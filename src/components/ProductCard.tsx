import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import StarRating from './StarRating';

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: string;
  emoji: string;
  category: string;
  time: string;
  location: string;
  rating?: number;
}

export default function ProductCard({
  id,
  title,
  description,
  price,
  condition,
  emoji,
  category,
  time,
  location,
  rating = 4.8
}: ProductCardProps) {
  return (
    <Link href={`/item/${id}`}>
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-2xl hover:border-blue-300 transition-all hover:-translate-y-2 cursor-pointer group">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
          {emoji}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {category}
            </span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              {condition}
            </span>
          </div>
          <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">
            {title}
          </h4>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-blue-600">${price}</span>
              <StarRating rating={rating} size="sm" showNumber />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {time}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
