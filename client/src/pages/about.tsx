import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Shield, Globe, Heart, Award } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function About() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">About MbendeStay</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Connecting travelers with authentic accommodations across all regions of Cameroon, 
              while empowering local property owners to share their spaces.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                MbendeStay was founded with a simple yet powerful vision: to showcase the incredible 
                diversity and beauty of Cameroon through authentic accommodation experiences. From 
                the bustling cities of Douala and Yaoundé to the serene landscapes of the Far North 
                and the coastal charm of Kribi, we believe every region has unique stories to tell.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our platform bridges the gap between travelers seeking authentic experiences and 
                local property owners who want to share their spaces. We understand that 
                accommodation is more than just a place to sleep – it's your gateway to 
                experiencing Cameroonian culture, hospitality, and local life.
              </p>
              <p className="text-lg text-gray-700">
                Whether you're visiting for business, pleasure, or exploration, MbendeStay 
                ensures you find the perfect place to call home during your stay in Cameroon.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-6">
                To revolutionize the hospitality industry in Cameroon by creating a trusted, 
                accessible platform that celebrates local culture while providing exceptional 
                accommodation experiences.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To become the leading accommodation platform in Central Africa, known for 
                authentic experiences, community empowerment, and sustainable tourism.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We prioritize building strong relationships with local communities, 
                  ensuring our platform benefits both hosts and guests while respecting 
                  local customs and traditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Trust & Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Security and trust are fundamental to our platform. We implement 
                  robust verification processes and safety measures to protect both 
                  hosts and guests throughout their journey.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Cultural Authenticity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We celebrate Cameroon's rich cultural diversity by promoting 
                  authentic experiences that allow visitors to truly connect with 
                  local communities and traditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Exceptional Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We are committed to providing outstanding customer service, 
                  ensuring every interaction with our platform is smooth, 
                  helpful, and memorable.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Quality Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We maintain high standards for all properties and services 
                  listed on our platform, ensuring guests receive consistent 
                  quality experiences across Cameroon.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Local Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We empower local property owners by providing them with tools, 
                  support, and opportunities to generate income while sharing 
                  their unique spaces with visitors.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Makes Us Different</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Local Expertise</h3>
                <p className="text-gray-700 mb-6">
                  Our team consists of Cameroon natives who understand the local market, 
                  culture, and traveler needs. This local knowledge helps us provide 
                  better service and authentic recommendations.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Regional Focus</h3>
                <p className="text-gray-700">
                  Unlike global platforms, we specialize exclusively in Cameroon, 
                  allowing us to offer deeper insights, better local partnerships, 
                  and more tailored experiences for each region.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community Impact</h3>
                <p className="text-gray-700 mb-6">
                  Every booking through MbendeStay directly supports local communities. 
                  We work with property owners to ensure fair compensation and provide 
                  training to help them succeed as hosts.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Curated Experiences</h3>
                <p className="text-gray-700">
                  We personally vet all properties and hosts to ensure they meet 
                  our quality standards and can provide authentic Cameroonian 
                  hospitality experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience Cameroon?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Join thousands of travelers who have discovered authentic Cameroonian hospitality through MbendeStay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/browse" 
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Browse Properties
            </a>
            <a 
              href="/contact" 
              className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}