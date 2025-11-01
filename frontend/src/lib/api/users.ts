import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';

// Get user profile by ID
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return { data: data as User, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
}

// Get user stats (listings count, sold count, etc.)
export async function getUserStats(userId: string) {
  try {
    const [activeListingsResult, soldListingsResult] = await Promise.all([
      supabase
        .from('listings')
        .select('listing_id', { count: 'exact', head: true })
        .eq('seller_id', userId)
        .eq('status', 'available'),
      supabase
        .from('listings')
        .select('listing_id', { count: 'exact', head: true })
        .eq('seller_id', userId)
        .eq('status', 'sold'),
    ]);

    return {
      data: {
        activeListings: activeListingsResult.count || 0,
        itemsSold: soldListingsResult.count || 0,
        responseRate: 95, // This would need to be calculated from messages
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { data: null, error };
  }
}
