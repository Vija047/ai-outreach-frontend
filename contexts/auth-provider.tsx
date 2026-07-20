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

import { api, isProfileComplete } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth-storage";
import type { SellerProfile, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  profile: SellerProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  sendSignupOtp: (name: string, email: string, password: string) => Promise<void>;
  verifySignupOtp: (email: string, otp: string) => Promise<void>;
  resendSignupOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshProfile: () => Promise<SellerProfile | null>;
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
    } catch {
      clearToken();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  useEffect(() => {
    void (async () => {
      await refreshUser();
    })();
  }, [refreshUser]);

  const afterAuth = useCallback(
    async (accessToken: string, authUser: User) => {
      setToken(accessToken);
      setUser(authUser);
      const p = await refreshProfile();
      if (p && !isProfileComplete(p)) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    },
    [refreshProfile, router],
  );

  const sendSignupOtp = useCallback(
    async (name: string, email: string, password: string) => {
      await api.sendSignupOtp({ name, email, password });
    },
    [],
  );

  const verifySignupOtp = useCallback(
    async (email: string, otp: string) => {
      const res = await api.verifySignupOtp({ email, otp });
      await afterAuth(res.accessToken, res.user);
    },
    [afterAuth],
  );

  const resendSignupOtp = useCallback(async (email: string) => {
    await api.resendSignupOtp({ email });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login({ email, password });
      await afterAuth(res.accessToken, res.user);
    },
    [afterAuth],
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    clearToken();
    setUser(null);
    setProfile(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      login,
      sendSignupOtp,
      verifySignupOtp,
      resendSignupOtp,
      logout,
      refreshUser,
      refreshProfile,
    }),
    [
      user,
      profile,
      loading,
      login,
      sendSignupOtp,
      verifySignupOtp,
      resendSignupOtp,
      logout,
      refreshUser,
      refreshProfile,
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
