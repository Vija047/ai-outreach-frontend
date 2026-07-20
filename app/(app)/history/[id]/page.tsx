"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppPage } from "@/components/app/app-page";
import { OutreachResults } from "@/components/app/outreach-results";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Generation } from "@/lib/types";

export default function HistoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<Generation | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getGeneration(id)
      .then(setItem)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (!item) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <AppPage>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
            {item.company?.name ?? "Outreach"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {item.tone} · {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/history">Back</Link>
        </Button>
      </div>

      <OutreachResults generation={item} showHistoryLink={false} />
    </AppPage>
  );
}
