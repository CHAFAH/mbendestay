import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users, 
  Lock, 
  Camera,
  FileText,
  MessageCircle
} from "lucide-react";

const safetyGuidelines = [
  {
    category: "Property Viewing Safety",
    icon: Eye,
    color: "bg-blue-500",
    guidelines: [
      {
        title: "Meet in Public First",
        description: "Always arrange to meet the landlord in a public place before viewing the property.",
        importance: "Critical"
      },
      {
        title: "Bring a Friend",
        description: "Never go to property viewings alone. Bring a trusted friend or family member.",
        importance: "High"
      },
      {
        title: "Share Your Location",
        description: "Tell someone where you're going and when you expect to return.",
        importance: "High"
      },
      {
        title: "Verify Identity",
        description: "Ask for government-issued ID and verify the landlord's identity.",
        importance: "Critical"
      }
    ]
  },
  {
    category: "Communication Safety",
    icon: MessageCircle,
    color: "bg-green-500",
    guidelines: [
      {
        title: "Use Platform Messaging",
        description: "Keep initial communications within the MbendeStay messaging system.",
        importance: "Medium"
      },
      {
        title: "Verify Contact Information",
        description: "Confirm phone numbers and email addresses before meeting.",
        importance: "High"
      },
      {
        title: "Trust Your Instincts",
        description: "If something feels wrong in conversations, don't proceed with the meeting.",
        importance: "Critical"
      },
      {
        title: "Report Suspicious Behavior",
        description: "Report any inappropriate or suspicious messages immediately.",
        importance: "High"
      }
    ]
  },
  {
    category: "Financial Protection",
    icon: Lock,
    color: "bg-purple-500",
    guidelines: [
      {
        title: "No Upfront Payments",
        description: "Never send money or deposits before viewing the property in person.",
        importance: "Critical"
      },
      {
        title: "Verify Property Ownership",
        description: "Ask for proof of ownership or authorization to rent the property.",
        importance: "Critical"
      },
      {
        title: "Use Secure Payment Methods",
        description: "Avoid cash payments. Use traceable payment methods when possible.",
        importance: "High"
      },
      {
        title: "Get Written Agreements",
        description: "Ensure all rental terms are documented in writing before payment.",
        importance: "High"
      }
    ]
  },
  {
    category: "Personal Information",
    icon: FileText,
    color: "bg-orange-500",
    guidelines: [
      {
        title: "Limit Personal Details",
        description: "Don't share unnecessary personal information in initial contacts.",
        importance: "Medium"
      },
      {
        title: "Protect Documents",
        description: "Never give original documents. Only provide copies when absolutely necessary.",
        importance: "High"
      },
      {
        title: "Verify Before Sharing",
        description: "Confirm the legitimacy of requests for personal information.",
        importance: "High"
      },
      {
        title: "Secure Your Data",
        description: "Be cautious about what personal data you include in messages.",
        importance: "Medium"
      }
    ]
  }
];

const emergencyContacts = [
  {
    service: "Police Emergency",
    number: "117",
    description: "For immediate police assistance"
  },
  {
    service: "Gendarmerie",
    number: "118", 
    description: "National security force emergency line"
  },
  {
    service: "Fire Department",
    number: "118",
    description: "Fire and rescue services"
  },
  {
    service: "Medical Emergency",
    number: "119",
    description: "Emergency medical services"
  }
];

export default function Safety() {
  useScrollToTop();
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Shield className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Safety Guidelines</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Your safety is our top priority. Follow these guidelines to ensure secure 
              interactions while using MbendeStay.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Safety Alert */}
        <Alert className="mb-12 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important:</strong> If you ever feel unsafe or encounter suspicious activity, 
            trust your instincts and contact local authorities immediately. Your safety comes first.
          </AlertDescription>
        </Alert>

        {/* Safety Guidelines */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Safety Guidelines</h2>
          <div className="space-y-12">
            {safetyGuidelines.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.guidelines.map((guideline, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{guideline.title}</CardTitle>
                          <Badge 
                            variant={
                              guideline.importance === "Critical" ? "destructive" : 
                              guideline.importance === "High" ? "default" : "secondary"
                            }
                            className="ml-2"
                          >
                            {guideline.importance}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{guideline.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Warning Signs to Watch For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Pressure Tactics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-red-700 space-y-2">
                  <li>• Demanding immediate payment</li>
                  <li>• Refusing to allow property viewing</li>
                  <li>• Creating false urgency</li>
                  <li>• Avoiding phone calls</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Suspicious Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-red-700 space-y-2">
                  <li>• Asking for full payment upfront</li>
                  <li>• Requesting personal documents immediately</li>
                  <li>• Wanting to meet in isolated locations</li>
                  <li>• Avoiding identity verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Communication Issues</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-red-700 space-y-2">
                  <li>• Poor grammar or spelling consistently</li>
                  <li>• Reluctance to provide clear photos</li>
                  <li>• Evasive answers about property details</li>
                  <li>• Inappropriate personal questions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Property Verification Checklist</h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Before Viewing Any Property</span>
              </CardTitle>
              <CardDescription>
                Use this checklist to verify property legitimacy before scheduling a viewing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Landlord Verification</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Government ID verified</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Phone number confirmed</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Property ownership documents seen</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Previous tenant references available</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Property Details</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Recent photos provided</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Address clearly specified</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Rental terms clearly explained</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">Utilities and amenities confirmed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="text-center border-red-200">
                <CardHeader>
                  <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <CardTitle className="text-lg text-red-800">{contact.service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 mb-2">{contact.number}</div>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* MbendeStay Support */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Safety Concerns</h2>
          <p className="text-lg text-gray-700 mb-6">
            If you encounter any safety issues or suspicious activity on our platform, 
            report it immediately to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <a href="tel:+237672923300" className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Emergency: +237 672 923 300</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:sani.ray.red@gmail.com" className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Report Issue</span>
              </a>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Our safety team responds to reports within 2 hours • Available 24/7
          </p>
        </div>
      </div>
    </div>
  );
}