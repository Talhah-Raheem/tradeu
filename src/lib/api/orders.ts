import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database';

// Create a new order (fake checkout)
export async function createOrder(listingId: number) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*, seller:users!listings_user_id_fkey(user_id, email)')
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

    // Mark listing as sold (bypass seller ownership since buyer is performing checkout)
    const { error: statusError } = await supabase
      .from('listings')
      .update({ status: 'sold' })
      .eq('listing_id', listingId);

    if (statusError) {
      console.error('Error marking listing as sold:', statusError);
      console.warn('Order created successfully but listing status column may not be updated. Orders table is the source of truth for sold status.');
    }

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
        seller:users!orders_seller_id_fkey(user_id, email),
        listing:listings(listing_id, title, price, images:listing_images(image_url))
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data as Order[], error: null };
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
        buyer:users!orders_buyer_id_fkey(user_id, email),
        listing:listings(listing_id, title, price, images:listing_images(image_url))
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data as Order[], error: null };
  } catch (error) {
    console.error('Error fetching user sales:', error);
    return { data: null, error };
  }
}
