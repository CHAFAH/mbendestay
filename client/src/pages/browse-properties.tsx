import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import SearchForm from "@/components/search-form";
import PropertyCard from "@/components/property-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, X, Lock, Search } from "lucide-react";
import { PROPERTY_TYPES, CONTRACT_TYPES, AMENITIES, SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Link } from "wouter";
import type { PropertyWithDetails } from "@shared/schema";

export default function BrowseProperties() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [location] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    regionId: undefined as number | undefined,
    divisionId: undefined as number | undefined,
    propertyType: "",
    contractType: "",
    minPrice: 0,
    maxPrice: 500000,
    rooms: "",
    amenities: [] as string[],
    page: 1,
  });

  // Check if user has active renter subscription or is admin
  const hasActiveSubscription = user?.subscriptionStatus === 'active' || user?.email === 'sani.ray.red@gmail.com';
  
  // Show subscription required message if not authenticated or no subscription
  if (!authLoading && (!isAuthenticated || !hasActiveSubscription)) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Lock className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h1 className="font-bold text-3xl text-neutral-800 mb-4">
              Subscription Required
            </h1>
            <p className="text-lg text-neutral-600 mb-6">
              To browse properties, you need an active renter subscription.
            </p>
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto mb-8 shadow-lg">
              <Search className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl mb-2">Renter Subscription</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">10,000 FCFA</div>
              <p className="text-neutral-600 mb-4">Per month</p>
              <ul className="text-left space-y-2 text-sm mb-6">
                {SUBSCRIPTION_PLANS.renter_monthly.features.en.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link href="/login?redirect=/browse">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                      Login to Subscribe
                    </Button>
                  </Link>
                  <p className="text-sm text-neutral-600">
                    Don't have an account? <Link href="/signup?redirect=/browse" className="text-green-600 hover:underline">Sign up here</Link>
                  </p>
                </div>
              ) : (
                <Link href="/subscribe">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                    Subscribe Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    setFilters(prev => ({
      ...prev,
      regionId: params.get('regionId') ? parseInt(params.get('regionId')!) : undefined,
      divisionId: params.get('divisionId') ? parseInt(params.get('divisionId')!) : undefined,
      propertyType: params.get('propertyType') || "",
      contractType: params.get('contractType') || "",
      page: parseInt(params.get('page') || '1'),
    }));
  }, [location]);

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery<{
    properties: PropertyWithDetails[];
    total: number;
  }>({
    queryKey: ["/api/properties", filters],
  });

  const properties = propertiesData?.properties || [];
  const total = propertiesData?.total || 0;

  const handleSearch = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      regionId: undefined,
      divisionId: undefined,
      propertyType: "",
      contractType: "",
      minPrice: 0,
      maxPrice: 500000,
      rooms: "",
      amenities: [],
      page: 1,
    });
  };

  const totalPages = total ? Math.ceil(total / 12) : 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Header */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-bold text-3xl text-neutral-800">Browse Properties</h1>
              <p className="text-neutral-600 mt-2">
                {total} properties found
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 xl:w-96 space-y-6 ${showFilters || 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-sm"
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="md:hidden"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-3">
                  <Label className="font-medium">Property Type</Label>
                  <Select 
                    value={filters.propertyType} 
                    onValueChange={(value) => handleFilterChange('propertyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Type</SelectItem>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contract Type */}
                <div className="space-y-3">
                  <Label className="font-medium">Contract Type</Label>
                  <Select 
                    value={filters.contractType} 
                    onValueChange={(value) => handleFilterChange('contractType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Contract" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Contract</SelectItem>
                      {CONTRACT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="font-medium">Price Range (XCFA)</Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.minPrice, filters.maxPrice]}
                      onValueChange={([min, max]) => {
                        setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }));
                      }}
                      max={500000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-neutral-600">
                      <span>XCFA {filters.minPrice.toLocaleString()}</span>
                      <span>XCFA {filters.maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Rooms */}
                <div className="space-y-3">
                  <Label className="font-medium">Number of Rooms</Label>
                  <Select 
                    value={filters.rooms} 
                    onValueChange={(value) => handleFilterChange('rooms', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="1">1 Room</SelectItem>
                      <SelectItem value="2">2 Rooms</SelectItem>
                      <SelectItem value="3">3 Rooms</SelectItem>
                      <SelectItem value="4">4 Rooms</SelectItem>
                      <SelectItem value="5">5+ Rooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <Label className="font-medium">Amenities</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {AMENITIES.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={filters.amenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {propertiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : properties && properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {properties.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={filters.page === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">
                  No properties found
                </h3>
                <p className="text-neutral-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
