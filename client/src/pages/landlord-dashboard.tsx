import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Camera,
  DollarSign,
  Users,
  Star,
  AlertCircle,
  Check,
  X
} from "lucide-react";
import { PROPERTY_TYPES, CONTRACT_TYPES, AMENITIES, SUBSCRIPTION_PLANS } from "@/lib/constants";

export default function LandlordDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [propertyFormData, setPropertyFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    contractType: "",
    regionId: "",
    divisionId: "",
    address: "",
    pricePerNight: "",
    pricePerMonth: "",
    rooms: "",
    size: "",
    maxTenants: "",
    amenities: [] as string[],
    images: [] as string[],
    videoUrl: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
    
    // Check if user is landlord or admin
    if (!authLoading && user && user.userType !== "landlord" && !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "This dashboard is only for landlords.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  // Fetch data
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/landlord/properties"],
    enabled: isAuthenticated,
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/landlord/inquiries"],
    enabled: isAuthenticated,
  });

  const { data: regions = [] } = useQuery({
    queryKey: ["/api/regions"],
  });

  const { data: divisions = [] } = useQuery({
    queryKey: [`/api/regions/${propertyFormData.regionId}/divisions`],
    enabled: !!propertyFormData.regionId,
  });

  // Property mutations
  const createPropertyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/landlord/properties", data);
    },
    onSuccess: () => {
      toast({
        title: "Property Created",
        description: "Your property has been listed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/landlord/properties"] });
      setShowPropertyForm(false);
      resetForm();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to Create Property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/landlord/properties/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Property Updated",
        description: "Your property has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/landlord/properties"] });
      setShowPropertyForm(false);
      setEditingProperty(null);
      resetForm();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to Update Property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/landlord/properties/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Property Deleted",
        description: "Your property has been removed from listings.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/landlord/properties"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to Delete Property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form handlers
  const resetForm = () => {
    setPropertyFormData({
      title: "",
      description: "",
      propertyType: "",
      contractType: "",
      regionId: "",
      divisionId: "",
      address: "",
      pricePerNight: "",
      pricePerMonth: "",
      rooms: "",
      size: "",
      maxTenants: "",
      amenities: [],
      images: [],
      videoUrl: "",
    });
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setPropertyFormData({
      title: property.title || "",
      description: property.description || "",
      propertyType: property.propertyType || "",
      contractType: property.contractType || "",
      regionId: property.regionId?.toString() || "",
      divisionId: property.divisionId?.toString() || "",
      address: property.address || "",
      pricePerNight: property.pricePerNight || "",
      pricePerMonth: property.pricePerMonth || "",
      rooms: property.rooms?.toString() || "",
      size: property.size?.toString() || "",
      maxTenants: property.maxTenants?.toString() || "",
      amenities: property.amenities || [],
      images: property.images || [],
      videoUrl: property.videoUrl || "",
    });
    setShowPropertyForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      ...propertyFormData,
      regionId: parseInt(propertyFormData.regionId),
      divisionId: parseInt(propertyFormData.divisionId),
      pricePerNight: propertyFormData.pricePerNight ? parseFloat(propertyFormData.pricePerNight) : null,
      pricePerMonth: propertyFormData.pricePerMonth ? parseFloat(propertyFormData.pricePerMonth) : null,
      rooms: propertyFormData.rooms ? parseInt(propertyFormData.rooms) : null,
      size: propertyFormData.size ? parseInt(propertyFormData.size) : null,
    };

    if (editingProperty) {
      updatePropertyMutation.mutate({ id: editingProperty.id, data: formData });
    } else {
      createPropertyMutation.mutate(formData);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setPropertyFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const formatPrice = (price: string | null) => {
    if (!price) return "Not set";
    return `XCFA ${parseInt(price).toLocaleString()}`;
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "apartment":
        return "bg-accent text-accent-foreground";
      case "guestHouse":
        return "bg-secondary text-secondary-foreground";
      case "room":
        return "bg-primary text-primary-foreground";
      case "studio":
        return "bg-blue-500 text-white";
      case "officeSpace":
        return "bg-purple-500 text-white";
      case "commercial":
        return "bg-orange-500 text-white";
      default:
        return "bg-neutral-200 text-neutral-700";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Check if user needs subscription (admin users bypass this)
  if (!user || (!user.isAdmin && user.userType !== "landlord" && user.subscriptionStatus !== 'active')) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h1 className="font-bold text-3xl text-neutral-800 mb-4">
            {user?.userType === "renter" ? "Subscription Required" : "Landlord Access Required"}
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            {user?.userType === "renter" 
              ? "You need an active subscription to access property management features."
              : "You need to register as a landlord to access the property management dashboard."
            }
          </p>
          <Button 
            onClick={() => window.location.href = user?.userType === "renter" ? "/subscribe" : "/register-landlord"}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {user?.userType === "renter" ? "Subscribe Now" : "Become a Landlord"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Header */}
      <section className="py-8 bg-primary text-white">
        <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl mb-2">Landlord Dashboard</h1>
              <p className="text-white/90">
                Welcome back, {user?.firstName || 'Host'}! Manage your properties and bookings.
              </p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">
                {user?.isAdmin ? 'Admin Access' : (user?.subscriptionType === 'yearly' ? 'Yearly' : 'Monthly') + ' Plan'}
              </Badge>
              <div className="text-sm text-white/80">
                {user?.isAdmin ? 'Full Access' : `Expires: ${user?.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : 'Never'}`}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-neutral-800">
                {Array.isArray(properties) ? properties.length : 0}
              </div>
              <div className="text-sm text-neutral-600">Properties Listed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-neutral-800">
                {Array.isArray(inquiries) ? inquiries.length : 0}
              </div>
              <div className="text-sm text-neutral-600">Total Inquiries</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-neutral-800">
                {Math.round((inquiries.length / Math.max(properties.length, 1)) * 100) / 10 || 0}
              </div>
              <div className="text-sm text-neutral-600">Avg. Inquiries/Property</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-neutral-800">
                {user.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-sm text-neutral-600">Days Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-2xl text-neutral-800">Your Properties</h2>
              <Button
                onClick={() => {
                  setEditingProperty(null);
                  resetForm();
                  setShowPropertyForm(true);
                }}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>

            {propertiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-80" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {properties.map((property: any) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative h-48">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-neutral-400" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge className={getPropertyTypeColor(property.propertyType)}>
                          {property.propertyType === "guesthouse" ? "Guest House" : 
                           property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant={property.isActive ? "default" : "secondary"}>
                          {property.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-neutral-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.division?.name}, {property.region?.name}</span>
                      </div>
                      <div className="text-primary font-semibold mb-3">
                        {formatPrice(property.pricePerNight)} 
                        {property.pricePerNight && <span className="text-neutral-500 text-sm font-normal"> / night</span>}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/property/${property.id}`, '_blank')}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(property)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this property?")) {
                              deletePropertyMutation.mutate(property.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Building className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-xl text-neutral-800 mb-2">No Properties Yet</h3>
                  <p className="text-neutral-600 mb-6">
                    Start building your rental business by adding your first property.
                  </p>
                  <Button
                    onClick={() => {
                      setEditingProperty(null);
                      resetForm();
                      setShowPropertyForm(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <h2 className="font-bold text-2xl text-neutral-800">Recent Inquiries</h2>
            
            {inquiriesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inquiry: any) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{inquiry.guestName}</h3>
                          <p className="text-neutral-600">{inquiry.guestEmail}</p>
                          {inquiry.guestPhone && (
                            <p className="text-neutral-600">{inquiry.guestPhone}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            inquiry.status === 'pending' ? 'default' :
                            inquiry.status === 'responded' ? 'secondary' : 'outline'
                          }>
                            {inquiry.status}
                          </Badge>
                          <div className="text-sm text-neutral-500 mt-1">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                        <p className="text-neutral-700">{inquiry.message}</p>
                      </div>
                      
                      {(inquiry.checkInDate || inquiry.checkOutDate) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {inquiry.checkInDate && (
                            <div>
                              <span className="font-medium">Check-in:</span> {new Date(inquiry.checkInDate).toLocaleDateString()}
                            </div>
                          )}
                          {inquiry.checkOutDate && (
                            <div>
                              <span className="font-medium">Check-out:</span> {new Date(inquiry.checkOutDate).toLocaleDateString()}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Guests:</span> {inquiry.guests}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-xl text-neutral-800 mb-2">No Inquiries Yet</h3>
                  <p className="text-neutral-600">
                    Once guests start inquiring about your properties, they'll appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="font-bold text-2xl text-neutral-800">Profile & Subscription</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <div className="mt-1 p-3 bg-neutral-50 rounded-lg">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : 'Not provided'
                      }
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1 p-3 bg-neutral-50 rounded-lg">
                      {user?.email || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <div className="mt-1 p-3 bg-neutral-50 rounded-lg">
                      {user?.phoneNumber || 'Not provided'}
                    </div>
                  </div>
                  <div>
                    <Label>Verification Status</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      {user?.isVerified ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending Verification
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Plan</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge variant="secondary">
                        {user?.subscriptionType === 'yearly' ? 'Yearly' : 'Monthly'} Plan
                      </Badge>
                      <span className="text-lg font-semibold text-primary">
                        ₣{user?.subscriptionType === 'yearly' 
                          ? SUBSCRIPTION_PLANS.yearly.price.toLocaleString()
                          : SUBSCRIPTION_PLANS.monthly.price.toLocaleString()
                        } / {user?.subscriptionType === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      <Badge variant={user?.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                        {user?.subscriptionStatus || 'inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Expires</Label>
                    <div className="mt-1 p-3 bg-neutral-50 rounded-lg">
                      {user?.subscriptionExpiresAt 
                        ? new Date(user.subscriptionExpiresAt).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                  </div>
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Plan Features</h4>
                    <ul className="space-y-1 text-sm">
                      {user?.isAdmin ? (
                        <li className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-green-600" />
                          <span>Full Administrative Access</span>
                        </li>
                      ) : (
                        (user?.subscriptionType === 'yearly' 
                          ? SUBSCRIPTION_PLANS.yearly.features 
                          : SUBSCRIPTION_PLANS.monthly.features
                        ).map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span>{feature}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Property Form Dialog */}
      <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? "Edit Property" : "Add New Property"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={propertyFormData.title}
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select 
                  value={propertyFormData.propertyType} 
                  onValueChange={(value) => setPropertyFormData(prev => ({ ...prev, propertyType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={propertyFormData.description}
                onChange={(e) => setPropertyFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Region *</Label>
                <Select 
                  value={propertyFormData.regionId} 
                  onValueChange={(value) => setPropertyFormData(prev => ({ ...prev, regionId: value, divisionId: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region: any) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="division">Division *</Label>
                <Select 
                  value={propertyFormData.divisionId} 
                  onValueChange={(value) => setPropertyFormData(prev => ({ ...prev, divisionId: value }))}
                  disabled={!propertyFormData.regionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division: any) => (
                      <SelectItem key={division.id} value={division.id.toString()}>
                        {division.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={propertyFormData.address}
                onChange={(e) => setPropertyFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contractType">Contract Type *</Label>
                <Select 
                  value={propertyFormData.contractType} 
                  onValueChange={(value) => setPropertyFormData(prev => ({ ...prev, contractType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pricePerNight">Price per Night (XCFA)</Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  value={propertyFormData.pricePerNight}
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, pricePerNight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="pricePerMonth">Price per Month (XCFA)</Label>
                <Input
                  id="pricePerMonth"
                  type="number"
                  value={propertyFormData.pricePerMonth}
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, pricePerMonth: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rooms">Number of Rooms</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={propertyFormData.rooms}
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, rooms: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="size">Size (m²)</Label>
                <Input
                  id="size"
                  type="number"
                  value={propertyFormData.size}
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, size: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="maxTenants">Max Tenants</Label>
                <Input
                  id="maxTenants"
                  type="number"
                  min="1"
                  value={propertyFormData.maxTenants}
                  onChange={(e) => setPropertyFormData(prev => ({ ...prev, maxTenants: e.target.value }))}
                  placeholder="e.g., 4"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Maximum number of people who can stay
                </p>
              </div>
            </div>

            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={propertyFormData.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <Label>Property Images</Label>
              <div className="mt-2 space-y-3">
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-600 mb-3">
                    Upload property images (Max 10 images, 5MB each)
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 10) {
                        alert("Maximum 10 images allowed");
                        return;
                      }
                      // Convert files to URLs for preview (in real app, upload to server)
                      const imageUrls = files.map(file => URL.createObjectURL(file));
                      setPropertyFormData(prev => ({ 
                        ...prev, 
                        images: [...prev.images, ...imageUrls].slice(0, 10)
                      }));
                    }}
                    className="w-auto mx-auto"
                  />
                </div>
                
                {/* Image Preview */}
                {propertyFormData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {propertyFormData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPropertyFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="videoUrl">Video URL (Optional)</Label>
              <Input
                id="videoUrl"
                type="url"
                value={propertyFormData.videoUrl}
                onChange={(e) => setPropertyFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-neutral-500 mt-1">
                Add a YouTube, Vimeo, or other video URL to showcase your property
              </p>
            </div>

            <div className="flex space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPropertyForm(false);
                  setEditingProperty(null);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {createPropertyMutation.isPending || updatePropertyMutation.isPending
                  ? "Saving..."
                  : editingProperty
                  ? "Update Property"
                  : "Create Property"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
