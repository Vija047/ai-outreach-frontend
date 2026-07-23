import { Suspense } from "react";
import { VerifyEmailView } from "@/components/auth/verify-email-view";

export const metadata = {
  title: "Verify Email | AI Outreach",
  description: "Verify your email to activate your AI Outreach account.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-background">
          <div className="text-muted-foreground animate-pulse text-sm">Loading verification details...</div>
        </div>
      }
    >
      <VerifyEmailView />
    </Suspense>
  );
}
