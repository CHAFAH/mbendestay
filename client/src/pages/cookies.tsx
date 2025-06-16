import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Cookie, Calendar, Mail, Phone, Settings, Shield, BarChart, Target } from "lucide-react";
import { useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const cookieCategories = [
  {
    id: "essential",
    title: "Essential Cookies",
    icon: Shield,
    color: "bg-green-500",
    required: true,
    description: "These cookies are necessary for the website to function and cannot be switched off.",
    examples: [
      "Authentication and login status",
      "Shopping cart contents",
      "Security features",
      "Load balancing"
    ],
    duration: "Session or up to 30 days"
  },
  {
    id: "functional",
    title: "Functional Cookies",
    icon: Settings,
    color: "bg-blue-500",
    required: false,
    description: "These cookies enable enhanced functionality and personalization.",
    examples: [
      "Language preferences",
      "Region selection",
      "User interface customizations",
      "Accessibility settings"
    ],
    duration: "Up to 1 year"
  },
  {
    id: "analytics",
    title: "Analytics Cookies",
    icon: BarChart,
    color: "bg-purple-500",
    required: false,
    description: "These cookies help us understand how visitors interact with our website.",
    examples: [
      "Page views and user journeys",
      "Popular content identification",
      "Performance monitoring",
      "Error tracking"
    ],
    duration: "Up to 2 years"
  },
  {
    id: "marketing",
    title: "Marketing Cookies",
    icon: Target,
    color: "bg-orange-500",
    required: false,
    description: "These cookies are used to deliver relevant advertisements and marketing content.",
    examples: [
      "Targeted advertising",
      "Social media integration",
      "Conversion tracking",
      "Retargeting campaigns"
    ],
    duration: "Up to 1 year"
  }
];

const specificCookies = [
  {
    name: "_mbstay_session",
    purpose: "Maintains user login session",
    category: "Essential",
    duration: "Session",
    provider: "MbendeStay"
  },
  {
    name: "_mbstay_lang",
    purpose: "Stores language preference",
    category: "Functional",
    duration: "1 year",
    provider: "MbendeStay"
  },
  {
    name: "_mbstay_region",
    purpose: "Remembers selected region",
    category: "Functional",
    duration: "6 months",
    provider: "MbendeStay"
  },
  {
    name: "_ga",
    purpose: "Google Analytics tracking",
    category: "Analytics",
    duration: "2 years",
    provider: "Google"
  },
  {
    name: "_gid",
    purpose: "Google Analytics session tracking",
    category: "Analytics",
    duration: "24 hours",
    provider: "Google"
  },
  {
    name: "_fbp",
    purpose: "Facebook Pixel tracking",
    category: "Marketing",
    duration: "3 months",
    provider: "Facebook"
  }
];

export default function Cookies() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false
  });

  const handlePreferenceChange = (category: string, enabled: boolean) => {
    if (category === "essential") return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const savePreferences = () => {
    // In a real implementation, this would save to localStorage and apply the settings
    console.log("Saving cookie preferences:", cookiePreferences);
    alert("Cookie preferences saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Cookie className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Cookie Policy</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Learn about how we use cookies and similar technologies to enhance your experience on MbendeStay.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4 text-green-100">
              <Calendar className="w-4 h-4" />
              <span>Last updated: December 15, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cookie Settings */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Cookie Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize your cookie settings below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cookieCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{category.title}</div>
                        {category.required && (
                          <Badge variant="secondary" className="text-xs">Required</Badge>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={cookiePreferences[category.id as keyof typeof cookiePreferences]}
                      onCheckedChange={(checked) => handlePreferenceChange(category.id, checked)}
                      disabled={category.required}
                    />
                  </div>
                ))}
                
                <Button onClick={savePreferences} className="w-full mt-6">
                  Save Preferences
                </Button>
                
                <div className="text-xs text-gray-500 mt-4">
                  Your preferences will be saved and applied to your browsing experience.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cookie Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Cookies are small text files that are stored on your device when you visit a website. 
                  They help us provide you with a better experience by remembering your preferences, 
                  keeping you logged in, and understanding how you use our platform.
                </p>
                <p>
                  Similar technologies like web beacons, pixels, and local storage may also be used 
                  for similar purposes. When we refer to "cookies" in this policy, we include these 
                  similar technologies.
                </p>
              </CardContent>
            </Card>

            {/* Cookie Categories */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Types of Cookies We Use</h2>
              {cookieCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <span>{category.title}</span>
                      {category.required && (
                        <Badge variant="secondary">Required</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Examples:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {category.examples.map((example, index) => (
                            <li key={index}>• {example}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Duration:</h4>
                        <p className="text-sm text-gray-600">{category.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Specific Cookies Table */}
            <Card>
              <CardHeader>
                <CardTitle>Specific Cookies We Use</CardTitle>
                <CardDescription>
                  Detailed information about individual cookies on our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Cookie Name</th>
                        <th className="text-left p-3 font-semibold">Purpose</th>
                        <th className="text-left p-3 font-semibold">Category</th>
                        <th className="text-left p-3 font-semibold">Duration</th>
                        <th className="text-left p-3 font-semibold">Provider</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specificCookies.map((cookie, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-mono text-sm">{cookie.name}</td>
                          <td className="p-3 text-sm">{cookie.purpose}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {cookie.category}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{cookie.duration}</td>
                          <td className="p-3 text-sm">{cookie.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Some cookies are set by third-party services that appear on our pages. We use 
                  these services to enhance functionality and understand our audience better.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Analytics Services:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Google Analytics</li>
                      <li>• Hotjar (user behavior)</li>
                      <li>• Mixpanel (event tracking)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Marketing Services:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Facebook Pixel</li>
                      <li>• Google Ads</li>
                      <li>• Twitter conversion tracking</li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  These third-party services have their own privacy policies and cookie practices. 
                  We recommend reviewing their policies for more information.
                </p>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Browser Settings:</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Most web browsers allow you to control cookies through their settings. 
                    You can usually find these options in the "Tools" or "Preferences" menu.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
                    <li>• <strong>Firefox:</strong> Preferences &gt; Privacy & Security &gt; Cookies and Site Data</li>
                    <li>• <strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
                    <li>• <strong>Edge:</strong> Settings &gt; Cookies and site permissions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Opt-Out Tools:</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    You can also use industry opt-out tools to manage marketing cookies:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Digital Advertising Alliance opt-out page</li>
                    <li>• Network Advertising Initiative opt-out page</li>
                    <li>• Google Ads Settings</li>
                    <li>• Facebook Ad Preferences</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Disabling certain cookies may affect the functionality 
                    of our website and your user experience.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Updates to This Cookie Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our 
                  practices, technology, or legal requirements.
                </p>
                <p>
                  When we make significant changes, we will notify you through our platform or 
                  by email. We encourage you to review this policy periodically.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About Cookies?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span>Email: sani.ray.red@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span>Phone: +237 672 923 300</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Policies</h2>
          <p className="text-lg text-gray-700 mb-6">
            Learn more about how we protect your data and privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/privacy">Privacy Policy</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/terms">Terms & Conditions</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}