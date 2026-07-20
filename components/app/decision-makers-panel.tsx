"use client";

import { IconBrandLinkedin, IconRefresh } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanyContact } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DecisionMakersPanelProps {
  contacts: CompanyContact[];
  selectedContactId?: string;
  onSelectContact: (contactId: string | undefined) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  error?: string;
}

function getConfidenceBadge(contact: CompanyContact) {
  const score = contact.emailConfidence;
  if (score == null) {
    return {
      label: "Unknown",
      className: "text-muted-foreground border-border",
    };
  }
  if (score >= 80) {
    return {
      label: `${score}% verified`,
      className: "text-emerald-400 border-emerald-500/30",
    };
  }
  if (score >= 50) {
    return {
      label: `${score}% verified`,
      className: "text-amber-200 border-amber-500/30",
    };
  }
  return {
    label: `${score}% verified`,
    className: "text-muted-foreground border-border",
  };
}

export function DecisionMakersPanel({
  contacts,
  selectedContactId,
  onSelectContact,
  loading = false,
  refreshing = false,
  onRefresh,
  error,
}: DecisionMakersPanelProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle>Decision makers</CardTitle>
          <CardDescription>
            Verified contacts at this company — optional recipient for
            personalized outreach.
          </CardDescription>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            onClick={onRefresh}
            disabled={refreshing || loading}
          >
            <IconRefresh
              className={cn("mr-1 size-4", refreshing && "animate-spin")}
            />
            Refresh contacts
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              No verified contacts found
            </p>
            <p className="mt-1">
              You can still generate outreach without a named recipient.
            </p>
          </div>
        ) : (
          contacts.map((contact) => {
            const badge = getConfidenceBadge(contact);
            const isSelected = selectedContactId === contact.id;

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() =>
                  onSelectContact(isSelected ? undefined : contact.id)
                }
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium">{contact.name}</span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {contact.title}
                    </p>
                  </div>
                  <Badge variant="outline" className={badge.className}>
                    {badge.label}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  {contact.email && (
                    <span className="text-foreground">{contact.email}</span>
                  )}
                  {contact.linkedinUrl && (
                    <a
                      href={contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      aria-label={`Open ${contact.name} on LinkedIn`}
                    >
                      <IconBrandLinkedin className="size-4" />
                      LinkedIn
                    </a>
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {contact.sourceNote}
                </p>
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
