'use client';

import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Heart } from 'lucide-react';
import { Listing } from '@/types/database';

interface FeaturedItemsProps {
  listings: Listing[];
  loading: boolean;
  errorMessage: string | null;
}

const FeaturedItems = ({ listings, loading, errorMessage }: FeaturedItemsProps) => {
  return (
    <section className="mb-24 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Recent Listings</h2>
          <p className="text-gray-600 text-lg">Freshly posted by students on campus</p>
        </div>
        <button className="group flex items-center space-x-2 text-soft-blue-600 hover:text-soft-blue-700 font-bold transition-colors bg-soft-blue-50 hover:bg-soft-blue-100 px-5 py-3 rounded-full">
          <span>View All</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && !errorMessage ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
              <div className="bg-gray-200 h-48"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : errorMessage ? (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-lg">{errorMessage}</p>
          </div>
        ) : listings.length > 0 ? (
          listings.map((listing) => (
            <Link key={listing.listing_id} href={`/listings/${listing.listing_id}`}>
              <div className="bg-white rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-48 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {listing.condition}
                  </div>
                  <button className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4 text-coral-500" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-soft-blue-600 font-bold text-xs uppercase tracking-wide">{listing.category?.category_name}</span>
                    <span className="text-xl font-extrabold text-gray-900">${listing.price}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-3 line-clamp-2 group-hover:text-soft-blue-600 transition-colors leading-snug">
                    {listing.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      <span className="truncate max-w-[100px]">{listing.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg font-medium">No listings found</p>
            <p className="text-gray-500 text-sm mt-2">Try a different search term or browse all items</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedItems;
