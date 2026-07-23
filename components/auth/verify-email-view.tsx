"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  IconLoader2,
  IconCircleCheck,
  IconAlertTriangle,
  IconMail,
} from "@tabler/icons-react";

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
import { supabase } from "@/lib/supabase";

type VerifyState = "verifying" | "success" | "error" | "check-email";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("token_hash");
  const { resendVerification } = useAuth();
  const [state, setState] = useState<VerifyState>(token ? "verifying" : "check-email");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("check-email");
      return;
    }

    let isMounted = true;
    void (async () => {
      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });

        if (error) {
          throw error;
        }

        if (isMounted) {
          setState("success");
          setMessage("Email verified successfully.");
        }
      } catch (err) {
        if (isMounted) {
          setState("error");
          setMessage(
            err instanceof Error
              ? err.message
              : "Verification link is invalid or expired."
          );
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleResend(e: FormEvent) {
    e.preventDefault();
    setResendSuccess("");
    setResendError("");
    setSubmitting(true);
    try {
      const res = await resendVerification(resendEmail.trim());
      setResendSuccess(res.message || "Verification email sent successfully.");
      setResendEmail("");
    } catch (err) {
      setResendError(
        err instanceof Error ? err.message : "Failed to resend email."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <Card className="w-full max-w-md">
          {state === "verifying" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconLoader2 className="h-6 w-6 animate-spin" />
                </div>
                <CardTitle className="text-2xl font-bold">Verifying your email</CardTitle>
                <CardDescription>
                  Please wait while we verify your account...
                </CardDescription>
              </CardHeader>
              <CardContent className="h-16" />
            </>
          )}

          {state === "check-email" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IconMail className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
                <CardDescription>
                  Please click the link in the verification email to verify your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleResend} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="resend-email" className="text-xs">
                      Didn't get a link? Request a new one:
                    </Label>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder="you@company.com"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                    />
                  </div>
                  {resendSuccess && (
                    <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600 font-medium">
                      {resendSuccess}
                    </p>
                  )}
                  {resendError && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {resendError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full text-xs"
                    disabled={submitting}
                  >
                    {submitting ? "Resending..." : "Resend Verification Link"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="justify-center border-t pt-4">
                <p className="text-center text-sm text-muted-foreground">
                  Ready to log in?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </>
          )}

          {state === "success" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <IconCircleCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Verification Successful</CardTitle>
                <CardDescription>
                  Your email has been verified.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {message || "Email verified successfully."} You can now log in to your account.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </CardFooter>
            </>
          )}

          {state === "error" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <IconAlertTriangle className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
                <CardDescription>
                  The verification link was invalid or expired.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground text-sm leading-relaxed">
                  {message} If you need a new verification link, enter your email below to request one.
                </p>
                <form onSubmit={handleResend} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="resend-email-err" className="text-xs">
                      Email address
                    </Label>
                    <Input
                      id="resend-email-err"
                      type="email"
                      placeholder="you@company.com"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                    />
                  </div>
                  {resendSuccess && (
                    <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600 font-medium">
                      {resendSuccess}
                    </p>
                  )}
                  {resendError && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      {resendError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full text-xs"
                    disabled={submitting}
                  >
                    {submitting ? "Resending..." : "Resend Verification Link"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="justify-center border-t pt-4">
                <p className="text-center text-sm text-muted-foreground">
                  Back to{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
