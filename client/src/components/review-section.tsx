import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Plus, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ReviewWithDetails } from "@shared/schema";

interface ReviewSectionProps {
  propertyId: number;
}

export default function ReviewSection({ propertyId }: ReviewSectionProps) {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    comment: "",
    stayDuration: "",
    reviewerName: "",
    reviewerEmail: "",
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/properties", propertyId, "reviews"],
  });

  const { data: ratingStats } = useQuery<{ averageRating: number; reviewCount: number }>({
    queryKey: ["/api/properties", propertyId, "rating-stats"],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      return await apiRequest("POST", `/api/properties/${propertyId}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties", propertyId, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties", propertyId, "rating-stats"] });
      setIsFormOpen(false);
      setFormData({
        rating: 5,
        title: "",
        comment: "",
        stayDuration: "",
        reviewerName: "",
        reviewerEmail: "",
      });
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    createReviewMutation.mutate(formData);
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const starSize = size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Reviews & Ratings</CardTitle>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this property
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Select 
                      value={formData.rating.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center gap-2">
                              <span>{rating}</span>
                              {renderStars(rating, "sm")}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Review Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Brief summary of your experience"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Share details about your stay..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stayDuration">Duration of Stay</Label>
                    <Input
                      id="stayDuration"
                      value={formData.stayDuration}
                      onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
                      placeholder="e.g., 3 months, 1 week"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reviewerName">Your Name</Label>
                    <Input
                      id="reviewerName"
                      value={formData.reviewerName}
                      onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="reviewerEmail">Email Address</Label>
                    <Input
                      id="reviewerEmail"
                      type="email"
                      value={formData.reviewerEmail}
                      onChange={(e) => setFormData({ ...formData, reviewerEmail: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createReviewMutation.isPending}
                  >
                    {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {ratingStats && (
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">
                  {ratingStats.averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(ratingStats.averageRating), "lg")}
                <div className="text-sm text-gray-600 mt-1">
                  {ratingStats.reviewCount} review{ratingStats.reviewCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviewsLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.reviewer?.profileImageUrl || undefined} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{review.reviewerName}</h4>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          {review.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Stay
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(review.createdAt!)}
                      </div>
                    </div>
                    
                    <h5 className="font-medium">{review.title}</h5>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    
                    {review.stayDuration && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Duration of stay:</span> {review.stayDuration}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}