import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface FavoriteButtonProps {
  propertyId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({ propertyId, className = "", size = "md" }: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if property is favorited
  const { data: favoriteData } = useQuery({
    queryKey: [`/api/favorites/${propertyId}/check`],
    enabled: isAuthenticated,
    retry: false,
  });

  const isFavorited = (favoriteData as { isFavorite?: boolean })?.isFavorite || false;

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        return await apiRequest("DELETE", `/api/favorites/${propertyId}`);
      } else {
        return await apiRequest("POST", "/api/favorites", { propertyId });
      }
    },
    onSuccess: () => {
      // Invalidate queries to refresh favorite status
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", propertyId, "check"] });
      
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited 
          ? "Property removed from your favorites list" 
          : "Property added to your favorites list",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Required",
          description: "Please log in to save properties to favorites",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to save properties to favorites",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    toggleFavoriteMutation.mutate();
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`${sizeClasses[size]} bg-white/90 hover:bg-white border-gray-200 hover:border-red-300 transition-all ${className}`}
      onClick={handleClick}
      disabled={toggleFavoriteMutation.isPending}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={`${iconSizes[size]} transition-all ${
          isFavorited 
            ? "fill-red-500 text-red-500" 
            : "text-gray-400 hover:text-red-500"
        }`} 
      />
    </Button>
  );
}