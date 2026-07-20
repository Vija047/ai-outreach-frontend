"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  colorFrom = "#2563eb",
  colorTo = "#38bdf8",
  delay = 0,
}: BorderBeamProps) {
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      <div
        className="absolute aspect-square w-[calc(var(--size)*1px)] animate-border-beam rounded-full opacity-80"
        style={{
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          animationDelay: `-${delay}s`,
          offsetPath: "rect(0 auto auto 0 round calc(var(--size) * 1px))",
          offsetAnchor: "90% 50%",
        }}
      />
    </div>
  );
}
