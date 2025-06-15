import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { subscriptionSchema } from "@shared/schema";
import type { z } from "zod";
import Navigation from "@/components/navigation";

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      type: "monthly",
    },
  });

  const selectedPlan = form.watch("type");

  const subscriptionMutation = useMutation({
    mutationFn: async (data: SubscriptionFormData) => {
      return apiRequest("POST", "/api/subscription/create", data);
    },
    onSuccess: () => {
      toast({
        title: "Subscription activated!",
        description: "You now have access to all property details.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SubscriptionFormData) => {
    subscriptionMutation.mutate(data);
  };

  const monthlyPrice = 2500;
  const yearlyPrice = 25000;
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            Choose Your Subscription Plan
          </h1>
          <p className="text-lg text-neutral-600">
            Unlock detailed property information, landlord contact details, and precise locations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {/* Monthly Plan */}
                      <FormItem>
                        <FormLabel className="cursor-pointer">
                          <Card className={`relative transition-all duration-200 hover:shadow-lg ${
                            selectedPlan === "monthly" 
                              ? "ring-2 ring-blue-500 shadow-lg" 
                              : "hover:border-blue-300"
                          }`}>
                            <CardHeader className="text-center pb-4">
                              <div className="flex items-center justify-center mb-2">
                                <Star className="h-6 w-6 text-blue-600 mr-2" />
                                <CardTitle className="text-xl">Monthly Plan</CardTitle>
                              </div>
                              <div className="text-3xl font-bold text-neutral-800">
                                {monthlyPrice.toLocaleString()} XCFA
                                <span className="text-lg font-normal text-neutral-600">/month</span>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Full property details</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Landlord contact information</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Precise property locations</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Priority customer support</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Save property favorites</span>
                                </div>
                              </div>
                              
                              <FormControl>
                                <RadioGroupItem value="monthly" className="sr-only" />
                              </FormControl>
                            </CardContent>
                          </Card>
                        </FormLabel>
                      </FormItem>

                      {/* Yearly Plan */}
                      <FormItem>
                        <FormLabel className="cursor-pointer">
                          <Card className={`relative transition-all duration-200 hover:shadow-lg ${
                            selectedPlan === "yearly" 
                              ? "ring-2 ring-blue-500 shadow-lg" 
                              : "hover:border-blue-300"
                          }`}>
                            {yearlySavings > 0 && (
                              <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                                Save {yearlySavings.toLocaleString()} XCFA
                              </Badge>
                            )}
                            
                            <CardHeader className="text-center pb-4">
                              <div className="flex items-center justify-center mb-2">
                                <Crown className="h-6 w-6 text-yellow-600 mr-2" />
                                <CardTitle className="text-xl">Yearly Plan</CardTitle>
                                <Badge variant="secondary" className="ml-2">Best Value</Badge>
                              </div>
                              <div className="text-3xl font-bold text-neutral-800">
                                {yearlyPrice.toLocaleString()} XCFA
                                <span className="text-lg font-normal text-neutral-600">/year</span>
                              </div>
                              <p className="text-sm text-green-600 font-medium">
                                ~{Math.round(yearlyPrice / 12).toLocaleString()} XCFA per month
                              </p>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                              <div className="space-y-3">
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Full property details</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Landlord contact information</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Precise property locations</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Priority customer support</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm">Save property favorites</span>
                                </div>
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 text-green-600 mr-3" />
                                  <span className="text-sm font-medium">2 months free!</span>
                                </div>
                              </div>
                              
                              <FormControl>
                                <RadioGroupItem value="yearly" className="sr-only" />
                              </FormControl>
                            </CardContent>
                          </Card>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-8 text-center">
              <Button
                type="submit"
                size="lg"
                className="px-12 py-3 text-lg"
                disabled={subscriptionMutation.isPending}
              >
                {subscriptionMutation.isPending 
                  ? "Processing..." 
                  : `Subscribe ${selectedPlan === "yearly" ? "Yearly" : "Monthly"}`
                }
              </Button>
              
              <p className="text-sm text-neutral-500 mt-4">
                Cancel anytime. No hidden fees. Secure payment processing.
              </p>
            </div>
          </form>
        </Form>

        {/* Feature Comparison */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-center mb-6">What You Get With Subscription</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Complete Property Details</h4>
              <p className="text-sm text-neutral-600">
                Access full descriptions, amenities, pricing, and availability
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">Direct Landlord Contact</h4>
              <p className="text-sm text-neutral-600">
                Phone numbers, email addresses, and WhatsApp contact info
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-2">Exact Locations</h4>
              <p className="text-sm text-neutral-600">
                Precise addresses and GPS coordinates for easy navigation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}