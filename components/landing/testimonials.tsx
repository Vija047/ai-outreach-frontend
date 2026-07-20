"use client";

import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { FadeIn } from "@/components/landing/motion-primitives";

const testimonials = [
  {
    quote:
      "I used to spend 30 minutes researching each prospect. Now I paste a URL and have a personalized email in under two minutes.",
    name: "Priya Mehta",
    title: "SDR at CloudScale",
  },
  {
    quote:
      "The hook confidence scores changed how I prioritize outreach. I lead with funding news and my reply rates went up.",
    name: "Marcus Chen",
    title: "Freelance consultant",
  },
  {
    quote:
      "Our agency runs 40+ outreach campaigns a month. AI Outreach cut research time in half without losing quality.",
    name: "Elena Vasquez",
    title: "Founder, Pipeline Labs",
  },
  {
    quote:
      "LinkedIn DMs, connection notes, and follow-ups in one click. I copy, paste, and move to the next prospect.",
    name: "James Okonkwo",
    title: "Business development rep",
  },
  {
    quote:
      "The templates library means I start from a proven structure and let AI fill in the company-specific details.",
    name: "Sofia Lindstrom",
    title: "Agency owner",
  },
  {
    quote:
      "Twenty free credits let me test the full workflow before committing. The analyze step alone saved me hours.",
    name: "Daniel Park",
    title: "Independent seller",
  },
];

export function Testimonials() {
  return (
    <section className="overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32">
      <FadeIn className="mx-auto mb-8 max-w-2xl px-4 text-center sm:mb-12 md:px-6">
        <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
          Hear from sellers in the field
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Freelancers, SDRs, and agency founders use AI Outreach to research
          faster and write better first messages.
        </p>
      </FadeIn>
      <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
    </section>
  );
}
