"use client";

import { useState } from "react";
import {
  IconBrandLinkedin,
  IconChevronDown,
  IconCopy,
  IconMail,
  IconTrash,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import type { Template } from "@/lib/types";
import {
  CHANNEL_META,
  parseTemplateCategory,
  previewBody,
  type TemplateChannel,
} from "@/lib/template-channels";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  onDelete?: (id: string) => void;
  index?: number;
}

export function TemplateCard({ template, onDelete, index = 0 }: TemplateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const { channel, goal } = parseTemplateCategory(template.category);
  const meta = CHANNEL_META[channel];
  const Icon = channel === "EMAIL" ? IconMail : IconBrandLinkedin;

  async function copyBody() {
    await navigator.clipboard.writeText(template.body);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group"
    >
      <div className="flex flex-col gap-3 px-3 py-3.5 sm:flex-row sm:items-start sm:gap-4 sm:px-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50",
              meta.iconClass,
            )}
          >
            <Icon className="size-4" stroke={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-medium">{template.name}</p>
              <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {goal}
              </span>
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 text-[11px] font-medium",
                  template.isSystem
                    ? "border-border text-muted-foreground"
                    : "border-primary/30 bg-primary/10 text-primary",
                )}
              >
                {template.isSystem ? "System" : "Custom"}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:line-clamp-1">
              {previewBody(template.body)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:shrink-0 sm:justify-end">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconChevronDown
              className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
              stroke={1.5}
            />
            {expanded ? "Hide" : "Preview"}
          </button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs active:scale-[0.98]"
              onClick={copyBody}
            >
              <IconCopy className="size-3.5" stroke={1.5} />
              {copied ? "Copied" : "Copy"}
            </Button>
            {!template.isSystem && onDelete ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-destructive hover:text-destructive active:scale-[0.98]"
                onClick={() => onDelete(template.id)}
                aria-label="Delete template"
              >
                <IconTrash className="size-3.5" stroke={1.5} />
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {expanded ? (
        <pre className="mx-3 mb-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground sm:mx-4">
          {template.body}
        </pre>
      ) : null}
    </motion.li>
  );
}

export function TemplateSection({
  title,
  channel,
  templates,
  onDelete,
}: {
  title: string;
  channel: TemplateChannel;
  templates: Template[];
  onDelete?: (id: string) => void;
}) {
  if (templates.length === 0) return null;

  const meta = CHANNEL_META[channel];
  const Icon = channel === "EMAIL" ? IconMail : IconBrandLinkedin;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={cn("size-4", meta.iconClass)} stroke={1.5} />
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
          {templates.length}
        </span>
      </div>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
}
