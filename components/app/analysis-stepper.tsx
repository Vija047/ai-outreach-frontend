"use client";

import { IconCheck, IconLoader2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import type { AnalysisJobStep } from "@/lib/types";

const STEPS = [
  { id: 1, label: "Reading site", backendStep: "SCRAPING" as AnalysisJobStep },
  { id: 2, label: "Finding hooks", backendStep: "ENRICHING" as AnalysisJobStep },
  { id: 3, label: "Preparing profile", backendStep: "ANALYZING" as AnalysisJobStep },
  { id: 4, label: "Finding contacts", backendStep: "DISCOVERING_CONTACTS" as AnalysisJobStep },
] as const;

function stepIndexFromBackend(step?: AnalysisJobStep | null, status?: string): number {
  if (status === "DONE") return 4;
  if (step === "DISCOVERING_CONTACTS" || step === "SAVING") return 4;
  if (step === "ANALYZING") return 3;
  if (step === "ENRICHING") return 2;
  if (step === "SCRAPING" || status === "RUNNING" || status === "QUEUED") return 1;
  return 1;
}

interface AnalysisStepperProps {
  activeStep?: number;
  backendStep?: AnalysisJobStep | null;
  status?: string;
}

export function AnalysisStepper({
  activeStep,
  backendStep,
  status,
}: AnalysisStepperProps) {
  const current =
    activeStep ?? stepIndexFromBackend(backendStep, status);

  return (
    <ol className="space-y-3">
      {STEPS.map((step) => {
        const isComplete = step.id < current;
        const isActive = step.id === current;

        return (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-3 text-sm",
              isComplete && "text-muted-foreground",
              isActive && "font-medium text-foreground",
              !isComplete && !isActive && "text-muted-foreground/60",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border",
                isComplete && "border-primary/30 bg-primary/10 text-primary",
                isActive && "border-primary bg-primary/10 text-primary",
              )}
            >
              {isComplete ? (
                <IconCheck className="size-3.5" />
              ) : isActive ? (
                <IconLoader2 className="size-3.5 animate-spin" />
              ) : (
                <span className="text-xs">{step.id}</span>
              )}
            </span>
            {step.label}
            {isActive && "…"}
          </li>
        );
      })}
    </ol>
  );
}
