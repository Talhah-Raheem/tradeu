// Database types for TypeScript
export interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  university: string;
  profile_image_url: string | null;
  created_at: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  created_at: string;
}

export interface Listing {
  listing_id: number;
  user_id: string;
  categories_id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  status: 'active' | 'sold' | 'deleted';
  created_at: string;
  updated_at: string;
  // Joined fields
  seller?: User;
  category?: Category;
  images?: ListingImage[];
}

export interface ListingImage {
  image_id: number;
  listing_id: number;
  image_url: string;
  created_at: string;
}

export interface Message {
  message_id: number;
  listing_id: number;
  sender_id: string;
  receiver_id: string;
  message_content: string;
  message_type: string;
  timestamp: string;
  is_read: boolean;
  // Joined fields
  sender?: User;
  receiver?: User;
  listing?: Listing;
}

export interface Order {
  order_id: number;
  buyer_id: string;
  seller_id: string;
  listing_id: number;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  // Joined fields
  buyer?: User;
  seller?: User;
  listing?: Listing;
}

export interface Review {
  review_id: number;
  reviewer_id: string;
  reviewee_id: string;
  order_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  // Joined fields
  reviewer?: User;
}
