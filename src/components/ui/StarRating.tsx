import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  maxStars?: number;
}

export function StarRating({ value, onChange, maxStars = 5 }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const rating = index + 1;
        const isFilled = rating <= (hoveredRating || value);
        
        return (
          <button
            key={rating}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => onChange(rating)}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
} 