'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { User, MapPin, Calendar, Package, TrendingUp, MessageCircle, Flag, Star } from 'lucide-react';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';
import ReviewCard from '@/components/ReviewCard';
import Button from '@/components/Button';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');

  // Mock user data
  const user = {
    id: id,
    firstName: 'Sarah',
    lastName: 'Johnson', // Optional
    university: 'UC Berkeley',
    memberSince: 'September 2024',
    avatar: '', // Empty = show placeholder
    rating: 4.8,
    reviewCount: 24,
    stats: {
      itemsSold: 32,
      activeListings: 8,
      responseRate: 95
    }
  };

  // Mock active listings
  const activeListings = [
    {
      id: 1,
      title: 'Calculus Textbook',
      description: 'Early Transcendentals 8th Edition',
      price: 45,
      condition: 'Like New',
      emoji: '📚',
      category: 'Textbooks',
      time: '2 hours ago',
      location: 'UC Berkeley'
    },
    {
      id: 2,
      title: 'Study Desk',
      description: 'IKEA desk, perfect condition',
      price: 80,
      condition: 'Excellent',
      emoji: '🪑',
      category: 'Furniture',
      time: '5 hours ago',
      location: 'UC Berkeley'
    },
    {
      id: 3,
      title: 'Biology Lab Manual',
      description: 'BIO 101 - Never used',
      price: 25,
      condition: 'New',
      emoji: '🔬',
      category: 'Textbooks',
      time: '4 hours ago',
      location: 'UC Berkeley'
    },
    {
      id: 4,
      title: 'Mini Fridge',
      description: 'Perfect for dorm rooms',
      price: 60,
      condition: 'Like New',
      emoji: '🧊',
      category: 'Appliances',
      time: '3 hours ago',
      location: 'UC Berkeley'
    }
  ];

  // Mock reviews
  const reviews = [
    {
      reviewerName: 'Michael Chen',
      rating: 5,
      comment: 'Great seller! Item was exactly as described and Sarah was very responsive. Smooth transaction!',
      date: '2 days ago',
      itemName: 'Chemistry Textbook'
    },
    {
      reviewerName: 'Emily Rodriguez',
      rating: 5,
      comment: 'Super friendly and accommodating. Met on campus for pickup. Would definitely buy from again!',
      date: '1 week ago',
      itemName: 'Desk Lamp'
    },
    {
      reviewerName: 'David Park',
      rating: 4,
      comment: 'Good condition, fair price. Communication could have been faster but overall positive experience.',
      date: '2 weeks ago',
      itemName: 'MacBook Charger'
    },
    {
      reviewerName: 'Jessica Liu',
      rating: 5,
      comment: 'Amazing! The furniture was in perfect condition and Sarah even helped me carry it to my car. 10/10',
      date: '3 weeks ago',
      itemName: 'Bookshelf'
    }
  ];

  // Rating breakdown
  const ratingBreakdown = [
    { stars: 5, count: 20, percentage: 83 },
    { stars: 4, count: 3, percentage: 13 },
    { stars: 3, count: 1, percentage: 4 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-blue-100">
                  <User className="h-16 w-16 text-blue-600" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">{user.university}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <StarRating rating={user.rating} size="lg" showNumber reviewCount={user.reviewCount} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Contact Seller</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Flag className="h-4 w-4" />
                  <span>Report User</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-blue-300 transition">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{user.stats.itemsSold}</div>
            <div className="text-gray-600 text-sm">Items Sold</div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-blue-300 transition">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{user.stats.activeListings}</div>
            <div className="text-gray-600 text-sm">Active Listings</div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center hover:border-blue-300 transition">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{user.stats.responseRate}%</div>
            <div className="text-gray-600 text-sm">Response Rate</div>
          </div>
        </div>

        {/* Active Listings Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.firstName}&apos;s Listings
            </h2>

            {/* Tab Selector */}
            <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition ${
                  activeTab === 'active'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active ({user.stats.activeListings})
              </button>
              <button
                onClick={() => setActiveTab('sold')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition ${
                  activeTab === 'sold'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sold ({user.stats.itemsSold})
              </button>
            </div>
          </div>

          {activeTab === 'active' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeListings.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          )}

          {activeTab === 'sold' && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sold items are not displayed publicly</p>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews ({user.reviewCount})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Breakdown */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">{user.rating}</div>
                <StarRating rating={user.rating} size="lg" />
                <p className="text-gray-600 text-sm mt-2">{user.reviewCount} reviews</p>
              </div>

              <div className="space-y-3">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm font-medium text-gray-700">{item.stars}</span>
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((review, index) => (
                <ReviewCard key={index} {...review} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
