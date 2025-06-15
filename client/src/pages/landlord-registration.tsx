import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Shield, 
  Upload, 
  CreditCard, 
  Check, 
  AlertCircle,
  Building,
  Star,
  Users,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  User,
  CheckCircle2
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function LandlordRegistration() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    subscriptionType: "landlord_monthly" as "landlord_monthly" | "landlord_yearly",
    nationalIdFront: null as File | null,
    nationalIdBack: null as File | null,
    agreeToTerms: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", "/api/profile", data);
    },
    onSuccess: () => {
      setStep(3);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Profile Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (subscriptionType: string) => {
      const amount = subscriptionType === "landlord_yearly" ? 80000 : 10000;
      return await apiRequest("POST", "/api/create-payment-intent", { 
        amount,
        subscriptionType,
        description: `MbendeStay ${subscriptionType === "landlord_yearly" ? "Yearly" : "Monthly"} Landlord Subscription`
      });
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setStep(4); // Move to payment step
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Setup Failed",
        description: error.message || "Failed to setup payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.agreeToTerms) {
        toast({
          title: "Terms Required",
          description: "Please agree to the terms and conditions.",
          variant: "destructive",
        });
        return;
      }
      
      // Update profile
      updateProfileMutation.mutate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        isVerified: true, // In a real app, this would be pending until ID verification
      });
    } else if (step === 3) {
      // Create payment intent
      createPaymentMutation.mutate(formData.subscriptionType);
    }
  };

  const handleFileUpload = (field: 'nationalIdFront' | 'nationalIdBack', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const selectedPlan = SUBSCRIPTION_PLANS[formData.subscriptionType];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h1 className="font-bold text-3xl text-neutral-800 mb-4">
            Login Required
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Please log in to register as a landlord and start hosting on MbendeStay.
          </p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (user?.subscriptionStatus === 'active') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="font-bold text-3xl text-neutral-800 mb-4">
            You're Already a Host!
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            You already have an active subscription. Go to your dashboard to manage your properties.
          </p>
          <Button 
            onClick={() => window.location.href = "/dashboard"}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Header */}
      <section className="py-12 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building className="w-16 h-16 text-accent mx-auto mb-6" />
          <h1 className="font-bold text-3xl md:text-4xl mb-4">
            Become a Host on MbendeStay
          </h1>
          <p className="text-xl text-white/90">
            Join thousands of successful hosts across Cameroon and start earning from your property
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNumber 
                    ? "bg-primary text-white" 
                    : "bg-neutral-200 text-neutral-600"
                }`}>
                  {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? "bg-primary" : "bg-neutral-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <div className="font-semibold text-lg text-neutral-800">
                {step === 1 && "Personal Information"}
                {step === 2 && "Verification & Terms"}
                {step === 3 && "Choose Your Plan"}
                {step === 4 && "Welcome to MbendeStay!"}
              </div>
              <div className="text-sm text-neutral-600">
                Step {step} of 4
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-neutral-50"
                />
                <p className="text-sm text-neutral-600 mt-1">
                  This is your login email and cannot be changed here.
                </p>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+237 6XX XXX XXX"
                  required
                />
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleNext}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Verification & Terms */}
        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Verification & Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">ID Verification</h4>
                    <p className="text-blue-800 text-sm">
                      For demo purposes, ID verification is automatically approved. In production, 
                      you would upload your national ID front and back images for manual review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>National ID (Front) - Demo Mode</Label>
                  <div className="mt-2 border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center bg-neutral-50">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">
                      ID verification automatically approved for demo
                    </p>
                  </div>
                </div>

                <div>
                  <Label>National ID (Back) - Demo Mode</Label>
                  <div className="mt-2 border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center bg-neutral-50">
                    <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">
                      ID verification automatically approved for demo
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                  />
                  <div>
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a> of MbendeStay
                    </Label>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {updateProfileMutation.isPending ? "Processing..." : "Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Choose Plan */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-bold text-2xl text-neutral-800 mb-4">Choose Your Subscription Plan</h2>
              <p className="text-neutral-600">Select the plan that best fits your hosting needs</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Monthly Plan */}
              <Card className={`cursor-pointer transition-all duration-200 ${
                formData.subscriptionType === 'monthly' 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-lg'
              }`}>
                <CardContent className="p-6">
                  <RadioGroup value={formData.subscriptionType} onValueChange={(value: "monthly" | "yearly") => setFormData(prev => ({ ...prev, subscriptionType: value }))}>
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="font-semibold text-lg">Monthly Plan</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="text-3xl font-bold text-primary mb-4">
                    ₣{SUBSCRIPTION_PLANS.monthly.price.toLocaleString()}
                    <span className="text-lg font-normal text-neutral-600"> / month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {SUBSCRIPTION_PLANS.monthly.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center text-sm text-neutral-600">
                    Perfect for getting started
                  </div>
                </CardContent>
              </Card>

              {/* Yearly Plan */}
              <Card className={`cursor-pointer transition-all duration-200 relative ${
                formData.subscriptionType === 'yearly' 
                  ? 'ring-2 ring-secondary bg-secondary/5' 
                  : 'hover:shadow-lg'
              }`}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-3 py-1">
                    {SUBSCRIPTION_PLANS.yearly.savings}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <RadioGroup value={formData.subscriptionType} onValueChange={(value: "monthly" | "yearly") => setFormData(prev => ({ ...prev, subscriptionType: value }))}>
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value="yearly" id="yearly" />
                      <Label htmlFor="yearly" className="font-semibold text-lg">Yearly Plan</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="text-3xl font-bold text-secondary mb-4">
                    ₣{SUBSCRIPTION_PLANS.yearly.price.toLocaleString()}
                    <span className="text-lg font-normal text-neutral-600"> / year</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {SUBSCRIPTION_PLANS.yearly.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center text-sm text-neutral-600">
                    Best value for serious hosts
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-neutral-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Payment Methods Accepted</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
                    <span className="text-black font-bold text-xs">MTN</span>
                  </div>
                  <div>
                    <div className="font-medium">MTN Mobile Money</div>
                    <div className="text-sm text-neutral-600">Fast & secure</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">OM</span>
                  </div>
                  <div>
                    <div className="font-medium">Orange Money</div>
                    <div className="text-sm text-neutral-600">Quick payments</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neutral-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">$</span>
                  </div>
                  <div>
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-sm text-neutral-600">Traditional banking</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={subscriptionMutation.isPending}
                className={`flex-1 ${
                  formData.subscriptionType === 'yearly' 
                    ? 'bg-secondary hover:bg-secondary/90' 
                    : 'bg-primary hover:bg-primary/90'
                } text-white`}
              >
                {subscriptionMutation.isPending 
                  ? "Processing Payment..." 
                  : `Subscribe for ₣${selectedPlan.price.toLocaleString()}`
                }
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h2 className="font-bold text-3xl text-neutral-800 mb-4">
                Welcome to MbendeStay!
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Your subscription has been activated successfully. You can now start listing your properties and earning from hosting.
              </p>

              <div className="bg-neutral-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-medium">List Properties</div>
                    <div className="text-neutral-600">Add your first property</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="font-medium">Get Reviews</div>
                    <div className="text-neutral-600">Build your reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-neutral-700" />
                    </div>
                    <div className="font-medium">Earn Money</div>
                    <div className="text-neutral-600">Start generating income</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/"}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
