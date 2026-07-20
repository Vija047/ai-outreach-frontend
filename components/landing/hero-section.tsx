"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { HeroHighlight } from "@/components/aceternity/hero-highlight";
import {
  AmbientGlow,
  HeroWordReveal,
  springHover,
} from "@/components/landing/motion-primitives";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const featurePills = ["Analyze", "Hooks", "Email", "LinkedIn"];

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden pt-16 sm:pt-20">
      <AmbientGlow
        className="-left-24 top-1/4 size-72 bg-primary/20"
        duration={9}
      />
      <AmbientGlow
        className="-right-16 top-1/3 size-64 bg-cyan-500/15"
        duration={11}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          WebkitMaskImage:
            "radial-gradient(600px circle at center, black, transparent)",
          maskImage:
            "radial-gradient(600px circle at center, black, transparent)",
        }}
      >
        <DotPattern />
      </div>
      <BackgroundBeams />

      <HeroHighlight containerClassName="min-h-[calc(100dvh-4rem)] px-4 sm:min-h-[calc(100dvh-5rem)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1"
          >
            <AnimatedShinyText className="text-sm font-medium">
              AI-powered cold outreach
            </AnimatedShinyText>
          </motion.div>

          <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            <HeroWordReveal text="Personalized outreach in minutes" />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[65ch] text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Analyze any company URL, pick a hook, and get email plus LinkedIn
            copy ready to send.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={springHover}
            >
              <Link href="/signup">
                <ShimmerButton className="h-11 px-8 text-sm font-medium shadow-2xl">
                  Start for free
                </ShimmerButton>
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={springHover}
            >
              <Button variant="outline" size="lg" asChild>
                <Link href="#demo">See how it works</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </HeroHighlight>

      <motion.div
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "visible"}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.75 },
          },
        }}
        className="relative z-10 mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 pb-16"
      >
        {featurePills.map((pill) => (
          <motion.div
            key={pill}
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.9 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            whileHover={reduce ? undefined : { y: -2, scale: 1.04 }}
            transition={springHover}
          >
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-1.5 text-sm"
            >
              {pill}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
