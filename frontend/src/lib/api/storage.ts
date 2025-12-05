import { supabase } from '@/lib/supabase';

const LISTING_IMAGES_BUCKET = 'listing-images';

// Upload images for a listing
export async function uploadListingImages(listingId: number, files: File[]) {
  try {
    // TIMEOUT PROTECTION: Don't let bucket check hang forever
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage bucket check timeout')), 5000)
    );

    // Check if bucket exists by trying to list it
    const bucketCheckPromise = supabase.storage
      .from(LISTING_IMAGES_BUCKET)
      .list('', { limit: 1 });

    const result = await Promise.race([
      bucketCheckPromise,
      timeoutPromise
    ]) as any;

    const { error: bucketCheckError } = result;

    if (bucketCheckError) {
      console.error('Storage bucket check failed:', bucketCheckError);
      console.warn('Skipping image upload. Listing will be created without images.');
      // Return success but with no URLs - listing will be created without images
      return { data: [], error: null };
    }

    console.log('Storage bucket found! Proceeding with image upload...');

    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${listingId}/${Date.now()}-${index}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(LISTING_IMAGES_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(LISTING_IMAGES_BUCKET)
        .getPublicUrl(fileName);

      // Insert into listing_images table
      const { error: dbError } = await supabase
        .from('listing_images')
        .insert({
          listing_id: listingId,
          image_url: publicUrl,
        });

      if (dbError) throw dbError;

      return publicUrl;
    });

    const urls = await Promise.all(uploadPromises);
    return { data: urls, error: null };
  } catch (error) {
    console.error('Error uploading images:', error);
    // Return success even if images fail - listing should still be created
    return { data: [], error: null };
  }
}

// Delete all images for a listing
export async function deleteListingImages(listingId: number) {
  try {
    // Get all images for this listing
    const { data: images } = await supabase
      .from('listing_images')
      .select('image_url')
      .eq('listing_id', listingId);

    if (!images || images.length === 0) return { error: null };

    // Extract file paths from URLs
    const filePaths = images.map(img => {
      const url = new URL(img.image_url);
      const pathParts = url.pathname.split('/');
      return pathParts.slice(-2).join('/'); // Get 'listingId/filename.ext'
    });

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(LISTING_IMAGES_BUCKET)
      .remove(filePaths);

    if (storageError) throw storageError;

    // Delete from database (should cascade automatically, but doing it explicitly)
    const { error: dbError } = await supabase
      .from('listing_images')
      .delete()
      .eq('listing_id', listingId);

    if (dbError) throw dbError;

    return { error: null };
  } catch (error) {
    console.error('Error deleting images:', error);
    return { error };
  }
}

// Delete a single image
export async function deleteListingImage(imageId: number) {
  try {
    // Get image info
    const { data: image } = await supabase
      .from('listing_images')
      .select('image_url')
      .eq('image_id', imageId)
      .single();

    if (!image) throw new Error('Image not found');

    // Extract file path from URL
    const url = new URL(image.image_url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(LISTING_IMAGES_BUCKET)
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('listing_images')
      .delete()
      .eq('image_id', imageId);

    if (dbError) throw dbError;

    return { error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error };
  }
}
