"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { Generation, OutreachVariant, ReplyOutcome } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OutreachFields {
  email: string;
  linkedInDm: string;
  connectionNote: string;
  subjectLines: string[];
  followUp1: string;
  followUp2: string;
}

interface OutreachResultsProps {
  generation: Generation;
  showHistoryLink?: boolean;
}

function variantToFields(variant: OutreachVariant | Generation): OutreachFields {
  return {
    email: variant.email,
    linkedInDm: variant.linkedInDm,
    connectionNote: variant.connectionNote,
    subjectLines: variant.subjectLines ?? [],
    followUp1: variant.followUp1,
    followUp2: variant.followUp2,
  };
}

function buildAllCopyText(fields: OutreachFields): string {
  const subjects = fields.subjectLines
    .map((s, i) => `Subject ${i + 1}: ${s}`)
    .join("\n");
  return [
    subjects,
    "",
    "Email:",
    fields.email,
    "",
    "LinkedIn DM:",
    fields.linkedInDm,
    "",
    "Connection note:",
    fields.connectionNote,
    "",
    "Follow-up 1:",
    fields.followUp1,
    "",
    "Follow-up 2:",
    fields.followUp2,
  ].join("\n");
}

export function OutreachResults({
  generation,
  showHistoryLink = true,
}: OutreachResultsProps) {
  const variants = useMemo<OutreachVariant[]>(() => {
    if (generation.variants?.length) return generation.variants;
    return [
      {
        tone: generation.tone,
        ...variantToFields(generation),
      },
    ];
  }, [generation]);

  const [selectedTone, setSelectedTone] = useState(
    variants.find((v) => v.tone === generation.tone)?.tone ??
      variants[0]?.tone ??
      "Direct",
  );
  const [fieldsByTone, setFieldsByTone] = useState<Record<string, OutreachFields>>(() => {
    const initial: Record<string, OutreachFields> = {};
    for (const variant of variants) {
      initial[variant.tone] = variantToFields(variant);
    }
    return initial;
  });
  const [sentAt, setSentAt] = useState<string | null>(generation.sentAt ?? null);
  const [replyOutcome, setReplyOutcome] = useState<ReplyOutcome | null>(
    generation.replyOutcome ?? null,
  );
  const [markingSent, setMarkingSent] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFields = fieldsByTone[selectedTone] ?? variantToFields(generation);

  useEffect(() => {
    setSentAt(generation.sentAt ?? null);
    setReplyOutcome(generation.replyOutcome ?? null);
  }, [generation.sentAt, generation.replyOutcome]);

  useEffect(() => {
    setFieldsByTone((prev) => {
      const next = { ...prev };
      for (const variant of variants) {
        if (!next[variant.tone]) {
          next[variant.tone] = variantToFields(variant);
        }
      }
      return next;
    });
  }, [variants]);

  const persistEdits = useCallback(
    (tone: string, fields: OutreachFields, extra?: Partial<Generation>) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await api.updateGeneration(generation.id, {
            tone,
            ...fields,
            ...extra,
          });
        } catch {
          // Edits remain local if save fails
        }
      }, 800);
    },
    [generation.id],
  );

  function updateField<K extends keyof OutreachFields>(
    key: K,
    value: OutreachFields[K],
  ) {
    setFieldsByTone((prev) => {
      const updated = {
        ...prev,
        [selectedTone]: {
          ...(prev[selectedTone] ?? activeFields),
          [key]: value,
        },
      };
      persistEdits(selectedTone, updated[selectedTone]);
      return updated;
    });
  }

  function updateSubjectLine(index: number, value: string) {
    setFieldsByTone((prev) => {
      const current = prev[selectedTone] ?? activeFields;
      const subjectLines = [...current.subjectLines];
      subjectLines[index] = value;
      const updated = {
        ...prev,
        [selectedTone]: {
          ...current,
          subjectLines,
        },
      };
      persistEdits(selectedTone, updated[selectedTone]);
      return updated;
    });
  }

  async function copyText(label: string, text: string) {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }

  async function handleMarkSent() {
    setMarkingSent(true);
    try {
      const updated = await api.markGenerationSent(generation.id);
      setSentAt(updated.sentAt ?? new Date().toISOString());
      setReplyOutcome(updated.replyOutcome ?? "PENDING");
      toast.success("Marked as sent");
    } catch {
      toast.error("Could not mark as sent");
    } finally {
      setMarkingSent(false);
    }
  }

  async function handleReplyOutcome(outcome: ReplyOutcome) {
    const repliedAt =
      outcome === "YES" || outcome === "NO"
        ? new Date().toISOString()
        : null;

    setReplyOutcome(outcome);
    try {
      await api.updateGeneration(generation.id, {
        replyOutcome: outcome,
        ...(repliedAt ? { repliedAt } : {}),
      });
      toast.success("Reply status saved");
    } catch {
      toast.error("Could not save reply status");
    }
  }

  const sections: { label: string; key: keyof OutreachFields }[] = [
    { label: "Email", key: "email" },
    { label: "LinkedIn DM", key: "linkedInDm" },
    { label: "Connection note", key: "connectionNote" },
    { label: "Follow-up 1", key: "followUp1" },
    { label: "Follow-up 2", key: "followUp2" },
  ];

  const showReplyPrompt = Boolean(sentAt) && !replyOutcome;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">Generated outreach</h2>
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.tone}
                type="button"
                onClick={() => setSelectedTone(variant.tone)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  selectedTone === variant.tone
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50",
                )}
              >
                {variant.tone}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sticky top-0 z-10 -mx-3 flex gap-2 overflow-x-auto rounded-lg border bg-background/95 p-3 backdrop-blur sm:static sm:mx-0 sm:flex-wrap sm:overflow-visible">
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => copyText("Email", activeFields.email)}
          disabled={!activeFields.email.trim()}
        >
          Copy email
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={() =>
            copyText("Subject line", activeFields.subjectLines[0] ?? "")
          }
          disabled={!activeFields.subjectLines[0]?.trim()}
        >
          Copy subject
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={() => copyText("All outreach", buildAllCopyText(activeFields))}
          disabled={!activeFields.email.trim()}
        >
          Copy all
        </Button>
        {!sentAt && (
          <Button
            size="sm"
            variant="secondary"
            className="shrink-0"
            onClick={handleMarkSent}
            disabled={markingSent}
          >
            {markingSent ? "Saving..." : "Mark as sent"}
          </Button>
        )}
        {showHistoryLink && (
          <Button size="sm" variant="outline" asChild className="shrink-0 sm:ml-auto">
            <Link href={`/history/${generation.id}`}>View in history</Link>
          </Button>
        )}
      </div>

      {sentAt && (
        <p className="text-sm text-muted-foreground">
          Marked as sent {new Date(sentAt).toLocaleString()}
        </p>
      )}

      {showReplyPrompt && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="font-medium">Did they reply?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleReplyOutcome("YES")}>
              Yes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReplyOutcome("NO")}
            >
              No
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleReplyOutcome("PENDING")}
            >
              Not yet
            </Button>
          </div>
        </div>
      )}

      {replyOutcome && replyOutcome !== "PENDING" && (
        <p className="text-sm text-muted-foreground">
          Reply outcome: {replyOutcome === "YES" ? "They replied" : "No reply yet"}
        </p>
      )}

      {sections.map((section) => {
        const value = activeFields[section.key];
        if (typeof value !== "string") return null;
        return (
          <Card key={section.key}>
            <CardHeader className="flex flex-col gap-2 space-y-0 pb-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base">{section.label}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="w-full shrink-0 sm:w-auto"
                onClick={() => copyText(section.label, value)}
                disabled={!value.trim()}
              >
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={value}
                onChange={(e) => updateField(section.key, e.target.value)}
                className="min-h-24"
              />
            </CardContent>
          </Card>
        );
      })}

      {activeFields.subjectLines.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col gap-2 space-y-0 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Subject lines</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="w-full shrink-0 sm:w-auto"
              onClick={() =>
                copyText("Subject lines", activeFields.subjectLines.join("\n"))
              }
            >
              Copy all
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeFields.subjectLines.map((line, index) => (
              <div
                key={`subject-${index}`}
                className="flex flex-col gap-2 rounded-md border px-3 py-2 sm:flex-row sm:items-center"
              >
                <Input
                  value={line}
                  onChange={(e) => updateSubjectLine(index, e.target.value)}
                  className="min-w-0 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full shrink-0 sm:w-auto"
                  onClick={() => copyText(`Subject ${index + 1}`, line)}
                >
                  Copy
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
