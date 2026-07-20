"use client";

import { IconClock, IconCoin, IconMessages } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/landing/motion-primitives";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: IconCoin,
    value: "20",
    label: "Free signup credits",
    detail: "Enough to analyze and generate outreach for your first prospects.",
  },
  {
    icon: IconMessages,
    value: "5",
    label: "Output channels",
    detail: "Email, LinkedIn DM, connection note, subject lines, and follow-ups.",
  },
  {
    icon: IconClock,
    value: "< 2 min",
    label: "First outreach ready",
    detail: "From URL paste to copy-ready messages in under two minutes.",
  },
];

export function StatsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-border bg-muted/10 py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeIn className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Built for sellers who move fast
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Real limits from the backend. No vanity metrics, just what you get
            on day one.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reduce ? undefined : { y: -4 }}
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="pt-6">
                  <motion.div
                    initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                    whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  >
                    <stat.icon
                      className="mb-4 size-8 text-primary"
                      stroke={1.5}
                    />
                  </motion.div>
                  <div className="text-4xl font-bold tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-medium">{stat.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {stat.detail}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
