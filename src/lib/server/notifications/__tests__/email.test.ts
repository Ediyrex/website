import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  htmlToPlainText,
  sendEmail,
  isResendConfigured,
} from "../email.provider";
import {
  renderEnquiryReceivedEmail,
  renderNewEnquiryAdminEmail,
  renderPasswordResetEmail,
  renderTestEmail,
} from "../email.templates";
import {
  queueNotificationJob,
  sendDirectTestEmail,
} from "../notifications.service";
import {
  DEFAULT_FROM_EMAIL,
  DEFAULT_REPLY_TO,
  ADMIN_NOTIFICATION_EMAIL,
} from "../email.constants";

describe("Email Provider & Plain Text Extraction", () => {
  it("converts HTML email body into readable plain-text", () => {
    const html = `
      <h1>Hello John</h1>
      <p>Your enquiry has been received &amp; logged.</p>
      <br />
      <p>Visit <a href="https://ediyrex.com">our website</a>.</p>
    `;

    const plain = htmlToPlainText(html);
    expect(plain).toContain("Hello John");
    expect(plain).toContain("Your enquiry has been received & logged.");
    expect(plain).toContain("our website");
    expect(plain).not.toContain("<h1>");
    expect(plain).not.toContain("&amp;");
  });

  it("dispatches mocked email successfully in test mode", async () => {
    const result = await sendEmail({
      to: "client@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });

    expect(result.success).toBe(true);
    expect(result.isMocked).toBe(true);
    expect(result.messageId).toBeDefined();
  });
});

describe("Email Templates Rendering", () => {
  it("renders Client Enquiry Received template with reference code and Cal.com CTA", () => {
    const { subject, html } = renderEnquiryReceivedEmail({
      name: "Alex Vance",
      referenceCode: "EDY-2026-9901",
      projectType: "Autonomous AI Agents",
      budgetCurrency: "USD",
      budgetRange: "$10,000 - $25,000",
      wantsDiscoveryCall: true,
    });

    expect(subject).toContain("EDY-2026-9901");
    expect(html).toContain("Hello Alex Vance");
    expect(html).toContain("Autonomous AI Agents");
    expect(html).toContain("Schedule Discovery Call");
    expect(html).toContain("EDIYREX");
  });

  it("renders Studio Lead Alert template with full brief details and CRM link", () => {
    const { subject, html } = renderNewEnquiryAdminEmail({
      name: "Morgan Lee",
      email: "morgan@acme.corp",
      company: "Acme Corporation",
      phone: "+1-555-0199",
      referenceCode: "EDY-2026-8822",
      projectType: "Full-Stack Web Application",
      goals: "Build an enterprise portal with high throughput",
      budgetCurrency: "USD",
      budgetRange: "$50,000+",
      timeline: "Q1 2027",
      wantsDiscoveryCall: false,
    });

    expect(subject).toContain("[NEW LEAD]");
    expect(subject).toContain("Morgan Lee");
    expect(html).toContain("Acme Corporation");
    expect(html).toContain("morgan@acme.corp");
    expect(html).toContain("Build an enterprise portal");
    expect(html).toContain("/admin/inquiries");
  });

  it("renders Password Reset email with secure single-use link", () => {
    const { subject, html } = renderPasswordResetEmail({
      displayName: "Studio Admin",
      resetUrl: "https://ediyrex.com/admin/reset-password?token=sec_12345",
      expiresInMinutes: 30,
    });

    expect(subject).toContain("password");
    expect(html).toContain("Studio Admin");
    expect(html).toContain("30 minutes");
    expect(html).toContain("https://ediyrex.com/admin/reset-password?token=sec_12345");
  });

  it("renders Infrastructure Test template", () => {
    const { subject, html } = renderTestEmail("director@ediyrex.com");
    expect(subject).toContain("EDIYREX Studio · Notification Infrastructure Active");
    expect(html).toContain("director@ediyrex.com");
    expect(html).toContain("Resend Node.js SDK");
  });
});

describe("Notification Service Execution", () => {
  it("handles queuing safely in preview mode when no db is connected", async () => {
    const res = await queueNotificationJob({
      eventType: "enquiry.submitted",
      entityType: "enquiry",
      entityId: "123e4567-e89b-12d3-a456-426614174000",
      templateKey: "enquiry_received",
      payload: { name: "Test User" },
    });

    expect(res).toBeDefined();
    expect(typeof res.id).toBe("string");
  });

  it("dispatches direct test email in test mode", async () => {
    const result = await sendDirectTestEmail("test@ediyrex.com");
    expect(result.success).toBe(true);
    expect(result.isMocked).toBe(true);
  });
});
