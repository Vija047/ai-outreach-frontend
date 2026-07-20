import {
  IconArrowRight,
  IconMail,
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react";

const STEPS = [
  {
    icon: IconSearch,
    title: "Paste URL",
    body: "We research the site and recent news.",
  },
  {
    icon: IconSparkles,
    title: "Review hooks",
    body: "Pick a fact-backed hook with sources.",
  },
  {
    icon: IconMail,
    title: "Generate outreach",
    body: "Get email, LinkedIn, and follow-ups.",
  },
] as const;

export function HowItWorksStrip() {
  return (
    <section
      aria-label="How it works"
      className="rounded-xl border border-border/70 bg-card/50 p-4 md:p-5"
    >
      <p className="mb-4 text-sm font-medium text-foreground">How it works</p>
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <step.icon className="size-4" stroke={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {index + 1}. {step.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
            {index < STEPS.length - 1 ? (
              <IconArrowRight
                className="mt-2 hidden size-4 shrink-0 text-muted-foreground/40 md:ml-auto md:block"
                stroke={1.5}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
