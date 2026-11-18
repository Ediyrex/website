"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Link2,
  Calendar,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Copy,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useBookingModal } from "@/features/bookings";
import { TurnstileWidget, useTurnstile } from "@/features/turnstile";
import { useWaitExplanation } from "@/hooks/ui-speed";
import { startProgressBar, finishProgressBar } from "@/components/ui/OptimisticProgressBar";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { SITE_CONFIG } from "@/config/site";

export type EngagementModel =
  | "Project-Based"
  | "Ongoing Collaboration"
  | "Custom Engagement"
  | "Not Sure Yet";

export interface DivisionOption {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const DIVISIONS: readonly DivisionOption[] = [
  {
    id: "branding",
    number: "01",
    title: "BRANDING & MARKETING",
    description: "Brand strategy, identity, marketing and growth.",
  },
  {
    id: "media",
    number: "02",
    title: "MEDIA & CONTENT PRODUCTION",
    description: "Video, photography, graphic design, motion and content.",
  },
  {
    id: "digital",
    number: "03",
    title: "WEB, APPS & DIGITAL PRODUCTS",
    description: "Websites, mobile apps, SaaS, CRM, ERP and digital experiences.",
  },
  {
    id: "ai",
    number: "04",
    title: "AI & AUTOMATION",
    description: "AI agents, voice systems, chatbots and workflow automation.",
  },
];

export const ENGAGEMENT_MODELS: readonly EngagementModel[] = [
  "Project-Based",
  "Ongoing Collaboration",
  "Custom Engagement",
  "Not Sure Yet",
];

export const USD_BUDGETS = [
  { value: "tier_1", label: "Under $3,000" },
  { value: "tier_2", label: "$3,000 – $10,000" },
  { value: "tier_3", label: "$10,000 – $25,000" },
  { value: "tier_4", label: "$25,000 – $50,000" },
  { value: "tier_5", label: "$50,000+" },
];

export const INR_BUDGETS = [
  { value: "tier_1", label: "Under ₹2,50,000" },
  { value: "tier_2", label: "₹2,50,000 – ₹8,00,000" },
  { value: "tier_3", label: "₹8,00,000 – ₹20,00,000" },
  { value: "tier_4", label: "₹20,00,000 – ₹40,00,000" },
  { value: "tier_5", label: "₹40,00,000+" },
];

export const TIMELINE_OPTIONS = [
  { id: "immediate", label: "Immediately" },
  { id: "within_1_month", label: "Within 1 month" },
  { id: "1_to_3_months", label: "1 - 3 months" },
  { id: "3_to_6_months", label: "3 - 6 months" },
  { id: "flexible", label: "Flexible" },
  { id: "not_decided", label: "Not decided yet" },
];

export const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "US / Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
];

export function ProjectBriefDesk() {
  const searchParams = useSearchParams();
  const { openBookingModal } = useBookingModal();

  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 01 state
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [isNotSureDivision, setIsNotSureDivision] = useState(false);
  const [engagementModel, setEngagementModel] = useState<EngagementModel>("Project-Based");

  // Step 02 state
  const [projectOverview, setProjectOverview] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState<"USD" | "INR">("USD");
  const [budgetTier, setBudgetTier] = useState<string>("");
  const [budgetSpecial, setBudgetSpecial] = useState<"" | "not_sure" | "prefer_not_to_say">("");
  const [timeline, setTimeline] = useState<string>("within_1_month");

  // Step 03 state
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [company, setCompany] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [wantsDiscoveryCall, setWantsDiscoveryCall] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Status & Errors
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const [serverError, setServerError] = useState("");
  const [emailCopied, setEmailCopied] = useState(false);
  const turnstile = useTurnstile();

  // Explain waits over 1s for submission
  const { explanation: submitExplanation } = useWaitExplanation(isSubmitting, [
    { afterMs: 1000, message: "Encrypting brief details..." },
    { afterMs: 2500, message: "Connecting with studio operations desk..." },
    { afterMs: 4500, message: "Generating your reference code..." },
  ]);

  // Read URL query params on mount
  useEffect(() => {
    const divisionParam = searchParams.get("division")?.toLowerCase() || "";
    const serviceParam = searchParams.get("service")?.toLowerCase() || "";
    const engagementParam = searchParams.get("engagement")?.toLowerCase() || "";

    const initial: string[] = [];

    if (divisionParam) {
      if (divisionParam.includes("brand")) initial.push("branding");
      if (divisionParam.includes("media")) initial.push("media");
      if (divisionParam.includes("digital") || divisionParam.includes("web")) initial.push("digital");
      if (divisionParam.includes("ai") || divisionParam.includes("auto")) initial.push("ai");
    }

    if (serviceParam) {
      if (
        serviceParam.includes("brand") ||
        serviceParam.includes("market") ||
        serviceParam.includes("ads") ||
        serviceParam.includes("packaging") ||
        serviceParam.includes("seo") ||
        serviceParam.includes("influencer") ||
        serviceParam.includes("email")
      ) {
        if (!initial.includes("branding")) initial.push("branding");
      }
      if (
        serviceParam.includes("media") ||
        serviceParam.includes("content") ||
        serviceParam.includes("video") ||
        serviceParam.includes("motion") ||
        serviceParam.includes("photography") ||
        serviceParam.includes("graphics")
      ) {
        if (!initial.includes("media")) initial.push("media");
      }
      if (
        serviceParam.includes("web") ||
        serviceParam.includes("digital") ||
        serviceParam.includes("app") ||
        serviceParam.includes("extension") ||
        serviceParam.includes("dadv")
      ) {
        if (!initial.includes("digital")) initial.push("digital");
      }
      if (
        serviceParam.includes("ai") ||
        serviceParam.includes("auto") ||
        serviceParam.includes("chatbot") ||
        serviceParam.includes("calling") ||
        serviceParam.includes("n8n")
      ) {
        if (!initial.includes("ai")) initial.push("ai");
      }

      const formattedServiceName = serviceParam
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setProjectOverview((current) =>
        current ? current : `Enquiry regarding ${formattedServiceName}.`
      );
    }

    if (initial.length > 0) {
      setSelectedDivisions(initial);
    }

    if (engagementParam) {
      if (engagementParam.includes("project")) setEngagementModel("Project-Based");
      else if (engagementParam.includes("ongoing")) setEngagementModel("Ongoing Collaboration");
      else if (engagementParam.includes("custom")) setEngagementModel("Custom Engagement");
      else if (engagementParam.includes("sure")) setEngagementModel("Not Sure Yet");
    }
  }, [searchParams]);

  // Copy email handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ediyrex@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // Toggle Division selection
  const toggleDivision = (divId: string) => {
    setIsNotSureDivision(false);
    setSelectedDivisions((prev) =>
      prev.includes(divId) ? prev.filter((id) => id !== divId) : [...prev, divId]
    );
    if (stepErrors.division) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next.division;
        return next;
      });
    }
  };

  const handleToggleNotSure = () => {
    if (!isNotSureDivision) {
      setIsNotSureDivision(true);
      setSelectedDivisions([]);
    } else {
      setIsNotSureDivision(false);
    }
    if (stepErrors.division) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next.division;
        return next;
      });
    }
  };

  // Step 01 Validation & Navigation
  const handleProceedToStep2 = () => {
    if (selectedDivisions.length === 0 && !isNotSureDivision) {
      setStepErrors({
        division: "Please select at least one division or choose 'Not Sure Yet'.",
      });
      return;
    }
    setStepErrors({});
    setCurrentStep(2);
    trackEvent("Contact Step Completed", { step: 1 });
  };

  // Step 02 Validation & Navigation
  const handleProceedToStep3 = () => {
    const errors: Record<string, string> = {};
    if (!projectOverview.trim()) {
      errors.projectOverview = "Please describe your project before continuing.";
    } else if (projectOverview.trim().length < 10) {
      errors.projectOverview = "Please provide at least 10 characters describing your project.";
    }

    if (referenceUrl.trim()) {
      let raw = referenceUrl.trim();
      if (!/^https?:\/\//i.test(raw)) {
        raw = `https://${raw}`;
      }
      try {
        const parsed = new URL(raw);
        if (!parsed.protocol.startsWith("http") || !parsed.hostname.includes(".")) {
          errors.referenceUrl = "Please enter a valid website address (e.g. yoursite.com).";
        }
      } catch {
        errors.referenceUrl = "Please enter a valid website address or leave this field empty.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }

    setStepErrors({});
    setCurrentStep(3);
    trackEvent("Contact Step Completed", { step: 2 });
  };

  // Step 03 Validation & Final Submission
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!workEmail.trim() || !emailRegex.test(workEmail.trim())) {
      errors.workEmail = "Please enter a valid email address.";
    }

    if (!privacyConsent) {
      errors.privacyConsent = "Please acknowledge the Privacy Policy before submitting.";
    }

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }

    setStepErrors({});
    setIsSubmitting(true);
    startProgressBar();

    // Prepare primary projectType label
    const primaryDivisionNames = isNotSureDivision
      ? "Exploring / Not Sure"
      : selectedDivisions
          .map((id) => DIVISIONS.find((d) => d.id === id)?.title)
          .filter(Boolean)
          .join(", ") || "General Project";

    // Formatted structured goals string
    const enrichedGoals = [
      projectOverview.trim(),
      referenceUrl.trim()
        ? `Reference URL: ${/^https?:\/\//i.test(referenceUrl.trim()) ? referenceUrl.trim() : `https://${referenceUrl.trim()}`}`
        : null,
      `Engagement Model: ${engagementModel}`,
      `Selected Divisions: ${primaryDivisionNames}`,
      budgetSpecial === "prefer_not_to_say"
        ? "Budget Preference: Prefer not to say"
        : budgetSpecial === "not_sure"
        ? "Budget Preference: Exploring / Not sure"
        : budgetTier
        ? `Budget Tier: ${budgetTier}`
        : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const payload = {
      name: fullName.trim(),
      email: workEmail.trim(),
      company: company.trim() || undefined,
      phone: phone.trim() ? `${countryCode} ${phone.trim()}` : undefined,
      projectType: primaryDivisionNames.slice(0, 140),
      goals: enrichedGoals.slice(0, 2000),
      budgetCurrency: budgetCurrency,
      budgetRange: budgetSpecial ? "not_sure" : budgetTier || "not_sure",
      timeline: timeline,
      wantsDiscoveryCall: wantsDiscoveryCall,
      consentAccepted: privacyConsent,
      turnstileToken: turnstile.token || undefined,
    };

    try {
      const res = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to submit enquiry. Please try again.");
      }

      const ref = json.data?.referenceId || `ENQ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setReferenceCode(ref);
      setIsSuccess(true);
      trackEvent("Enquiry Submitted", {
        divisions: selectedDivisions.join(","),
        engagementModel,
        wantsDiscoveryCall,
      });
    } catch (err) {
      turnstile.reset();
      setServerError(
        err instanceof Error
          ? err.message
          : "We couldn't submit your enquiry just now. Your information is preserved. Please try again."
      );
    } finally {
      finishProgressBar();
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-label="Contact and Project Brief Desk"
      className="w-full bg-[#0C0D0F] text-[#F5F2EC] pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      <div className="max-w-[1460px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: PROJECT INVITATION & DIRECT CONTACT           */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-8 lg:space-y-10 lg:pr-4">
            {/* 01. Section Identifier */}
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#F06419] inline-block shrink-0" />
              <span className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-[0.18em] text-[#F5F2EC]">
                DISCOVERY / PROJECT INTAKE
              </span>
              <span
                aria-hidden="true"
                className="h-px bg-[#292E35] flex-1 inline-block ml-2"
              />
            </div>

            {/* 02. Display Headline */}
            <div className="space-y-4">
              <h1 className="font-heading font-extrabold text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
                Let&apos;s build something
                <br />
                that moves your
                <br />
                <span className="text-[#F06419] italic font-heading font-extrabold">
                  business forward.
                </span>
              </h1>

              <p className="text-[15.5px] sm:text-[17px] text-[#898D94] leading-[1.6] max-w-xl pt-1">
                Every meaningful project starts with a clear conversation. Tell us what you&apos;re planning,
                what challenges you&apos;re facing and where you want to go.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#292E35] w-full" />

            {/* 03. What to Expect */}
            <div className="space-y-5">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                WHAT TO EXPECT
              </span>

              <div className="divide-y divide-[#292E35]">
                {/* 01 */}
                <div className="py-4 first:pt-0 space-y-1">
                  <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#F5F2EC] uppercase tracking-tight">
                    <span className="text-[#F06419] mr-2">01 /</span> DIRECT PROJECT REVIEW
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-[#898D94] leading-relaxed pl-8">
                    Your enquiry is reviewed by the people responsible for shaping and building the work.
                  </p>
                </div>

                {/* 02 */}
                <div className="py-4 space-y-1">
                  <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#F5F2EC] uppercase tracking-tight">
                    <span className="text-[#F06419] mr-2">02 /</span> CLEAR SCOPE DISCUSSION
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-[#898D94] leading-relaxed pl-8">
                    Understand the expected deliverables, requirements and project direction before execution begins.
                  </p>
                </div>

                {/* 03 */}
                <div className="py-4 last:pb-0 space-y-1">
                  <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#F5F2EC] uppercase tracking-tight">
                    <span className="text-[#F06419] mr-2">03 /</span> A CONSIDERED NEXT STEP
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-[#898D94] leading-relaxed pl-8">
                    We discuss the most appropriate way to move your project forward.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#292E35] w-full" />

            {/* 04. Direct Contact */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                DIRECT CONTACT
              </span>

              <div className="flex items-center gap-4 p-4 rounded-[14px] bg-[#121519] border border-[#292E35] hover:border-[#3D4450] transition-colors">
                <div className="w-12 h-12 rounded-[10px] border border-[#F06419]/60 bg-[#0E1012] flex items-center justify-center shrink-0 text-[#F06419]">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-heading font-extrabold text-[13px] uppercase tracking-wider text-[#F5F2EC] block leading-snug">
                    STUDIO INBOX
                  </span>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    className="font-mono text-sm text-[#F06419] hover:underline block my-0.5 truncate font-medium"
                    aria-label={`Email ${SITE_CONFIG.contact.email}`}
                  >
                    {SITE_CONFIG.contact.email}
                  </a>
                  <span className="font-mono text-xs text-[#898D94] block">
                    Response within 24h
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1.5 rounded-[6px] border border-[#292E35] bg-[#0E1012] text-xs font-mono text-[#898D94] hover:text-[#F5F2EC] hover:border-[#3D4450] transition-colors shrink-0"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {emailCopied ? <Check className="w-3.5 h-3.5 text-[#56C58B]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Direct Phone Line */}
              <div className="flex items-center gap-4 p-4 rounded-[14px] bg-[#121519] border border-[#292E35] hover:border-[#3D4450] transition-colors">
                <div className="w-12 h-12 rounded-[10px] border border-[#D9B875]/60 bg-[#0E1012] flex items-center justify-center shrink-0 text-[#D9B875]">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-heading font-extrabold text-[13px] uppercase tracking-wider text-[#F5F2EC] block leading-snug">
                    DIRECT CALL / WHATSAPP
                  </span>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
                    className="font-mono text-sm text-[#D9B875] hover:underline block my-0.5 truncate font-medium"
                    aria-label={`Call ${SITE_CONFIG.contact.phone}`}
                  >
                    {SITE_CONFIG.contact.phone}
                  </a>
                  <span className="font-mono text-xs text-[#898D94] block">
                    {SITE_CONFIG.contact.hours}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#292E35] w-full" />

            {/* 05. Direct Meeting Scheduling */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                DIRECT CALENDAR
              </span>

              <div className="p-4 sm:p-5 rounded-[14px] bg-[#121519] border border-[#292E35] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] border border-[#D6B77A]/40 bg-[#0E1012] flex items-center justify-center shrink-0 text-[#D6B77A]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-[14px] uppercase tracking-wider text-[#F5F2EC]">
                      SCHEDULE A MEETING
                    </h4>
                    <p className="text-xs text-[#898D94] mt-0.5">
                      30-min Google Meet consultation with EDYREX studio leads.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="w-full py-3 px-4 rounded-[8px] bg-[#D6B77A] hover:bg-[#E2C78E] text-[#08090B] font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule a Meeting</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: PROJECT BRIEF DESK (3-STEP PROGRESSIVE FORM) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="rounded-[20px] sm:rounded-[24px] bg-[#121519] border border-[#292E35] p-6 sm:p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
              {/* Header: Project Brief Desk & Step Counter */}
              <div className="flex items-center justify-between pb-4 border-b border-[#292E35]">
                <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#F5F2EC]">
                  PROJECT BRIEF DESK
                </span>
                <span className="font-mono text-xs sm:text-[13px] font-medium uppercase tracking-[0.16em] text-[#898D94]">
                  {isSuccess ? "CONFIRMATION" : `STEP 0${currentStep} OF 03`}
                </span>
              </div>

              {/* Progress Indicator (Visible in steps 1, 2, 3) */}
              {!isSuccess && (
                <div className="py-5 border-b border-[#292E35]">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* Step 1 Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold ${
                          currentStep === 1
                            ? "bg-[#F06419] text-black"
                            : currentStep > 1
                            ? "bg-[#D9B875] text-black"
                            : "bg-[#0E1012] border border-[#292E35] text-[#898D94]"
                        }`}
                      >
                        {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "01"}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${
                          currentStep === 1
                            ? "text-[#F06419]"
                            : currentStep > 1
                            ? "text-[#D9B875]"
                            : "text-[#898D94]"
                        }`}
                      >
                        PROJECT DIRECTION
                      </span>
                    </div>

                    {/* Connecting Bar 1 -> 2 */}
                    <span
                      aria-hidden="true"
                      className={`h-px flex-1 ${currentStep > 1 ? "bg-[#D9B875]" : "bg-[#292E35]"}`}
                    />

                    {/* Step 2 Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold ${
                          currentStep === 2
                            ? "bg-[#F06419] text-black"
                            : currentStep > 2
                            ? "bg-[#D9B875] text-black"
                            : "bg-[#0E1012] border border-[#292E35] text-[#898D94]"
                        }`}
                      >
                        {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : "02"}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${
                          currentStep === 2
                            ? "text-[#F06419]"
                            : currentStep > 2
                            ? "text-[#D9B875]"
                            : "text-[#898D94]"
                        }`}
                      >
                        SCOPE &amp; EXPECTATIONS
                      </span>
                    </div>

                    {/* Connecting Bar 2 -> 3 */}
                    <span
                      aria-hidden="true"
                      className={`h-px flex-1 ${currentStep > 2 ? "bg-[#D9B875]" : "bg-[#292E35]"}`}
                    />

                    {/* Step 3 Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold ${
                          currentStep === 3
                            ? "bg-[#F06419] text-black"
                            : "bg-[#0E1012] border border-[#292E35] text-[#898D94]"
                        }`}
                      >
                        03
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${
                          currentStep === 3 ? "text-[#F06419]" : "text-[#898D94]"
                        }`}
                      >
                        YOUR DETAILS
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 01: PROJECT DIRECTION                                */}
              {/* ========================================================= */}
              {currentStep === 1 && !isSuccess && (
                <div className="pt-7 space-y-7">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                      01 / PROJECT DIRECTION
                    </span>
                    <h2 className="font-heading font-extrabold text-[clamp(1.75rem,2.8vw,2.4rem)] text-[#F5F2EC] leading-[1.08] tracking-tight">
                      What are you looking to build?
                    </h2>
                    <p className="text-xs sm:text-sm text-[#898D94] leading-relaxed">
                      Select the areas that match your requirements. You can choose more than one division.
                    </p>
                  </div>

                  {/* Division Cards (2x2 Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {DIVISIONS.map((division) => {
                      const isSelected = selectedDivisions.includes(division.id);
                      return (
                        <div
                          key={division.id}
                          onClick={() => toggleDivision(division.id)}
                          className={`p-5 rounded-[14px] border cursor-pointer transition-all flex flex-col justify-between min-h-[135px] select-none ${
                            isSelected
                              ? "border-[#F06419] bg-[#F06419]/[0.08]"
                              : "border-[#292E35] bg-[#0E1012] hover:border-[#3D4450]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-base font-bold text-[#F06419]">
                              {division.number}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-[#F06419] border-[#F06419] text-black"
                                  : "border-[#444C58] bg-transparent"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="mt-3">
                            <h3 className="font-heading font-extrabold text-sm sm:text-[15px] uppercase tracking-tight text-[#F5F2EC] leading-snug">
                              {division.title}
                            </h3>
                            <p className="text-xs text-[#898D94] mt-1 leading-snug">
                              {division.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 5th Option: Not Sure Yet */}
                  <div
                    onClick={handleToggleNotSure}
                    className={`p-4 rounded-[14px] border cursor-pointer transition-all flex items-center gap-3.5 select-none ${
                      isNotSureDivision
                        ? "border-[#F06419] bg-[#F06419]/[0.08]"
                        : "border-[#292E35] bg-[#0E1012] hover:border-[#3D4450]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                        isNotSureDivision
                          ? "bg-[#F06419] border-[#F06419] text-black"
                          : "border-[#444C58] bg-transparent"
                      }`}
                    >
                      {isNotSureDivision && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="font-heading font-extrabold text-sm uppercase tracking-tight text-[#F5F2EC]">
                        NOT SURE YET
                      </span>
                      <span className="text-xs text-[#898D94] ml-2 hidden sm:inline">
                        I&apos;m still exploring what the right solution should be.
                      </span>
                    </div>
                  </div>

                  {stepErrors.division && (
                    <div className="flex items-center gap-2 text-xs text-[#EF6B6B] font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{stepErrors.division}</span>
                    </div>
                  )}

                  {/* Preferred Engagement Model */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                      PREFERRED ENGAGEMENT MODEL
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {ENGAGEMENT_MODELS.map((model) => {
                        const isSelected = engagementModel === model;
                        return (
                          <button
                            key={model}
                            type="button"
                            onClick={() => setEngagementModel(model)}
                            className={`py-3 px-3 rounded-[8px] text-xs font-mono font-medium text-center border transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#F06419] bg-[#F06419]/[0.12] text-[#F5F2EC]"
                                : "border-[#292E35] bg-[#0E1012] text-[#898D94] hover:text-[#F5F2EC] hover:border-[#3D4450]"
                            }`}
                          >
                            {model}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 01 Action Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="w-full py-4 rounded-[8px] bg-[#F06419] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D95612] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>CONTINUE TO SCOPE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 02: SCOPE & EXPECTATIONS                             */}
              {/* ========================================================= */}
              {currentStep === 2 && !isSuccess && (
                <div className="pt-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                      02 / SCOPE &amp; EXPECTATIONS
                    </span>
                    <h2 className="font-heading font-extrabold text-[clamp(1.75rem,2.8vw,2.4rem)] text-[#F5F2EC] leading-[1.08] tracking-tight">
                      Let&apos;s understand the scope.
                    </h2>
                    <p className="text-xs sm:text-sm text-[#898D94] leading-relaxed">
                      Give us a little more context about the project, your expectations and the direction you&apos;re considering.
                    </p>
                  </div>

                  {/* Field 01: Project Overview & Requirements */}
                  <div className="space-y-2">
                    <label
                      htmlFor="project-overview"
                      className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] block"
                    >
                      PROJECT OVERVIEW &amp; REQUIREMENTS <span className="text-[#F06419]">*</span>
                    </label>
                    <textarea
                      id="project-overview"
                      rows={4}
                      value={projectOverview}
                      onChange={(e) => {
                        setProjectOverview(e.target.value);
                        if (stepErrors.projectOverview) {
                          setStepErrors((prev) => {
                            const next = { ...prev };
                            delete next.projectOverview;
                            return next;
                          });
                        }
                      }}
                      placeholder="Describe what you want to build or produce, the problem you're trying to solve, important features or deliverables, and the outcome you're looking for..."
                      className={`w-full bg-[#0E1012] border rounded-[10px] p-4 text-[#F5F2EC] placeholder:text-[#5A606A] text-sm focus:outline-none transition-colors ${
                        stepErrors.projectOverview
                          ? "border-[#EF6B6B] focus:border-[#EF6B6B]"
                          : "border-[#292E35] focus:border-[#F06419]"
                      }`}
                    />
                    {stepErrors.projectOverview && (
                      <span className="text-xs text-[#EF6B6B] font-mono block">
                        {stepErrors.projectOverview}
                      </span>
                    )}
                  </div>

                  {/* Field 02: Reference URL */}
                  <div className="space-y-2">
                    <label
                      htmlFor="reference-url"
                      className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] block"
                    >
                      REFERENCE URL / EXISTING WEBSITE
                    </label>
                    <div className="relative">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#898D94]" />
                      <input
                        id="reference-url"
                        type="url"
                        value={referenceUrl}
                        onChange={(e) => {
                          setReferenceUrl(e.target.value);
                          if (stepErrors.referenceUrl) {
                            setStepErrors((prev) => {
                              const next = { ...prev };
                              delete next.referenceUrl;
                              return next;
                            });
                          }
                        }}
                        placeholder="https://yourwebsite.com (optional)"
                        className={`w-full bg-[#0E1012] border rounded-[10px] pl-11 pr-4 py-3.5 text-[#F5F2EC] placeholder:text-[#5A606A] text-sm focus:outline-none transition-colors ${
                          stepErrors.referenceUrl
                            ? "border-[#EF6B6B] focus:border-[#EF6B6B]"
                            : "border-[#292E35] focus:border-[#F06419]"
                        }`}
                      />
                    </div>
                    {stepErrors.referenceUrl && (
                      <span className="text-xs text-[#EF6B6B] font-mono block">
                        {stepErrors.referenceUrl}
                      </span>
                    )}
                    {/* Real-time SSRF-safe link preview */}
                    <LinkPreview url={referenceUrl} className="mt-2.5" />
                  </div>

                  {/* 2-Column: Budget & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Budget Column */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] flex items-center gap-1.5">
                          <span>INDICATIVE PROJECT BUDGET</span>
                          <span title="Optional budget range" className="cursor-help">
                            <Info className="w-3.5 h-3.5 text-[#898D94]" />
                          </span>
                        </label>

                        {/* USD / INR Toggle */}
                        <div className="inline-flex rounded-[6px] border border-[#292E35] p-0.5 bg-[#0E1012]">
                          <button
                            type="button"
                            onClick={() => {
                              setBudgetCurrency("USD");
                              setBudgetTier("");
                            }}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${
                              budgetCurrency === "USD"
                                ? "bg-[#D9B875] text-black"
                                : "text-[#898D94] hover:text-[#F5F2EC]"
                            }`}
                          >
                            USD
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setBudgetCurrency("INR");
                              setBudgetTier("");
                            }}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider transition-colors ${
                              budgetCurrency === "INR"
                                ? "bg-[#D9B875] text-black"
                                : "text-[#898D94] hover:text-[#F5F2EC]"
                            }`}
                          >
                            INR
                          </button>
                        </div>
                      </div>

                      {/* Budget Dropdown */}
                      <div className="relative">
                        <select
                          value={budgetSpecial ? "" : budgetTier}
                          onChange={(e) => {
                            setBudgetTier(e.target.value);
                            setBudgetSpecial("");
                          }}
                          className="w-full appearance-none bg-[#0E1012] border border-[#292E35] focus:border-[#F06419] focus:outline-none rounded-[10px] px-4 py-3 text-[#F5F2EC] text-sm pr-10 cursor-pointer"
                        >
                          <option value="">Select a budget range (optional)</option>
                          {(budgetCurrency === "USD" ? USD_BUDGETS : INR_BUDGETS).map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#898D94] pointer-events-none" />
                      </div>

                      {/* Not sure yet / Prefer not to say chips */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setBudgetSpecial(budgetSpecial === "not_sure" ? "" : "not_sure");
                            setBudgetTier("");
                          }}
                          className={`py-2 px-3 rounded-[8px] text-xs font-mono text-center border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                            budgetSpecial === "not_sure"
                              ? "border-[#F06419] bg-[#F06419]/[0.12] text-[#F5F2EC]"
                              : "border-[#292E35] bg-[#0E1012] text-[#898D94] hover:text-[#F5F2EC] hover:border-[#3D4450]"
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full border ${
                              budgetSpecial === "not_sure"
                                ? "border-[#F06419] bg-[#F06419]"
                                : "border-[#898D94]"
                            }`}
                          />
                          <span>Not sure yet</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setBudgetSpecial(budgetSpecial === "prefer_not_to_say" ? "" : "prefer_not_to_say");
                            setBudgetTier("");
                          }}
                          className={`py-2 px-3 rounded-[8px] text-xs font-mono text-center border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                            budgetSpecial === "prefer_not_to_say"
                              ? "border-[#F06419] bg-[#F06419]/[0.12] text-[#F5F2EC]"
                              : "border-[#292E35] bg-[#0E1012] text-[#898D94] hover:text-[#F5F2EC] hover:border-[#3D4450]"
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full border ${
                              budgetSpecial === "prefer_not_to_say"
                                ? "border-[#F06419] bg-[#F06419]"
                                : "border-[#898D94]"
                            }`}
                          />
                          <span>Prefer not to say</span>
                        </button>
                      </div>
                    </div>

                    {/* Timeline Column */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F06419]" />
                        <span>DESIRED PROJECT TIMELINE</span>
                      </label>

                      {/* Timeline Dropdown */}
                      <div className="relative">
                        <select
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className="w-full appearance-none bg-[#0E1012] border border-[#292E35] focus:border-[#F06419] focus:outline-none rounded-[10px] px-4 py-3 text-[#F5F2EC] text-sm pr-10 cursor-pointer"
                        >
                          {TIMELINE_OPTIONS.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#898D94] pointer-events-none" />
                      </div>

                      {/* Timeline Chips Grid (2x3) */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {TIMELINE_OPTIONS.map((t) => {
                          const isSelected = timeline === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTimeline(t.id)}
                              className={`py-2 px-2.5 rounded-[8px] text-[11px] sm:text-xs font-mono text-center border transition-colors cursor-pointer truncate ${
                                isSelected
                                  ? "border-[#F06419] bg-[#F06419]/[0.12] text-[#F5F2EC] font-bold"
                                  : "border-[#292E35] bg-[#0E1012] text-[#898D94] hover:text-[#F5F2EC] hover:border-[#3D4450]"
                              }`}
                            >
                              {t.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Step 02 Navigation Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#292E35]">
                    <button
                      type="button"
                      onClick={() => {
                        setStepErrors({});
                        setCurrentStep(1);
                      }}
                      className="w-full sm:w-auto px-6 py-4 rounded-[8px] border border-[#292E35] bg-transparent text-[#F5F2EC] hover:bg-[#1A1E24] hover:border-[#3D4450] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>BACK TO PROJECT DIRECTION</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="w-full sm:flex-1 py-4 rounded-[8px] bg-[#F06419] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D95612] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>CONTINUE TO YOUR DETAILS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 03: YOUR DETAILS                                     */}
              {/* ========================================================= */}
              {currentStep === 3 && !isSuccess && (
                <form onSubmit={handleSubmitEnquiry} className="pt-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                      03 / YOUR DETAILS
                    </span>
                    <h2 className="font-heading font-extrabold text-[clamp(1.75rem,2.8vw,2.4rem)] text-[#F5F2EC] leading-[1.08] tracking-tight">
                      Who should we contact?
                    </h2>
                    <p className="text-xs sm:text-sm text-[#898D94] leading-relaxed">
                      Share your details so we can review your enquiry and get back to you about the next steps.
                    </p>
                  </div>

                  {/* 2-Column Contact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="full-name"
                        className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] block"
                      >
                        FULL NAME <span className="text-[#F06419]">*</span>
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (stepErrors.fullName) {
                            setStepErrors((prev) => {
                              const next = { ...prev };
                              delete next.fullName;
                              return next;
                            });
                          }
                        }}
                        placeholder="Your full name"
                        className={`w-full bg-[#0E1012] border rounded-[10px] px-4 py-3.5 text-[#F5F2EC] placeholder:text-[#5A606A] text-sm focus:outline-none transition-colors ${
                          stepErrors.fullName
                            ? "border-[#EF6B6B] focus:border-[#EF6B6B]"
                            : "border-[#292E35] focus:border-[#F06419]"
                        }`}
                      />
                      {stepErrors.fullName && (
                        <span className="text-xs text-[#EF6B6B] font-mono block">
                          {stepErrors.fullName}
                        </span>
                      )}
                    </div>

                    {/* Work Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="work-email"
                        className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] block"
                      >
                        WORK EMAIL <span className="text-[#F06419]">*</span>
                      </label>
                      <input
                        id="work-email"
                        type="email"
                        value={workEmail}
                        onChange={(e) => {
                          setWorkEmail(e.target.value);
                          if (stepErrors.workEmail) {
                            setStepErrors((prev) => {
                              const next = { ...prev };
                              delete next.workEmail;
                              return next;
                            });
                          }
                        }}
                        placeholder="you@company.com"
                        className={`w-full bg-[#0E1012] border rounded-[10px] px-4 py-3.5 text-[#F5F2EC] placeholder:text-[#5A606A] text-sm focus:outline-none transition-colors ${
                          stepErrors.workEmail
                            ? "border-[#EF6B6B] focus:border-[#EF6B6B]"
                            : "border-[#292E35] focus:border-[#F06419]"
                        }`}
                      />
                      {stepErrors.workEmail && (
                        <span className="text-xs text-[#EF6B6B] font-mono block">
                          {stepErrors.workEmail}
                        </span>
                      )}
                    </div>

                    {/* Company / Organisation */}
                    <div className="space-y-2">
                      <label
                        htmlFor="company-name"
                        className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] block"
                      >
                        COMPANY / ORGANISATION
                      </label>
                      <input
                        id="company-name"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company or organisation name"
                        className="w-full bg-[#0E1012] border border-[#292E35] focus:border-[#F06419] focus:outline-none rounded-[10px] px-4 py-3.5 text-[#F5F2EC] placeholder:text-[#5A606A] text-sm transition-colors"
                      />
                    </div>

                    {/* Phone / WhatsApp with Country Code Selector */}
                    <div className="space-y-2">
                      <label
                        htmlFor="phone-number"
                        className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#F5F2EC] block"
                      >
                        PHONE / WHATSAPP
                      </label>
                      <div className="flex items-center rounded-[10px] border border-[#292E35] focus-within:border-[#F06419] bg-[#0E1012] overflow-hidden transition-colors">
                        {/* Country code selector */}
                        <div className="relative border-r border-[#292E35] shrink-0">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="appearance-none bg-transparent py-3.5 pl-3 pr-7 text-xs font-mono text-[#F5F2EC] focus:outline-none cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code} className="bg-[#121519] text-[#F5F2EC]">
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#898D94] pointer-events-none" />
                        </div>

                        {/* Number input */}
                        <input
                          id="phone-number"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your number"
                          className="flex-1 bg-transparent px-3 py-3.5 text-[#F5F2EC] placeholder:text-[#5A606A] text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Checkbox 1: Discovery Call Request */}
                  <div
                    onClick={() => setWantsDiscoveryCall((prev) => !prev)}
                    className="flex items-start gap-3 pt-2 cursor-pointer select-none group"
                  >
                    <div
                      className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        wantsDiscoveryCall
                          ? "bg-[#F06419] border-[#F06419] text-black"
                          : "border-[#444C58] bg-[#0E1012]"
                      }`}
                    >
                      {wantsDiscoveryCall && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#B8B9BC] group-hover:text-[#F5F2EC] transition-colors leading-snug">
                      <Calendar className="w-4 h-4 text-[#D9B875] shrink-0" />
                      <span>I&apos;d like to arrange a 30-minute discovery call to discuss the project.</span>
                    </div>
                  </div>

                  {/* Checkbox 2: Privacy Consent */}
                  <div
                    onClick={() => {
                      setPrivacyConsent((prev) => !prev);
                      if (stepErrors.privacyConsent) {
                        setStepErrors((prev) => {
                          const next = { ...prev };
                          delete next.privacyConsent;
                          return next;
                        });
                      }
                    }}
                    className="flex items-start gap-3 cursor-pointer select-none group"
                  >
                    <div
                      className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                        privacyConsent
                          ? "bg-[#F06419] border-[#F06419] text-black"
                          : "border-[#444C58] bg-[#0E1012]"
                      }`}
                    >
                      {privacyConsent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="text-xs sm:text-sm text-[#B8B9BC] group-hover:text-[#F5F2EC] transition-colors leading-snug">
                      I acknowledge the{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#F5F2EC] underline underline-offset-2 hover:text-[#F06419]"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and consent to EDYREX reviewing this enquiry and contacting me regarding my project.{" "}
                      <span className="text-[#F06419]">*</span>
                    </div>
                  </div>
                  {stepErrors.privacyConsent && (
                    <span className="text-xs text-[#EF6B6B] font-mono block pl-8">
                      {stepErrors.privacyConsent}
                    </span>
                  )}

                  {serverError && (
                    <div className="p-4 rounded-[10px] bg-[#EF6B6B]/10 border border-[#EF6B6B]/30 flex items-center gap-3 text-xs text-[#EF6B6B] font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Cloudflare Turnstile Bot Protection */}
                  <TurnstileWidget
                    action="project_enquiry"
                    onSuccess={turnstile.onSuccess}
                    onError={turnstile.onError}
                    onExpire={turnstile.onExpire}
                    theme="dark"
                  />

                  {/* Step 03 Navigation Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#292E35]">
                    <button
                      type="button"
                      onClick={() => {
                        setStepErrors({});
                        setCurrentStep(2);
                      }}
                      className="w-full sm:w-auto px-6 py-4 rounded-[8px] border border-[#292E35] bg-transparent text-[#F5F2EC] hover:bg-[#1A1E24] hover:border-[#3D4450] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>BACK TO SCOPE</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-4 px-6 rounded-[8px] bg-[#F06419] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D95612] transition-all duration-75 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span>{submitExplanation || "SUBMITTING ENQUIRY..."}</span>
                        </div>
                      ) : (
                        <>
                          <span>SUBMIT PROJECT ENQUIRY</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* SUCCESS STATE: ENQUIRY RECEIVED                           */}
              {/* ========================================================= */}
              {isSuccess && (
                <div className="pt-8 pb-4 space-y-8 animate-fadeIn">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#56C58B]/10 border border-[#56C58B]/30 text-[#56C58B] text-xs font-mono font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ENQUIRY RECEIVED</span>
                    </div>

                    <h2 className="font-heading font-extrabold text-[clamp(2rem,3.4vw,3rem)] text-[#F5F2EC] leading-[1.05] tracking-tight">
                      Your next move starts here.
                    </h2>

                    <p className="text-sm sm:text-base text-[#898D94] leading-relaxed max-w-xl">
                      Thank you for sharing your project with EDYREX. Your enquiry has been received successfully.
                    </p>
                  </div>

                  {/* Public Reference Card */}
                  {referenceCode && (
                    <div className="p-4 rounded-[12px] bg-[#0E1012] border border-[#292E35] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-mono text-[#898D94] uppercase tracking-wider">
                        ENQUIRY REFERENCE
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#F06419] tracking-widest">
                        {referenceCode}
                      </span>
                    </div>
                  )}

                  {/* What happens next? */}
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
                      WHAT HAPPENS NEXT?
                    </span>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-3.5 rounded-[10px] bg-[#0E1012] border border-[#292E35]">
                        <span className="font-mono text-xs font-bold text-[#F06419] shrink-0 mt-0.5">
                          01
                        </span>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[#F5F2EC] uppercase tracking-tight">
                            ENQUIRY RECEIVED
                          </h4>
                          <p className="text-xs text-[#898D94] mt-0.5 leading-relaxed">
                            Your project details have reached the EDYREX studio.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3.5 rounded-[10px] bg-[#0E1012] border border-[#292E35]">
                        <span className="font-mono text-xs font-bold text-[#F06419] shrink-0 mt-0.5">
                          02
                        </span>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[#F5F2EC] uppercase tracking-tight">
                            REQUIREMENTS REVIEWED
                          </h4>
                          <p className="text-xs text-[#898D94] mt-0.5 leading-relaxed">
                            We review your requirements and identify the appropriate next steps.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3.5 rounded-[10px] bg-[#0E1012] border border-[#292E35]">
                        <span className="font-mono text-xs font-bold text-[#F06419] shrink-0 mt-0.5">
                          03
                        </span>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[#F5F2EC] uppercase tracking-tight">
                            STUDIO FOLLOW-UP
                          </h4>
                          <p className="text-xs text-[#898D94] mt-0.5 leading-relaxed">
                            We contact you using the details you provided.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {wantsDiscoveryCall && (
                    <div className="p-4 rounded-[12px] bg-[#F06419]/10 border border-[#F06419]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-heading font-bold text-sm text-[#F5F2EC]">
                          Lock In Your Discovery Session
                        </h4>
                        <p className="text-xs text-[#898D94]">
                          Select a convenient slot on our live Cal.com calendar right now.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          openBookingModal({
                            prefill: { name: fullName, email: workEmail },
                          })
                        }
                        className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] bg-[#F06419] hover:bg-[#FF7A2E] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 transition-colors shadow-md shadow-[#F06419]/20 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Discovery Call</span>
                      </button>
                    </div>
                  )}

                  {/* Success CTAs */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#292E35]">
                    <Link
                      href={`/thank-you?ref=${encodeURIComponent(referenceCode)}&stored=true&call=${wantsDiscoveryCall}`}
                      className="w-full sm:flex-1 py-4 rounded-[8px] bg-[#F06419] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D95612] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                    >
                      <span>VIEW CONFIRMATION RECEIPT</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/"
                      className="w-full sm:w-auto px-6 py-4 rounded-[8px] border border-[#292E35] bg-[#0E1012] text-[#F5F2EC] hover:bg-[#1A1E24] hover:border-[#3D4450] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
                    >
                      <span>RETURN HOME</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
