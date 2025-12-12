import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0-5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = false,
  reviewCount
}: StarRatingProps) {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Stars */}
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = rating >= starValue;
          const isPartial = rating > index && rating < starValue;

          return (
            <div key={index} className="relative">
              {isPartial ? (
                <div className="relative">
                  <Star className={`${sizes[size]} text-gray-300`} />
                  <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${(rating - index) * 100}%` }}
                  >
                    <Star className={`${sizes[size]} text-yellow-500 fill-yellow-500`} />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${sizes[size]} ${
                    isFilled
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Rating number */}
      {showNumber && (
        <span className={`${textSizes[size]} font-semibold text-gray-900`}>
          {rating.toFixed(1)}
        </span>
      )}

      {/* Review count */}
      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} text-gray-500`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
