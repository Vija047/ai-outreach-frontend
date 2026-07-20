"use client";

import { Button } from "@/components/ui/button";

const SAMPLE_URL = "stripe.com";

interface DashboardEmptyStateProps {
  onTrySample: (url: string) => void;
}

export function DashboardEmptyState({ onTrySample }: DashboardEmptyStateProps) {
  return (
    <section className="rounded-xl border border-dashed border-border bg-muted/30 px-5 py-6 text-center">
      <p className="text-sm font-medium text-foreground">
        You haven&apos;t analyzed a company yet
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Paste a URL above to get started. Each analysis finds personalization hooks
        with source links so you can verify before generating outreach.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => onTrySample(SAMPLE_URL)}
      >
        Try {SAMPLE_URL}
      </Button>
    </section>
  );
}
