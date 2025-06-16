import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, Users, CreditCard, Shield, Home, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

const faqData = [
  {
    category: "Getting Started",
    icon: Users,
    questions: [
      {
        question: "How do I create an account on MbendeStay?",
        answer: "Creating an account is simple. Click 'Sign Up' on our homepage, choose whether you're a renter or landlord, fill in your details, and verify your email address. You can then choose a subscription plan to start using our services."
      },
      {
        question: "What's the difference between renter and landlord accounts?",
        answer: "Renter accounts are for travelers looking for accommodations. They can browse properties, contact landlords, and make bookings. Landlord accounts are for property owners who want to list their spaces for rent."
      },
      {
        question: "Do I need a subscription to use MbendeStay?",
        answer: "Yes, MbendeStay operates on a subscription model. Renters pay 10,000 FCFA monthly for 30-day access to browse and contact landlords. Landlords choose between monthly (10,000 FCFA) or yearly (80,000 FCFA) plans."
      }
    ]
  },
  {
    category: "Subscriptions & Payments",
    icon: CreditCard,
    questions: [
      {
        question: "What subscription plans are available?",
        answer: "We offer three plans: Renter Monthly (10,000 FCFA/month), Landlord Monthly (10,000 FCFA/month with 2 months listing), and Landlord Yearly (80,000 FCFA/year with 12 months listing)."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, MasterCard), mobile money (MTN Mobile Money, Orange Money), and bank transfers. All payments are processed securely."
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time. For monthly plans, cancellation takes effect at the end of your current billing cycle. Yearly subscriptions are prorated for refunds."
      },
      {
        question: "What happens if my subscription expires?",
        answer: "If your subscription expires, you'll lose access to premium features like contacting landlords and viewing their contact details. You can renew anytime to restore full access."
      }
    ]
  },
  {
    category: "Property Listings",
    icon: Home,
    questions: [
      {
        question: "How do I list my property?",
        answer: "Sign up as a landlord, choose your subscription plan, and complete our property listing form. Include high-quality photos, detailed descriptions, amenities, and pricing. Our team reviews all listings before they go live."
      },
      {
        question: "What types of properties can I list?",
        answer: "You can list apartments, guest houses, rooms, studios, office spaces, and commercial properties. All property types are welcome as long as they meet our quality standards."
      },
      {
        question: "How many properties can I list?",
        answer: "Monthly landlord subscriptions allow listing for 2 months, while yearly subscriptions provide 12 months of listing duration. There's no limit on the number of properties you can list during your subscription period."
      },
      {
        question: "How do I update my property listing?",
        answer: "Log into your landlord dashboard where you can edit property details, update photos, modify pricing, and manage availability. Changes are reflected immediately on the platform."
      }
    ]
  },
  {
    category: "Booking & Communication",
    icon: Users,
    questions: [
      {
        question: "How do I contact a property owner?",
        answer: "With an active renter subscription, you can view landlord contact details and send direct messages through our platform. You can also call or email them directly using the provided contact information."
      },
      {
        question: "Can I book properties directly through the platform?",
        answer: "Currently, booking arrangements are made directly between renters and landlords. Our platform facilitates the connection and communication, while the actual booking terms are agreed upon between both parties."
      },
      {
        question: "Is there a messaging system?",
        answer: "Yes, we have an integrated messaging system that allows secure communication between renters and landlords. All conversations are stored in your account for easy reference."
      }
    ]
  },
  {
    category: "Safety & Security",
    icon: Shield,
    questions: [
      {
        question: "How do you verify property listings?",
        answer: "All property listings go through our verification process. We check photos, descriptions, and landlord credentials. We also encourage user reviews and ratings to maintain quality standards."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with third parties without your consent."
      },
      {
        question: "What should I do if I encounter a problem?",
        answer: "Contact our customer support immediately at +237 672 923 300 or email sani.ray.red@gmail.com. We have 24/7 phone support for emergencies and respond to emails within 24 hours."
      },
      {
        question: "Do you have safety guidelines for meetings?",
        answer: "Yes, we recommend meeting in public places first, verifying property ownership, and trusting your instincts. Never send money or personal documents before viewing a property in person."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: HelpCircle,
    questions: [
      {
        question: "I'm having trouble with the website. What should I do?",
        answer: "First, try refreshing the page or clearing your browser cache. If problems persist, contact our technical support team at sani.ray.red@gmail.com with details about the issue and your browser type."
      },
      {
        question: "Can I use MbendeStay on my mobile phone?",
        answer: "Yes, our website is fully responsive and works well on all mobile devices. We're also developing a mobile app for an even better experience."
      },
      {
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions in the reset email. If you don't receive the email, check your spam folder or contact support."
      }
    ]
  }
];

export default function FAQ() {
  useScrollToTop();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = faqData.filter(category => {
    if (selectedCategory !== "all" && category.category !== selectedCategory) {
      return false;
    }
    
    if (searchTerm) {
      return category.questions.some(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

  const categories = ["all", ...faqData.map(cat => cat.category)];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <HelpCircle className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Find answers to common questions about MbendeStay, our services, and how to get the most out of our platform.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
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
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-12">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.questions
                  .filter(q => 
                    !searchTerm || 
                    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((faq, index) => (
                  <Card key={index} className="h-fit">
                    <CardHeader>
                      <CardTitle className="text-lg leading-tight">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
            </p>
            <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
              View All FAQs
            </Button>
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Can't find the answer you're looking for? Our friendly customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="tel:+237672923300" className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Call +237 672 923 300</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:sani.ray.red@gmail.com" className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Email Support</span>
              </a>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Phone support available 24/7 • Email responses within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}