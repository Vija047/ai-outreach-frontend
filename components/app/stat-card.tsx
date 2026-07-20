"use client";

import type { ReactNode } from "react";

import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  className?: string;
  highlight?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  className,
  highlight,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-5",
        highlight && "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
        className,
      )}
    >
      {highlight ? (
        <BorderBeam size={180} duration={14} colorFrom="#2563eb" colorTo="#38bdf8" />
      ) : null}
      <div className="relative space-y-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {label}
        </p>
        <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
          {value}
        </p>
        {hint ? (
          <p className="text-sm text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
