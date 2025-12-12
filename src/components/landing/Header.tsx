'use client';

import Link from 'next/link';
import { BookOpen, Plus, User, ChevronDown, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRef, useState, useEffect } from 'react';

const Header = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-gradient-to-br from-soft-blue-500 to-soft-blue-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-soft-blue-600 to-soft-green-600 bg-clip-text text-transparent">TradeU</h1>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/listings" className="text-gray-600 hover:text-soft-blue-600 font-medium transition-colors text-sm">
                Browse
              </Link>
              <Link href="/#how-it-works" className="text-gray-600 hover:text-soft-blue-600 font-medium transition-colors text-sm">
                How it Works
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-soft-blue-600 font-medium transition-colors text-sm">
                Support
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Link href="/messages">
                    <button className="text-gray-700 hover:text-soft-blue-600 transition-colors p-2 rounded-full hover:bg-soft-blue-50 relative">
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/listings/create">
                    <button className="bg-gradient-to-r from-soft-blue-500 to-soft-blue-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition-all duration-200 flex items-center font-semibold text-sm">
                      <Plus className="h-4 w-4 mr-1.5" />
                      Sell Item
                    </button>
                  </Link>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {userProfile?.profile_image_url ? (
                        <img
                          src={userProfile.profile_image_url}
                          alt="Profile"
                          className="w-9 h-9 rounded-full border-2 border-white shadow-md object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lilac-300 to-lilac-400 flex items-center justify-center border-2 border-white shadow-md">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <Link href={`/profile/${user.id}`}>
                          <button
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-soft-blue-50 transition flex items-center space-x-3 rounded-lg mx-1"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <User className="h-4 w-4 text-soft-blue-600" />
                            <span className="font-medium">My Profile</span>
                          </button>
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={handleLogoutClick}
                          className="w-full text-left px-4 py-3 text-sm text-coral-600 hover:bg-coral-50 transition flex items-center space-x-3 rounded-lg mx-1"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="font-medium">Log Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <button className="text-gray-700 hover:text-soft-blue-600 font-semibold transition-colors text-sm px-4 py-2">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="bg-gradient-to-r from-soft-blue-500 to-soft-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 font-semibold text-sm">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-[2px] z-[100]"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 pointer-events-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-coral-100 flex items-center justify-center mx-auto mb-4">
                  <LogOut className="h-8 w-8 text-coral-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Log Out?</h3>
                <p className="text-gray-600">Are you sure you want to log out of your account?</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-600 hover:shadow-lg text-white rounded-xl font-semibold transition-all"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
