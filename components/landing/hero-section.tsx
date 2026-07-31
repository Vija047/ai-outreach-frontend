"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { HeroHighlight } from "@/components/aceternity/hero-highlight";
import {
  AmbientGlow,
  springHover,
} from "@/components/landing/motion-primitives";
import { HeroUrlInput } from "@/components/landing/hero-url-input";
import { AppLogo } from "@/components/ui/logo";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const featurePills = ["Analyze", "Hooks", "Email", "LinkedIn"];

const headlineWords = [
  { text: "Paste" },
  { text: "a" },
  { text: "URL." },
  { text: "Get" },
  { text: "outreach", className: "text-primary" },
  { text: "ready", className: "text-primary" },
  { text: "to", className: "text-primary" },
  { text: "send.", className: "text-primary" },
];

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-x-hidden pt-16 sm:pt-20">
      <AmbientGlow
        className="-left-24 top-1/4 hidden size-72 bg-primary/20 sm:block"
        duration={9}
      />
      <AmbientGlow
        className="-right-16 top-1/3 hidden size-64 bg-cyan-500/15 sm:block"
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

      <HeroHighlight containerClassName="min-h-[calc(100dvh-4rem)] px-3 sm:min-h-[calc(100dvh-5rem)] sm:px-4">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex flex-col items-center gap-3 sm:mb-6"
          >
            <AppLogo height={100} width={260} imageClassName="h-16 sm:h-20 md:h-24 w-auto" />
            <div className="inline-flex max-w-full items-center rounded-full border border-border bg-muted/50 px-3 py-1 sm:px-4">
              <AnimatedShinyText className="text-xs font-medium sm:text-sm">
                AI-powered cold outreach
              </AnimatedShinyText>
            </div>
          </motion.div>

          {reduce ? (
            <h1 className="max-w-[18ch] text-balance text-2xl font-bold tracking-tighter text-foreground sm:max-w-none sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Paste a URL. Get outreach ready to send.
            </h1>
          ) : (
            <div className="flex w-full max-w-full justify-center overflow-hidden">
              <TypewriterEffectSmooth
                words={headlineWords}
                className="my-0 w-full justify-center"
                cursorClassName="bg-primary"
              />
            </div>
          )}

          <HeroUrlInput className="mt-6 w-full sm:mt-10" />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-6 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
          >
            <motion.div
              className="w-full sm:w-auto"
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={springHover}
            >
              <Link href="/signup" className="block w-full sm:inline-block sm:w-auto">
                <ShimmerButton className="h-11 w-full px-8 text-sm font-medium shadow-2xl sm:w-auto">
                  Start for free
                </ShimmerButton>
              </Link>
            </motion.div>
            <motion.div
              className="w-full sm:w-auto"
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={springHover}
            >
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
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
        className="relative z-10 mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-3 pb-12 sm:gap-3 sm:px-4 sm:pb-16"
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
              className="rounded-full px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm"
            >
              {pill}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
