"use client";

import { IconLink, IconSparkles, IconUserCircle } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/landing/motion-primitives";

const steps = [
  {
    icon: IconUserCircle,
    title: "Create profile",
    description:
      "Set your role, services, value proposition, and tone so every message sounds like you.",
  },
  {
    icon: IconLink,
    title: "Analyze prospect",
    description:
      "Paste a company URL. AI scrapes the site, pulls news, and ranks personalization hooks.",
  },
  {
    icon: IconSparkles,
    title: "Generate outreach",
    description:
      "Pick a hook and copy email, LinkedIn, connection note, subject lines, and follow-ups.",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeIn className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Setup. Analyze. Generate.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Three steps from signup to copy-ready outreach.
          </p>
        </FadeIn>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16.666%] right-[16.666%] top-12 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="relative rounded-xl border border-border bg-card p-6 sm:p-8"
            >
              <motion.div
                initial={reduce ? false : { scale: 0, rotate: -12 }}
                whileInView={reduce ? undefined : { scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                  delay: 0.1 + i * 0.1,
                }}
                className="mb-6 flex size-12 items-center justify-center rounded-lg bg-primary/10"
              >
                <step.icon className="size-6 text-primary" stroke={1.5} />
              </motion.div>
              <span className="mb-2 inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
