"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

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
import { IconMailCheck } from "@tabler/icons-react";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <Card className="w-full max-w-md">
          {!success ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Reset your password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a recovery link.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  {error && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="justify-center">
                <p className="text-center text-sm text-muted-foreground">
                  Remembered your password?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <IconMailCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                <CardDescription className="text-sm">
                  We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-2 pb-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Please click the link in the email to securely update your password.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
