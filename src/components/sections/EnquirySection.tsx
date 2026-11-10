"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2, Send, Calendar } from "lucide-react";
import { enquirySchema, EnquiryFormData } from "@/lib/validations/enquiry";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BudgetCurrency } from "@/types";
import { cn } from "@/lib/utils";

const BUDGET_TIERS: Record<BudgetCurrency, { value: string; label: string }[]> = {
  USD: [
    { value: "tier_1", label: "Under $3,000" },
    { value: "tier_2", label: "$3,000 – $10,000" },
    { value: "tier_3", label: "$10,000 – $25,000" },
    { value: "tier_4", label: "$25,000 – $50,000" },
    { value: "tier_5", label: "$50,000+" },
    { value: "not_sure", label: "Flexible / Exploring Scope" },
  ],
  INR: [
    { value: "tier_1", label: "Under ₹2,50,000" },
    { value: "tier_2", label: "₹2,50,000 – ₹8,00,000" },
    { value: "tier_3", label: "₹8,00,000 – ₹20,00,000" },
    { value: "tier_4", label: "₹20,00,000 – ₹40,00,000" },
    { value: "tier_5", label: "₹40,00,000+" },
    { value: "not_sure", label: "Flexible / Exploring Scope" },
  ],
};

export function EnquirySection() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";

  const [formData, setFormData] = useState<Partial<EnquiryFormData>>({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: preselectedService || "website-design-development",
    goals: "",
    budgetCurrency: "USD",
    budgetRange: "tier_2",
    timeline: "within_1_month",
    wantsDiscoveryCall: true,
    consentAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [serverError, setServerError] = useState("");

  const activeCurrency: BudgetCurrency = formData.budgetCurrency || "USD";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const nextValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCurrencyChange = (currency: BudgetCurrency) => {
    setFormData((prev) => ({ ...prev, budgetCurrency: currency }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    const result = enquirySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to submit enquiry");
      }

      setReferenceId(json.data?.referenceId || "");
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass =
    "w-full h-12 px-3.5 rounded-[8px] bg-[#0D0F12] border border-[#3A414B] text-[#F5F3EE] placeholder-[#777D87] text-sm focus:outline-none focus:border-[#D6B77A] focus:ring-1 focus:ring-[#D6B77A] transition-colors";

  return (
    <section
      id="contact"
      className="py-16 md:py-24 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="accent">Discovery &amp; Enquiry</Badge>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15]">
              Tell us what you are working on.
            </h2>
            <p className="text-[#B2B4BA] text-sm sm:text-base leading-relaxed">
              Serving teams in India and globally. Share your goals across Media, Digital, or AI, and we will help shape the clearest path forward.
            </p>

            <div className="space-y-3.5 pt-4 border-t border-[#252A32]">
              <div className="flex items-center gap-3 text-sm text-[#B2B4BA]">
                <CheckCircle className="w-4 h-4 text-[#54C99A] shrink-0" />
                <span>Direct response from studio engineering &amp; creative leads</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#B2B4BA]">
                <CheckCircle className="w-4 h-4 text-[#54C99A] shrink-0" />
                <span>Clear scope quotation before execution begins</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#B2B4BA]">
                <CheckCircle className="w-4 h-4 text-[#54C99A] shrink-0" />
                <span>Scoping available in USD or INR</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] text-sm space-y-2">
              <span className="text-[11px] font-mono text-[#D6B77A] uppercase tracking-wider block">
                Direct Contact
              </span>
              <p className="text-[#F5F3EE] font-medium">Ediyrex Studio</p>
              <a
                href="mailto:hello@ediyrex.com"
                className="text-[#B2B4BA] hover:text-[#F5F3EE] font-mono text-xs transition-colors"
              >
                hello@ediyrex.com
              </a>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#12151A] border border-[#252A32]">
              {isSuccess ? (
                <div role="status" className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#E9B86A]/10 border border-[#E9B86A]/30 text-[#E9B86A] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-[#F5F3EE]">
                    Enquiry Validated (Local Preview)
                  </h3>
                  {referenceId && (
                    <p className="text-xs font-mono text-[#D6B77A]">
                      Preview Reference: {referenceId}
                    </p>
                  )}
                  <p className="text-sm text-[#B2B4BA] max-w-md mx-auto leading-relaxed">
                    Your brief passed client and server validation, but persistent database storage and email notifications are not yet connected in this local preview build. Please email{" "}
                    <a
                      href="mailto:hello@ediyrex.com"
                      className="text-[#D6B77A] underline hover:text-[#E6CC99]"
                    >
                      hello@ediyrex.com
                    </a>{" "}
                    directly to reach the studio.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      setReferenceId("");
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        phone: "",
                        projectType: "website-design-development",
                        goals: "",
                        budgetCurrency: "USD",
                        budgetRange: "tier_2",
                        timeline: "within_1_month",
                        wantsDiscoveryCall: true,
                        consentAccepted: false,
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Submit Another Enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#252A32]">
                    <h3 className="font-heading text-lg font-semibold text-[#F5F3EE]">
                      Project Enquiry
                    </h3>
                    <span className="text-[11px] font-mono text-[#777D87] uppercase">
                      * Required fields
                    </span>
                  </div>

                  {serverError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-[#F07878] text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="enquiry-name"
                        className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
                      >
                        Your Name *
                      </label>
                      <input
                        id="enquiry-name"
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        placeholder="Alex Morgan"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "error-name" : undefined}
                        className={cn(
                          inputBaseClass,
                          errors.name && "border-[#F07878]"
                        )}
                      />
                      {errors.name && (
                        <p
                          id="error-name"
                          className="text-xs text-[#F07878] mt-1.5 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="enquiry-email"
                        className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
                      >
                        Work Email *
                      </label>
                      <input
                        id="enquiry-email"
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "error-email" : undefined
                        }
                        className={cn(
                          inputBaseClass,
                          errors.email && "border-[#F07878]"
                        )}
                      />
                      {errors.email && (
                        <p
                          id="error-email"
                          className="text-xs text-[#F07878] mt-1.5 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company */}
                    <div>
                      <label
                        htmlFor="enquiry-company"
                        className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
                      >
                        Company / Organisation
                      </label>
                      <input
                        id="enquiry-company"
                        type="text"
                        name="company"
                        value={formData.company || ""}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className={inputBaseClass}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="enquiry-phone"
                        className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="enquiry-phone"
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        placeholder="+91 / +1 ..."
                        className={inputBaseClass}
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label
                      htmlFor="enquiry-project-type"
                      className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
                    >
                      Project Type / Service *
                    </label>
                    <select
                      id="enquiry-project-type"
                      name="projectType"
                      value={formData.projectType || ""}
                      onChange={handleChange}
                      className={cn(inputBaseClass, "cursor-pointer")}
                    >
                      <optgroup label="Digital">
                        <option value="website-design-development">
                          Website Design &amp; Development
                        </option>
                        <option value="saas-products-dashboards">
                          SaaS Products &amp; Dashboards
                        </option>
                        <option value="landing-pages">
                          Landing Pages &amp; Conversion Websites
                        </option>
                        <option value="ecommerce-websites">
                          E-Commerce Experiences
                        </option>
                        <option value="ui-ux-design">UI / UX Design</option>
                        <option value="full-stack-app-dev">
                          Full-Stack App Development
                        </option>
                        <option value="brand-identity-graphic-design">
                          Brand Identity &amp; Graphic Design
                        </option>
                      </optgroup>
                      <optgroup label="Artificial Intelligence">
                        <option value="ai-agents">Autonomous AI Agents</option>
                        <option value="ai-voice-receptionist">
                          AI Voice Receptionist
                        </option>
                        <option value="business-workflow-automation">
                          Business Workflow Automation
                        </option>
                        <option value="ai-research-knowledge-systems-rag">
                          AI Knowledge Systems (RAG)
                        </option>
                        <option value="ai-chatbots-customer-support">
                          AI Chatbots &amp; Customer Support
                        </option>
                        <option value="custom-ai-applications">
                          Custom AI Applications
                        </option>
                        <option value="ai-integration-existing-products">
                          AI Integration for Existing Products
                        </option>
                      </optgroup>
                      <optgroup label="Media">
                        <option value="video-production">Video Production</option>
                        <option value="reels-short-form-videos">
                          Reels &amp; Short-Form Video
                        </option>
                        <option value="brand-films-commercials">
                          Brand Films &amp; Commercials
                        </option>
                        <option value="photography">Photography</option>
                        <option value="motion-graphics-animation">
                          Motion Graphics &amp; Animation
                        </option>
                        <option value="social-media-content">
                          Social Media Content
                        </option>
                        <option value="content-strategy">
                          Content Strategy
                        </option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Budget & Timeline Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="enquiry-budget"
                          className="block text-xs font-medium text-[#F5F3EE]"
                        >
                          Indicative Budget
                        </label>
                        <div
                          className="inline-flex rounded-md border border-[#252A32] bg-[#0D0F12] p-0.5"
                          role="group"
                          aria-label="Budget currency"
                        >
                          {(["USD", "INR"] as BudgetCurrency[]).map((curr) => (
                            <button
                              key={curr}
                              type="button"
                              onClick={() => handleCurrencyChange(curr)}
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-mono rounded transition-colors cursor-pointer",
                                activeCurrency === curr
                                  ? "bg-[#D6B77A] text-[#17130B] font-semibold"
                                  : "text-[#B2B4BA] hover:text-[#F5F3EE]"
                              )}
                            >
                              {curr}
                            </button>
                          ))}
                        </div>
                      </div>
                      <select
                        id="enquiry-budget"
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className={cn(inputBaseClass, "cursor-pointer")}
                      >
                        {BUDGET_TIERS[activeCurrency].map((tier) => (
                          <option key={tier.value} value={tier.value}>
                            {tier.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="enquiry-timeline"
                        className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
                      >
                        Desired Timeline
                      </label>
                      <select
                        id="enquiry-timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className={cn(inputBaseClass, "cursor-pointer")}
                      >
                        <option value="immediate">Immediate (&lt; 2 weeks)</option>
                        <option value="within_1_month">Within 1 month</option>
                        <option value="1_to_3_months">1 to 3 months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Goals */}
                  <div>
                    <label
                      htmlFor="enquiry-goals"
                      className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
                    >
                      Project Overview &amp; Requirements *
                    </label>
                    <textarea
                      id="enquiry-goals"
                      name="goals"
                      rows={4}
                      value={formData.goals || ""}
                      onChange={handleChange}
                      placeholder="Describe what you want to build or produce, key constraints, and desired outcomes..."
                      aria-invalid={Boolean(errors.goals)}
                      aria-describedby={errors.goals ? "error-goals" : undefined}
                      className={cn(
                        "w-full min-h-[120px] p-3.5 rounded-[8px] bg-[#0D0F12] border border-[#3A414B] text-[#F5F3EE] placeholder-[#777D87] text-sm focus:outline-none focus:border-[#D6B77A] focus:ring-1 focus:ring-[#D6B77A] transition-colors",
                        errors.goals && "border-[#F07878]"
                      )}
                    />
                    {errors.goals && (
                      <p
                        id="error-goals"
                        className="text-xs text-[#F07878] mt-1.5 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.goals}</span>
                      </p>
                    )}
                  </div>

                  {/* Discovery Call & Consent */}
                  <div className="space-y-3 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#F5F3EE]">
                      <input
                        type="checkbox"
                        name="wantsDiscoveryCall"
                        checked={Boolean(formData.wantsDiscoveryCall)}
                        onChange={handleChange}
                        className="mt-0.5 rounded border-[#3A414B] bg-[#0D0F12] accent-[#D6B77A]"
                      />
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                        <span>
                          Request a 30-minute discovery call to discuss scope
                        </span>
                      </span>
                    </label>

                    <div>
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#B2B4BA]">
                        <input
                          type="checkbox"
                          name="consentAccepted"
                          checked={Boolean(formData.consentAccepted)}
                          onChange={handleChange}
                          aria-invalid={Boolean(errors.consentAccepted)}
                          aria-describedby={
                            errors.consentAccepted ? "error-consent" : undefined
                          }
                          className="mt-0.5 rounded border-[#3A414B] bg-[#0D0F12] accent-[#D6B77A]"
                        />
                        <span>
                          I acknowledge the{" "}
                          <a
                            href="/privacy"
                            className="text-[#D6B77A] underline hover:text-[#E6CC99]"
                          >
                            Privacy Policy
                          </a>{" "}
                          and consent to Ediyrex Studio reviewing this enquiry to respond. *
                        </span>
                      </label>
                      {errors.consentAccepted && (
                        <p
                          id="error-consent"
                          className="text-xs text-[#F07878] mt-1.5 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.consentAccepted}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      variant="primary"
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {formData.wantsDiscoveryCall
                              ? "Submit & Book Discovery Call"
                              : "Submit Project Enquiry"}
                          </span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
