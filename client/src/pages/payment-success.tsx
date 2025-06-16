import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  const activateSubscriptionMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      return await apiRequest("POST", "/api/payment/success", { 
        paymentIntentId,
        subscriptionType: "renter_monthly"
      });
    },
    onSuccess: async () => {
      setIsProcessing(false);
      toast({
        title: "Subscription Activated!",
        description: "You now have access to all property details and landlord contact information.",
      });
      
      // Clear any stored redirect and go to original destination
      const redirectTo = sessionStorage.getItem('pendingRedirect') || '/';
      sessionStorage.removeItem('pendingRedirect');
      
      // Wait a moment then redirect
      setTimeout(() => {
        setLocation(redirectTo);
      }, 2000);
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: "Subscription Activation Failed",
        description: error.message || "Failed to activate subscription. Please contact support.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Get payment intent ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    
    if (paymentIntentId && paymentIntentClientSecret) {
      // Activate the subscription
      activateSubscriptionMutation.mutate(paymentIntentId);
    } else {
      // No payment intent found, redirect to subscription page
      setIsProcessing(false);
      toast({
        title: "Payment verification failed",
        description: "No payment information found. Please try subscribing again.",
        variant: "destructive",
      });
      setLocation("/subscribe");
    }
  }, []);

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
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {isProcessing ? (
                <Loader className="w-16 h-16 text-primary animate-spin" />
              ) : (
                <CheckCircle className="w-16 h-16 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isProcessing ? "Processing Payment..." : "Payment Successful!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing ? (
              <div>
                <p className="text-neutral-600 mb-4">
                  We're activating your subscription. This should only take a moment.
                </p>
                <div className="text-sm text-neutral-500">
                  Please don't close this page.
                </div>
              </div>
            ) : (
              <div>
                <p className="text-neutral-600 mb-6">
                  Your MbendeStay subscription is now active! You can now:
                </p>
                <div className="text-left space-y-2 max-w-md mx-auto">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm">View landlord contact information</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm">See exact property locations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm">Message landlords directly</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      const redirectTo = sessionStorage.getItem('pendingRedirect') || '/';
                      sessionStorage.removeItem('pendingRedirect');
                      setLocation(redirectTo);
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Continue Browsing Properties
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}