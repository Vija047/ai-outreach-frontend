"use client";

import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Company, CompanyHook } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HooksPanelProps {
  hooks: CompanyHook[];
  company: Company;
  selectedHookId?: string;
  onSelectHook: (hookId: string) => void;
}

function getSourceLabel(hook: CompanyHook): string {
  if (hook.sourceType === "NEWS") return "From news";
  if (hook.sourceType === "WEBSITE") return "From homepage";
  return "Source";
}

function formatRelativeDate(dateStr?: string | null): string {
  if (!dateStr) return "recently";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function getSourceDateLabel(hook: CompanyHook, company: Company): string {
  const dateSource =
    hook.sourceType === "NEWS" ? hook.createdAt : company.analyzedAt;
  return `${getSourceLabel(hook)}, analyzed ${formatRelativeDate(dateSource)}`;
}

function getSourceUrl(hook: CompanyHook, company: Company): string | null {
  return hook.sourceUrl ?? company.websiteUrl ?? null;
}

export function HooksPanel({
  hooks,
  company,
  selectedHookId,
  onSelectHook,
}: HooksPanelProps) {
  const topHooks = hooks.slice(0, 3);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Personalization hooks</CardTitle>
        <CardDescription>
          Facts we found on their site and in the news — review sources, pick
          one, then generate outreach.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {topHooks.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              No strong hooks found on this page.
            </p>
            <p className="mt-1">
              The site may be sparse or mostly visual. Try analyzing their
              /about or /news page, or generate using company summary only.
            </p>
            <Link
              href="/analyze"
              className="mt-3 inline-block text-primary hover:underline"
            >
              Analyze a different URL
            </Link>
          </div>
        ) : (
          topHooks.map((hook) => {
            const sourceUrl = getSourceUrl(hook, company);
            return (
              <button
                key={hook.id}
                type="button"
                onClick={() => onSelectHook(hook.id)}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  selectedHookId === hook.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 font-medium">{hook.title}</span>
                  <Badge variant="outline" className="shrink-0">
                    {(hook.confidence * 100).toFixed(0)}% match
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {hook.description}
                </p>
                {hook.excerpt && hook.excerpt !== hook.description && (
                  <p className="mt-2 border-l-2 border-primary/30 pl-3 text-xs italic text-muted-foreground">
                    &ldquo;{hook.excerpt}&rdquo;
                  </p>
                )}
                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <IconExternalLink className="size-3.5" />
                    {getSourceLabel(hook)} — view source
                  </a>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Source: company website
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {getSourceDateLabel(hook, company)}
                </p>
              </button>
            );
          })
        )}
        {hooks.length > 3 && (
          <p className="text-xs text-muted-foreground">
            Showing top 3 of {hooks.length} hooks by confidence.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
