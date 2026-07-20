"use client";

import { motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/landing/motion-primitives";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Badge } from "@/components/ui/badge";

const genericMessage = `Hi there,

I wanted to reach out about our services. We help companies grow with technology solutions.

Would you be open to a quick call this week?

Best,
Alex`;

const personalizedMessage = `Hi Sarah,

Congrats on Acme's Series B and the new Austin plant. Scaling a robotics team that fast is no small feat.

We help industrial automation companies ship AI-powered outreach systems faster. Given your 12 open engineering roles, I thought a 15-minute chat could be useful.

Open to connecting this week?

Best,
Alex`;

export function FeatureOutreachDiff() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-border bg-muted/10 py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeIn className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            From generic to personalized
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Pick a hook and get email, LinkedIn DM, connection note, subject
            lines, and follow-ups in one generation.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduce ? undefined : { y: -3 }}
            className="relative rounded-xl border border-border bg-card p-4 sm:p-6"
          >
            <Badge variant="outline" className="mb-4">
              Before
            </Badge>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {genericMessage}
            </pre>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduce ? undefined : { y: -3 }}
            className="relative overflow-hidden rounded-xl border border-primary/30 bg-card p-4 sm:p-6"
          >
            <BorderBeam colorFrom="#2563eb" colorTo="#38bdf8" />
            <Badge className="mb-4">After</Badge>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground sm:text-sm">
              {personalizedMessage}
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
