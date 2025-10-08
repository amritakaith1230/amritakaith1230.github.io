"use client";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth";
import { authService } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    console.log("🔄 Setting up auth state listener...");

    const unsubscribe = authService.onAuthStateChange((user) => {
      console.log(
        "🔄 Auth state changed:",
        user ? `User: ${user.email}, Role: ${user.role}` : "No user"
      );
      setUser(user);
      setLoading(false);

      // Only redirect if user is authenticated and we're on auth pages
      if (user) {
        const currentPath = window.location.pathname;
        console.log("📍 Current path:", currentPath);

        // Only redirect from auth pages to dashboard
        if (currentPath.startsWith("/auth/")) {
          const redirectPath = getDashboardPath(user.role);
          console.log("🚀 Redirecting from auth page to:", redirectPath);

          setTimeout(() => {
            router.replace(redirectPath);
          }, 2000); // 2 second delay to show success message
        }
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth state listener");
      unsubscribe();
    };
  }, [router]);

  const getDashboardPath = (role: string) => {
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "staff":
        return "/dashboard/staff";
      case "user":
        return "/dashboard/user";
      default:
        return "/services";
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      setError(null);
      console.log("🔐 Attempting login for:", email);

      const user = await authService.login({ email, password });
      console.log("✅ Login successful:", user);

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${user.displayName || user.email}`,
        variant: "default",
      });

      // User state will be updated by onAuthStateChanged
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setError(error.message);

      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });

      logger.error("Login failed", { email, error: error.message });
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setAuthLoading(true);
      setError(null);
      console.log("📝 Attempting registration for:", data.email);

      const result = await authService.register(data);
      console.log("✅ Registration successful:", result);

      toast({
        title: "Registration Successful!",
        description: result.message,
        variant: "default",
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      setError(error.message);

      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });

      logger.error("Registration failed", {
        email: data.email,
        error: error.message,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);
      await authService.logout();
      setUser(null);

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default",
      });

      router.replace("/");
    } catch (error: any) {
      setError(error.message);

      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });

      logger.error("Logout failed", { error: error.message });
    } finally {
      setAuthLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading: loading || authLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
