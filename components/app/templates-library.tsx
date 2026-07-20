"use client";

import {
  IconBrandLinkedin,
  IconLayoutGrid,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { TemplateSection } from "@/components/app/template-card";
import {
  formatTemplateCategory,
  parseTemplateCategory,
  type TemplateChannel,
} from "@/lib/template-channels";
import type { Template } from "@/lib/types";
import { cn } from "@/lib/utils";

export type FilterChannel = "ALL" | TemplateChannel;

interface TemplatesSummaryProps {
  templates: Template[];
}

export function TemplatesSummary({ templates }: TemplatesSummaryProps) {
  const emailCount = templates.filter(
    (t) => parseTemplateCategory(t.category).channel === "EMAIL",
  ).length;
  const linkedInCount = templates.filter(
    (t) => parseTemplateCategory(t.category).channel === "LINKEDIN",
  ).length;
  const customCount = templates.filter((t) => !t.isSystem).length;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconLayoutGrid className="size-3.5" stroke={1.5} />
          Total
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
          {templates.length}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconMail className="size-3.5" stroke={1.5} />
          Email
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
          {emailCount}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconBrandLinkedin className="size-3.5" stroke={1.5} />
          LinkedIn
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
          {linkedInCount}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <IconUser className="size-3.5" stroke={1.5} />
          Custom
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
          {customCount}
        </p>
      </div>
    </div>
  );
}

export function TemplatesLibrarySkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[76px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-10 w-full max-w-sm animate-pulse rounded-xl bg-muted" />
      <div className="overflow-hidden rounded-xl border border-border">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse border-b border-border bg-muted/40 last:border-b-0"
          />
        ))}
      </div>
    </div>
  );
}

export function TemplatesEmptyState() {
  return (
    <section className="rounded-xl border border-dashed border-border bg-muted/30 px-5 py-8 text-center">
      <p className="text-sm font-medium text-foreground">No templates yet</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Create your first template above, or switch the filter to see system
        templates once they load.
      </p>
    </section>
  );
}

const FILTER_OPTIONS: Array<{
  id: FilterChannel;
  label: string;
  icon?: typeof IconMail;
}> = [
  { id: "ALL", label: "All" },
  { id: "EMAIL", label: "Email", icon: IconMail },
  { id: "LINKEDIN", label: "LinkedIn", icon: IconBrandLinkedin },
];

interface TemplatesFilterProps {
  value: FilterChannel;
  onChange: (value: FilterChannel) => void;
}

export function TemplatesFilter({ value, onChange }: TemplatesFilterProps) {
  return (
    <div className="w-full overflow-x-auto sm:w-auto sm:overflow-visible">
      <div className="inline-flex min-w-full flex-wrap gap-1 rounded-xl border border-border bg-card/40 p-1 sm:min-w-0">
      {FILTER_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.98]",
              value === option.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {Icon ? <Icon className="size-3.5" stroke={1.5} /> : null}
            {option.label}
          </button>
        );
      })}
      </div>
    </div>
  );
}

interface TemplatesLibraryProps {
  templates: Template[];
  filter: FilterChannel;
  onDelete: (id: string) => void;
}

export function TemplatesLibrary({
  templates,
  filter,
  onDelete,
}: TemplatesLibraryProps) {
  const reduce = useReducedMotion();

  const filtered =
    filter === "ALL"
      ? templates
      : templates.filter(
          (template) =>
            parseTemplateCategory(template.category).channel === filter,
        );

  const emailTemplates = filtered.filter(
    (template) => parseTemplateCategory(template.category).channel === "EMAIL",
  );
  const linkedInTemplates = filtered.filter(
    (template) =>
      parseTemplateCategory(template.category).channel === "LINKEDIN",
  );

  if (filtered.length === 0) {
    return <TemplatesEmptyState />;
  }

  return (
    <motion.div
      className="space-y-6"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {filter === "ALL" ? (
        <>
          <TemplateSection
            title="Email templates"
            channel="EMAIL"
            templates={emailTemplates}
            onDelete={onDelete}
          />
          <TemplateSection
            title="LinkedIn templates"
            channel="LINKEDIN"
            templates={linkedInTemplates}
            onDelete={onDelete}
          />
        </>
      ) : (
        <TemplateSection
          title={
            filter === "EMAIL" ? "Email templates" : "LinkedIn templates"
          }
          channel={filter}
          templates={filtered}
          onDelete={onDelete}
        />
      )}
    </motion.div>
  );
}