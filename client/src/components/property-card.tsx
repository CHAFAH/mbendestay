import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { PropertyWithDetails } from "@shared/schema";

interface PropertyCardProps {
  property: PropertyWithDetails;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: string | null) => {
    if (!price) return "Contact for price";
    return `₣${parseInt(price).toLocaleString()}`;
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "apartment":
        return "bg-accent text-accent-foreground";
      case "guesthouse":
        return "bg-secondary text-secondary-foreground";
      case "room":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
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
            {property.propertyType === "guesthouse" ? "Guest House" : 
             property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
          </Badge>
        </div>
        
        <button className="absolute top-4 right-4 bg-white/90 hover:bg-white text-neutral-700 p-2 rounded-full transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-xl text-neutral-800 line-clamp-2">{property.title}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-4 h-4 text-accent fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
        
        <div className="flex items-center text-neutral-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.division.name}, {property.region.name}</span>
        </div>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-xl text-primary">
              {formatPrice(property.pricePerNight)}
            </span>
            {property.pricePerNight && (
              <span className="text-neutral-500 text-sm ml-1">per night</span>
            )}
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
