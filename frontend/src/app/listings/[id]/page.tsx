'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Package, User, MessageCircle, ShoppingCart, ArrowLeft, Edit, Trash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getListingById, deleteListing } from '@/lib/api/listings';
import { Listing } from '@/types/database';
import Button from '@/components/Button';
import StarRating from '@/components/StarRating';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const statusLabels: Record<Listing['status'], string> = {
    active: 'Available',
    sold: 'Sold',
    deleted: 'Removed',
  };

  const statusClasses: Record<Listing['status'], string> = {
    active: 'text-green-600 bg-green-50',
    sold: 'text-gray-600 bg-gray-50',
    deleted: 'text-red-600 bg-red-50',
  };

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    setLoading(true);
    const { data } = await getListingById(id);
    if (data) {
      setListing(data);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await deleteListing(parseInt(id));
    if (!error) {
      router.push('/');
    } else {
      alert('Failed to delete listing');
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/messages?listing=${id}&seller=${listing?.user_id}`);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(`/checkout/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
          <p className="text-gray-600 mb-6">This listing may have been removed or doesn't exist.</p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === listing.user_id;
  const images = listing.images || [];
  const currentImage = images[selectedImageIndex] || null;

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
              {currentImage ? (
                <img
                  src={currentImage.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-9xl">📦</div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.image_id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`bg-gray-100 rounded-lg overflow-hidden aspect-square ${
                      idx === selectedImageIndex ? 'ring-4 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${listing.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {listing.category?.category_name}
                </span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  statusClasses[listing.status] ?? 'text-gray-600 bg-gray-50'
                }`}>
                  {statusLabels[listing.status] ?? listing.status}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              <div className="text-5xl font-bold text-blue-600 mb-6">${listing.price}</div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  {listing.condition}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(listing.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
              <Link href={`/profile/${listing.seller?.user_id}`} className="flex items-center space-x-4 hover:bg-gray-50 p-3 rounded-lg transition">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {listing.seller?.first_name ||
                      listing.seller?.email?.split('@')[0] ||
                      'Seller'}
                  </div>
                  <div className="text-sm text-gray-600">{listing.seller?.university}</div>
                </div>
                <StarRating rating={4.8} size="sm" showNumber />
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOwner ? (
                <>
                  <Link href={`/listings/${id}/edit`}>
                    <Button variant="primary" className="w-full flex items-center justify-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit Listing</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 hover:border-red-500 hover:text-red-500"
                    onClick={handleDelete}
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete Listing</span>
                  </Button>
                </>
              ) : listing.status === 'active' ? (
                <>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={handleBuyNow}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Buy Now</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={handleContactSeller}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact Seller</span>
                  </Button>
                </>
              ) : (
                <div className="text-center py-4 text-gray-600">
                  This item is no longer available
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
