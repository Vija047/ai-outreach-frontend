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
import { api, ApiError } from "@/lib/api";

type VerifyState = "verifying" | "success" | "error";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>("verifying");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("Verification token is missing.");
      return;
    }

    let isMounted = true;
    void (async () => {
      try {
        const res = await api.verifyEmail(token);
        if (isMounted) {
          setState("success");
          setMessage(res.message || "Email verified successfully.");
        }
      } catch (err) {
        if (isMounted) {
          setState("error");
          setMessage(
            err instanceof ApiError
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
      const res = await api.resendVerification(resendEmail.trim());
      setResendSuccess(res.message || "Verification email sent successfully.");
      setResendEmail("");
    } catch (err) {
      setResendError(
        err instanceof ApiError ? err.message : "Failed to resend email."
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
                    <Label htmlFor="resend-email" className="text-xs">
                      Email address
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
                    className="w-full text-xs active:scale-[0.98] transition-transform duration-100"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <IconLoader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <IconMail className="mr-2 h-3.5 w-3.5" />
                        Resend Verification Link
                      </>
                    )}
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
