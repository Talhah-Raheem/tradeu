'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building2, Shield } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    university?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Popular universities for the dropdown
  const universities = [
    'UC Berkeley',
    'Stanford University',
    'UCLA',
    'USC',
    'MIT',
    'Harvard University',
    'Columbia University',
    'NYU',
    'University of Michigan',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!formData.email.endsWith('.edu')) {
      newErrors.email = 'Please use your .edu email address';
    }

    // University validation
    if (!formData.university) {
      newErrors.university = 'Please select your university';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase');

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.name.split(' ')[0],
            last_name: formData.name.split(' ').slice(1).join(' ') || '',
            university: formData.university,
          },
        },
      });

      if (error) {
        setErrors({ email: error.message || 'This email is already registered' });
        return;
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // Email confirmation required
        alert('Please check your email to verify your account before logging in.');
        router.push('/login');
      } else {
        // Auto-login successful, redirect to home
        router.push('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ email: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join TradeU"
      subtitle="Create your student account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* .edu Reminder */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Student Verification Required</p>
            <p>You&apos;ll need to verify your <span className="font-semibold">.edu email</span> to complete signup</p>
          </div>
        </div>

        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          icon={<User className="h-5 w-5" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <Input
          type="email"
          label="University Email"
          placeholder="you@university.edu"
          icon={<Mail className="h-5 w-5" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          helperText="Must be a valid .edu email address"
          required
        />

        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            University
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none appearance-none ${
                errors.university
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300'
              }`}
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              required
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>
          {errors.university && (
            <p className="text-red-600 text-sm mt-1.5 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.university}
            </p>
          )}
        </div>

        <Input
          type="password"
          label="Password"
          placeholder="Create a strong password"
          icon={<Lock className="h-5 w-5" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-enter your password"
          icon={<Lock className="h-5 w-5" />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
          required
        />

        <div className="flex items-start space-x-2 pt-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
            required
          />
          <label className="text-sm text-gray-600">
            I agree to TradeU&apos;s{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          Create Account
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <Link href="/login">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
          >
            Login
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
}
