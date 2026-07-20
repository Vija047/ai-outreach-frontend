"use client";

import { IconCoin } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

interface CreditsRunwayProps {
  balance: number | null;
  plan?: string;
  loading?: boolean;
  className?: string;
}

export function CreditsRunway({
  balance,
  plan,
  loading,
  className,
}: CreditsRunwayProps) {
  const isPro = plan?.toUpperCase() === "PRO";

  if (loading) {
    return (
      <p className={cn("h-5 w-64 animate-pulse rounded bg-muted", className)} />
    );
  }

  if (isPro) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Pro plan: unlimited analyses and generations.
      </p>
    );
  }

  if (balance == null) return null;

  const companyWord = balance === 1 ? "company" : "companies";

  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <IconCoin className="size-4 shrink-0" stroke={1.5} />
        <span>
          <span className="font-medium text-foreground">{balance} credits</span> left
        </span>
        <span className="hidden sm:inline">
          {" · "}
          enough for ~{balance} new {companyWord} (1 credit to analyze, 1 to generate)
        </span>
        <span className="w-full text-xs sm:hidden">
          ~{balance} new {companyWord} at 1 credit each
        </span>
      </span>
    </p>
  );
}
