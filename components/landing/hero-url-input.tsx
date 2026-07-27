"use client";

import { FormEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useAuth } from "@/contexts/auth-provider";
import { normalizeCompanyUrl } from "@/lib/company-analysis";
import { cn } from "@/lib/utils";

const PENDING_URL_KEY = "pending-analyze-url";

const URL_PLACEHOLDERS = [
  "stripe.com",
  "linear.app/about",
  "notion.so/careers",
  "vercel.com",
];

export function HeroUrlInput({ className }: { className?: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const [url, setUrl] = useState("");

  const navigateWithUrl = useCallback(
    (raw: string) => {
      const normalized = normalizeCompanyUrl(raw);
      sessionStorage.setItem(PENDING_URL_KEY, normalized);
      router.push(user ? "/dashboard#analyze" : "/signup");
    },
    [router, user],
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = url.trim();
    if (!value) return;
    navigateWithUrl(value);
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative mx-auto w-full max-w-2xl px-1 sm:px-0", className)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-[0_8px_40px_rgb(0,0,0,0.12)] backdrop-blur-md sm:rounded-full dark:shadow-[0_8px_40px_rgb(0,0,0,0.45)]">
        {!reduce ? (
          <BorderBeam size={240} duration={14} colorFrom="#2563eb" colorTo="#38bdf8" />
        ) : null}
        <PlaceholdersAndVanishInput
          placeholders={URL_PLACEHOLDERS}
          onChange={(e) => setUrl(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
        Free to try — 20 credits, no card required
      </p>
    </motion.div>
  );
}

export function consumePendingAnalyzeUrl(): string | null {
  if (typeof window === "undefined") return null;
  const pending = sessionStorage.getItem(PENDING_URL_KEY);
  if (!pending) return null;
  sessionStorage.removeItem(PENDING_URL_KEY);
  return pending;
}
