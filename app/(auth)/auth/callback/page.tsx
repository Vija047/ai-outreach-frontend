"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { Navbar } from "@/components/landing/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-provider";
import { isProfileComplete } from "@/lib/api";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { establishSession } = useAuth();
  const [message, setMessage] = useState("Completing sign-in...");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      handled.current = true;
      setMessage(decodeURIComponent(error));
      const timer = setTimeout(() => router.replace("/login"), 3000);
      return () => clearTimeout(timer);
    }

    if (!token) {
      handled.current = true;
      setMessage("Missing sign-in token");
      const timer = setTimeout(() => router.replace("/login"), 3000);
      return () => clearTimeout(timer);
    }

    handled.current = true;
    void (async () => {
      try {
        const profile = await establishSession(token);
        router.replace(
          profile && !isProfileComplete(profile) ? "/onboarding" : "/dashboard",
        );
      } catch {
        setMessage("Sign-in failed. Redirecting to login...");
        setTimeout(() => router.replace("/login"), 2000);
      }
    })();
  }, [searchParams, router, establishSession]);

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
