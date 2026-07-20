"use client";

import {
  IconChartBar,
  IconHistory,
  IconMail,
  IconSearch,
  IconTemplate,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import {
  FadeIn,
  StaggerItem,
  StaggerReveal,
} from "@/components/landing/motion-primitives";
import { BentoGrid, BentoGridItem } from "@/components/magicui/bento-grid";

export function FeatureWorkflowBento() {
  const reduce = useReducedMotion();

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeIn className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Research, hook, generate, repeat
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            One workflow covers company research, hook selection, multi-channel
            output, templates, and history.
          </p>
        </FadeIn>

        <StaggerReveal>
          <BentoGrid className="md:auto-rows-[20rem]">
            <StaggerItem className="md:col-span-2">
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-full"
              >
                <BentoGridItem
                  className="h-full bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10"
                  title="Company research"
                  description="Firecrawl scrapes the site while Tavily pulls recent news. OpenAI extracts industry, mission, and tech stack."
                  header={
                    <div className="flex h-28 items-center justify-center rounded-lg bg-zinc-900/50 font-mono text-xs text-blue-300">
                      acme.com → summary + techStack + news
                    </div>
                  }
                  icon={
                    <IconSearch className="size-5 text-primary" stroke={1.5} />
                  }
                />
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-full"
              >
                <BentoGridItem
                  className="h-full bg-gradient-to-t from-primary/5 to-transparent"
                  title="Hook confidence scores"
                  description="Personalization angles ranked 0-1 so you lead with the strongest opener."
                  header={
                    <div className="space-y-2 p-2">
                      {[
                        { label: "Series B funding", score: 0.92 },
                        { label: "New Austin plant", score: 0.87 },
                        { label: "12 open roles", score: 0.81 },
                      ].map((hook) => (
                        <div
                          key={hook.label}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div className="h-1.5 flex-1 rounded-full bg-muted">
                            <motion.div
                              className="h-full rounded-full bg-primary"
                              initial={reduce ? false : { width: 0 }}
                              whileInView={
                                reduce
                                  ? undefined
                                  : { width: `${hook.score * 100}%` }
                              }
                              viewport={{ once: true, amount: 0.8 }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                          </div>
                          <span className="w-24 truncate text-muted-foreground">
                            {hook.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  }
                  icon={
                    <IconChartBar className="size-5 text-primary" stroke={1.5} />
                  }
                />
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-full"
              >
                <BentoGridItem
                  className="h-full"
                  title="Multi-channel generation"
                  description="Email, LinkedIn DM, connection note, 3 subject lines, and 2 follow-ups in one call."
                  header={
                    <div className="flex flex-wrap gap-2 p-2">
                      {["Email", "LinkedIn", "Follow-up 1", "Follow-up 2"].map(
                        (channel, index) => (
                          <motion.span
                            key={channel}
                            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                            whileInView={
                              reduce ? undefined : { opacity: 1, scale: 1 }
                            }
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.35,
                              delay: 0.15 + index * 0.06,
                            }}
                            className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs"
                          >
                            {channel}
                          </motion.span>
                        ),
                      )}
                    </div>
                  }
                  icon={
                    <IconMail className="size-5 text-primary" stroke={1.5} />
                  }
                />
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-full"
              >
                <BentoGridItem
                  className="h-full"
                  title="Templates library"
                  description="Start from system templates or save your own for repeat outreach."
                  header={
                    <div className="rounded-lg border border-dashed border-border p-4 font-mono text-xs text-muted-foreground">
                      Hi {"{{name}}"}, saw {"{{hook}}"}...
                    </div>
                  }
                  icon={
                    <IconTemplate className="size-5 text-primary" stroke={1.5} />
                  }
                />
              </motion.div>
            </StaggerItem>
            <StaggerItem className="md:col-span-2">
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-full"
              >
                <BentoGridItem
                  className="h-full bg-gradient-to-br from-zinc-900/50 to-transparent dark:from-zinc-800/30"
                  title="History and analytics"
                  description="Track past generations, most-used tones, and credit balance from your dashboard."
                  header={
                    <div className="grid grid-cols-3 gap-2 p-2 text-center sm:gap-3">
                      {[
                        { label: "Generated", value: "47" },
                        { label: "Analyzed", value: "23" },
                        { label: "Credits", value: "12" },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={reduce ? false : { opacity: 0, y: 12 }}
                          whileInView={
                            reduce ? undefined : { opacity: 1, y: 0 }
                          }
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.1 + index * 0.08,
                          }}
                          className="rounded-lg bg-muted/30 p-2 sm:p-3"
                        >
                          <div className="text-xl font-bold sm:text-2xl">
                            {stat.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  }
                  icon={
                    <IconHistory className="size-5 text-primary" stroke={1.5} />
                  }
                />
              </motion.div>
            </StaggerItem>
          </BentoGrid>
        </StaggerReveal>
      </div>
    </section>
  );
}
