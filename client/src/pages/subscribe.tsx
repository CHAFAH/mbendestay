import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Your subscription is now active!",
      });
      // Clear any stored redirect and go to original destination
      const redirectTo = sessionStorage.getItem('pendingRedirect') || '/';
      sessionStorage.removeItem('pendingRedirect');
      setLocation(redirectTo);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isProcessing ? "Processing..." : "Pay 10,000 FCFA"}
      </Button>
    </form>
  );
}

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  
  // Get redirect parameter from URL or sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect') || sessionStorage.getItem('pendingRedirect') || '/';

  // Redirect non-renter users away from subscription page
  useEffect(() => {
    if (!isLoading && user) {
      const userData = user as any;
      // Admin users bypass subscription
      if (userData.isAdmin) {
        setLocation("/");
        return;
      }
      // Landlords don't need subscription - redirect to dashboard
      if (userData.userType === "landlord") {
        toast({
          title: "No subscription needed",
          description: "Landlords can list properties for free.",
        });
        setLocation("/landlord-dashboard");
        return;
      }
      // Only renters should see subscription page
      if (userData.userType !== "renter") {
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation, toast]);

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/create-payment-intent", { 
        amount: 10000,
        subscriptionType: "renter_monthly",
        description: "MbendeStay Monthly Renter Subscription"
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setClientSecret(data.clientSecret);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Setup Failed",
        description: error.message || "Failed to setup payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = () => {
    createPaymentMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            Renter Subscription Plan
          </h1>
          <p className="text-lg text-neutral-600">
            Access detailed property information, landlord contact details, and precise locations across Cameroon
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Only 10,000 FCFA/month - Find your perfect accommodation
          </p>
        </div>

        {!clientSecret ? (
          /* Plan Selection */
          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            <Card className="relative border-2 border-primary shadow-lg">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-neutral-800">
                  Monthly Access
                </CardTitle>
                <div className="text-4xl font-bold text-primary">
                  10,000 FCFA
                  <span className="text-lg text-neutral-500 font-normal">/month</span>
                </div>
                <p className="text-neutral-600">30-day unlimited access</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "View detailed property information",
                    "Access landlord contact details",
                    "See exact property locations",
                    "Browse all properties across Cameroon",
                    "Direct messaging with landlords",
                    "Priority customer support"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    onClick={handleSubscribe}
                    disabled={createPaymentMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
                  >
                    {createPaymentMutation.isPending ? "Setting up..." : "Continue to Payment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Payment Form */
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Complete Your Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}