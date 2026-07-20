import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RecentCompanyActivity } from "@/lib/types";

function companyFavicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
}

function companyLabel(company: RecentCompanyActivity) {
  return company.name ?? company.domain;
}

function formatActivityDate(iso?: string | null) {
  if (!iso) return "Recently";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function normalizeReviewerName(name?: string | null) {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "Unknown user";
}

function reviewerInitials(name?: string | null) {
  const safeName = normalizeReviewerName(name);
  const parts = safeName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function reviewerLabel(
  company: RecentCompanyActivity,
  currentUserId?: string | null,
) {
  const name = normalizeReviewerName(company.reviewedByName);
  if (currentUserId && company.reviewedByUserId === currentUserId) {
    return "You";
  }
  return name;
}

function activityMeta(
  company: RecentCompanyActivity,
  currentUserId?: string | null,
) {
  const reviewedWhen = company.reviewedAt ?? company.analyzedAt;
  const parts = [
    `Reviewed by ${reviewerLabel(company, currentUserId)}`,
    formatActivityDate(reviewedWhen),
  ];

  if (company.emailsGenerated > 0) {
    parts.push(
      `${company.emailsGenerated} email${company.emailsGenerated === 1 ? "" : "s"} generated`,
    );
  } else {
    parts.push("No outreach yet");
  }

  if (company.contactsFound > 0) {
    parts.push(
      `${company.contactsFound} contact${company.contactsFound === 1 ? "" : "s"} found`,
    );
  }

  return parts.join(" · ");
}

interface OutreachDropoffNudgeProps {
  companies: RecentCompanyActivity[];
  totalPending: number;
  currentUserId?: string | null;
}

export function OutreachDropoffNudge({
  companies,
  totalPending,
  currentUserId,
}: OutreachDropoffNudgeProps) {
  if (companies.length === 0) return null;

  return (
    <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-4 sm:px-5">
      <p className="text-sm font-medium text-foreground">
        You&apos;ve analyzed {totalPending}{" "}
        {totalPending === 1 ? "company" : "companies"} but haven&apos;t generated
        outreach yet
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Open a company, pick a hook, then hit Generate outreach to finish the flow.
      </p>
      <ul className="mt-4 space-y-2">
        {companies.slice(0, 5).map((company) => (
          <li key={company.id}>
            <Link
              href={`/companies/${company.id}`}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <img
                src={companyFavicon(company.domain)}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-sm bg-muted object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{companyLabel(company)}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground sm:truncate">
                  {activityMeta(company, currentUserId)}
                </p>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Continue
              </span>
              <IconArrowRight className="size-4 shrink-0 text-primary" stroke={1.5} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface RecentCompaniesListProps {
  companies: RecentCompanyActivity[];
  loading?: boolean;
  currentUserId?: string | null;
}

export function RecentCompaniesList({
  companies,
  loading,
  currentUserId,
}: RecentCompaniesListProps) {
  if (loading) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Recent activity</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted sm:h-14" />
          ))}
        </div>
      </section>
    );
  }

  if (companies.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Recent activity</h2>
        <Button variant="ghost" size="sm" className="h-8 shrink-0 text-xs" asChild>
          <Link href="/history">All history</Link>
        </Button>
      </div>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {companies.map((company) => {
          const reviewerName = normalizeReviewerName(company.reviewedByName);

          return (
            <li key={company.id}>
              <Link
                href={`/companies/${company.id}`}
                className="flex flex-col gap-3 px-3 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-3 sm:px-4"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                  <img
                    src={companyFavicon(company.domain)}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 shrink-0 rounded-md bg-muted object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {companyLabel(company)}
                      </p>
                      <span
                        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
                        title={reviewerName}
                      >
                        {reviewerInitials(reviewerName)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground sm:line-clamp-1">
                      {activityMeta(company, currentUserId)}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "w-full shrink-0 rounded-md border border-border px-2.5 py-1.5 text-center text-xs font-medium sm:w-auto",
                    company.hasOutreach
                      ? "text-muted-foreground"
                      : "border-primary/30 bg-primary/10 text-primary",
                  )}
                >
                  {company.hasOutreach ? "View" : "Continue"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
