import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Mail, Phone } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Terms() {
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
              <FileText className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Terms & Conditions</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using MbendeStay.
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
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Welcome to MbendeStay ("we," "our," or "us"). These Terms and Conditions ("Terms") 
                govern your use of the MbendeStay platform, website, and services (collectively, 
                the "Service") operated by MbendeStay.
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you 
                disagree with any part of these terms, then you may not access the Service.
              </p>
              <p>
                MbendeStay is a platform that connects property owners (landlords) with individuals 
                seeking accommodation (renters) across Cameroon. We facilitate these connections 
                through our subscription-based service.
              </p>
            </CardContent>
          </Card>

          {/* Definitions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>2. Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li><strong>"Platform"</strong> refers to the MbendeStay website and all associated services.</li>
                <li><strong>"User"</strong> means any person who accesses or uses our Service.</li>
                <li><strong>"Landlord"</strong> refers to property owners listing accommodations on our platform.</li>
                <li><strong>"Renter"</strong> refers to individuals seeking accommodation through our platform.</li>
                <li><strong>"Content"</strong> means any information, text, images, or other materials posted on the platform.</li>
                <li><strong>"Subscription"</strong> refers to the paid access plans for using our services.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Account Registration */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. Account Registration and Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>3.1 Eligibility:</strong> You must be at least 18 years old to use our Service. 
                By using the Service, you represent and warrant that you meet this age requirement.
              </p>
              <p>
                <strong>3.2 Account Information:</strong> You must provide accurate, current, and 
                complete information when creating your account. You are responsible for maintaining 
                the accuracy of your account information.
              </p>
              <p>
                <strong>3.3 Account Security:</strong> You are responsible for maintaining the 
                confidentiality of your account credentials and for all activities that occur 
                under your account.
              </p>
              <p>
                <strong>3.4 Account Types:</strong> We offer separate account types for landlords 
                and renters, each with specific features and subscription requirements.
              </p>
            </CardContent>
          </Card>

          {/* Subscription Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>4. Subscription Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>4.1 Subscription Plans:</strong> MbendeStay operates on a subscription model:
              </p>
              <ul className="ml-6 space-y-2">
                <li>• Renter Monthly: 10,000 FCFA per month for 30-day access</li>
                <li>• Landlord Monthly: 10,000 FCFA per month with 2 months listing duration</li>
                <li>• Landlord Yearly: 80,000 FCFA per year with 12 months listing duration</li>
              </ul>
              <p>
                <strong>4.2 Payment:</strong> Subscription fees are payable in advance. We accept 
                major credit cards, mobile money, and bank transfers.
              </p>
              <p>
                <strong>4.3 Auto-Renewal:</strong> Monthly subscriptions automatically renew unless 
                cancelled before the renewal date. You will be charged the then-current subscription fee.
              </p>
              <p>
                <strong>4.4 Cancellation:</strong> You may cancel your subscription at any time. 
                Cancellation takes effect at the end of your current billing period.
              </p>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>5.1 Lawful Use:</strong> You agree to use the Service only for lawful 
                purposes and in accordance with these Terms.
              </p>
              <p>
                <strong>5.2 Accurate Information:</strong> All information you provide must be 
                accurate, current, and complete. Landlords must accurately represent their properties.
              </p>
              <p>
                <strong>5.3 Prohibited Activities:</strong> You may not:
              </p>
              <ul className="ml-6 space-y-2">
                <li>• Post false, misleading, or fraudulent information</li>
                <li>• Engage in discriminatory practices</li>
                <li>• Harass, threaten, or abuse other users</li>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Attempt to circumvent our security measures</li>
              </ul>
            </CardContent>
          </Card>

          {/* Platform Role */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Platform Role and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>6.1 Facilitation Service:</strong> MbendeStay provides a platform to 
                connect landlords and renters. We do not own, control, or manage any properties 
                listed on our platform.
              </p>
              <p>
                <strong>6.2 No Guarantee:</strong> We do not guarantee the accuracy of property 
                listings, the identity of users, or the quality of accommodations.
              </p>
              <p>
                <strong>6.3 Direct Arrangements:</strong> All rental agreements and transactions 
                are made directly between landlords and renters. We are not a party to these agreements.
              </p>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>7.1 User Content:</strong> You retain ownership of content you post but 
                grant us a license to use, display, and distribute it on our platform.
              </p>
              <p>
                <strong>7.2 Platform Content:</strong> All platform features, design, and 
                functionality are owned by MbendeStay and protected by intellectual property laws.
              </p>
              <p>
                <strong>7.3 Prohibited Content:</strong> You may not post content that is illegal, 
                offensive, infringing, or violates these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>8. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your privacy is important to us. Our collection and use of personal information 
                is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p>
                By using our Service, you consent to the collection, use, and sharing of your 
                information as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>9.1 Disclaimer:</strong> The Service is provided "as is" without warranties 
                of any kind. We disclaim all warranties, express or implied.
              </p>
              <p>
                <strong>9.2 Limitation:</strong> To the maximum extent permitted by law, we shall 
                not be liable for any indirect, incidental, special, or consequential damages.
              </p>
              <p>
                <strong>9.3 Maximum Liability:</strong> Our total liability for any claims related 
                to the Service shall not exceed the amount you paid for your subscription in the 
                12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>10.1 Termination by You:</strong> You may terminate your account at any 
                time by contacting us or using account deletion features.
              </p>
              <p>
                <strong>10.2 Termination by Us:</strong> We may terminate or suspend your account 
                immediately for violations of these Terms or for any other reason.
              </p>
              <p>
                <strong>10.3 Effect of Termination:</strong> Upon termination, your right to use 
                the Service ceases, and we may delete your account and content.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>11. Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>11.1 Governing Law:</strong> These Terms are governed by and construed 
                in accordance with the laws of Cameroon.
              </p>
              <p>
                <strong>11.2 Dispute Resolution:</strong> Any disputes arising from these Terms 
                or your use of the Service shall be resolved through binding arbitration in 
                Douala, Cameroon.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>12. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes by email or through our platform.
              </p>
              <p>
                Your continued use of the Service after changes become effective constitutes 
                acceptance of the modified Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>13. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us:
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

        {/* Action Buttons */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-600">
            By using MbendeStay, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms and Conditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/signup">Accept and Sign Up</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Have Questions?</a>
            </Button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}