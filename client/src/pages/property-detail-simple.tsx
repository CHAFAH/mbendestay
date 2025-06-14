import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

export default function PropertyDetailSimple() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);

  const { data: property, isLoading, error } = useQuery<any>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId && !isNaN(propertyId),
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug info */}
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <pre className="text-xs overflow-auto max-h-32">
            {JSON.stringify(property, null, 2)}
          </pre>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          {property.images && property.images.length > 0 ? (
            <div className="h-96 bg-neutral-200 rounded-xl overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
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

                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                  Contact Landlord
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
      </div>

      <Footer />
    </div>
  );
}