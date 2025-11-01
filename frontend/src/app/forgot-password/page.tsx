'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!email.endsWith('.edu')) {
      setError('Please use your .edu email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase');

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email. Please try again.');
        return;
      }

      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center py-6">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <p className="text-gray-700 mb-6">
            We&apos;ve sent a password reset link to <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-blue-800 font-medium mb-2">What&apos;s next?</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the password reset link</li>
              <li>Create a new password</li>
              <li>Login with your new password</li>
            </ol>
          </div>

          <Link href="/login">
            <Button variant="primary" size="lg" className="w-full">
              Back to Login
            </Button>
          </Link>

          <button
            onClick={() => {
              setEmailSent(false);
              setEmail('');
            }}
            className="text-sm text-gray-600 hover:text-gray-800 mt-4 underline"
          >
            Didn&apos;t receive the email? Try again
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries, we'll send you reset instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="email"
          label="Email Address"
          placeholder="you@university.edu"
          icon={<Mail className="h-5 w-5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          helperText="Enter your .edu email address"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>

        <Link href="/login">
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="w-full flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
}
