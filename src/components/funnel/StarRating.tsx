import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

export function StarRating({ rating = 5, size = "md", className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(sizeMap[size], "fill-rating-gold stroke-rating-gold", i > rating && "fill-muted stroke-muted")}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
