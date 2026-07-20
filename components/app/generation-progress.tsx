"use client";

import { useEffect, useState } from "react";

import { IconLoader2 } from "@tabler/icons-react";

const GENERATION_STEPS = [
  "Writing email…",
  "Writing LinkedIn message…",
  "Drafting follow-ups…",
  "Finalizing…",
];

interface GenerationProgressProps {
  active: boolean;
}

export function GenerationProgress({ active }: GenerationProgressProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) =>
        prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev,
      );
    }, 2200);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <IconLoader2 className="size-4 animate-spin text-primary" />
      {GENERATION_STEPS[stepIndex]}
    </div>
  );
}
