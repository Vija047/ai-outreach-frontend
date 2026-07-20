import type { AnalysisJobStep } from "@/lib/types";

export function normalizeCompanyUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed.startsWith("http")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export const ANALYSIS_ERROR_MESSAGES: Record<string, string> = {
  EMPTY_CONTENT:
    "This page had too little content to analyze. Try their /about or /news page.",
  UNREACHABLE_URL:
    "Could not reach this URL. Check the address and try again.",
  ANALYSIS_FAILED: "Analysis failed. Please try again.",
};

export function getAnalysisErrorMessage(job: {
  error?: string | null;
  errorCode?: string | null;
}): string {
  if (job.errorCode && ANALYSIS_ERROR_MESSAGES[job.errorCode]) {
    return ANALYSIS_ERROR_MESSAGES[job.errorCode];
  }
  return job.error ?? "Analysis failed";
}

export function stepFromJob(
  step: AnalysisJobStep | null | undefined,
  status: string,
): number {
  if (step === "ANALYZING" || step === "SAVING") return 3;
  if (step === "ENRICHING" || status === "RUNNING") return 2;
  return 1;
}
