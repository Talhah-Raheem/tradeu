import { supabase } from '@/lib/supabase';
import { Category } from '@/types/database';

// Fetch all categories
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('category_name', { ascending: true });

    if (error) throw error;

    return { data: data as Category[], error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
}

// Get category by ID
export async function getCategoryById(categoryId: number) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_id', categoryId)
      .single();

    if (error) throw error;

    return { data: data as Category, error: null };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { data: null, error };
  }
}
