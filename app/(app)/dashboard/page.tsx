"use client";

import { useEffect, useState } from "react";
import {
  IconMail,
  IconMessageReply,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { AppPageHeader } from "@/components/app/app-page-header";
import { AppPage } from "@/components/app/app-page";
import { CompanyAnalyzeComposer } from "@/components/app/company-analyze-composer";
import { CreditsRunway } from "@/components/app/credits-runway";
import { DashboardEmptyState } from "@/components/app/dashboard-empty-state";
import { DashboardQuickLinks } from "@/components/app/dashboard-quick-links";
import { HowItWorksStrip } from "@/components/app/how-it-works-strip";
import {
  OutreachDropoffNudge,
  RecentCompaniesList,
} from "@/components/app/recent-companies-list";
import { StatCard } from "@/components/app/stat-card";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { useCompanyAnalysis } from "@/hooks/use-company-analysis";
import { useAuth } from "@/contexts/auth-provider";
import { api } from "@/lib/api";
import type { AnalyticsSummary } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [statsError, setStatsError] = useState("");
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();
  const analysis = useCompanyAnalysis();

  useEffect(() => {
    api
      .getAnalytics()
      .then(setStats)
      .catch((err) => setStatsError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#analyze") {
      document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const companiesAnalyzed = stats?.companiesAnalyzed ?? 0;
  const emailsGenerated = stats?.emailsGenerated ?? 0;
  const showEmptyState = !loading && companiesAnalyzed === 0;
  const showDropoffNudge =
    !loading &&
    companiesAnalyzed > 0 &&
    emailsGenerated === 0 &&
    (stats?.pendingOutreach?.length ?? 0) > 0;
  const showHowItWorks = !loading && companiesAnalyzed < 3;

  function handleTrySample(url: string) {
    analysis.setUrl(url);
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AppPage size="sm" className="relative">
      <DotPattern
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
      />

      <AppPageHeader
        title="Home"
        description="Paste a prospect URL to research the company and find outreach hooks."
      />

      <CreditsRunway
        balance={stats?.creditsRemaining ?? null}
        plan={user?.plan}
        loading={loading}
      />

      <motion.section
        id="analyze"
        className="scroll-mt-20 sm:scroll-mt-24"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <CompanyAnalyzeComposer
          url={analysis.url}
          onUrlChange={analysis.setUrl}
          onSubmit={analysis.submit}
          submitting={analysis.submitting}
          error={analysis.error}
          onRetry={analysis.retry}
          canRetry={Boolean(analysis.lastUrl)}
          activeStep={analysis.activeStep}
          backendStep={analysis.backendStep}
          jobStatus={analysis.jobStatus}
          placeholder="Paste a company URL to analyze..."
        />
      </motion.section>

      {showHowItWorks ? <HowItWorksStrip /> : null}

      {showEmptyState ? (
        <DashboardEmptyState onTrySample={handleTrySample} />
      ) : null}

      {showDropoffNudge && stats ? (
        <OutreachDropoffNudge
          companies={stats.pendingOutreach}
          totalPending={stats.companiesWithoutOutreach}
          currentUserId={user?.id}
        />
      ) : null}

      {statsError ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {statsError}
        </p>
      ) : null}

      {!showEmptyState ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h2 className="text-sm font-medium text-muted-foreground">Your activity</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Companies analyzed"
              value={loading ? "—" : companiesAnalyzed}
              icon={<IconSearch className="size-4" stroke={1.5} />}
            />
            <StatCard
              label="Emails generated"
              value={loading ? "—" : emailsGenerated}
              icon={<IconMail className="size-4" stroke={1.5} />}
              hint={
                !loading && companiesAnalyzed > emailsGenerated
                  ? `${companiesAnalyzed - emailsGenerated} analyzed without outreach`
                  : undefined
              }
            />
            <StatCard
              label="Contacts found"
              value={loading ? "—" : (stats?.contactsFoundTotal ?? 0)}
              icon={<IconUsers className="size-4" stroke={1.5} />}
              hint="Verified emails on analyzed companies"
            />
          </div>
        </motion.div>
      ) : null}

      {!showEmptyState ? (
        <RecentCompaniesList
          companies={stats?.recentCompanies ?? []}
          loading={loading}
          currentUserId={user?.id}
        />
      ) : null}

      <DashboardQuickLinks />

      {!loading && (stats?.outreachSent ?? 0) > 0 ? (
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            highlight
            label="Overall reply rate"
            value={
              stats?.overallReplyRate != null
                ? `${stats.overallReplyRate}%`
                : "—"
            }
            icon={<IconMessageReply className="size-4" stroke={1.5} />}
            hint={`${stats?.repliesReceived ?? 0} replies from ${stats?.outreachSent ?? 0} sent`}
          />
          <StatCard
            label="Best tone (replies)"
            value={stats?.bestToneLabel ?? "—"}
            hint={
              stats?.bestToneReplyRate != null
                ? `${stats.bestToneReplyRate}% reply rate`
                : "Send more outreach to see tone stats"
            }
          />
          <StatCard
            label="Best hook (replies)"
            value={
              <span className="line-clamp-2 text-2xl font-sans font-semibold">
                {stats?.bestHookLabel ?? "—"}
              </span>
            }
            hint={
              stats?.bestHookReplyRate != null
                ? `${stats.bestHookReplyRate}% reply rate`
                : "Send more outreach to see hook stats"
            }
          />
        </motion.div>
      ) : null}

      {stats?.mostUsedTone ? (
        <p className="text-sm text-muted-foreground">
          Most used tone: {stats.mostUsedTone}
          {stats.mostUsedHook ? ` · Top hook: ${stats.mostUsedHook}` : ""}
        </p>
      ) : null}
    </AppPage>
  );
}
