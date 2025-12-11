'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { User, MapPin, Calendar, Package, TrendingUp, MessageCircle, Flag, Star, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, getUserStats } from '@/lib/api/users';
import { getListingsBySeller } from '@/lib/api/listings';
import { User as UserType, Listing, Order } from '@/types/database';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';
import ReviewCard from '@/components/ReviewCard';
import Button from '@/components/Button';
import { getUserOrders } from '@/lib/api/orders';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [stats, setStats] = useState({ activeListings: 0, itemsSold: 0, responseRate: 95 });
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      if (!isMounted) return;

      setLoading(true);

      const [userResult, statsResult, listingsResult] = await Promise.all([
        getUserProfile(id),
        getUserStats(id),
        getListingsBySeller(id, activeTab === 'active' ? 'active' : 'sold'),
      ]);

      if (!isMounted) return;

      if (userResult.data) {
        setProfileUser(userResult.data);
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }

      if (listingsResult.data) {
        setListings(listingsResult.data);
      }

      // Only fetch buyer orders for your own profile
      if (currentUser?.id === id) {
        setOrdersLoading(true);
        const { data: ordersData } = await getUserOrders(id);
        if (ordersData) {
          setOrders(ordersData);
        }
        setOrdersLoading(false);
      } else {
        setOrders([]);
        setOrdersLoading(false);
      }

      setLoading(false);
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [id, activeTab, currentUser?.id]);

  if (loading || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === id;

  // Mock user data (now using real data)
  const user = {
    id: id,
    firstName: profileUser.first_name,
    lastName: profileUser.last_name || '',
    university: profileUser.university,
    memberSince: new Date(profileUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    avatar: profileUser.profile_image_url || '',
    rating: 4.8,
    reviewCount: 24,
    stats: stats
  };

  // Use real listings from database
  const displayListings = listings;

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
                {isOwnProfile ? (
                  // Show edit button for own profile
                  <Link href={`/profile/${id}/edit`}>
                    <Button variant="primary" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </Link>
                ) : (
                  // Show contact/report buttons for other users
                  <>
                    <Button variant="primary" className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>Contact Seller</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Flag className="h-4 w-4" />
                      <span>Report User</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* My Orders - only visible on own profile */}
        {isOwnProfile && (
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
            </div>

            {ordersLoading ? (
              <div className="bg-white rounded-2xl shadow border-2 border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                <Link href="/listings">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                    Browse Listings
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const firstImage = order.listing?.images && order.listing.images.length > 0
                    ? order.listing.images[0].image_url
                    : null;

                  const statusClasses =
                    order.status === 'completed'
                      ? 'text-green-600'
                      : order.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600';

                  return (
                    <div key={order.order_id} className="bg-white rounded-xl shadow border-2 border-gray-200 p-6 hover:shadow-lg transition">
                      <div className="flex items-start space-x-4">
                        {/* Image */}
                        <Link href={`/listings/${order.listing_id}`}>
                          {firstImage ? (
                            <img
                              src={firstImage}
                              alt={order.listing?.title}
                              className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl">
                              📦
                            </div>
                          )}
                        </Link>

                        {/* Order Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link href={`/listings/${order.listing_id}`}>
                                <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 transition cursor-pointer">
                                  {order.listing?.title}
                                </h3>
                              </Link>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  <Link href={`/profile/${order.seller_id}`}>
                                    <span className="hover:text-blue-600 transition">
                                      {order.seller?.first_name || order.seller?.email?.split('@')[0] || 'Seller'}
                                    </span>
                                  </Link>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(order.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">${order.total_price}</div>
                              <div className={`text-sm font-medium mt-1 ${statusClasses}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3 mt-4">
                            <Link href={`/listings/${order.listing_id}`}>
                              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                View Item
                              </button>
                            </Link>
                            <Link href={`/profile/${order.seller_id}`}>
                              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                View Seller
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

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
              {displayListings.length > 0 ? (
                displayListings.map((listing) => (
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
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {listing.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
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
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active listings</p>
                </div>
              )}
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
