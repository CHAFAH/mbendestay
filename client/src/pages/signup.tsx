import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, User, Home } from "lucide-react";
import { signupSchema } from "@shared/schema";
import { z } from "zod";
import Navigation from "@/components/navigation";

const clientSignupSchema = signupSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type SignupForm = z.infer<typeof clientSignupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(clientSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "renter" as const,
      phoneNumber: ""
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const { confirmPassword, ...signupData } = data;
      
      // Convert landlord_yearly to landlord for backend compatibility
      const processedData = {
        ...signupData,
        userType: data.userType === "landlord_yearly" ? "landlord" : data.userType,
        subscriptionType: data.userType === "landlord_yearly" ? "landlord_yearly" : 
                         data.userType === "landlord" ? "landlord_monthly" : "renter_monthly"
      };
      
      const response = await apiRequest("POST", "/api/auth/signup", processedData);
      return response.json();
    },
    onSuccess: (response, variables) => {
      toast({
        title: "Account created successfully!",
        description: "Please sign in to continue.",
      });
      
      // Redirect based on subscription type
      if (variables.userType === "landlord" || variables.userType === "landlord_yearly") {
        setLocation("/landlord-subscribe");
      } else {
        setLocation("/subscribe");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  const watchedUserType = form.watch("userType");

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription>
              Join MbendeStay to {watchedUserType === "renter" ? "find your perfect accommodation" : "list your properties"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Account Type Selection */}
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">Choose Account Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormLabel className="cursor-pointer">
                              <Card className={`p-4 transition-all hover:shadow-md ${
                                field.value === "renter" 
                                  ? "ring-2 ring-blue-500 bg-blue-50" 
                                  : "hover:border-blue-300"
                              }`}>
                                <div className="text-center">
                                  <RadioGroupItem value="renter" className="mb-3" />
                                  <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                  <div className="font-medium text-lg mb-2">Looking for Property</div>
                                  <div className="text-sm text-neutral-600 mb-2">Search and rent properties</div>
                                  <div className="text-lg font-bold text-blue-600">10,000 FCFA</div>
                                  <div className="text-xs text-blue-600">per month</div>
                                </div>
                              </Card>
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormLabel className="cursor-pointer">
                              <Card className={`p-4 transition-all hover:shadow-md ${
                                field.value === "landlord" 
                                  ? "ring-2 ring-green-500 bg-green-50" 
                                  : "hover:border-green-300"
                              }`}>
                                <div className="text-center">
                                  <RadioGroupItem value="landlord" className="mb-3" />
                                  <Home className="h-8 w-8 text-green-600 mx-auto mb-3" />
                                  <div className="font-medium text-lg mb-2">Monthly Plan</div>
                                  <div className="text-sm text-neutral-600 mb-2">Properties listed for 2 months</div>
                                  <div className="text-lg font-bold text-green-600">10,000 FCFA</div>
                                  <div className="text-xs text-green-600">per month</div>
                                </div>
                              </Card>
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormLabel className="cursor-pointer">
                              <Card className={`p-4 transition-all hover:shadow-md relative ${
                                field.value === "landlord_yearly" 
                                  ? "ring-2 ring-green-500 bg-green-50" 
                                  : "hover:border-green-300"
                              }`}>
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">Best Value</span>
                                </div>
                                <div className="text-center">
                                  <RadioGroupItem value="landlord_yearly" className="mb-3" />
                                  <Home className="h-8 w-8 text-green-600 mx-auto mb-3" />
                                  <div className="font-medium text-lg mb-2">Yearly Plan</div>
                                  <div className="text-sm text-neutral-600 mb-2">Properties listed for 12 months</div>
                                  <div className="text-lg font-bold text-green-600">80,000 FCFA</div>
                                  <div className="text-xs text-green-600">per year</div>
                                  <div className="text-xs text-green-600 font-medium">Save 40,000 FCFA</div>
                                </div>
                              </Card>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+237 6XX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-neutral-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-neutral-500">Or</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="/api/login"
                      className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                    >
                      Continue with Replit
                    </a>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}