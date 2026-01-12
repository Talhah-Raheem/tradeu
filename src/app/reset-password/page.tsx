'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    // Check if we have a valid token in the URL
    // Supabase sends the token as a hash fragment, not a query param
    // The Supabase client handles this automatically
    const checkToken = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();

        // If there's no session, the token might be invalid or expired
        if (!session) {
          // Check if there's a recovery token in the URL
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const hasRecoveryToken = hashParams.has('type') && hashParams.get('type') === 'recovery';

          if (!hasRecoveryToken) {
            setTokenError(true);
          }
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { supabase } = await import('@/lib/supabase');

      // Update the user's password
      // Supabase automatically uses the reset token from the URL context
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (updateError) {
        // Handle specific error cases
        const errorMessage = updateError.message.toLowerCase();
        if (errorMessage.includes('token') || errorMessage.includes('expired')) {
          setErrors({ general: 'Reset link has expired. Please request a new one.' });
        } else if (errorMessage.includes('invalid')) {
          setErrors({ general: 'Invalid reset link. Please request a new one.' });
        } else {
          setErrors({ general: updateError.message || 'Failed to reset password. Please try again.' });
        }
        return;
      }

      // Success! Show success message and redirect
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Show error if token is invalid or missing
  if (tokenError) {
    return (
      <AuthLayout
        title="Invalid Reset Link"
        subtitle="This link is no longer valid"
      >
        <div className="text-center py-6">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>

          <p className="text-gray-700 mb-6">
            This password reset link is invalid or has expired.
            <br />
            Please request a new one.
          </p>

          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button variant="primary" size="lg" className="w-full">
                Request New Reset Link
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Show success screen
  if (resetSuccess) {
    return (
      <AuthLayout
        title="Password Reset Successful"
        subtitle="Your password has been updated"
      >
        <div className="text-center py-6">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <p className="text-gray-700 mb-6">
            Your password has been successfully reset.
            <br />
            <span className="text-sm text-gray-600">Redirecting to login...</span>
          </p>

          <Link href="/login">
            <Button variant="primary" size="lg" className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Show password reset form
  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your new password"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Error</p>
              <p>{errors.general}</p>
              {(errors.general.includes('expired') || errors.general.includes('Invalid')) && (
                <Link href="/forgot-password" className="underline font-medium mt-2 inline-block">
                  Request a new reset link
                </Link>
              )}
            </div>
          </div>
        )}

        <Input
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          icon={<Lock className="h-5 w-5" />}
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          error={errors.newPassword}
          helperText="At least 8 characters with uppercase, lowercase, and number"
          required
        />

        <Input
          type="password"
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          icon={<Lock className="h-5 w-5" />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Reset Password
        </Button>

        <Link href="/login">
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="w-full"
          >
            Back to Login
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
}
