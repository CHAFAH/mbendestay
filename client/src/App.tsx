import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import BrowseProperties from "@/pages/browse-properties";
import PropertyDetail from "@/pages/property-detail-simple";
import RegionDetail from "@/pages/region-detail";
import LandlordDashboard from "@/pages/landlord-dashboard";
import LandlordRegistration from "@/pages/landlord-registration";
import LandlordSubscribe from "@/pages/landlord-subscribe";
import MessagesPage from "@/pages/messages";
import ChatPage from "@/pages/chat";
import Subscribe from "@/pages/subscribe";
import Profile from "@/pages/profile";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/subscribe" component={Subscribe} />
      
      {!isAuthenticated && !isLoading ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/browse" component={BrowseProperties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/region/:slug" component={RegionDetail} />
          <Route path="/register-landlord" component={LandlordRegistration} />
          <Route path="/landlord-subscribe" component={LandlordSubscribe} />
        </>
      ) : isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/browse" component={BrowseProperties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/region/:slug" component={RegionDetail} />
          <Route path="/dashboard" component={LandlordDashboard} />
          <Route path="/register-landlord" component={LandlordRegistration} />
          <Route path="/landlord-subscribe" component={LandlordSubscribe} />
          <Route path="/messages" component={MessagesPage} />
          <Route path="/messages/:id" component={ChatPage} />
          <Route path="/profile" component={Profile} />
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
