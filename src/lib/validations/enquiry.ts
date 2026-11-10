import { z } from "zod";
import { sanitizePlainText } from "@/lib/server/sanitize";

export const enquirySchema = z.object({
  name: z
    .string()
    .transform(sanitizePlainText)
    .pipe(
      z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long")
    ),
  email: z.string().trim().email("Please provide a valid email address"),
  company: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().max(100))
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().max(30))
    .optional()
    .or(z.literal("")),
  projectType: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().min(1, "Please select a primary service or project type").max(140)),
  goals: z
    .string()
    .transform(sanitizePlainText)
    .pipe(
      z
        .string()
        .min(
          10,
          "Please briefly describe your goals and requirements (at least 10 characters)"
        )
        .max(2000, "Description too long")
    ),
  budgetCurrency: z.enum(["USD", "INR"], {
    message: "Please select a currency",
  }),
  budgetRange: z.enum(
    ["tier_1", "tier_2", "tier_3", "tier_4", "tier_5", "not_sure"],
    {
      message: "Please select an indicative budget range",
    }
  ),
  timeline: z.enum(
    ["immediate", "within_1_month", "1_to_3_months", "flexible"],
    {
      message: "Please select your expected timeline",
    }
  ),
  wantsDiscoveryCall: z.boolean().default(true),
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: "Please confirm consent so we can respond to your enquiry",
  }),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
