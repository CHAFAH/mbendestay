import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { User, Heart, CreditCard, Settings, AlertTriangle, Download, Calendar, MapPin, Star } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/components/simple-language-switcher";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user favorites
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch subscription details
  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["/api/profile/subscription"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch payment transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/profile/transactions"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Type cast for API responses
  const typedSubscriptionData = subscriptionData as {
    subscriptionStatus?: string;
    subscriptionType?: string;
    subscriptionExpiresAt?: string;
    details?: {
      currentPlan?: string;
      planPrice?: string;
      billingCycle?: string;
      nextBillingDate?: string;
    };
  } | undefined;

  const typedFavorites = favorites as Array<{
    id: number;
    property: {
      id: number;
      title: string;
      price: string;
      images: string[];
      region: { name: string };
      division: { name: string };
    };
  }>;

  const typedTransactions = transactions as Array<{
    id: number;
    description: string;
    amount: string;
    status: string;
    createdAt: string;
    receiptUrl?: string;
  }>;

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/profile/account");
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    const value = parseInt(amount);
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getSubscriptionStatus = () => {
    if (!typedSubscriptionData?.subscriptionStatus) return 'inactive';
    if (typedSubscriptionData.subscriptionExpiresAt) {
      return new Date(typedSubscriptionData.subscriptionExpiresAt) > new Date() ? 'active' : 'expired';
    }
    return typedSubscriptionData.subscriptionStatus;
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'fr' ? 'Profil Utilisateur' : 'User Profile'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'fr' 
              ? 'Gérez votre compte, abonnements et favoris' 
              : 'Manage your account, subscriptions, and favorites'}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {language === 'fr' ? 'Aperçu' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {language === 'fr' ? 'Favoris' : 'Favorites'}
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {language === 'fr' ? 'Facturation' : 'Billing'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {language === 'fr' ? 'Paramètres' : 'Settings'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {language === 'fr' ? 'Informations du compte' : 'Account Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === 'fr' ? 'Nom' : 'Name'}
                    </p>
                    <p className="text-lg">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === 'fr' ? 'Type de compte' : 'Account Type'}
                    </p>
                    <Badge variant={user.userType === 'landlord' ? 'default' : 'secondary'}>
                      {user.userType === 'landlord' 
                        ? (language === 'fr' ? 'Propriétaire' : 'Landlord')
                        : (language === 'fr' ? 'Locataire' : 'Renter')
                      }
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {language === 'fr' ? 'Statut d\'abonnement' : 'Subscription Status'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {language === 'fr' ? 'Statut' : 'Status'}
                    </p>
                    <Badge 
                      variant={
                        subscriptionStatus === 'active' ? 'default' : 
                        subscriptionStatus === 'expired' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {subscriptionStatus === 'active' 
                        ? (language === 'fr' ? 'Actif' : 'Active')
                        : subscriptionStatus === 'expired'
                        ? (language === 'fr' ? 'Expiré' : 'Expired')
                        : (language === 'fr' ? 'Inactif' : 'Inactive')
                      }
                    </Badge>
                  </div>
                  {typedSubscriptionData?.subscriptionType && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === 'fr' ? 'Plan' : 'Plan'}
                      </p>
                      <p className="text-lg capitalize">{typedSubscriptionData.subscriptionType.replace('_', ' ')}</p>
                    </div>
                  )}
                  {typedSubscriptionData?.subscriptionExpiresAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {language === 'fr' ? 'Expire le' : 'Expires On'}
                      </p>
                      <p className="text-lg">{formatDate(typedSubscriptionData.subscriptionExpiresAt)}</p>
                    </div>
                  )}
                  {subscriptionStatus !== 'active' && (
                    <div className="pt-4">
                      <Link href={user?.userType === 'landlord' ? '/landlord-subscribe' : '/subscribe'}>
                        <Button className="w-full">
                          {language === 'fr' ? 'S\'abonner maintenant' : 'Subscribe Now'}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {language === 'fr' ? 'Propriétés favorites' : 'Favorite Properties'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Propriétés que vous avez sauvegardées' 
                    : 'Properties you have saved to your favorites'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : typedFavorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      {language === 'fr' 
                        ? 'Aucune propriété favorite pour le moment' 
                        : 'No favorite properties yet'}
                    </p>
                    <Link href="/browse-properties">
                      <Button className="mt-4">
                        {language === 'fr' ? 'Parcourir les propriétés' : 'Browse Properties'}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {typedFavorites.map((favorite) => (
                      <Card key={favorite.id} className="overflow-hidden">
                        <div className="aspect-video bg-gray-200 relative">
                          {favorite.property.images && favorite.property.images.length > 0 ? (
                            <img
                              src={favorite.property.images[0]}
                              alt={favorite.property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <MapPin className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{favorite.property.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {favorite.property.region.name}, {favorite.property.division.name}
                          </p>
                          <p className="text-primary font-bold text-xl mb-3">
                            {formatCurrency(favorite.property.price)}/
                            {language === 'fr' ? 'mois' : 'month'}
                          </p>
                          <Link href={`/property/${favorite.property.id}`}>
                            <Button className="w-full">
                              {language === 'fr' ? 'Voir les détails' : 'View Details'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {language === 'fr' ? 'Détails de l\'abonnement' : 'Subscription Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptionLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : typedSubscriptionData?.details ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {language === 'fr' ? 'Plan actuel' : 'Current Plan'}
                        </p>
                        <p className="text-lg capitalize">{typedSubscriptionData.details.currentPlan?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {language === 'fr' ? 'Prix du plan' : 'Plan Price'}
                        </p>
                        <p className="text-lg">{formatCurrency(typedSubscriptionData.details.planPrice || '0')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {language === 'fr' ? 'Cycle de facturation' : 'Billing Cycle'}
                        </p>
                        <p className="text-lg capitalize">{typedSubscriptionData.details.billingCycle}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {language === 'fr' ? 'Prochaine facturation' : 'Next Billing Date'}
                        </p>
                        <p className="text-lg">
                          {typedSubscriptionData.details.nextBillingDate 
                            ? formatDate(typedSubscriptionData.details.nextBillingDate)
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      {language === 'fr' 
                        ? 'Aucun abonnement actif' 
                        : 'No active subscription'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {language === 'fr' ? 'Historique des paiements' : 'Payment History'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Toutes vos transactions et reçus' 
                    : 'All your transactions and receipts'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : typedTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      {language === 'fr' 
                        ? 'Aucune transaction pour le moment' 
                        : 'No transactions yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {typedTransactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                          <Badge 
                            variant={transaction.status === 'succeeded' ? 'default' : 'destructive'}
                            className="mt-1"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            {formatCurrency(transaction.amount)}
                          </p>
                          {transaction.receiptUrl && (
                            <a 
                              href={transaction.receiptUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              <Download className="h-3 w-3" />
                              {language === 'fr' ? 'Reçu' : 'Receipt'}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  {language === 'fr' ? 'Zone de danger' : 'Danger Zone'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Actions irréversibles pour votre compte' 
                    : 'Irreversible actions for your account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {language === 'fr' 
                      ? 'Supprimer votre compte supprimera définitivement toutes vos données, propriétés, favoris et historique de paiement. Cette action ne peut pas être annulée.' 
                      : 'Deleting your account will permanently remove all your data, properties, favorites, and payment history. This action cannot be undone.'}
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6">
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        {language === 'fr' ? 'Supprimer le compte' : 'Delete Account'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {language === 'fr' ? 'Confirmer la suppression' : 'Confirm Deletion'}
                        </DialogTitle>
                        <DialogDescription>
                          {language === 'fr' 
                            ? 'Êtes-vous sûr de vouloir supprimer définitivement votre compte? Cette action ne peut pas être annulée.' 
                            : 'Are you sure you want to permanently delete your account? This action cannot be undone.'}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          {language === 'fr' ? 'Annuler' : 'Cancel'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            deleteAccountMutation.mutate();
                            setDeleteDialogOpen(false);
                          }}
                          disabled={deleteAccountMutation.isPending}
                        >
                          {deleteAccountMutation.isPending 
                            ? (language === 'fr' ? 'Suppression...' : 'Deleting...') 
                            : (language === 'fr' ? 'Supprimer définitivement' : 'Delete Permanently')
                          }
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}