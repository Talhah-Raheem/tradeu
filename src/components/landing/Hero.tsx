'use client';

import { Search, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeroProps {
  onSearch: (searchTerm: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      // Optionally navigate to listings page with search
      // router.push(`/listings?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
    // Scroll to listings section
    const listingsSection = document.getElementById('featured-items');
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="text-center py-16 sm:py-24 lg:py-28 px-4">
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-soft-blue-100 to-soft-green-100 text-soft-blue-700 px-5 py-2.5 rounded-full text-sm font-bold mb-8 shadow-sm border border-soft-blue-200/50">
        <Shield className="h-4 w-4" />
        <span>.edu Verified Students Only</span>
        <Sparkles className="h-4 w-4 text-soft-green-600" />
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
        Your Campus
        <span className="block mt-2 bg-gradient-to-r from-soft-blue-600 via-soft-green-600 to-lilac-600 bg-clip-text text-transparent">
          Marketplace
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium text-balance">
        Buy, sell, and trade with verified students. Safe, easy, and built for campus&nbsp;life.
      </p>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-soft-blue-400 to-soft-green-400 rounded-full opacity-30 blur group-hover:opacity-40 transition duration-200"></div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <input
              type="text"
              placeholder="Search for textbooks, furniture, electronics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-14 pr-36 py-5 bg-white border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-soft-blue-400 focus:border-soft-blue-500 placeholder:text-gray-400 text-gray-900 shadow-lg text-base transition-all outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-soft-blue-500 to-soft-blue-600 text-white px-7 py-3 rounded-full hover:shadow-xl transition-all duration-200 font-bold text-sm"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-gray-500">
          <span className="font-medium">Popular:</span>
          <button
            onClick={() => handlePopularSearch('textbook')}
            className="px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-soft-blue-400 hover:text-soft-blue-600 transition-colors font-medium"
          >
            Textbooks
          </button>
          <button
            onClick={() => handlePopularSearch('furniture')}
            className="px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-soft-blue-400 hover:text-soft-blue-600 transition-colors font-medium"
          >
            Furniture
          </button>
          <button
            onClick={() => handlePopularSearch('electronics')}
            className="px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-soft-blue-400 hover:text-soft-blue-600 transition-colors font-medium"
          >
            Electronics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
