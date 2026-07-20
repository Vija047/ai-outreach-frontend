"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import {
  AmbientGlow,
  FadeIn,
  springHover,
} from "@/components/landing/motion-primitives";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export function CtaSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-border py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10" />
      <AmbientGlow
        className="left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 bg-primary/15"
        duration={10}
      />

      <FadeIn className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
          Start outreach smarter today
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Stop writing generic messages. Let AI research prospects and draft
          personalized copy. Free to start.
        </p>
        <div className="mt-8 flex justify-center">
          <motion.div
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={springHover}
          >
            <Link href="/signup">
              <ShimmerButton className="h-11 px-8 text-sm font-medium shadow-2xl">
                Start for free
              </ShimmerButton>
            </Link>
          </motion.div>
        </div>
      </FadeIn>
    </section>
  );
}
