import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      // Try JWT auth first
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const response = await fetch("/api/auth/user", {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            return response.json();
          }
          // If JWT fails, remove invalid token
          localStorage.removeItem("auth_token");
        } catch (error) {
          localStorage.removeItem("auth_token");
        }
      }
      
      // Try Replit OAuth auth
      try {
        const response = await fetch("/api/auth/user", {
          credentials: 'include'
        });
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        // Both auth methods failed
      }
      
      return null;
    },
    retry: false,
    staleTime: 0, // Always refetch when needed
    gcTime: 0, // Don't cache for long
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSubscribed: user?.subscriptionStatus === "active",
  };
}
