import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database';
import { markListingAsSold } from './listings';

// Create a new order (fake checkout)
export async function createOrder(listingId: number) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*, seller:users!listings_user_id_fkey(user_id)')
      .eq('listing_id', listingId)
      .single();

    if (listingError) throw listingError;
    if (!listing) throw new Error('Listing not found');
    if (listing.status !== 'active') throw new Error('Listing is not available');
    if (listing.user_id === user.id) throw new Error('Cannot buy your own listing');

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        seller_id: listing.user_id,
        listing_id: listingId,
        total_price: listing.price,
        status: 'completed', // For MVP, all orders are immediately completed
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Mark listing as sold
    await markListingAsSold(listingId);

    return { data: order as Order, error: null };
  } catch (error) {
    console.error('Error creating order:', error);
    return { data: null, error };
  }
}

// Get user's orders (as buyer)
export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        seller:users!orders_seller_id_fkey(user_id, first_name, last_name, university),
        listing:listings(listing_id, title, price, images:listing_images(image_url, display_order))
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Sort images by display_order
    const ordersWithSortedImages = data?.map(order => ({
      ...order,
      listing: {
        ...order.listing,
        images: order.listing?.images?.sort((a, b) => a.display_order - b.display_order) || []
      }
    }));

    return { data: ordersWithSortedImages as Order[], error: null };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { data: null, error };
  }
}

// Get user's sales (as seller)
export async function getUserSales(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        buyer:users!orders_buyer_id_fkey(user_id, first_name, last_name, university),
        listing:listings(listing_id, title, price, images:listing_images(image_url, display_order))
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Sort images by display_order
    const salesWithSortedImages = data?.map(sale => ({
      ...sale,
      listing: {
        ...sale.listing,
        images: sale.listing?.images?.sort((a, b) => a.display_order - b.display_order) || []
      }
    }));

    return { data: salesWithSortedImages as Order[], error: null };
  } catch (error) {
    console.error('Error fetching user sales:', error);
    return { data: null, error };
  }
}
