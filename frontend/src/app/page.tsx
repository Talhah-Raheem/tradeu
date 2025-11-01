'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, BookOpen, Shield, Users, TrendingUp, Star, Clock, MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getListings } from "@/lib/api/listings";
import { Listing } from "@/types/database";

export default function Home() {
  const { user, userProfile, signOut } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await getListings({ limit: 8 });
      if (error) {
        console.error("Error loading listings:", error);
        setListings([]);
        setErrorMessage("Unable to load listings right now.");
        return;
      }
      setListings(data ?? []);
    } catch (error) {
      console.error("Unexpected error loading listings:", error);
      setListings([]);
      setErrorMessage("Unable to load listings right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await getListings({ search: searchTerm, limit: 8 });
      if (error) {
        console.error("Error searching listings:", error);
        setListings([]);
        setErrorMessage("Unable to load listings for that search.");
        return;
      }
      setListings(data ?? []);
    } catch (error) {
      console.error("Unexpected error searching listings:", error);
      setListings([]);
      setErrorMessage("Unable to load listings for that search.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    // Optionally redirect to home or reload
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">TradeU</h1>
                <p className="text-xs text-gray-500">.edu verified</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">Browse</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">Categories</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">About</a>
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link href={`/profile/${user.id}`}>
                    <button className="text-gray-700 hover:text-gray-900 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition font-medium">
                      Hi, {userProfile?.first_name || 'there'}
                    </button>
                  </Link>
                  <Link href="/listings/create">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center font-medium">
                      <Plus className="h-4 w-4 mr-2" />
                      Sell Item
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <button className="text-gray-700 hover:text-gray-900 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition font-medium">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center font-medium">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16 mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Student Verified Platform</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Buy. Sell. Trade.
            <span className="block text-blue-600">Made for Students.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect with verified students on campus. Find textbooks, furniture, electronics, and more at prices you can afford.
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for textbooks, furniture, electronics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 placeholder:text-gray-500 text-gray-900 shadow-sm text-lg transition"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600 text-sm">Active Students</div>
            </div>
            <div className="border-l border-gray-300"></div>
            <div>
              <div className="text-3xl font-bold text-blue-600">1,200+</div>
              <div className="text-gray-600 text-sm">Items Sold</div>
            </div>
            <div className="border-l border-gray-300"></div>
            <div>
              <div className="text-3xl font-bold text-blue-600">8</div>
              <div className="text-gray-600 text-sm">Universities</div>
            </div>
            <div className="border-l border-gray-300"></div>
            <div>
              <div className="text-3xl font-bold text-blue-600">4.9★</div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Enhanced Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Textbooks</h3>
            <p className="text-gray-700 mb-4">Save up to 70% on course materials from fellow students</p>
            <div className="flex items-center text-blue-600 font-semibold">
              <span>Browse books</span>
              <TrendingUp className="h-4 w-4 ml-2" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border-2 border-purple-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="text-4xl mb-4">🪑</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Furniture</h3>
            <p className="text-gray-700 mb-4">Dorm and apartment essentials at student-friendly prices</p>
            <div className="flex items-center text-purple-600 font-semibold">
              <span>Shop furniture</span>
              <TrendingUp className="h-4 w-4 ml-2" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Electronics</h3>
            <p className="text-gray-700 mb-4">Quality laptops, phones, and gadgets for your studies</p>
            <div className="flex items-center text-green-600 font-semibold">
              <span>View tech</span>
              <TrendingUp className="h-4 w-4 ml-2" />
            </div>
          </div>
        </div>

        {/* Enhanced Featured Items */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Featured Items</h3>
              <p className="text-gray-600 mt-1">Fresh listings from students near you</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2 bg-blue-50 px-5 py-2 rounded-lg hover:bg-blue-100 transition">
              <span>View All</span>
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && !errorMessage ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-5 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : errorMessage ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">{errorMessage}</p>
              </div>
            ) : listings.length > 0 ? (
              listings.map((listing) => (
                <Link key={listing.listing_id} href={`/listings/${listing.listing_id}`}>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-2xl hover:border-blue-300 transition-all hover:-translate-y-2 cursor-pointer group">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0].image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl">📦</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {listing.category?.category_name}
                        </span>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {listing.condition}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">
                        {listing.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>

                      <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-blue-600">${listing.price}</span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm ml-1 text-gray-600">
                            {listing.seller?.first_name ||
                              listing.seller?.email?.split('@')[0] ||
                              'Seller'}
                          </span>
                        </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(listing.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No listings found. Try a different search term.</p>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 mb-16 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Students Love TradeU</h3>
            <p className="text-blue-100 text-lg">Safe, verified, and built for campus life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">.edu Verified</h4>
              <p className="text-blue-100">Only verified students can join. No scams, no strangers.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Campus Community</h4>
              <p className="text-blue-100">Buy and sell locally with students from your university.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Best Prices</h4>
              <p className="text-blue-100">Student-friendly prices that won't break the bank.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">TradeU</span>
              </div>
              <p className="text-gray-400 text-sm">The trusted marketplace for students across the nation.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Browse Items</a></li>
                <li><a href="#" className="hover:text-white transition">Sell Item</a></li>
                <li><a href="#" className="hover:text-white transition">Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 TradeU. Built by Dylan, Talhah, and Omar.</p>
            <p className="mt-2">Made with ❤️ for students</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
