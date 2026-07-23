"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { AuthDivider, GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";
import { ApiError } from "@/lib/api";

export function LoginForm() {
  const { login, resendVerification, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResendSuccess("");
    setResendError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResendSuccess("");
    setResendError("");
    setResending(true);
    try {
      const res = await resendVerification(email.trim());
      setResendSuccess(res?.message || "Verification email sent.");
    } catch (err) {
      setResendError(err instanceof ApiError ? err.message : "Failed to resend.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Log in to analyze prospects and generate outreach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <GoogleAuthButton label="Sign in with Google" />
              <AuthDivider />
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive space-y-2">
                  <p>{error}</p>
                  {error.includes("verify") && (
                    <div className="pt-1">
                      {resendSuccess ? (
                        <p className="text-xs text-emerald-600 font-medium bg-emerald-500/10 p-1.5 rounded-md">
                          {resendSuccess}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                          disabled={resending}
                        >
                          {resending ? "Resending..." : "Resend verification link"}
                        </button>
                      )}
                      {resendError && (
                        <p className="text-xs text-destructive mt-1 font-medium">
                          {resendError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-center text-sm text-muted-foreground">
              No account yet?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up free
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
