"use client";

import { IconCoin } from "@tabler/icons-react";

import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

interface CreditsBadgeProps {
  balance: number | null;
  plan?: string;
  loading?: boolean;
  className?: string;
}

export function CreditsBadge({
  balance,
  plan,
  loading,
  className,
}: CreditsBadgeProps) {
  const isPro = plan?.toUpperCase() === "PRO";
  const isLow = balance != null && balance < 5 && !isPro;

  if (loading) {
    return (
      <span
        className={cn(
          "inline-flex h-8 min-w-[5.5rem] animate-pulse rounded-full bg-muted",
          className,
        )}
        aria-hidden
      />
    );
  }

  if (isPro) {
    return (
      <span
        className={cn(
          "relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary",
          className,
        )}
      >
        <IconCoin className="size-3.5" stroke={1.5} />
        Unlimited
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border px-3 py-1 text-xs font-medium tabular-nums",
        isLow
          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "border-border bg-muted/80 text-foreground",
        className,
      )}
      title={
        isLow ? "Running low on credits. Each analyze or generate uses 1 credit." : undefined
      }
    >
      {!isLow && (
        <BorderBeam size={120} duration={18} colorFrom="#2563eb" colorTo="#38bdf8" />
      )}
      <IconCoin className="relative size-3.5 shrink-0" stroke={1.5} />
      <span className="relative">
        {balance ?? "—"} {balance === 1 ? "credit" : "credits"}
      </span>
    </span>
  );
}
