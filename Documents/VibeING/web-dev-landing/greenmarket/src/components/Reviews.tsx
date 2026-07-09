import { Star } from "lucide-react";

interface ReviewItemProps {
  review: {
    id: number;
    name: string;
    rating: number;
    text: string;
    date: string;
  };
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center text-sm font-bold text-green-light">
            {review.name[0]}
          </div>
          <div>
            <p className="text-sm font-medium">{review.name}</p>
            <p className="text-[10px] text-white/30">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < review.rating ? "fill-green-light text-green-light" : "fill-transparent text-white/20"}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-white/50 leading-relaxed">{review.text}</p>
    </div>
  );
}

interface ReviewCardProps {
  reviews: {
    id: number;
    name: string;
    rating: number;
    text: string;
    date: string;
  }[];
}

export function ReviewsList({ reviews }: ReviewCardProps) {
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
    </div>
  );
}
