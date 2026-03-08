import { cn } from "@/modules/shared/lib/utils";
import { Star } from "lucide-react";

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
};

export function RatingInput({ value, onChange, max = 5, size = 24 }: RatingInputProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= value;

        return (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            onClick={() => onChange(starValue)}
            className={cn(
              "transition-colors focus:outline-none",
              isFilled ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
            )}
          >
            <Star size={size} className={isFilled ? "fill-current" : ""} />
          </button>
        );
      })}
    </div>
  );
}
