import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import SearchForm from "@/components/search-form";
import PropertyCard from "@/components/property-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  MessageSquare,
  TrendingUp,
  Building
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: featuredProperties } = useQuery({
    queryKey: ["/api/properties", { limit: 6 }],
  });

  const { data: userProperties } = useQuery({
    queryKey: ["/api/landlord/properties"],
    enabled: !!user,
  });

  const { data: inquiries } = useQuery({
    queryKey: ["/api/landlord/inquiries"],
    enabled: !!user,
  });

  const handleSearch = (filters: any) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });
    setLocation(`/browse?${params.toString()}`);
  };

  const isLandlord = user?.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-bold text-3xl md:text-4xl mb-4">
              Welcome back, {user?.firstName || 'Friend'}!
            </h1>
            <p className="text-xl text-white/90 mb-6">
              {isLandlord 
                ? "Manage your properties and grow your hosting business"
                : "Discover amazing stays across Cameroon"
              }
            </p>
            
            {isLandlord && (
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {user?.subscriptionType === 'yearly' ? 'Yearly' : 'Monthly'} Subscriber
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-white/10 text-white border-white/30">
                  Verified Host
                </Badge>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Cards for Landlords */}
      {isLandlord && (
        <section className="py-8 -mt-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Building className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-800">
                    {userProperties?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-600">Properties Listed</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-800">
                    {inquiries?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-600">New Inquiries</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-800">85%</div>
                  <div className="text-sm text-neutral-600">Response Rate</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neutral-800">12</div>
                  <div className="text-sm text-neutral-600">Days Active</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Go to Full Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-bold text-2xl md:text-3xl text-neutral-800 mb-4">
              Find Your Next Stay
            </h2>
            <p className="text-lg text-neutral-600">
              Search through thousands of properties across Cameroon
            </p>
          </div>
          
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
              Recommended for You
            </h2>
            <p className="text-lg text-neutral-600">
              Based on your preferences and popular choices
            </p>
          </div>

          {featuredProperties?.properties && featuredProperties.properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.properties.slice(0, 6).map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-lg">
                No properties available yet. Check back soon!
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-8">
                Browse All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
