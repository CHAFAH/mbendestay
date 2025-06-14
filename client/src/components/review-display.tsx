import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import ReviewForm from "./review-form";

interface ReviewDisplayProps {
  propertyId: number;
}

interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  stayDuration?: string;
  reviewerName: string;
  reviewerEmail: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface RatingStats {
  averageRating: number;
  reviewCount: number;
  ratingDistribution: { [key: number]: number };
}

export default function ReviewDisplay({ propertyId }: ReviewDisplayProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: [`/api/properties/${propertyId}/reviews`],
  });

  const { data: ratingStats, isLoading: statsLoading } = useQuery<RatingStats>({
    queryKey: [`/api/properties/${propertyId}/rating-stats`],
  });

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderRatingDistribution = () => {
    if (!ratingStats || !ratingStats.ratingDistribution) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingStats.ratingDistribution[star] || 0;
          const percentage = ratingStats.reviewCount > 0 ? (count / ratingStats.reviewCount) * 100 : 0;
          
          return (
            <div key={star} className="flex items-center space-x-2 text-sm">
              <span className="w-8">{star}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (reviewsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {ratingStats && ratingStats.reviewCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Reviews & Ratings</span>
              <Badge variant="secondary">{ratingStats.reviewCount} reviews</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {ratingStats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(ratingStats.averageRating), "w-6 h-6")}
                </div>
                <div className="text-sm text-gray-600">
                  Based on {ratingStats.reviewCount} review{ratingStats.reviewCount !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Rating Distribution */}
              <div>
                <h4 className="font-semibold mb-3">Rating breakdown</h4>
                {renderRatingDistribution()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {reviews.length > 0 ? `All Reviews (${reviews.length})` : 'No Reviews Yet'}
        </h3>
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant={showReviewForm ? "outline" : "default"}
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          propertyId={propertyId}
          onSuccess={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 && !showReviewForm && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500 mb-4">No reviews yet</div>
              <div className="text-sm text-gray-400 mb-4">
                Be the first to share your experience with this property
              </div>
              <Button onClick={() => setShowReviewForm(true)}>
                Write the First Review
              </Button>
            </CardContent>
          </Card>
        )}

        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.reviewerName}</span>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(review.createdAt), 'MMM d, yyyy')}</span>
                      {review.stayDuration && (
                        <>
                          <span>•</span>
                          <span>Stayed {review.stayDuration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="ml-1 text-sm font-medium">{review.rating}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {review.helpfulCount > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpfulCount} people found this helpful</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}