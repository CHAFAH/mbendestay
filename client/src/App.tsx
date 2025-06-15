import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import BrowseProperties from "@/pages/browse-properties";
import PropertyDetail from "@/pages/property-detail-simple";
import RegionDetail from "@/pages/region-detail";
import LandlordDashboard from "@/pages/landlord-dashboard";
import LandlordRegistration from "@/pages/landlord-registration";
import MessagesPage from "@/pages/messages";
import ChatPage from "@/pages/chat";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/browse" component={BrowseProperties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/region/:slug" component={RegionDetail} />
          <Route path="/register-landlord" component={LandlordRegistration} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/browse" component={BrowseProperties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/region/:slug" component={RegionDetail} />
          <Route path="/dashboard" component={LandlordDashboard} />
          <Route path="/register-landlord" component={LandlordRegistration} />
          <Route path="/messages" component={MessagesPage} />
          <Route path="/messages/:id" component={ChatPage} />
        </>
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
