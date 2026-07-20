"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { TemplateCreateForm } from "@/components/app/template-create-form";
import { AppPageHeader } from "@/components/app/app-page-header";
import { AppPage } from "@/components/app/app-page";
import {
  TemplatesFilter,
  TemplatesLibrary,
  TemplatesLibrarySkeleton,
  TemplatesSummary,
  type FilterChannel,
} from "@/components/app/templates-library";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { api, ApiError } from "@/lib/api";
import {
  channelPlaceholder,
  formatTemplateCategory,
  type TemplateChannel,
  type TemplateGoal,
} from "@/lib/template-channels";
import type { Template } from "@/lib/types";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<TemplateChannel>("EMAIL");
  const [goal, setGoal] = useState<TemplateGoal>("Interview");
  const [body, setBody] = useState(channelPlaceholder("EMAIL"));
  const [filter, setFilter] = useState<FilterChannel>("ALL");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const reduce = useReducedMotion();

  function loadTemplates() {
    api
      .getTemplates()
      .then(setTemplates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  function handleChannelChange(next: TemplateChannel) {
    setChannel(next);
    setBody(channelPlaceholder(next));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.createTemplate({
        name: name.trim(),
        category: formatTemplateCategory(channel, goal),
        body: body.trim(),
      });
      setName("");
      setBody(channelPlaceholder(channel));
      loadTemplates();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create template");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete");
    }
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

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <AppPageHeader
          title="Templates"
          description="Save reusable outreach snippets for email and LinkedIn, with placeholders for personalization."
        />
      </motion.div>

      <TemplateCreateForm
        name={name}
        channel={channel}
        goal={goal}
        body={body}
        submitting={submitting}
        onNameChange={setName}
        onChannelChange={handleChannelChange}
        onGoalChange={setGoal}
        onBodyChange={setBody}
        onSubmit={handleCreate}
      />

      {error ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? <TemplatesLibrarySkeleton /> : null}

      {!loading ? (
        <motion.div
          className="space-y-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {templates.length > 0 ? <TemplatesSummary templates={templates} /> : null}
          <TemplatesFilter value={filter} onChange={setFilter} />
          <TemplatesLibrary
            templates={templates}
            filter={filter}
            onDelete={handleDelete}
          />
        </motion.div>
      ) : null}
    </AppPage>
  );
}
