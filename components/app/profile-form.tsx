"use client";

import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  IconBriefcase,
  IconCheck,
  IconLink,
  IconLogout,
  IconSparkles,
  IconTarget,
  IconUser,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { AppPageHeader } from "@/components/app/app-page-header";
import { AppPage } from "@/components/app/app-page";
import { guessDefaultPhoneCountry, PhoneInput } from "@/components/app/phone-input";
import { BorderBeam } from "@/components/magicui/border-beam";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-provider";
import { api, ApiError, isProfileComplete } from "@/lib/api";
import { formatPhoneDisplay } from "@/lib/phone-countries";
import { cn } from "@/lib/utils";

const TONE_OPTIONS = [
  "Professional",
  "Direct",
  "Consultative",
  "Casual",
] as const;

function ProfileField({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof IconUser;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-5 md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" stroke={1.5} />
        </span>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function ProfileForm() {
  const { user, profile, refreshProfile, logout } = useAuth();
  const reduce = useReducedMotion();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [services, setServices] = useState("");
  const [targetCustomers, setTargetCustomers] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [tone, setTone] = useState("Professional");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState(guessDefaultPhoneCountry());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setRole(profile.role ?? "");
    setCompany(profile.company ?? "");
    setServices(profile.services?.join(", ") ?? "");
    setTargetCustomers(profile.targetCustomers ?? "");
    setValueProposition(profile.valueProposition ?? "");
    setTone(profile.tone ?? "Professional");
    setPortfolioUrl(profile.portfolioUrl ?? "");
    setPhoneCountryCode(profile.phoneCountryCode ?? guessDefaultPhoneCountry());
    setPhoneNumber(profile.phoneNumber ?? "");
  }, [profile]);

  const completion = useMemo(() => {
    const checks = [
      Boolean(role.trim()),
      Boolean(company.trim()),
      Boolean(services.trim()),
      Boolean(targetCustomers.trim()),
      Boolean(valueProposition.trim()),
    ];
    const done = checks.filter(Boolean).length;
    return { done, total: checks.length, percent: Math.round((done / checks.length) * 100) };
  }, [role, company, services, targetCustomers, valueProposition]);

  const profileComplete = isProfileComplete({
    role,
    company,
    services: services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    targetCustomers,
    valueProposition,
    portfolioUrl: portfolioUrl || null,
    tone,
    phoneCountryCode: phoneNumber.trim() ? phoneCountryCode : null,
    phoneNumber: phoneNumber.trim() || null,
    id: profile?.id ?? "",
    userId: profile?.userId ?? "",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.updateProfile({
        role: role.trim(),
        company: company.trim(),
        services: services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        targetCustomers: targetCustomers.trim(),
        valueProposition: valueProposition.trim(),
        tone: tone.trim(),
        portfolioUrl: portfolioUrl.trim() || undefined,
        phoneCountryCode: phoneNumber.trim() ? phoneCountryCode : null,
        phoneNumber: phoneNumber.trim() ? phoneNumber.replace(/\D/g, "") : null,
      });
      await refreshProfile();
      setSuccess("Profile saved. Generated outreach will match your voice.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  }

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppPage size="sm" className="relative">
      <DotPattern
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(480px_circle_at_center,white,transparent)]"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
      />

      <AppPageHeader
        title="Seller profile"
        description="Tell AI Outreach about you so generated messages match your voice."
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm"
      >
        <BorderBeam size={200} duration={16} colorFrom="#2563eb" colorTo="#38bdf8" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
              {initials ?? "?"}
            </span>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {phoneNumber ? (
                <p className="text-sm text-muted-foreground tabular-nums">
                  {formatPhoneDisplay(phoneCountryCode, phoneNumber)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="w-full min-w-0 sm:min-w-[10rem] sm:max-w-xs">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Profile completion</span>
              <span className="font-medium tabular-nums">{completion.percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${completion.percent}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {profileComplete
                ? "Ready to generate outreach"
                : `${completion.done}/${completion.total} required fields filled`}
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="Who you are"
          description="How you introduce yourself in cold outreach."
          icon={IconUser}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField id="role" label="Role">
              <Input
                id="role"
                placeholder="AI Full Stack Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="h-10 rounded-lg bg-background/80"
              />
            </ProfileField>
            <ProfileField id="company" label="Company">
              <Input
                id="company"
                placeholder="Your company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="h-10 rounded-lg bg-background/80"
              />
            </ProfileField>
          </div>
          <ProfileField
            id="phone"
            label="Phone number"
            hint="Optional. Used for account details and future outreach features."
          >
            <PhoneInput
              countryCode={phoneCountryCode}
              phoneNumber={phoneNumber}
              onCountryChange={setPhoneCountryCode}
              onPhoneChange={setPhoneNumber}
              disabled={submitting}
            />
          </ProfileField>
          <ProfileField
            id="services"
            label="Services"
            hint="Comma-separated list of what you offer."
          >
            <Input
              id="services"
              placeholder="Web Development, AI Automation, SaaS Consulting"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              required
              className="h-10 rounded-lg bg-background/80"
            />
          </ProfileField>
          <ProfileField id="portfolioUrl" label="Portfolio URL" hint="Optional link included when relevant.">
            <div className="relative">
              <IconLink
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                stroke={1.5}
              />
              <Input
                id="portfolioUrl"
                type="url"
                placeholder="https://yoursite.com"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="h-10 rounded-lg bg-background/80 pl-9"
              />
            </div>
          </ProfileField>
        </SectionCard>

        <SectionCard
          title="Who you serve"
          description="Helps AI tailor hooks and offers to the right buyer."
          icon={IconTarget}
        >
          <ProfileField id="targetCustomers" label="Target customers">
            <Input
              id="targetCustomers"
              placeholder="US SaaS startups, B2B founders, AI product teams"
              value={targetCustomers}
              onChange={(e) => setTargetCustomers(e.target.value)}
              required
              className="h-10 rounded-lg bg-background/80"
            />
          </ProfileField>
          <ProfileField id="valueProposition" label="Value proposition">
            <Textarea
              id="valueProposition"
              placeholder="I help startups ship production-ready AI SaaS with React, Next.js, and NestJS."
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              required
              rows={4}
              className="min-h-28 rounded-lg bg-background/80"
            />
          </ProfileField>
        </SectionCard>

        <SectionCard
          title="Your voice"
          description="Default tone for generated outreach variants."
          icon={IconSparkles}
        >
          <ProfileField id="tone" label="Default tone">
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={tone === option ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    tone === option && "shadow-sm",
                  )}
                  onClick={() => setTone(option)}
                >
                  {tone === option ? (
                    <IconCheck className="size-3.5" stroke={2} />
                  ) : null}
                  {option}
                </Button>
              ))}
            </div>
          </ProfileField>
        </SectionCard>

        {error ? (
          <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
            <IconCheck className="size-4 shrink-0" stroke={2} />
            {success}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconBriefcase className="size-4 shrink-0" stroke={1.5} />
            Required before you can generate outreach on any company.
          </p>
          <ShimmerButton
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-2.5 text-sm sm:w-auto"
            background="rgba(37, 99, 235, 1)"
          >
            {submitting ? "Saving..." : "Save profile"}
          </ShimmerButton>
        </div>

        <div className="md:hidden">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={logout}
          >
            <IconLogout className="size-4" stroke={1.5} />
            Log out
          </Button>
        </div>
      </form>
    </AppPage>
  );
}
