export type UserPlan = "FREE" | "PRO";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  role: string | null;
  company: string | null;
  services: string[];
  portfolioUrl: string | null;
  targetCustomers: string | null;
  valueProposition: string | null;
  tone: string | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export type HookSourceType = "WEBSITE" | "NEWS";

export type ContactSource = "NINJAPEARL" | "ROCKETREACH" | "HUNTER" | "BOTH";

export type EmailStatus =
  | "valid"
  | "accept_all"
  | "risky"
  | "invalid"
  | "unknown";

export type ReplyOutcome = "PENDING" | "YES" | "NO";

export interface CompanyHook {
  id: string;
  companyId: string;
  title: string;
  description: string;
  confidence: number;
  sourceUrl: string | null;
  sourceType?: HookSourceType | null;
  excerpt?: string | null;
  createdAt?: string;
}

export interface CompanyContact {
  id: string;
  companyId: string;
  name: string;
  title: string;
  linkedinUrl: string | null;
  profilePicUrl: string | null;
  email: string | null;
  emailConfidence: number | null;
  emailStatus: EmailStatus;
  source: ContactSource;
  sourceNote: string;
  rankScore: number;
}

export interface ContactsResponse {
  contacts: CompanyContact[];
  fetchedAt: string | null;
  stale: boolean;
  warnings?: string[];
}

export interface Company {
  id: string;
  domain: string;
  name: string | null;
  websiteUrl: string | null;
  summary: string | null;
  industry: string | null;
  mission: string | null;
  techStack: string[];
  analyzedAt?: string;
  hooks?: CompanyHook[];
}

export type AnalysisJobStatus = "QUEUED" | "RUNNING" | "DONE" | "FAILED";
export type AnalysisJobStep =
  | "SCRAPING"
  | "ENRICHING"
  | "ANALYZING"
  | "SAVING"
  | "DISCOVERING_CONTACTS";

export interface AnalysisJob {
  id: string;
  status: AnalysisJobStatus;
  step?: AnalysisJobStep | null;
  url: string;
  domain: string;
  error: string | null;
  errorCode?: string | null;
  companyId: string | null;
  company?: Company | null;
}

export interface OutreachVariant {
  tone: string;
  email: string;
  linkedInDm: string;
  connectionNote: string;
  subjectLines: string[];
  followUp1: string;
  followUp2: string;
}

export interface Generation {
  id: string;
  userId: string;
  companyId: string;
  hookId: string | null;
  contactId?: string | null;
  tone: string;
  email: string;
  linkedInDm: string;
  connectionNote: string;
  subjectLines: string[];
  followUp1: string;
  followUp2: string;
  variants?: OutreachVariant[] | null;
  sentAt?: string | null;
  replyOutcome?: ReplyOutcome | null;
  repliedAt?: string | null;
  createdAt: string;
  company?: { id: string; name: string | null; domain: string };
  hook?: { id: string; title: string } | null;
  contact?: {
    id: string;
    name: string;
    title: string;
    email: string | null;
  } | null;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  body: string;
  isSystem: boolean;
  userId: string | null;
}

export interface CreditsResponse {
  balance: number;
  ledger: {
    id: string;
    delta: number;
    reason: string;
    createdAt: string;
  }[];
}

export interface RecentCompanyActivity {
  id: string;
  name: string | null;
  domain: string;
  websiteUrl: string;
  analyzedAt: string;
  reviewedAt: string;
  reviewedByUserId?: string | null;
  reviewedByName?: string | null;
  emailsGenerated: number;
  contactsFound: number;
  hasOutreach: boolean;
}

export interface AnalyticsSummary {
  emailsGenerated: number;
  companiesAnalyzed: number;
  creditsRemaining: number;
  contactsFoundTotal: number;
  companiesWithoutOutreach: number;
  recentCompanies: RecentCompanyActivity[];
  pendingOutreach: RecentCompanyActivity[];
  mostUsedTone: string | null;
  mostUsedHook: string | null;
  outreachSent?: number;
  repliesReceived?: number;
  overallReplyRate?: number | null;
  bestToneReplyRate?: number | null;
  bestToneLabel?: string | null;
  bestHookReplyRate?: number | null;
  bestHookLabel?: string | null;
}

export interface PaginatedHistory {
  items: Generation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
