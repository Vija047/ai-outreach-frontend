"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CompanyIntel } from "@/components/app/company-intel";
import { AppPage } from "@/components/app/app-page";
import { DecisionMakersPanel } from "@/components/app/decision-makers-panel";
import { GenerationProgress } from "@/components/app/generation-progress";
import { HooksPanel } from "@/components/app/hooks-panel";
import { OutreachResults } from "@/components/app/outreach-results";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import type { Company, CompanyContact, CompanyHook, Generation } from "@/lib/types";

export default function CompanyPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [hooks, setHooks] = useState<CompanyHook[]>([]);
  const [contacts, setContacts] = useState<CompanyContact[]>([]);
  const [selectedHookId, setSelectedHookId] = useState<string | undefined>();
  const [selectedContactId, setSelectedContactId] = useState<
    string | undefined
  >();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [error, setError] = useState("");
  const [contactsError, setContactsError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [refreshingContacts, setRefreshingContacts] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([api.getCompany(companyId), api.getHooks(companyId)])
      .then(([c, h]) => {
        setCompany(c);
        setHooks(h);
        if (h.length > 0) setSelectedHookId(h[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    api
      .getContacts(companyId)
      .then((response) => {
        setContacts(response.contacts);
        if (response.contacts.length > 0) {
          setSelectedContactId(response.contacts[0].id);
        }
      })
      .catch((err) => setContactsError(err.message))
      .finally(() => setContactsLoading(false));
  }, [companyId]);

  async function handleRefreshContacts() {
    setContactsError("");
    setRefreshingContacts(true);
    try {
      const response = await api.refreshContacts(companyId);
      setContacts(response.contacts);
      if (response.contacts.length > 0) {
        setSelectedContactId(response.contacts[0].id);
      } else {
        setSelectedContactId(undefined);
      }
    } catch (err) {
      setContactsError(
        err instanceof ApiError ? err.message : "Could not refresh contacts",
      );
    } finally {
      setRefreshingContacts(false);
    }
  }

  async function handleGenerate() {
    setError("");
    setGenerating(true);
    try {
      const result = await api.generate({
        companyId,
        hookId: selectedHookId,
        contactId: selectedContactId,
      });
      setGeneration(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading company...</p>;
  }

  if (!company) {
    return <p className="text-destructive">{error || "Company not found"}</p>;
  }

  const canGenerate = hooks.length === 0 || Boolean(selectedHookId);

  return (
    <AppPage>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
            {company.name ?? company.domain}
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground sm:text-base">
            {company.domain}
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/dashboard">Analyze another</Link>
        </Button>
      </div>

      <CompanyIntel company={company} />

      <DecisionMakersPanel
        contacts={contacts}
        selectedContactId={selectedContactId}
        onSelectContact={setSelectedContactId}
        loading={contactsLoading}
        refreshing={refreshingContacts}
        onRefresh={handleRefreshContacts}
        error={contactsError}
      />

      <HooksPanel
        hooks={hooks}
        company={company}
        selectedHookId={selectedHookId}
        onSelectHook={setSelectedHookId}
      />

      {hooks.length === 0 && (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
          No hooks found — you can still generate outreach using company
          summary only.
        </p>
      )}

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleGenerate}
          disabled={generating || !canGenerate}
          className="w-full sm:w-auto"
        >
          {generating ? "Generating..." : "Generate outreach"}
        </Button>
        <GenerationProgress active={generating} />
        {variantsNote()}
        {selectedContactId && (
          <p className="text-xs text-muted-foreground">
            Outreach will address{" "}
            {contacts.find((c) => c.id === selectedContactId)?.name ??
              "selected contact"}
            .
          </p>
        )}
      </div>

      {generation && (
        <OutreachResults generation={generation} showHistoryLink />
      )}
    </AppPage>
  );
}

function variantsNote() {
  return (
    <p className="text-xs text-muted-foreground">
      Generates 3 tone variants (Direct, Consultative, Casual) — 1 credit.
    </p>
  );
}
