import { supabase } from '@/lib/supabase';
import { Listing } from '@/types/database';

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  location: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  status?: Listing['status'];
  images?: File[];
}

export interface UpdateListingData {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  location?: string;
  condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  status?: Listing['status'];
}

// Fetch all listings with seller info and images
export async function getListings(filters?: {
  categoryId?: number;
  status?: Listing['status'];
  search?: string;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        seller:users(user_id, email),
        category:categories(category_id, category_name),
        images:listing_images(image_id, image_url)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.categoryId) {
      query = query.eq('categories_id', filters.categoryId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      // Default to only active listings
      query = query.eq('status', 'active');
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as Listing[], error: null };
  } catch (error) {
    const err = error as { message?: string; details?: string; hint?: string };
    console.error('Error fetching listings:', err?.message || error);
    if (err?.details || err?.hint) {
      console.error('Listing fetch details:', err.details, err.hint);
    }
    return { data: null, error };
  }
}

// Fetch a single listing by ID
export async function getListingById(listingId: number | string | bigint) {
  try {
    const normalizedId =
      typeof listingId === 'bigint'
        ? listingId.toString()
        : listingId;

    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:users(user_id, email),
        category:categories(category_id, category_name),
        images:listing_images(image_id, image_url)
      `)
      .eq('listing_id', normalizedId)
      .single();

    if (error) throw error;

    return { data: data as Listing, error: null };
  } catch (error) {
    const err = error as { message?: string; details?: string; hint?: string };
    console.error('Error fetching listing:', err?.message || error);
    if (err?.details || err?.hint) {
      console.error('Listing fetch details:', err.details, err.hint);
    }
    return { data: null, error };
  }
}

// Get listings by seller ID
export async function getListingsBySeller(sellerId: string, status?: Listing['status']) {
  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        category:categories(category_id, category_name),
        images:listing_images(image_id, image_url)
      `)
      .eq('user_id', sellerId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as Listing[], error: null };
  } catch (error) {
    const err = error as { message?: string; details?: string; hint?: string };
    console.error('Error fetching seller listings:', err?.message || error);
    if (err?.details || err?.hint) {
      console.error('Seller listing fetch details:', err.details, err.hint);
    }
    return { data: null, error };
  }
}

// Create a new listing
export async function createListing(listingData: CreateListingData) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { images, status = 'active', categoryId, ...listingFields } = listingData;

    // Insert listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        ...listingFields,
        user_id: user.id,
        categories_id: categoryId,
        status,
      })
      .select()
      .single();

    if (listingError) throw listingError;

    // Handle image uploads if provided
    if (images && images.length > 0) {
      const { uploadListingImages } = await import('./storage');
      await uploadListingImages(listing.listing_id, images);
    }

    return { data: listing, error: null };
  } catch (error) {
    const err = error as { message?: string; details?: string; hint?: string };
    console.error('Error creating listing:', err?.message || error);
    if (err?.details || err?.hint) {
      console.error('Create listing details:', err.details, err.hint);
    }
    return { data: null, error };
  }
}

// Update an existing listing
export async function updateListing(listingId: number, updates: UpdateListingData) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('listing_id', listingId)
      .single();

    if (listing?.user_id !== user.id) {
      throw new Error('Not authorized to update this listing');
    }

    const { categoryId, ...rest } = updates;

    const updatePayload: Record<string, unknown> = { ...rest };
    if (typeof categoryId === 'number') {
      updatePayload.categories_id = categoryId;
    }

    const { data, error } = await supabase
      .from('listings')
      .update(updatePayload)
      .eq('listing_id', listingId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { data: null, error };
  }
}

// Delete a listing
export async function deleteListing(listingId: number) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('listing_id', listingId)
      .single();

    if (listing?.user_id !== user.id) {
      throw new Error('Not authorized to delete this listing');
    }

    // Delete associated images from storage
    const { deleteListingImages } = await import('./storage');
    await deleteListingImages(listingId);

    // Delete listing (will cascade to listing_images table)
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('listing_id', listingId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { error };
  }
}

// Mark listing as sold
export async function markListingAsSold(listingId: number) {
  return updateListing(listingId, { status: 'sold' });
}
