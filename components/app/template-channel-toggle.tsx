"use client";

import { IconBrandLinkedin, IconMail } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import type { TemplateChannel } from "@/lib/template-channels";
import { CHANNEL_META } from "@/lib/template-channels";

interface TemplateChannelToggleProps {
  value: TemplateChannel;
  onChange: (channel: TemplateChannel) => void;
  className?: string;
}

const options: TemplateChannel[] = ["EMAIL", "LINKEDIN"];

export function TemplateChannelToggle({
  value,
  onChange,
  className,
}: TemplateChannelToggleProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)}>
      {options.map((channel) => {
        const meta = CHANNEL_META[channel];
        const selected = value === channel;
        const Icon = channel === "EMAIL" ? IconMail : IconBrandLinkedin;

        return (
          <button
            key={channel}
            type="button"
            onClick={() => onChange(channel)}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3 text-left transition-all active:scale-[0.98]",
              selected
                ? "border-primary/40 bg-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "border-border bg-card/40 hover:border-border hover:bg-muted/30",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/80",
                selected && meta.iconClass,
              )}
            >
              <Icon className="size-4" stroke={1.5} />
            </span>
            <span>
              <span className="block text-sm font-medium">{meta.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                {meta.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
