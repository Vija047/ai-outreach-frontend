"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Navbar } from "@/components/landing/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { api, isProfileComplete } from "@/lib/api";
import { setToken } from "@/lib/auth-storage";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();
  const [message, setMessage] = useState("Completing sign-in...");

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setMessage(decodeURIComponent(error));
      const timer = setTimeout(() => router.replace("/login"), 3000);
      return () => clearTimeout(timer);
    }

    if (!token) {
      setMessage("Missing sign-in token");
      const timer = setTimeout(() => router.replace("/login"), 3000);
      return () => clearTimeout(timer);
    }

    void (async () => {
      try {
        setToken(token);
        const user = await api.getMe();
        const profile = await refreshProfile();
        if (profile && !isProfileComplete(profile)) {
          router.replace("/onboarding");
        } else {
          router.replace("/dashboard");
        }
        void user;
      } catch {
        setMessage("Sign-in failed. Redirecting to login...");
        setTimeout(() => router.replace("/login"), 2000);
      }
    })();
  }, [searchParams, router, refreshProfile]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Signing you in</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
