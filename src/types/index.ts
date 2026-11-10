export type ServiceDivision = "media" | "digital" | "ai";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  division: ServiceDivision;
  featured: boolean;
  displayOrder: number;
  isPublished: boolean;
  capabilities: string[];
  iconName: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: ServiceDivision | "hybrid";
  servicesDemonstrated: string[];
  coverImage: string;
  coverAlt?: string;
  description: string;
  challenge?: string;
  approach?: string;
  outcomes?: string[];
  isConcept: boolean;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BudgetCurrency = "USD" | "INR";

export type BudgetRange =
  | "tier_1"
  | "tier_2"
  | "tier_3"
  | "tier_4"
  | "tier_5"
  | "not_sure";

export type ExpectedTimeline =
  | "immediate"
  | "within_1_month"
  | "1_to_3_months"
  | "flexible";

export interface EnquirySubmission {
  id?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType: string;
  goals: string;
  budgetCurrency: BudgetCurrency;
  budgetRange: BudgetRange;
  timeline: ExpectedTimeline;
  wantsDiscoveryCall: boolean;
  consentAccepted: boolean;
  status?: "new" | "reviewing" | "qualified" | "archived";
  createdAt?: string;
}

export interface HybridProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "research" | "alpha" | "beta" | "live";
  division: ServiceDivision | "hybrid";
  techStack: string[];
  demoUrl?: string;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  role: string;
  company: string;
  avatarUrl?: string;
  content: string;
  rating?: number;
  isApproved: boolean;
}
