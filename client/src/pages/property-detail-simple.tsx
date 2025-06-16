import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import PropertyGallery from "@/components/property-gallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ReviewDisplay from "@/components/review-display";

export default function PropertyDetailSimple() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: property, isLoading, error } = useQuery<any>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId && !isNaN(propertyId),
  });

  const contactMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/conversations", {
        propertyId,
        landlordId: property.landlordId,
      });
      return response.json();
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/chat/${conversation.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: any) => {
    if (!price) return "Contact for price";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
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

  // Generate sample gallery media based on property type
  const generateGalleryMedia = () => {
    const baseImages = [
      {
        id: '1',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        title: 'Living Room',
        description: 'Spacious living area with modern furnishing'
      },
      {
        id: '2', 
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        title: 'Kitchen',
        description: 'Fully equipped modern kitchen'
      },
      {
        id: '3',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1540518614846-7eded47432f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        title: 'Bedroom',
        description: 'Comfortable master bedroom'
      },
      {
        id: '4',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        title: 'Bathroom',
        description: 'Modern bathroom with quality fixtures'
      },
      {
        id: '5',
        type: 'video' as const,
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        title: 'Property Tour',
        description: 'Virtual walkthrough of the entire property'
      },
      {
        id: '6',
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
        title: 'Exterior View',
        description: 'Beautiful exterior and surrounding area'
      }
    ];

    if (property.propertyType === 'commercial' || property.propertyType === 'officeSpace') {
      return [
        {
          id: '1',
          type: 'image' as const,
          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
          title: 'Office Space',
          description: 'Modern office environment'
        },
        {
          id: '2',
          type: 'image' as const,
          url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
          title: 'Conference Room',
          description: 'Professional meeting space'
        },
        {
          id: '3',
          type: 'image' as const,
          url: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800',
          title: 'Reception Area',
          description: 'Welcoming entrance space'
        },
        {
          id: '4',
          type: 'video' as const,
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
          title: 'Office Tour',
          description: 'Complete walkthrough of office facilities'
        }
      ];
    }

    return baseImages;
  };

  const galleryMedia = generateGalleryMedia();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Gallery */}
        <div className="mb-8">
          <PropertyGallery 
            media={galleryMedia}
            propertyTitle={property.title}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge>{property.propertyType}</Badge>
                <Badge variant="outline">{property.contractType?.replace('_', ' ')}</Badge>
              </div>
              <h1 className="font-bold text-3xl text-neutral-800 mb-2">{property.title}</h1>
              <div className="flex items-center text-neutral-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.division?.name}, {property.region?.name}</span>
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
                <div className="grid grid-cols-2 gap-4">
                  {property.rooms && (
                    <div>Rooms: {property.rooms}</div>
                  )}
                  {property.size && (
                    <div>Size: {property.size} m²</div>
                  )}
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {property.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="text-sm">{amenity}</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatPrice(property.pricePerNight || property.pricePerMonth)}
                  </div>
                  {property.pricePerNight ? (
                    <span className="text-neutral-600">per night</span>
                  ) : property.pricePerMonth ? (
                    <span className="text-neutral-600">per month</span>
                  ) : null}
                </div>

                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setLocation(`/login?redirect=${encodeURIComponent(`/property/${propertyId}`)}`);
                      return;
                    }
                    contactMutation.mutate();
                  }}
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Starting conversation..." : "Contact Landlord"}
                </Button>

                {/* Landlord Info */}
                {property.landlord && (
                  <div className="border-t pt-4 mt-6">
                    <h4 className="font-semibold mb-3">Hosted by</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                        {property.landlord.profileImageUrl ? (
                          <img 
                            src={property.landlord.profileImageUrl} 
                            alt="Host" 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="font-semibold text-neutral-600">
                            {property.landlord.firstName?.[0] || 'H'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {property.landlord.firstName && property.landlord.lastName 
                            ? `${property.landlord.firstName} ${property.landlord.lastName}`
                            : 'Host'
                          }
                        </div>
                        <div className="text-sm text-neutral-600">Verified Host</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewDisplay propertyId={propertyId} />
        </div>
      </div>

      <Footer />
    </div>
  );
}