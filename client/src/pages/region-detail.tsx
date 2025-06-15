import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Thermometer, 
  Users, 
  Star, 
  Camera,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { getRegionData } from "@/lib/regions-data";
import { useLanguage } from "@/components/simple-language-switcher";

export default function RegionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  
  const regionData = getRegionData(slug || '');
  
  const { data: properties } = useQuery({
    queryKey: ["/api/properties", { regionSlug: slug }],
  });

  if (!regionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Region Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src={regionData.imageUrl} 
          alt={`${regionData.name} landscape`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 pb-12">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {regionData.name} Region
            </h1>
            <p className="text-xl text-white/90 mb-2">
              Capital: {regionData.capital}
            </p>
            <p className="text-lg text-white/80 max-w-3xl">
              {regionData.description[language]}
            </p>
          </div>
        </div>
      </section>

      {/* Region Information */}
      <section className="py-12 bg-neutral-50">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Thermometer className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Temperature</h3>
                <p className="text-2xl font-bold text-primary">{regionData.temperature}</p>
                <p className="text-sm text-neutral-600">{regionData.climate}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Population</h3>
                <p className="text-2xl font-bold text-primary">{regionData.population}</p>
                <p className="text-sm text-neutral-600">Inhabitants</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Capital</h3>
                <p className="text-2xl font-bold text-primary">{regionData.capital}</p>
                <p className="text-sm text-neutral-600">Regional center</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Attractions</h3>
                <p className="text-2xl font-bold text-primary">{regionData.attractions.length}+</p>
                <p className="text-sm text-neutral-600">Tourist sites</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Popular Locations */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Popular Locations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {regionData.popularLocations.map((location, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-primary mr-3" />
                      <span className="font-medium text-neutral-800">{location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Attractions */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Key Attractions</h2>
              <div className="space-y-4">
                {regionData.attractions.map((attraction, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-accent mr-3" />
                      <span className="font-medium text-neutral-800">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Economy & Culture */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Economy & Culture</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {regionData.economy.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <div className="w-6 h-6 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties in Region */}
      <section className="py-12 bg-white">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-800">
              Properties in {regionData.name}
            </h2>
            <Link href={`/browse?region=${regionData.slug}`}>
              <Button variant="outline">
                View All Properties
              </Button>
            </Link>
          </div>

          {properties?.properties?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.properties.slice(0, 8).map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                No properties available yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Be the first to list a property in {regionData.name}
              </p>
              <Link href="/register-landlord">
                <Button>List Your Property</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}