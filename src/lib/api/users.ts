import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';
import { getListingsBySeller } from './listings';

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
    // Use getListingsBySeller which checks orders table for accurate counts
    // This ensures consistency with what's actually displayed in the tabs
    const [activeResult, soldResult] = await Promise.all([
      getListingsBySeller(userId, 'active'),
      getListingsBySeller(userId, 'sold'),
    ]);

    return {
      data: {
        activeListings: activeResult.data?.length || 0,
        itemsSold: soldResult.data?.length || 0,
        responseRate: 95, // This would need to be calculated from messages
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { data: null, error };
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    university?: string;
    profile_image_url?: string;
  }
) {
  try {
    // Get current user to verify they're updating their own profile
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser || currentUser.id !== userId) {
      throw new Error('Unauthorized: Can only update your own profile');
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data: data as User, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
}

/**
 * Update user password (used during password reset flow)
 * @param newPassword - The new password to set
 * @returns Success/error response
 */
export async function updatePassword(newPassword: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { data: null, error };
  }
}
