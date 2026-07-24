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
import type { SellerProfile, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  profile: SellerProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ message: string; autoLoggedIn?: boolean }>;
  resendVerification: (email: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshProfile: () => Promise<SellerProfile | null>;
  establishSession: (accessToken: string) => Promise<SellerProfile | null>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
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
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        setUser(null);
        setProfile(null);
      } else {
        console.error("Failed to load user profile from backend:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const establishSession = useCallback(
    async (accessToken: string): Promise<SellerProfile | null> => {
      setToken(accessToken);
      setLoading(true);
      try {
        const me = await api.getMe();
        setUser(me);
        let p: SellerProfile | null = null;
        try {
          p = await api.getProfile();
          setProfile(p);
        } catch {
          setProfile(null);
        }
        return p;
      } catch (err) {
        clearToken();
        setUser(null);
        setProfile(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res.autoLoggedIn && res.accessToken && res.user) {
        setToken(res.accessToken);
        setUser(res.user);
        const p = await refreshProfile();
        if (p && !isProfileComplete(p)) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
        return { autoLoggedIn: true, message: res.message };
      }

      return {
        autoLoggedIn: false,
        message:
          res.message ||
          "Registration successful. Please verify your email before logging in.",
      };
    },
    [router, refreshProfile],
  );

  const resendVerification = useCallback(async (email: string) => {
    return api.resendVerification(email.trim());
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login({ email: email.trim(), password });
      setToken(res.accessToken);
      setUser(res.user);

      const p = await refreshProfile();
      if (p && !isProfileComplete(p)) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    },
    [router, refreshProfile],
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // token may already be invalid
    }
    clearToken();
    setUser(null);
    setProfile(null);
    router.push("/login");
  }, [router]);

  const forgotPassword = useCallback(async (email: string) => {
    await api.forgotPassword(email.trim());
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await api.resetPassword(token, password);
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
      establishSession,
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
      establishSession,
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
