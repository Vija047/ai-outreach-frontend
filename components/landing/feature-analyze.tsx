"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/landing/motion-primitives";
import { BorderBeam } from "@/components/magicui/border-beam";

const terminalLines = [
  { text: '$ curl -X POST /api/v1/company/analyze', delay: 0 },
  { text: '  -d \'{"url": "https://acme.com"}\'', delay: 400 },
  { text: "", delay: 800 },
  { text: "→ jobId: job_8f2k9x", delay: 1200 },
  { text: "→ status: QUEUED", delay: 1600 },
  { text: "→ status: RUNNING", delay: 2200 },
  { text: "→ status: DONE", delay: 3000 },
  { text: "", delay: 3400 },
  { text: "Company: Acme Robotics", delay: 3800 },
  { text: "Industry: Industrial automation", delay: 4200 },
  { text: "Hooks found: 3", delay: 4600 },
  { text: "  • Series B funding (0.92)", delay: 5000 },
  { text: "  • New plant in Austin (0.87)", delay: 5400 },
  { text: "  • Hiring 12 engineers (0.81)", delay: 5800 },
];

export function FeatureAnalyze() {
  const reduce = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(
    reduce ? terminalLines.length : 0,
  );

  useEffect(() => {
    if (reduce) return;

    const timers = terminalLines.map((line, index) =>
      setTimeout(() => setVisibleCount(index + 1), line.delay),
    );

    const resetTimer = setInterval(() => {
      setVisibleCount(0);
      terminalLines.forEach((line, index) => {
        setTimeout(() => setVisibleCount(index + 1), line.delay);
      });
    }, 9000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(resetTimer);
    };
  }, [reduce]);

  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-12 md:grid-cols-2 md:px-6">
        <FadeIn direction="left" className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Your AI partner for every prospect
          </h2>
          <p className="mt-4 max-w-[65ch] leading-relaxed text-muted-foreground">
            Paste a company URL and AI Outreach scrapes the site, pulls recent
            news, and surfaces personalization hooks ranked by confidence.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Maps to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              POST /company/analyze
            </code>
          </p>
        </FadeIn>

        <FadeIn direction="right" delay={0.1} className="min-w-0">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-green-400 shadow-2xl sm:p-6 sm:text-sm"
          >
            <BorderBeam size={250} duration={12} />
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-yellow-500/80" />
              <span className="size-3 rounded-full bg-green-500/80" />
              <span className="ml-2 truncate text-xs text-zinc-500">
                analyze.sh
              </span>
            </div>
            <div className="min-h-[220px] space-y-1 overflow-x-auto sm:min-h-[280px]">
              {terminalLines.slice(0, visibleCount).map((line, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, x: -4 }}
                  animate={reduce ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-pre-wrap break-all sm:break-normal"
                >
                  {line.text || "\u00A0"}
                </motion.div>
              ))}
              {!reduce && visibleCount < terminalLines.length && (
                <span className="inline-block h-4 w-2 animate-pulse bg-green-400" />
              )}
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
