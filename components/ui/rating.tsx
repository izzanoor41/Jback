import { Star } from "lucide-react";
import React from "react";

const Rating = ({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) => {
  const filledStars = Math.floor(value);
  const isHalfStar = value % 1 >= 0.5;
  const totalStars = 5;

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(totalStars)].map((_, index) => {
        if (index < filledStars) {
          return <Star key={index} className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />;
        } else if (index === filledStars && isHalfStar) {
          return <Star key={index} className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400/50`} />;
        } else {
          return <Star key={index} className={`${sizeClasses[size]} text-gray-300`} />;
        }
      })}
    </div>
  );
};

export default Rating;
