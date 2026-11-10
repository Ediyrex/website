import { describe, it, expect } from "vitest";
import { enquirySchema } from "../enquiry";

describe("enquirySchema", () => {
  const validPayload = {
    name: "Aarav Sharma",
    email: "aarav@example.com",
    company: "Northstar Labs",
    phone: "+91 9876543210",
    projectType: "ai-agents",
    goals: "Looking to automate internal document processing and support triage.",
    budgetCurrency: "INR" as const,
    budgetRange: "tier_3" as const,
    timeline: "within_1_month" as const,
    wantsDiscoveryCall: true,
    consentAccepted: true,
  };

  it("accepts a valid enquiry with INR budget and discovery call request", () => {
    const result = enquirySchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects enquiry when consentAccepted is false", () => {
    const result = enquirySchema.safeParse({
      ...validPayload,
      consentAccepted: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.consentAccepted).toBeDefined();
    }
  });

  it("rejects invalid email and short goals description", () => {
    const result = enquirySchema.safeParse({
      ...validPayload,
      email: "not-an-email",
      goals: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.email).toBeDefined();
      expect(fields.goals).toBeDefined();
    }
  });
});

