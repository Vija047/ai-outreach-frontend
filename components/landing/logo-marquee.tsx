"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { FadeIn } from "@/components/landing/motion-primitives";
import { Marquee } from "@/components/magicui/marquee";

const logos = [
  { name: "Stripe", slug: "stripe" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Notion", slug: "notion" },
  { name: "Salesforce", slug: "salesforce" },
  { name: "Slack", slug: "slack" },
  { name: "Intercom", slug: "intercom" },
  { name: "Mailchimp", slug: "mailchimp" },
  { name: "Zapier", slug: "zapier" },
];

export function LogoMarquee() {
  const reduce = useReducedMotion();

  return (
    <FadeIn amount={0.4}>
      <section className="border-y border-border bg-muted/20 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-6 text-center text-sm text-muted-foreground sm:mb-8">
            Trusted by sellers and agencies
          </p>
          <Marquee pauseOnHover className="[--duration:30s]">
            {logos.map((logo) => (
              <motion.div
                key={logo.slug}
                whileHover={reduce ? undefined : { scale: 1.08, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="mx-8 flex h-10 w-28 items-center justify-center opacity-60 grayscale transition-opacity hover:opacity-100"
              >
                <Image
                  src={`https://cdn.simpleicons.org/${logo.slug}/888888`}
                  alt={logo.name}
                  width={96}
                  height={32}
                  className="h-8 w-auto dark:invert"
                  style={{ width: "auto", height: "2rem" }}
                  unoptimized
                />
              </motion.div>
            ))}
          </Marquee>
        </div>
      </section>
    </FadeIn>
  );
}
