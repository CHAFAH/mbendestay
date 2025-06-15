import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, Building } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment Form Component
function PaymentForm({ subscriptionType }: { subscriptionType: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/landlord-dashboard`,
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
        description: "Welcome to MbendeStay! You can now list properties.",
      });
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
        {isProcessing ? "Processing..." : `Pay ${subscriptionType === "landlord_yearly" ? "80,000" : "10,000"} FCFA`}
      </Button>
    </form>
  );
}

export default function LandlordSubscribe() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [subscriptionType, setSubscriptionType] = useState<"landlord_monthly" | "landlord_yearly">("landlord_monthly");
  const [clientSecret, setClientSecret] = useState("");

  const createPaymentMutation = useMutation({
    mutationFn: async (type: string) => {
      const amount = type === "landlord_yearly" ? 80000 : 10000;
      return await apiRequest("POST", "/api/create-payment-intent", { 
        amount,
        subscriptionType: type,
        description: `MbendeStay ${type === "landlord_yearly" ? "Yearly" : "Monthly"} Landlord Subscription`
      });
    },
    onSuccess: (data: any) => {
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
    createPaymentMutation.mutate(subscriptionType);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Building className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-bold text-3xl text-neutral-800 mb-4">
            Login Required
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Please log in to subscribe and start listing your properties.
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
            Subscribe to List Properties
          </h1>
          <p className="text-lg text-neutral-600">
            Choose your plan to start listing properties on MbendeStay
          </p>
        </div>

        {!clientSecret ? (
          <div className="space-y-8">
            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={subscriptionType}
                  onValueChange={(value) => setSubscriptionType(value as "landlord_monthly" | "landlord_yearly")}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {/* Monthly Plan */}
                  <div>
                    <Label htmlFor="landlord_monthly" className="cursor-pointer">
                      <Card className={`p-6 transition-all hover:shadow-md ${
                        subscriptionType === "landlord_monthly" 
                          ? "ring-2 ring-primary bg-primary/5" 
                          : "hover:border-primary/50"
                      }`}>
                        <div className="flex items-center space-x-3 mb-4">
                          <RadioGroupItem value="landlord_monthly" id="landlord_monthly" />
                          <div>
                            <h3 className="font-semibold text-xl">Monthly Plan</h3>
                            <p className="text-3xl font-bold text-primary">
                              {SUBSCRIPTION_PLANS.landlord_monthly.price.toLocaleString()} FCFA
                            </p>
                            <p className="text-sm text-neutral-600">List properties for 2 months</p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {SUBSCRIPTION_PLANS.landlord_monthly.features.en.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="w-4 h-4 text-primary mr-2" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </Label>
                  </div>

                  {/* Yearly Plan */}
                  <div>
                    <Label htmlFor="landlord_yearly" className="cursor-pointer">
                      <Card className={`p-6 transition-all hover:shadow-md relative ${
                        subscriptionType === "landlord_yearly" 
                          ? "ring-2 ring-primary bg-primary/5" 
                          : "hover:border-primary/50"
                      }`}>
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-primary text-white text-sm px-3 py-1 rounded-full font-semibold">
                            {SUBSCRIPTION_PLANS.landlord_yearly.savings?.en || "Best Value"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 mb-4">
                          <RadioGroupItem value="landlord_yearly" id="landlord_yearly" />
                          <div>
                            <h3 className="font-semibold text-xl">Yearly Plan</h3>
                            <p className="text-3xl font-bold text-primary">
                              {SUBSCRIPTION_PLANS.landlord_yearly.price.toLocaleString()} FCFA
                            </p>
                            <p className="text-sm text-neutral-600">List properties for 12 months</p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {SUBSCRIPTION_PLANS.landlord_yearly.features.en.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="w-4 h-4 text-primary mr-2" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </Label>
                  </div>
                </RadioGroup>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Complete Your Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm subscriptionType={subscriptionType} />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}