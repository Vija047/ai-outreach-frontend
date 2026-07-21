import { getToken } from "@/lib/auth-storage";
import type {
  AnalyticsSummary,
  AnalysisJob,
  AuthResponse,
  Company,
  CompanyContact,
  CompanyHook,
  ContactsResponse,
  CreditsResponse,
  Generation,
  PaginatedHistory,
  SellerProfile,
  Template,
  User,
} from "@/lib/types";

const API_URL = (() => {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return "/api/v1";
  return "http://localhost:3001/api/v1";
})();

export function getApiBaseUrl(): string {
  return API_URL;
}
export function getGoogleAuthUrl(): string {
  return `${API_URL}/auth/google`;
}

export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== "false";
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const authToken = token !== undefined ? token : getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (authToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${authToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    const isLocalApi = API_URL.includes("localhost") || API_URL.includes("127.0.0.1");
    throw new ApiError(
      0,
      isLocalApi
        ? "Cannot reach API (localhost). On Vercel, set NEXT_PUBLIC_API_URL to your Render URL (…/api/v1) and redeploy."
        : "Cannot reach the API. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.",
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const rawMessage = data.message;
    let message = "Request failed";
    let code = data.code as string | undefined;

    if (typeof rawMessage === "string") {
      message = rawMessage;
    } else if (Array.isArray(rawMessage)) {
      message = rawMessage.join(", ");
    } else if (typeof rawMessage === "object" && rawMessage !== null) {
      const nested = rawMessage as { message?: string; code?: string };
      message = nested.message ?? message;
      code = nested.code ?? code;
    }

    throw new ApiError(res.status, message, code);
  }

  return data as T;
}

export const api = {
  sendSignupOtp: (body: { name: string; email: string; password: string }) =>
    request<{ message: string; email: string }>("/auth/signup/send-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resendSignupOtp: (body: { email: string }) =>
    request<{ message: string; email: string }>("/auth/signup/resend-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifySignupOtp: (body: { email: string; otp: string }) =>
    request<AuthResponse>("/auth/signup/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),

  getMe: () => request<User>("/auth/me"),

  getProfile: () => request<SellerProfile>("/profile"),

  updateProfile: (body: Partial<SellerProfile>) =>
    request<SellerProfile>("/profile", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  getCredits: () => request<CreditsResponse>("/credits"),

  getAnalytics: () => request<AnalyticsSummary>("/analytics/summary"),

  analyzeCompany: (url: string) =>
    request<{ jobId: string; status: string; companyId?: string }>(
      "/company/analyze",
      {
        method: "POST",
        body: JSON.stringify({ url }),
      },
    ),

  getJob: (jobId: string) => request<AnalysisJob>(`/company/jobs/${jobId}`),

  getCompany: (id: string) => request<Company>(`/company/${id}`),

  getHooks: (id: string) => request<CompanyHook[]>(`/company/${id}/hooks`),

  getContacts: (id: string) =>
    request<ContactsResponse>(`/company/${id}/contacts`),

  refreshContacts: (id: string) =>
    request<ContactsResponse>(`/company/${id}/contacts/refresh`, {
      method: "POST",
    }),

  generate: (body: {
    companyId: string;
    hookId?: string;
    contactId?: string;
    tone?: string;
  }) =>
    request<Generation>("/generate", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getHistory: (page = 1, limit = 20) =>
    request<PaginatedHistory>(`/history?page=${page}&limit=${limit}`),

  getGeneration: (id: string) => request<Generation>(`/history/${id}`),

  updateGeneration: (
    id: string,
    body: Partial<
      Pick<
        Generation,
        | "tone"
        | "email"
        | "linkedInDm"
        | "connectionNote"
        | "subjectLines"
        | "followUp1"
        | "followUp2"
        | "sentAt"
        | "replyOutcome"
        | "repliedAt"
      >
    >,
  ) =>
    request<Generation>(`/history/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  markGenerationSent: (id: string) =>
    request<Generation>(`/history/${id}/mark-sent`, { method: "POST" }),

  getTemplates: () => request<Template[]>("/templates"),

  createTemplate: (body: { name: string; category: string; body: string }) =>
    request<Template>("/templates", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteTemplate: (id: string) =>
    request<void>(`/templates/${id}`, { method: "DELETE" }),
};

export function isProfileComplete(profile: SellerProfile): boolean {
  return Boolean(
    profile.role &&
      profile.company &&
      profile.services?.length > 0 &&
      profile.targetCustomers &&
      profile.valueProposition,
  );
}
