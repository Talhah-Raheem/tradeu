'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, ShoppingBag, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserOrders } from '@/lib/api/orders';
import { Order } from '@/types/database';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await getUserOrders(user.id);
    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">View your purchase history</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link href="/">
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
                              Sold by {order.seller?.first_name} {order.seller?.last_name}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">${order.total_price}</div>
                          <div className={`text-sm font-medium mt-1 ${
                            order.status === 'completed' ? 'text-green-600' :
                            order.status === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
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
      </main>
    </div>
  );
}
