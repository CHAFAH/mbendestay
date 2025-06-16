import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, Mail, Phone, Lock, Eye, Users, Database } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Privacy() {
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
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4 text-green-100">
              <Calendar className="w-4 h-4" />
              <span>Last updated: December 15, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              MbendeStay ("we," "our," or "us") respects your privacy and is committed to protecting 
              your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our platform and services.
            </p>
            <p>
              By using MbendeStay, you consent to the collection and use of information in accordance 
              with this Privacy Policy. If you do not agree with our policies and practices, do not 
              use our services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>2. Information We Collect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">2.1 Personal Information</h4>
              <p className="mb-3">We collect personal information that you voluntarily provide to us:</p>
              <ul className="ml-6 space-y-1">
                <li>• Name, email address, and phone number</li>
                <li>• Profile information and preferences</li>
                <li>• Payment and billing information</li>
                <li>• Identity verification documents (for landlords)</li>
                <li>• Property details and photos (for landlords)</li>
                <li>• Communication and messaging content</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2.2 Automatically Collected Information</h4>
              <p className="mb-3">We automatically collect certain information when you use our platform:</p>
              <ul className="ml-6 space-y-1">
                <li>• Device information (IP address, browser type, operating system)</li>
                <li>• Usage data (pages visited, time spent, features used)</li>
                <li>• Location information (if enabled)</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>3. How We Use Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect for various purposes:</p>
            
            <div>
              <h4 className="font-semibold mb-2">3.1 Service Provision</h4>
              <ul className="ml-6 space-y-1">
                <li>• Creating and managing your account</li>
                <li>• Processing subscriptions and payments</li>
                <li>• Facilitating connections between landlords and renters</li>
                <li>• Providing customer support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3.2 Communication</h4>
              <ul className="ml-6 space-y-1">
                <li>• Sending service-related notifications</li>
                <li>• Responding to inquiries and support requests</li>
                <li>• Sharing important updates and policy changes</li>
                <li>• Marketing communications (with your consent)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3.3 Improvement and Analytics</h4>
              <ul className="ml-6 space-y-1">
                <li>• Analyzing usage patterns to improve our services</li>
                <li>• Conducting research and development</li>
                <li>• Personalizing user experience</li>
                <li>• Ensuring platform security and preventing fraud</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>4. Information Sharing and Disclosure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We may share your information in the following circumstances:</p>
            
            <div>
              <h4 className="font-semibold mb-2">4.1 Between Users</h4>
              <p>
                We facilitate connections between landlords and renters by sharing relevant contact 
                information and property details with active subscribers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4.2 Service Providers</h4>
              <p>
                We may share information with trusted third-party service providers who assist us 
                in operating our platform, processing payments, or providing customer support.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4.3 Legal Requirements</h4>
              <p>
                We may disclose information if required by law, court order, or government request, 
                or to protect our rights, property, or safety.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4.4 Business Transfers</h4>
              <p>
                In the event of a merger, acquisition, or sale of assets, user information may be 
                transferred as part of the transaction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>5. Data Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate technical and organizational security measures to protect 
              your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Security Measures Include:</h4>
              <ul className="ml-6 space-y-1">
                <li>• Encryption of sensitive data in transit and at rest</li>
                <li>• Regular security audits and vulnerability assessments</li>
                <li>• Access controls and authentication measures</li>
                <li>• Employee training on data protection practices</li>
                <li>• Secure payment processing through trusted providers</li>
              </ul>
            </div>

            <p>
              However, no method of transmission over the internet is 100% secure. While we strive 
              to protect your information, we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this Privacy Policy.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Retention Periods:</h4>
              <ul className="ml-6 space-y-1">
                <li>• Account information: While your account is active plus 3 years</li>
                <li>• Payment records: 7 years for tax and accounting purposes</li>
                <li>• Communication logs: 2 years from last interaction</li>
                <li>• Usage analytics: Aggregated and anonymized data may be retained indefinitely</li>
              </ul>
            </div>

            <p>
              You may request deletion of your personal information by contacting us, subject to 
              legal obligations that may require us to retain certain information.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have certain rights regarding your personal information:</p>
            
            <div>
              <h4 className="font-semibold mb-2">7.1 Access and Portability</h4>
              <p>You have the right to access and obtain a copy of your personal information.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">7.2 Correction</h4>
              <p>You can request correction of inaccurate or incomplete personal information.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">7.3 Deletion</h4>
              <p>You may request deletion of your personal information, subject to legal obligations.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">7.4 Objection and Restriction</h4>
              <p>You can object to or request restriction of certain processing activities.</p>
            </div>

            <p>
              To exercise these rights, please contact us using the information provided below. 
              We will respond to your request within 30 days.
            </p>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>8. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Types of Cookies We Use:</h4>
              <ul className="ml-6 space-y-1">
                <li>• Essential cookies: Required for basic platform functionality</li>
                <li>• Performance cookies: Help us analyze and improve our services</li>
                <li>• Functional cookies: Remember your preferences and settings</li>
                <li>• Marketing cookies: Used for targeted advertising (with consent)</li>
              </ul>
            </div>

            <p>
              You can control cookie settings through your browser preferences. Note that disabling 
              certain cookies may affect platform functionality.
            </p>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>9. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our platform may contain links to third-party websites or integrate with third-party 
              services. This Privacy Policy does not apply to these external services.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Third-Party Integrations Include:</h4>
              <ul className="ml-6 space-y-1">
                <li>• Payment processors (Stripe, mobile money providers)</li>
                <li>• Analytics services (Google Analytics)</li>
                <li>• Communication tools</li>
                <li>• Social media platforms</li>
              </ul>
            </div>

            <p>
              We encourage you to review the privacy policies of any third-party services you interact with.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>10. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors.
            </p>
            <p>
              We will notify you of significant changes by email or through our platform. Your 
              continued use of our services after changes become effective constitutes acceptance 
              of the updated Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>11. Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or 
              our data practices, please contact us:
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
            <p className="mt-4 text-sm text-gray-600">
              We are committed to resolving any privacy concerns promptly and transparently.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-600">
            By using MbendeStay, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/cookies">Cookie Policy</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Privacy Questions?</a>
            </Button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}