import { BookOpen, Twitter, Instagram, Facebook, Mail, Heart } from 'lucide-react';
import Link from 'next/link';

const Footer = () => (
  <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        <div className="md:col-span-2">
          <Link href="/">
            <div className="flex items-center space-x-2 mb-4 cursor-pointer">
              <div className="bg-gradient-to-br from-soft-blue-500 to-soft-blue-600 p-2.5 rounded-xl shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-soft-blue-600 to-soft-green-600 bg-clip-text text-transparent">TradeU</span>
            </div>
          </Link>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
            The trusted student marketplace where campus communities buy, sell, and trade safely.
          </p>
          <div className="flex items-center space-x-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-soft-blue-100 flex items-center justify-center transition-colors group">
              <Twitter className="h-4 w-4 text-gray-600 group-hover:text-soft-blue-600" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-soft-blue-100 flex items-center justify-center transition-colors group">
              <Instagram className="h-4 w-4 text-gray-600 group-hover:text-soft-blue-600" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-soft-blue-100 flex items-center justify-center transition-colors group">
              <Facebook className="h-4 w-4 text-gray-600 group-hover:text-soft-blue-600" />
            </a>
            <a href="mailto:support@tradeu.com" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-soft-blue-100 flex items-center justify-center transition-colors group">
              <Mail className="h-4 w-4 text-gray-600 group-hover:text-soft-blue-600" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Marketplace</h4>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><Link href="/listings" className="hover:text-soft-blue-600 transition-colors font-medium">Browse Items</Link></li>
            <li><Link href="/listings/create" className="hover:text-soft-blue-600 transition-colors font-medium">Sell an Item</Link></li>
            <li><Link href="/listings" className="hover:text-soft-blue-600 transition-colors font-medium">Categories</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-soft-blue-600 transition-colors font-medium">How it Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Resources</h4>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><Link href="/support" className="hover:text-soft-blue-600 transition-colors font-medium">Help Center</Link></li>
            <li><Link href="/support#safety" className="hover:text-soft-blue-600 transition-colors font-medium">Safety Tips</Link></li>
            <li><Link href="/support#contact" className="hover:text-soft-blue-600 transition-colors font-medium">Contact Us</Link></li>
            <li><Link href="/support#faq" className="hover:text-soft-blue-600 transition-colors font-medium">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Legal</h4>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><Link href="/terms" className="hover:text-soft-blue-600 transition-colors font-medium">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-soft-blue-600 transition-colors font-medium">Privacy Policy</Link></li>
            <li><Link href="/guidelines" className="hover:text-soft-blue-600 transition-colors font-medium">Community Guidelines</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm font-medium">
          &copy; 2025 TradeU. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm flex items-center gap-1.5">
          Made with <Heart className="h-3.5 w-3.5 text-coral-500 fill-coral-500" /> for students
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
