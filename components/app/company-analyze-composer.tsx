"use client";

import { FormEvent, KeyboardEvent, useRef } from "react";
import {
  IconArrowUp,
  IconCoin,
  IconLink,
  IconWorld,
} from "@tabler/icons-react";

import { AnalysisStepper } from "@/components/app/analysis-stepper";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompanyAnalyzeComposerProps {
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  submitting?: boolean;
  error?: string;
  onRetry?: () => void;
  canRetry?: boolean;
  activeStep?: number;
  backendStep?: import("@/lib/types").AnalysisJobStep | null;
  jobStatus?: string;
  placeholder?: string;
  className?: string;
}

export function CompanyAnalyzeComposer({
  url,
  onUrlChange,
  onSubmit,
  submitting = false,
  error,
  onRetry,
  canRetry,
  activeStep,
  backendStep,
  jobStatus,
  placeholder = "Paste a company URL to analyze...",
  className,
}: CompanyAnalyzeComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = url.trim().length > 0 && !submitting;

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) void onSubmit();
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    await onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full space-y-4", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.25rem] border border-border/70 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow focus-within:shadow-[0_12px_40px_rgb(0,0,0,0.08)] sm:rounded-[1.75rem] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] dark:focus-within:shadow-[0_12px_40px_rgb(0,0,0,0.45)]",
          submitting && "opacity-95",
        )}
      >
        <BorderBeam size={220} duration={18} colorFrom="#2563eb" colorTo="#38bdf8" />

        <textarea
          ref={textareaRef}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={submitting}
          rows={3}
          aria-label="Company website URL"
          className="block min-h-[6.5rem] w-full resize-none bg-transparent px-4 pt-4 pb-3 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[7.5rem] sm:px-5 sm:pt-5"
        />

        <div className="flex flex-col gap-3 px-3 pb-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:pb-4">
          <div className="flex flex-wrap items-center gap-1">
            <span
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground"
              title="Paste any company homepage or careers URL"
            >
              <IconLink className="size-5" stroke={1.5} />
            </span>
            <span
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground"
              title="AI researches the site and recent news"
            >
              <IconWorld className="size-5" stroke={1.5} />
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2.5 py-1 text-xs text-muted-foreground"
            >
              <IconCoin className="size-3.5" stroke={1.5} />
              1 credit per new domain
            </span>
          </div>

          <button
            type="submit"
            disabled={!canSend}
            aria-label="Analyze company"
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 self-end sm:self-auto",
              canSend
                ? "bg-primary text-primary-foreground shadow-md hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            <IconArrowUp className="size-5" stroke={2} />
          </button>
        </div>
      </div>

      {submitting ? (
        <AnalysisStepper
          activeStep={activeStep}
          backendStep={backendStep}
          status={jobStatus}
        />
      ) : null}

      {error ? (
        <div className="space-y-2">
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
          {canRetry && onRetry ? (
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Retry analysis
            </Button>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
