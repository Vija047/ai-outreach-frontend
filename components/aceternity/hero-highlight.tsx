"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

export function HeroHighlight({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col items-center justify-center",
        containerClassName,
      )}
    >
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20 opacity-40 blur-3xl dark:from-blue-500/10 dark:to-cyan-500/10" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn("relative z-20", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
