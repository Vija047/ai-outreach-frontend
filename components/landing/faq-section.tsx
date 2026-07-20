"use client";

import { motion, useReducedMotion } from "motion/react";

import { FadeIn, StaggerItem, StaggerReveal } from "@/components/landing/motion-primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What does AI Outreach do?",
    answer:
      "AI Outreach researches prospect companies from a URL, surfaces personalization hooks, and generates email, LinkedIn, connection note, subject lines, and follow-up messages tailored to your seller profile.",
  },
  {
    question: "How do credits work?",
    answer:
      "New accounts get 20 signup credits. Each new company analysis costs 1 credit and each outreach generation costs 1 credit. Cached domains may not charge again. Pro plan users skip credit deductions entirely.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your account data and generation history are stored securely. Passwords are hashed with bcrypt. API access requires JWT authentication. We do not share your outreach data with third parties.",
  },
  {
    question: "Can I connect Gmail or my CRM?",
    answer:
      "Gmail, Outlook, and CRM integrations are coming soon. For now, copy generated messages and send through your existing tools.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Every new account starts with 20 free credits, enough to analyze several companies and generate multiple outreach messages before upgrading.",
  },
  {
    question: "How does AI Outreach save me time?",
    answer:
      "Instead of manually reading company websites and news, you paste a URL and get ranked hooks plus ready-to-send copy in under two minutes.",
  },
];

export function FaqSection() {
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <FadeIn className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Answers to common questions about AI Outreach. Contact us if you
            need anything else.
          </p>
        </FadeIn>

        <StaggerReveal amount={0.15}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <StaggerItem key={faq.question}>
                <motion.div
                  whileHover={reduce ? undefined : { x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <AccordionItem value={`item-${i}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              </StaggerItem>
            ))}
          </Accordion>
        </StaggerReveal>
      </div>
    </section>
  );
}
