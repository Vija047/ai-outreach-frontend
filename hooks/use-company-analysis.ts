"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { api, ApiError } from "@/lib/api";
import {
  getAnalysisErrorMessage,
  normalizeCompanyUrl,
  stepFromJob,
} from "@/lib/company-analysis";
import type { AnalysisJobStep } from "@/lib/types";

async function pollAnalysisJob(jobId: string, onProgress: (state: {
  activeStep: number;
  backendStep: AnalysisJobStep | null;
  jobStatus: string;
}) => void): Promise<string> {
  const maxAttempts = 90;
  for (let i = 0; i < maxAttempts; i++) {
    const job = await api.getJob(jobId);

    if (job.status === "DONE") {
      onProgress({ activeStep: 3, backendStep: job.step ?? null, jobStatus: "DONE" });
      const companyId = job.companyId ?? job.company?.id;
      if (companyId) return companyId;
    }

    if (job.status === "FAILED") {
      throw new Error(getAnalysisErrorMessage(job));
    }

    onProgress({
      activeStep: stepFromJob(job.step, job.status),
      backendStep: job.step ?? null,
      jobStatus: job.status,
    });

    await new Promise((r) => setTimeout(r, i < 3 ? 1000 : 2000));
  }
  throw new Error("Analysis timed out. Try again in a moment.");
}

export function useCompanyAnalysis() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [backendStep, setBackendStep] = useState<AnalysisJobStep | null>(null);
  const [jobStatus, setJobStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastUrl, setLastUrl] = useState("");

  const runAnalysis = useCallback(
    async (rawUrl: string) => {
      const analyzeUrl = normalizeCompanyUrl(rawUrl);
      setError("");
      setActiveStep(1);
      setBackendStep("SCRAPING");
      setJobStatus("QUEUED");
      setSubmitting(true);
      setLastUrl(analyzeUrl);

      try {
        const result = await api.analyzeCompany(analyzeUrl);

        if (result.status === "DONE" && result.companyId) {
          setActiveStep(3);
          router.push(`/companies/${result.companyId}`);
          return;
        }

        const companyId = await pollAnalysisJob(result.jobId, (state) => {
          setActiveStep(state.activeStep);
          setBackendStep(state.backendStep);
          setJobStatus(state.jobStatus);
        });

        await new Promise((r) => setTimeout(r, 400));
        router.push(`/companies/${companyId}`);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : (err as Error).message);
        setActiveStep(0);
      } finally {
        setSubmitting(false);
      }
    },
    [router],
  );

  const submit = useCallback(async () => {
    if (!url.trim() || submitting) return;
    await runAnalysis(url);
  }, [url, submitting, runAnalysis]);

  const retry = useCallback(async () => {
    if (!lastUrl) return;
    await runAnalysis(lastUrl);
  }, [lastUrl, runAnalysis]);

  return {
    url,
    setUrl,
    activeStep,
    backendStep,
    jobStatus,
    error,
    submitting,
    lastUrl,
    submit,
    retry,
  };
}
