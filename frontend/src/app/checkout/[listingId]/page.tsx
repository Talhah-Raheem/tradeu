'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getListingById } from '@/lib/api/listings';
import { createOrder } from '@/lib/api/orders';
import { Listing } from '@/types/database';
import Button from '@/components/Button';

export default function CheckoutPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadListing();
    }
  }, [listingId, user]);

  const loadListing = async () => {
    setLoading(true);
    const { data } = await getListingById(parseInt(listingId));
    if (data) {
      if (data.user_id === user?.id) {
        setError('You cannot buy your own listing');
      } else if (data.status !== 'active') {
        setError('This item is no longer available');
      }
      setListing(data);
    } else {
      setError('Listing not found');
    }
    setLoading(false);
  };

  const handleCheckout = async () => {
    setProcessing(true);
    setError(null);

    try {
      const { data, error: orderError } = await createOrder(parseInt(listingId));

      if (orderError) {
        setError('Failed to complete purchase. Please try again.');
        setProcessing(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred. Please try again.');
      setProcessing(false);
    }
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

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Checkout</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Purchase Successful!</h2>
          <p className="text-gray-600 mb-8">Your order has been confirmed. Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const firstImage = listing.images && listing.images.length > 0 ? listing.images[0].image_url : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/listings/${listingId}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listing
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Fake MVP Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> This is a demonstration checkout flow. No actual payment will be processed.
              The item will be marked as sold and added to your order history.
            </p>
          </div>

          {/* Order Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
              {firstImage ? (
                <img
                  src={firstImage}
                  alt={listing.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-3xl">
                  📦
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{listing.title}</h3>
                <p className="text-gray-600 text-sm">{listing.condition}</p>
                <p className="text-gray-600 text-sm">
                  Sold by:{' '}
                  {listing.seller?.first_name ||
                    listing.seller?.email?.split('@')[0] ||
                    'Seller'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">${listing.price}</div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">${listing.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${listing.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Checkout Button */}
          <div className="flex space-x-4">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 flex items-center justify-center space-x-2"
              onClick={handleCheckout}
              isLoading={processing}
              disabled={!!error}
            >
              <CheckCircle className="h-5 w-5" />
              <span>Confirm Purchase</span>
            </Button>
            <Link href={`/listings/${listingId}`} className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-500 text-xs text-center mt-6">
            By confirming, you agree to TradeU's terms of service. Contact the seller to arrange pickup or delivery.
          </p>
        </div>
      </main>
    </div>
  );
}
