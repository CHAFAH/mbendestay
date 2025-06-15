import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail, 
  Users, 
  CreditCard, 
  Home, 
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const helpCategories = [
  {
    title: "Getting Started",
    icon: Users,
    description: "Learn the basics of using MbendeStay",
    articles: [
      "How to create your account",
      "Understanding subscription plans", 
      "Setting up your profile",
      "Navigation guide"
    ]
  },
  {
    title: "For Renters",
    icon: Search,
    description: "Find and book the perfect accommodation",
    articles: [
      "How to search for properties",
      "Contacting property owners",
      "Understanding listings",
      "Booking process"
    ]
  },
  {
    title: "For Landlords",
    icon: Home,
    description: "List and manage your properties",
    articles: [
      "Creating property listings",
      "Managing your dashboard",
      "Communicating with renters",
      "Pricing strategies"
    ]
  },
  {
    title: "Payments & Billing",
    icon: CreditCard,
    description: "Manage subscriptions and payments",
    articles: [
      "Payment methods",
      "Subscription management",
      "Billing inquiries",
      "Refund policies"
    ]
  },
  {
    title: "Safety & Security",
    icon: Shield,
    description: "Stay safe while using our platform",
    articles: [
      "Safety guidelines",
      "Verification process",
      "Reporting issues",
      "Privacy protection"
    ]
  },
  {
    title: "Technical Support",
    icon: HelpCircle,
    description: "Resolve technical issues",
    articles: [
      "Troubleshooting guide",
      "Browser compatibility",
      "Mobile app issues",
      "Account recovery"
    ]
  }
];

const quickActions = [
  {
    title: "Live Chat Support",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    action: "Start Chat",
    available: "Online now"
  },
  {
    title: "Phone Support",
    description: "Call us for immediate assistance",
    icon: Phone,
    action: "Call +237 672 923 300",
    available: "24/7 Available"
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    action: "Send Email",
    available: "Response within 24h"
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <HelpCircle className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Help Center</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Find guides, tutorials, and answers to help you get the most out of MbendeStay.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Help Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <action.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    {action.available}
                  </Badge>
                  <Button className="w-full" asChild>
                    {action.title === "Phone Support" ? (
                      <a href="tel:+237672923300">{action.action}</a>
                    ) : action.title === "Email Support" ? (
                      <a href="mailto:sani.ray.red@gmail.com">{action.action}</a>
                    ) : (
                      <button>{action.action}</button>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary cursor-pointer transition-colors">
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span>{article}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    View All Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">How to Create Your First Property Listing</CardTitle>
                    <CardDescription>Step-by-step guide for landlords</CardDescription>
                  </div>
                  <Badge variant="secondary">Popular</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn how to create an attractive property listing that gets noticed by potential renters.
                  Includes tips on photography, descriptions, and pricing.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">5 min read</span>
                  <Button variant="outline" size="sm">Read Article</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Understanding Subscription Plans</CardTitle>
                    <CardDescription>Choose the right plan for your needs</CardDescription>
                  </div>
                  <Badge variant="secondary">Essential</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Compare our subscription plans and understand which features are included 
                  with each plan to make the best choice.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">3 min read</span>
                  <Button variant="outline" size="sm">Read Article</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Safety Tips for Property Viewings</CardTitle>
                    <CardDescription>Stay safe when meeting landlords</CardDescription>
                  </div>
                  <Badge variant="secondary">Safety</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Important safety guidelines to follow when viewing properties and meeting 
                  with landlords for the first time.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">4 min read</span>
                  <Button variant="outline" size="sm">Read Article</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Payment Methods & Billing</CardTitle>
                    <CardDescription>Manage your subscription payments</CardDescription>
                  </div>
                  <Badge variant="secondary">Billing</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn about accepted payment methods, how to update billing information, 
                  and manage your subscription settings.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">3 min read</span>
                  <Button variant="outline" size="sm">Read Article</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 aspect-video rounded-t-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Platform Overview</h3>
                  <p className="text-gray-600 text-sm mb-3">Get familiar with MbendeStay's interface and main features.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">8:30</span>
                    <Button size="sm">Watch Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 aspect-video rounded-t-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Creating Your First Listing</h3>
                  <p className="text-gray-600 text-sm mb-3">Step-by-step video guide for landlords.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">12:15</span>
                    <Button size="sm">Watch Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 aspect-video rounded-t-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Finding Properties</h3>
                  <p className="text-gray-600 text-sm mb-3">How to search and filter properties effectively.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">6:45</span>
                    <Button size="sm">Watch Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="tel:+237672923300" className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Call Support</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact" className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact Form</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/faq" className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>View FAQs</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}