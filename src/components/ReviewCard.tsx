import { User } from 'lucide-react';
import StarRating from './StarRating';

interface ReviewCardProps {
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  itemName?: string;
}

export default function ReviewCard({
  reviewerName,
  reviewerAvatar,
  rating,
  comment,
  date,
  itemName
}: ReviewCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition">
      <div className="flex items-start space-x-4">
        {/* Reviewer Avatar */}
        <div className="flex-shrink-0">
          {reviewerAvatar ? (
            <img
              src={reviewerAvatar}
              alt={reviewerName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{reviewerName}</h4>
              <p className="text-xs text-gray-500">{date}</p>
            </div>
            <StarRating rating={rating} size="sm" />
          </div>

          {itemName && (
            <p className="text-sm text-gray-600 mb-2">
              Purchased: <span className="font-medium text-gray-900">{itemName}</span>
            </p>
          )}

          <p className="text-gray-700 text-sm leading-relaxed">{comment}</p>
        </div>
      </div>
    </div>
  );
}
