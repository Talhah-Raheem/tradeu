'use client';

import { useState, useEffect, use, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '@/lib/api/users';
import { uploadProfileImage } from '@/lib/api/storage';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    university: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authorized to edit this profile
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push('/login');
      } else if (currentUser.id !== id) {
        // Not their profile, redirect to view mode
        router.push(`/profile/${id}`);
      }
    }
  }, [currentUser, authLoading, id, router]);

  // Load current profile data
  useEffect(() => {
    if (currentUser && currentUser.id === id) {
      loadProfile();
    }
  }, [currentUser, id]);

  const loadProfile = async () => {
    const { data } = await getUserProfile(id);
    if (data) {
      setFormData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        university: data.university || '',
      });
      setCurrentImageUrl(data.profile_image_url || '');
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setProfileImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let imageUrl = currentImageUrl;

      // Upload new image if one was selected
      if (profileImage) {
        const { data: uploadedUrl, error: uploadError } = await uploadProfileImage(id, profileImage);
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          alert('Failed to upload profile image. Profile will be updated without image change.');
        } else if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Update profile
      const { data, error } = await updateUserProfile(id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        university: formData.university,
        profile_image_url: imageUrl,
      });

      if (error) {
        console.error('Error updating profile:', error);
        const message = (error as any)?.message || 'Failed to update profile. Please try again.';
        alert(message);
        return;
      }

      if (data) {
        // Success! Redirect to profile view
        router.push(`/profile/${id}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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

  if (!currentUser || currentUser.id !== id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/profile/${id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600 mb-8">Update your profile information</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Picture
              </label>

              <div className="flex items-center space-x-6">
                {/* Current/Preview Image */}
                <div className="flex-shrink-0">
                  {imagePreview || currentImageUrl ? (
                    <div className="relative">
                      <img
                        src={imagePreview || currentImageUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-blue-100">
                      <UserIcon className="h-16 w-16 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                {!imagePreview && (
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span className="font-medium">Upload New Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
            </div>

            {/* First Name */}
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={errors.firstName}
              required
            />

            {/* Last Name */}
            <Input
              label="Last Name"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />

            {/* University */}
            <Input
              label="University"
              type="text"
              placeholder="UC Berkeley"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              error={errors.university}
              required
            />

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
              <Link href={`/profile/${id}`} className="flex-1">
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
