import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import SearchForm from "@/components/search-form";
import PropertyCard from "@/components/property-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  MessageSquare, 
  Star, 
  Headphones, 
  Upload, 
  CreditCard,
  Building,
  Check
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export default function Landing() {
  const [, setLocation] = useLocation();

  const { data: featuredProperties } = useQuery({
    queryKey: ["/api/properties", { limit: 6 }],
  });

  const { data: regions = [] } = useQuery({
    queryKey: ["/api/regions"],
  });

  const handleSearch = (filters: any) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });
    setLocation(`/browse?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(45, 80, 22, 0.4), rgba(45, 80, 22, 0.4)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
          }}
        />
        
        {/* Floating Cameroonian Images */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Cameroon Flag */}
          <div className="absolute top-16 left-16 w-20 h-14 animate-pulse opacity-90" style={{ animationDelay: '0s', animationDuration: '4s' }}>
            <div className="w-full h-full rounded shadow-lg bg-gradient-to-b from-green-600 via-red-600 to-yellow-500 border border-white/20"></div>
          </div>
          
          {/* Crab */}
          <div className="absolute top-20 right-24 w-16 h-16 animate-bounce opacity-80" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
            <div className="w-full h-full rounded-full shadow-lg bg-gradient-to-br from-red-600 to-orange-700 border-2 border-white/30 flex items-center justify-center">
              <div className="w-8 h-6 bg-red-400 rounded-lg relative">
                <div className="absolute -left-1 top-1 w-2 h-2 bg-red-300 rounded-full"></div>
                <div className="absolute -right-1 top-1 w-2 h-2 bg-red-300 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Elephant */}
          <div className="absolute top-32 right-20 w-20 h-20 animate-pulse opacity-90" style={{ animationDelay: '1s', animationDuration: '4s' }}>
            <img src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=80&h=80&fit=crop&crop=center" alt="Elephant" className="w-full h-full object-cover rounded-full shadow-lg" />
          </div>
          
          {/* Rice Plant */}
          <div className="absolute top-40 left-1/4 w-14 h-14 animate-bounce opacity-75" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
            <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=56&h=56&fit=crop&crop=center" alt="Rice Plant" className="w-full h-full object-cover rounded-full shadow-lg" />
          </div>
          
          {/* Saxophone */}
          <div className="absolute bottom-40 left-16 w-18 h-18 animate-pulse opacity-85" style={{ animationDelay: '0.5s', animationDuration: '3.8s' }}>
            <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=72&h=72&fit=crop&crop=center" alt="Saxophone" className="w-full h-full object-cover rounded-full shadow-lg" />
          </div>
          
          {/* Traditional Hut */}
          <div className="absolute bottom-32 right-32 w-16 h-16 animate-bounce opacity-80" style={{ animationDelay: '1.5s', animationDuration: '4.2s' }}>
            <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=64&h=64&fit=crop&crop=center" alt="Traditional Hut" className="w-full h-full object-cover rounded-full shadow-lg" />
          </div>
          
          {/* Lion */}
          <div className="absolute top-60 right-1/4 w-20 h-20 animate-pulse opacity-90" style={{ animationDelay: '2.5s', animationDuration: '3.2s' }}>
            <img src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=80&h=80&fit=crop&crop=center" alt="Lion" className="w-full h-full object-cover rounded-full shadow-lg" />
          </div>
          
          {/* Peace Plant */}
          <div className="absolute bottom-60 left-1/3 w-12 h-12 animate-bounce opacity-75" style={{ animationDelay: '3s', animationDuration: '3.6s' }}>
            <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=48&h=48&fit=crop&crop=center" alt="Peace Plant" className="w-full h-full object-cover rounded-full shadow-lg" />
          </div>
          
          {/* Coastal Scene */}
          <div className="absolute top-24 right-1/3 w-12 h-12 animate-pulse opacity-60" style={{ animationDelay: '4s', animationDuration: '5s' }}>
            <div className="w-full h-full rounded-full shadow-lg bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-white/30 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Additional Crab */}
          <div className="absolute bottom-20 right-16 w-12 h-12 animate-bounce opacity-70" style={{ animationDelay: '3.5s', animationDuration: '4.5s' }}>
            <div className="w-full h-full rounded-full shadow-lg bg-gradient-to-br from-orange-600 to-red-700 border-2 border-white/30 flex items-center justify-center">
              <div className="w-6 h-4 bg-orange-400 rounded-sm"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Find Your Perfect Stay in <span className="text-accent">Cameroon</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover authentic accommodations across all 10 regions of Cameroon. From bustling cities to serene villages.
          </p>

          <SearchForm onSearch={handleSearch} className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover handpicked accommodations across Cameroon's most beautiful destinations
            </p>
          </div>

          {featuredProperties?.properties && featuredProperties.properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
              {featuredProperties.properties.slice(0, 10).map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-lg">
                No properties available yet. Be the first to list your property!
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-8">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-16 bg-neutral-50">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
              Explore Cameroon's Regions
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From the coastal beauty of Littoral to the cultural richness of the West, discover accommodations across all 10 regions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
            {regions.slice(0, 5).map((region: any) => (
              <div key={region.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-3">
                  <img 
                    src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt={`${region.name} region landscape`} 
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-lg text-neutral-800 group-hover:text-primary transition-colors">
                  {region.name}
                </h3>
                <p className="text-sm text-neutral-600">Explore properties</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 text-center">
          <div className="mb-8">
            <Building className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="font-bold text-3xl md:text-4xl mb-4">
              List Your Property Today
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of successful hosts across Cameroon. Start earning from your property in just a few steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Listing</h3>
              <p className="text-white/80">Upload photos, add details, and publish your property in minutes</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Listings</h3>
              <p className="text-white/80">All hosts are verified with national ID for guest safety and trust</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Mobile Payments</h3>
              <p className="text-white/80">Accept payments via MTN, Orange Money, and bank transfers</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-lg mb-3">Monthly Subscription</h4>
                <div className="text-3xl font-bold text-accent mb-2">
                  {SUBSCRIPTION_PLANS.monthly.price.toLocaleString()} XCFA
                  <span className="text-lg font-normal text-white/80"> / month</span>
                </div>
                <ul className="space-y-2 text-white/90">
                  {SUBSCRIPTION_PLANS.monthly.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">
                  Yearly Subscription 
                  <span className="bg-accent text-primary text-xs px-2 py-1 rounded-full ml-2">
                    {SUBSCRIPTION_PLANS.yearly.savings}
                  </span>
                </h4>
                <div className="text-3xl font-bold text-accent mb-2">
                  {SUBSCRIPTION_PLANS.yearly.price.toLocaleString()} XCFA
                  <span className="text-lg font-normal text-white/80"> / year</span>
                </div>
                <ul className="space-y-2 text-white/90">
                  {SUBSCRIPTION_PLANS.yearly.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/register-landlord">
              <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary font-bold py-4 px-8 text-lg">
                Start Hosting Today
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 border-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We've built comprehensive safety measures to ensure secure and trustworthy experiences for both guests and hosts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-800">ID Verification</h3>
              <p className="text-neutral-600">All hosts must provide valid Cameroonian national ID for verification</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-800">Secure Messaging</h3>
              <p className="text-neutral-600">Built-in messaging system keeps your contact information private</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-neutral-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-800">Review System</h3>
              <p className="text-neutral-600">Mutual reviews help build trust and improve service quality</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-800">24/7 Support</h3>
              <p className="text-neutral-600">Customer support available around the clock for any issues</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
