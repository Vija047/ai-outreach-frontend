"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import {
  FadeIn,
  HoverLift,
  springHover,
} from "@/components/landing/motion-primitives";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for trying the full workflow",
    features: [
      "20 signup credits",
      "1 credit per company analyze",
      "1 credit per generation",
      "Email + LinkedIn + follow-ups",
      "Templates library",
      "Generation history",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 29, annual: 24 },
    description: "For sellers who outreach daily",
    features: [
      "Unlimited analyze and generate",
      "No credit deductions",
      "Priority processing",
      "All Free plan features",
      "Advanced analytics",
      "Early access to integrations",
    ],
    cta: "Upgrade to Pro",
    href: "/signup?plan=pro",
    popular: true,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const reduce = useReducedMotion();

  return (
    <section
      id="pricing"
      className="border-y border-border bg-muted/10 py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeIn className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Build more. Pay less. Scale smart.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Start with 20 free credits. Upgrade when outreach becomes part of
            your daily workflow.
          </p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 inline-flex rounded-lg border border-border p-1"
          >
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-md px-4 py-2 text-sm transition-colors",
                !annual
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-md px-4 py-2 text-sm transition-colors",
                annual
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Annually
            </button>
          </motion.div>
        </FadeIn>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <HoverLift className="h-full">
                <Card
                  className={cn(
                    "relative flex h-full flex-col transition-shadow hover:shadow-xl",
                    plan.popular &&
                      "border-primary shadow-lg shadow-primary/10",
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <motion.div
                      key={annual ? "annual" : "monthly"}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={reduce ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pt-4"
                    >
                      <span className="text-4xl font-bold">
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <IconCheck
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            stroke={1.5}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {plan.popular ? (
                      <Link href={plan.href} className="w-full">
                        <motion.div
                          whileHover={reduce ? undefined : { scale: 1.02 }}
                          whileTap={reduce ? undefined : { scale: 0.98 }}
                          transition={springHover}
                        >
                          <ShimmerButton className="h-10 w-full text-sm">
                            {plan.cta}
                          </ShimmerButton>
                        </motion.div>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={plan.href}>{plan.cta}</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </HoverLift>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
