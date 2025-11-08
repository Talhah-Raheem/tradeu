'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getListings } from '@/lib/api/listings';
import { Listing } from '@/types/database';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { Clock, MapPin, Search, Filter, X } from 'lucide-react';

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Textbooks', 'Furniture', 'Electronics', 'Clothing', 'Sports', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  useEffect(() => {
    loadListings();
  }, [searchTerm, selectedCategory]);

  const loadListings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const params: any = { limit: 50 };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const { data, error } = await getListings(params);
      if (error) {
        console.error('Error loading listings:', error);
        setListings([]);
        setErrorMessage('Unable to load listings right now.');
        return;
      }
      setListings(data ?? []);
    } catch (error) {
      console.error('Unexpected error loading listings:', error);
      setListings([]);
      setErrorMessage('Unable to load listings right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadListings();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Browse Listings</h1>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-soft-blue-400 focus:border-soft-blue-500 placeholder:text-gray-400 text-gray-900 transition-all outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-soft-blue-500 to-soft-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-bold"
              >
                Search
              </button>
            </form>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block mt-6 pt-6 border-t border-gray-200`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-gray-700">Category:</span>
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === ''
                      ? 'bg-soft-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-soft-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {(searchTerm || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 flex items-center gap-2 text-sm text-coral-600 hover:text-coral-700 font-semibold"
                >
                  <X className="h-4 w-4" />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600 font-medium">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'} found
              {selectedCategory && ` in ${selectedCategory}`}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
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
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-soft-blue-600 font-bold text-xs uppercase tracking-wide">
                        {listing.category?.category_name}
                      </span>
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
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-3 bg-soft-blue-500 text-white rounded-full hover:shadow-lg transition-all font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
