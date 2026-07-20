"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { AppPageHeader } from "@/components/app/app-page-header";
import { AppPage } from "@/components/app/app-page";
import {
  HistoryEmptyState,
  HistoryList,
  HistoryListSkeleton,
  HistorySummary,
} from "@/components/app/history-list";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { api } from "@/lib/api";
import type { Generation } from "@/lib/types";

export default function HistoryPage() {
  const [items, setItems] = useState<Generation[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    api
      .getHistory()
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
          title="History"
          description="Reopen past outreach, copy variants, and track what you sent."
        />
      </motion.div>

      {loading ? <HistoryListSkeleton /> : null}

      {error ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!loading && items.length === 0 ? <HistoryEmptyState /> : null}

      {!loading && items.length > 0 ? (
        <motion.div
          className="space-y-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <HistorySummary items={items} total={total} />
          <HistoryList items={items} />
        </motion.div>
      ) : null}
    </AppPage>
  );
}
