import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  // Try local auth first, fallback to Replit auth
  const { data: localUser, isLoading: localLoading } = useQuery({
    queryKey: ["/api/auth/user", "jwt"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return null;
      
      try {
        const response = await fetch("/api/auth/user", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Not authenticated');
        return response.json();
      } catch {
        localStorage.removeItem("auth_token");
        return null;
      }
    },
    retry: false,
  });

  const { data: replitUser, isLoading: replitLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !localUser,
  });

  const user = localUser || replitUser;
  const isLoading = localLoading || (replitLoading && !localUser);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isSubscribed: user?.subscriptionStatus === "active",
    hasLocalAuth: !!localUser,
  };
}
