import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { PropertyWithDetails } from "@shared/schema";
import FavoriteButton from "./favorite-button";

interface PropertyCardProps {
  property: PropertyWithDetails;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { data: ratingStats } = useQuery<{ averageRating: number; reviewCount: number }>({
    queryKey: ["/api/properties", property.id, "rating-stats"],
  });

  const formatPrice = (price: string | null) => {
    if (!price || price === "0") return "XCFA 0";
    return `XCFA ${parseInt(price).toLocaleString()}`;
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "apartment":
        return "bg-accent text-accent-foreground";
      case "guestHouse":
        return "bg-secondary text-secondary-foreground";
      case "room":
        return "bg-primary text-primary-foreground";
      case "studio":
        return "bg-blue-500 text-white";
      case "officeSpace":
        return "bg-purple-500 text-white";
      case "commercial":
        return "bg-orange-500 text-white";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case "guestHouse":
        return "Guest House";
      case "officeSpace":
        return "Office Space";
      case "apartment":
        return "Apartment";
      case "room":
        return "Room";
      case "studio":
        return "Studio";
      case "commercial":
        return "Commercial";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <div className="relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-500">No image available</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <Badge className={getPropertyTypeColor(property.propertyType)}>
            {getPropertyTypeLabel(property.propertyType)}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <FavoriteButton propertyId={property.id} className="bg-white/90 hover:bg-white" />
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-xl text-neutral-800 line-clamp-2">{property.title}</h3>
          {ratingStats && ratingStats.reviewCount > 0 && (
            <div className="flex items-center space-x-1 ml-2">
              {renderStars(Math.round(ratingStats.averageRating))}
              <span className="text-sm font-medium ml-1">
                {ratingStats.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-500">
                ({ratingStats.reviewCount})
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-neutral-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.division.name}, {property.region.name}</span>
        </div>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {property.pricePerNight && parseInt(property.pricePerNight) > 0 ? (
              <div>
                <span className="font-bold text-xl text-primary">
                  {formatPrice(property.pricePerNight)}
                </span>
                <span className="text-neutral-500 text-sm ml-1">per night</span>
              </div>
            ) : null}
            {property.pricePerMonth && parseInt(property.pricePerMonth) > 0 ? (
              <div className={property.pricePerNight && parseInt(property.pricePerNight) > 0 ? "mt-1" : ""}>
                <span className={`font-bold text-lg ${property.pricePerNight && parseInt(property.pricePerNight) > 0 ? "text-secondary" : "text-primary text-xl"}`}>
                  {formatPrice(property.pricePerMonth)}
                </span>
                <span className="text-neutral-500 text-sm ml-1">per month</span>
              </div>
            ) : null}
            {(!property.pricePerNight || parseInt(property.pricePerNight) === 0) && 
             (!property.pricePerMonth || parseInt(property.pricePerMonth) === 0) ? (
              <div>
                <span className="font-bold text-xl text-primary">Contact for pricing</span>
              </div>
            ) : null}
          </div>
          <Link href={`/property/${property.id}`}>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
