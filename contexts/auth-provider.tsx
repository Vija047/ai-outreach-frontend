"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api, isProfileComplete, ApiError } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth-storage";
import { supabase } from "@/lib/supabase";
import type { SellerProfile, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  profile: SellerProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ message: string }>;
  resendVerification: (email: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshProfile: () => Promise<SellerProfile | null>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (): Promise<SellerProfile | null> => {
    try {
      const p = await api.getProfile();
      setProfile(p);
      return p;
    } catch {
      setProfile(null);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const me = await api.getMe();
      setUser(me);
      await refreshProfile();
    } catch (err) {
      console.error("Failed to load user profile from backend:", err);
      if (err instanceof ApiError && err.status === 401) {
        await supabase.auth.signOut();
        clearToken();
        setUser(null);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  // Listen to Supabase auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setToken(session.access_token);
        await refreshUser();
      } else {
        clearToken();
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        message:
          "Registration successful. Please verify your email before logging in.",
      };
    },
    [],
  );

  const resendVerification = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Verification email resent successfully." };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error("Please verify your email before logging in.");
      }

      if (data.session) {
        setToken(data.session.access_token);
        
        // Wait for NestJS backend to synchronize the user profile
        const me = await api.getMe();
        setUser(me);
        
        const p = await refreshProfile();
        if (p && !isProfileComplete(p)) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    },
    [router, refreshProfile],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    clearToken();
    setUser(null);
    setProfile(null);
    router.push("/login");
  }, [router]);

  const forgotPassword = useCallback(async (email: string) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      login,
      signup,
      resendVerification,
      logout,
      refreshUser,
      refreshProfile,
      forgotPassword,
      resetPassword,
    }),
    [
      user,
      profile,
      loading,
      login,
      signup,
      resendVerification,
      logout,
      refreshUser,
      refreshProfile,
      forgotPassword,
      resetPassword,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
