import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PropertyWithDetails } from "@shared/schema";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ReviewSection from "@/components/review-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Star, 
  Heart, 
  Share2, 
  Wifi, 
  Car, 
  Utensils,
  Users,
  Maximize,
  Phone,
  Mail,
  MessageSquare,
  Check,
  X,
  ChefHat,
  Snowflake,
  PawPrint,
  Waves,
  Dumbbell,
  WashingMachine,
  TreePine,
  Shield,
  Zap
} from "lucide-react";
import { AMENITIES } from "@/lib/constants";

export default function PropertyDetail() {
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    message: "",
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });

  const propertyId = parseInt(params.id as string);

  const { data: property, isLoading } = useQuery<PropertyWithDetails>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId && !isNaN(propertyId),
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", `/api/properties/${propertyId}/inquiries`, data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent to the landlord. They will contact you soon.",
      });
      setShowInquiryForm(false);
      setInquiryData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        message: "",
        checkInDate: "",
        checkOutDate: "",
        guests: 1,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inquiryMutation.mutate(inquiryData);
  };

  const formatPrice = (price: number | string | null) => {
    if (!price) return "Contact for price";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: "Apartment",
      guestHouse: "Guest House",
      room: "Room",
      studio: "Studio",
      officeSpace: "Office Space",
      commercial: "Commercial",
      house: "House"
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getPropertyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      apartment: "bg-blue-100 text-blue-800",
      guestHouse: "bg-green-100 text-green-800",
      room: "bg-purple-100 text-purple-800",
      studio: "bg-orange-100 text-orange-800",
      officeSpace: "bg-gray-100 text-gray-800",
      commercial: "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-neutral-100 text-neutral-800";
  };

  const amenityIcons: Record<string, any> = {
    "Wi-Fi": Wifi,
    "Kitchen": ChefHat,
    "Parking": Car,
    "A/C": Snowflake,
    "Pet Friendly": PawPrint,
    "Swimming Pool": Waves,
    "Gym": Dumbbell,
    "Laundry": WashingMachine,
    "Balcony": TreePine,
    "Garden": TreePine,
    "Security": Shield,
    "Generator": Zap,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h1>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          {property.images && property.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image: string, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative h-96 rounded-xl overflow-hidden">
                      <img
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          ) : (
            <div className="h-96 bg-neutral-200 rounded-xl flex items-center justify-center">
              <span className="text-neutral-500 text-lg">No images available</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getPropertyTypeColor(property.propertyType)}>
                      {getPropertyTypeLabel(property.propertyType)}
                    </Badge>
                    <Badge variant="outline">{property.contractType.replace('_', ' ')}</Badge>
                  </div>
                  <h1 className="font-bold text-3xl text-neutral-800 mb-2">{property.title}</h1>
                  <div className="flex items-center text-neutral-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.division?.name}, {property.region?.name}</span>
                  </div>
                  
                  {/* Ratings */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{property.averageRating?.toFixed(1) || 'New'}</span>
                      {property.reviewCount && property.reviewCount > 0 && (
                        <span className="text-neutral-600">({property.reviewCount} reviews)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700 leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.rooms && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-neutral-600" />
                      <span>{property.rooms} {property.rooms === 1 ? 'room' : 'rooms'}</span>
                    </div>
                  )}
                  {property.size && (
                    <div className="flex items-center space-x-2">
                      <Maximize className="w-5 h-5 text-neutral-600" />
                      <span>{property.size} m²</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{property.contractType.replace('_', ' ')}</Badge>
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <h4 className="font-semibold mb-3">Amenities & Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {AMENITIES.map((amenity: string, index: number) => {
                      const isIncluded = property.amenities?.includes(amenity) || false;
                      const IconComponent = amenityIcons[amenity];
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          {isIncluded ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          {IconComponent && <IconComponent className="w-4 h-4 text-neutral-600" />}
                          <span className={`text-sm ${isIncluded ? 'text-neutral-800' : 'text-neutral-500'}`}>
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-neutral-700">
                  <MapPin className="w-5 h-5" />
                  <span>{property.division?.name}, {property.region?.name}, Cameroon</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatPrice(property.pricePerNight)}
                  </div>
                  {property.pricePerNight && (
                    <span className="text-neutral-600">per night</span>
                  )}
                  {property.pricePerMonth && (
                    <div className="text-lg text-neutral-700 mt-1">
                      {formatPrice(property.pricePerMonth)} per month
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <Button 
                    onClick={() => setShowInquiryForm(true)}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white"
                  >
                    Contact Landlord
                  </Button>
                </div>

                {/* Landlord Info */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Hosted by</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                      {property.landlord?.profileImageUrl ? (
                        <img 
                          src={property.landlord.profileImageUrl} 
                          alt="Host" 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-semibold text-neutral-600">
                          {property.landlord?.firstName?.[0] || (property.landlord?.email ? property.landlord.email[0].toUpperCase() : 'H')}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {property.landlord?.firstName && property.landlord?.lastName 
                          ? `${property.landlord.firstName} ${property.landlord.lastName}`
                          : 'Host'
                        }
                      </div>
                      <div className="text-sm text-neutral-600">Verified Host</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {property.landlord?.email && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-neutral-600" />
                        <span className="text-neutral-700">{property.landlord.email}</span>
                      </div>
                    )}
                    {property.landlord?.phoneNumber && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-neutral-600" />
                        <span className="text-neutral-700">{property.landlord.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Inquiry Form Modal */}
        {showInquiryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="guestName">Full Name</Label>
                    <Input
                      id="guestName"
                      value={inquiryData.guestName}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, guestName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={inquiryData.guestEmail}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, guestEmail: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guestPhone">Phone Number</Label>
                    <Input
                      id="guestPhone"
                      value={inquiryData.guestPhone}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, guestPhone: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="checkInDate">Check-in Date</Label>
                    <Input
                      id="checkInDate"
                      type="date"
                      value={inquiryData.checkInDate}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, checkInDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="checkOutDate">Check-out Date</Label>
                    <Input
                      id="checkOutDate"
                      type="date"
                      value={inquiryData.checkOutDate}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      value={inquiryData.guests}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell the landlord about your inquiry..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      disabled={inquiryMutation.isPending}
                      className="flex-1"
                    >
                      {inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowInquiryForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReviewSection propertyId={propertyId} />
        </div>
      </div>

      <Footer />
    </div>
  );
}