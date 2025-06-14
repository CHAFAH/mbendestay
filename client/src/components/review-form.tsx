import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReviewFormProps {
  propertyId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ propertyId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [stayDuration, setStayDuration] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/properties/${propertyId}/reviews`, {
        rating,
        title,
        comment,
        stayDuration,
        reviewerName,
        reviewerEmail,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
      toast({
        title: "Review Submitted",
        description: "Thank you for your review! It will be published after verification.",
      });
      
      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setStayDuration("");
      setReviewerName("");
      setReviewerEmail("");
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !title || !comment || !reviewerName || !reviewerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      toast({
        title: "Invalid Rating",
        description: "Please select a rating between 1 and 5 stars.",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`transition-colors ${isFilled ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star className="w-6 h-6 fill-current" />
        </button>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Overall Rating *</Label>
            <div className="flex items-center space-x-1">
              {renderStars()}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={200}
            />
          </div>

          {/* Stay Duration */}
          <div>
            <Label htmlFor="stayDuration">How long did you stay?</Label>
            <Select value={stayDuration} onValueChange={setStayDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3 days">1-3 days</SelectItem>
                <SelectItem value="1 week">1 week</SelectItem>
                <SelectItem value="2 weeks">2 weeks</SelectItem>
                <SelectItem value="1 month">1 month</SelectItem>
                <SelectItem value="2-3 months">2-3 months</SelectItem>
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="1 year+">1 year or more</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review Comment */}
          <div>
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience about this property..."
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Reviewer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reviewerName">Your Name *</Label>
              <Input
                id="reviewerName"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Full name"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="reviewerEmail">Email Address *</Label>
              <Input
                id="reviewerEmail"
                type="email"
                value={reviewerEmail}
                onChange={(e) => setReviewerEmail(e.target.value)}
                placeholder="your@email.com"
                maxLength={100}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createReviewMutation.isPending}
          >
            {createReviewMutation.isPending ? "Submitting Review..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}