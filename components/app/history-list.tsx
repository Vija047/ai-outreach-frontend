"use client";

import Link from "next/link";
import {
  IconArrowRight,
  IconClock,
  IconMail,
  IconSearch,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Generation } from "@/lib/types";

function companyFavicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
}

function companyLabel(item: Generation) {
  return item.company?.name ?? item.company?.domain ?? "Unknown company";
}

function formatHistoryDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTone(tone: string) {
  if (!tone) return "Direct";
  return tone.charAt(0).toUpperCase() + tone.slice(1).toLowerCase();
}

function replyBadge(outcome?: Generation["replyOutcome"], sentAt?: string | null) {
  if (!sentAt) return null;

  if (outcome === "YES") {
    return (
      <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
        Replied
      </span>
    );
  }

  if (outcome === "NO") {
    return (
      <span className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
        No reply
      </span>
    );
  }

  return (
    <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      Sent
    </span>
  );
}

interface HistorySummaryProps {
  items: Generation[];
  total: number;
}

export function HistorySummary({ items, total }: HistorySummaryProps) {
  const uniqueCompanies = new Set(
    items.map((item) => item.companyId || item.company?.id).filter(Boolean),
  ).size;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconMail className="size-3.5" stroke={1.5} />
          Generations
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
          {total}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconSearch className="size-3.5" stroke={1.5} />
          Companies
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
          {uniqueCompanies}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconClock className="size-3.5" stroke={1.5} />
          Latest
        </p>
        <p className="mt-1 truncate text-sm font-medium">
          {items[0] ? formatHistoryDate(items[0].createdAt) : "-"}
        </p>
      </div>
    </div>
  );
}

export function HistoryListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[76px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[72px] animate-pulse border-b border-border bg-muted/40 last:border-b-0"
          />
        ))}
      </div>
    </div>
  );
}

export function HistoryEmptyState() {
  return (
    <section className="rounded-xl border border-dashed border-border bg-muted/30 px-5 py-8 text-center">
      <p className="text-sm font-medium text-foreground">No outreach yet</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Generated emails and LinkedIn messages show up here. Analyze a company,
        pick a hook, then generate outreach to build your history.
      </p>
      <Button variant="outline" size="sm" className="mt-4" asChild>
        <Link href="/dashboard#analyze">Analyze a company</Link>
      </Button>
    </section>
  );
}

interface HistoryListProps {
  items: Generation[];
}

export function HistoryList({ items }: HistoryListProps) {
  const reduce = useReducedMotion();

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {items.map((item, index) => {
        const domain = item.company?.domain ?? "";
        const hookTitle = item.hook?.title ?? "No hook selected";

        return (
          <motion.li
            key={item.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              href={`/history/${item.id}`}
              className="group flex flex-col gap-3 px-3 py-3.5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-4 sm:px-4"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                {domain ? (
                  <img
                    src={companyFavicon(domain)}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 shrink-0 rounded-md bg-muted object-contain"
                  />
                ) : (
                  <div className="size-7 shrink-0 rounded-md bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {companyLabel(item)}
                    </p>
                    <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {formatTone(item.tone)}
                    </span>
                    {replyBadge(item.replyOutcome, item.sentAt)}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:line-clamp-1">
                    {hookTitle}
                  </p>
                  {item.contact?.name ? (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
                      To {item.contact.name}
                      {item.contact.title ? `, ${item.contact.title}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:justify-end">
                <time
                  dateTime={item.createdAt}
                  className="text-xs text-muted-foreground tabular-nums"
                >
                  {formatHistoryDate(item.createdAt)}
                </time>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    "group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary",
                  )}
                >
                  Open
                  <IconArrowRight className="size-3.5" stroke={1.5} />
                </span>
              </div>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
