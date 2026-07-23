"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IconLoader2 } from "@tabler/icons-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
