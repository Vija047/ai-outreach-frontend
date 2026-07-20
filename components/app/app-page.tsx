import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
} as const;

interface AppPageProps {
  children: ReactNode;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function AppPage({
  children,
  size = "md",
  className,
}: AppPageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0",
        sizeClasses[size],
        "space-y-6 sm:space-y-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
