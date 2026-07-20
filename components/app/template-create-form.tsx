"use client";

import { FormEvent } from "react";
import { IconPlus } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";

import { TemplateChannelToggle } from "@/components/app/template-channel-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  channelPlaceholder,
  TEMPLATE_GOALS,
  type TemplateChannel,
  type TemplateGoal,
} from "@/lib/template-channels";
import { cn } from "@/lib/utils";

interface TemplateCreateFormProps {
  name: string;
  channel: TemplateChannel;
  goal: TemplateGoal;
  body: string;
  submitting: boolean;
  onNameChange: (value: string) => void;
  onChannelChange: (channel: TemplateChannel) => void;
  onGoalChange: (goal: TemplateGoal) => void;
  onBodyChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function TemplateCreateForm({
  name,
  channel,
  goal,
  body,
  submitting,
  onNameChange,
  onChannelChange,
  onGoalChange,
  onBodyChange,
  onSubmit,
}: TemplateCreateFormProps) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      className="rounded-xl border border-border bg-card/60 p-4 sm:p-5"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight">Create template</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a channel and goal. Use {"{{name}}"}, {"{{company}}"}, and{" "}
          {"{{hook}}"} for personalization.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Channel</Label>
          <TemplateChannelToggle value={channel} onChange={onChannelChange} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="template-name">Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={
                channel === "EMAIL"
                  ? "Interview follow-up email"
                  : "LinkedIn intro DM"
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Goal</Label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_GOALS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onGoalChange(option)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.98]",
                    goal === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-body">Body</Label>
          <Textarea
            id="template-body"
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder={channelPlaceholder(channel)}
            className="min-h-44 font-mono text-sm leading-relaxed"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full active:scale-[0.98] sm:w-auto"
        >
          <IconPlus className="size-4" stroke={1.5} />
          {submitting ? "Creating..." : "Create template"}
        </Button>
      </form>
    </motion.section>
  );
}
