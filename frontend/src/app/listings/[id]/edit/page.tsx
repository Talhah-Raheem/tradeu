'use client';

import { useState, useEffect, FormEvent, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getListingById, updateListing } from '@/lib/api/listings';
import { getCategories } from '@/lib/api/categories';
import { Category, Listing } from '@/types/database';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    location: '',
    condition: 'Good' as 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor',
    status: 'available' as 'available' | 'sold' | 'reserved',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    const [listingResult, categoriesResult] = await Promise.all([
      getListingById(parseInt(id)),
      getCategories(),
    ]);

    if (listingResult.data) {
      const listing = listingResult.data;
      setListing(listing);
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        categoryId: listing.categories_id.toString(),
        location: listing.location,
        condition: listing.condition,
        status: listing.status,
      });
    }

    if (categoriesResult.data) {
      setCategories(categoriesResult.data);
    }

    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await updateListing(parseInt(id), {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        location: formData.location,
        condition: formData.condition,
        status: formData.status,
      });

      if (error) {
        alert('Failed to update listing. Please try again.');
        return;
      }

      router.push(`/listings/${id}`);
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || !listing) {
    return null;
  }

  // Check if user is the owner
  if (listing.seller_id !== user.id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to edit this listing.</p>
          <Link href={`/listings/${id}`}>
            <Button variant="primary">Back to Listing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/listings/${id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listing
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Listing</h1>
          <p className="text-gray-600 mb-8">Update your listing details</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Title"
              type="text"
              placeholder="e.g., Calculus Textbook 8th Edition"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              required
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-gray-900 ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-600 text-sm mt-1.5">{errors.categoryId}</p>
              )}
            </div>

            {/* Price */}
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              min="0"
              placeholder="45.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
              required
            />

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-gray-900"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                required
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none text-gray-900"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                required
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {/* Location */}
            <Input
              label="Location"
              type="text"
              placeholder="e.g., UC Berkeley Campus"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              error={errors.location}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none min-h-[150px] text-gray-900 placeholder:text-gray-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1.5">{errors.description}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                isLoading={isSubmitting}
              >
                Save Changes
              </Button>
              <Link href={`/listings/${id}`} className="flex-1">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
