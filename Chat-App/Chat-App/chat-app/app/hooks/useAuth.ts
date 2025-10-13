"use client";

import { useState, useEffect } from "react";
import type { User, AuthState } from "../lib/types";
import { validateUsername, generateId } from "../lib/utils";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("chatUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ user, isAuthenticated: true });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("chatUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string
  ): Promise<{ success: boolean; error?: string }> => {
    const validation = validateUsername(username);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    try {
      const user: User = {
        id: generateId(),
        username: username.trim(),
        joinedAt: new Date(),
      };

      localStorage.setItem("chatUser", JSON.stringify(user));
      setAuthState({ user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Failed to login. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("chatUser");
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem("chatUser", JSON.stringify(updatedUser));
      setAuthState({ user: updatedUser, isAuthenticated: true });
    }
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
    isLoading,
  };
}
