import { EMAIL_THEME } from "./email.constants";

interface EmailWrapperOptions {
  preheader: string;
  title: string;
  bodyContent: string;
}

/**
 * Common dark editorial email template shell.
 * Uses inline styles and table layout for compatibility across all email clients.
 */
function wrapInEmailShell({ preheader, title, bodyContent }: EmailWrapperOptions): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ediyrex.com";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${EMAIL_THEME.bg}; color: ${EMAIL_THEME.textPrimary}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader preview text (invisible in email body) -->
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: ${EMAIL_THEME.bg};">
    ${preheader} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${EMAIL_THEME.bg};">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <!-- Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${EMAIL_THEME.cardBg}; border: 1px solid ${EMAIL_THEME.border}; border-radius: 12px; overflow: hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 36px; border-bottom: 1px solid ${EMAIL_THEME.border}; background-color: #0E1014;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: ${EMAIL_THEME.textPrimary}; text-decoration: none;">
                      EDIYREX <span style="color: ${EMAIL_THEME.accentOrange}; font-size: 18px;">STUDIO</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: monospace; font-size: 11px; color: ${EMAIL_THEME.accentGold}; letter-spacing: 1px; text-transform: uppercase;">
                      DISCIPLINES // 04
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 36px 36px 28px 36px; line-height: 1.6;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; border-top: 1px solid ${EMAIL_THEME.border}; background-color: #0B0D10; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: ${EMAIL_THEME.textMuted}; line-height: 1.5;">
                EDIYREX Studio &middot; Creative, Digital &amp; Autonomous Agent Systems<br>
                Global operations &middot; <a href="${siteUrl}" style="color: ${EMAIL_THEME.accentGold}; text-decoration: none;">ediyrex.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #555A64;">
                This transactional notification was generated automatically by the EDIYREX application platform.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. Client Enquiry Received Confirmation
 */
export function renderEnquiryReceivedEmail(payload: {
  name: string;
  referenceCode: string;
  projectType: string;
  budgetCurrency?: string;
  budgetRange?: string;
  wantsDiscoveryCall?: boolean;
}): { subject: string; html: string } {
  const subject = `We have received your project enquiry · EDIYREX (${payload.referenceCode})`;
  const preheader = `Thank you ${payload.name}, your enquiry ${payload.referenceCode} has been received by our studio directors.`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ediyrex.com";
  const calBookingUrl =
    process.env.NEXT_PUBLIC_CAL_BOOKING_URL || "https://cal.com/ediyrex-pbxgua";

  const bodyContent = `
    <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: ${EMAIL_THEME.textPrimary}; letter-spacing: -0.3px;">
      Hello ${payload.name},
    </h1>
    <p style="margin: 0 0 20px 0; font-size: 15px; color: ${EMAIL_THEME.textSecondary};">
      Thank you for reaching out to EDIYREX Studio. We have successfully logged your project brief under reference code <strong style="color: ${EMAIL_THEME.accentGold}; font-family: monospace;">${payload.referenceCode}</strong>.
    </p>

    <!-- Details Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0E1014; border: 1px solid ${EMAIL_THEME.border}; border-radius: 8px; margin: 24px 0; padding: 18px 20px;">
      <tr>
        <td style="font-size: 13px; color: ${EMAIL_THEME.textMuted}; font-family: monospace; padding-bottom: 6px;">PROJECT DISCIPLINE</td>
      </tr>
      <tr>
        <td style="font-size: 15px; color: ${EMAIL_THEME.textPrimary}; font-weight: 600; padding-bottom: 14px;">${payload.projectType}</td>
      </tr>
      <tr>
        <td style="font-size: 13px; color: ${EMAIL_THEME.textMuted}; font-family: monospace; padding-bottom: 6px;">STATUS</td>
      </tr>
      <tr>
        <td style="font-size: 14px; color: ${EMAIL_THEME.accentGold}; font-weight: 500;">In Director Review &middot; SLA within 24 hours</td>
      </tr>
    </table>

    <p style="margin: 0 0 24px 0; font-size: 14px; color: ${EMAIL_THEME.textSecondary};">
      Our team is reviewing your project objectives and budget specifications. If your requirements are time-sensitive, you may also reserve a 30-minute discovery call directly with our technical director:
    </p>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 16px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: ${EMAIL_THEME.accentOrange};">
          <a href="${calBookingUrl}" target="_blank" style="font-size: 13px; font-family: monospace; font-weight: 700; color: #08090B; text-decoration: none; padding: 14px 28px; display: inline-block; letter-spacing: 0.5px; text-transform: uppercase;">
            Schedule Discovery Call &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject,
    html: wrapInEmailShell({ preheader, title: subject, bodyContent }),
  };
}

/**
 * 2. Internal Studio Alert: New Enquiry Received
 */
export function renderNewEnquiryAdminEmail(payload: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  referenceCode: string;
  projectType: string;
  goals: string;
  budgetCurrency?: string;
  budgetRange?: string;
  timeline?: string;
  wantsDiscoveryCall?: boolean;
}): { subject: string; html: string } {
  const subject = `[NEW LEAD] ${payload.name} · ${payload.projectType} (${payload.referenceCode})`;
  const preheader = `New project brief from ${payload.name} (${payload.company || "Individual"}) for ${payload.projectType}.`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ediyrex.com";
  const adminUrl = `${siteUrl}/admin/inquiries`;

  const bodyContent = `
    <div style="border-left: 3px solid ${EMAIL_THEME.accentOrange}; padding-left: 14px; margin-bottom: 20px;">
      <span style="font-family: monospace; font-size: 11px; color: ${EMAIL_THEME.accentOrange}; font-weight: 700; text-transform: uppercase;">
        NEW INCOMING PROJECT BRIEF
      </span>
      <h1 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 700; color: ${EMAIL_THEME.textPrimary};">
        ${payload.name} &middot; <span style="font-family: monospace; color: ${EMAIL_THEME.accentGold};">${payload.referenceCode}</span>
      </h1>
    </div>

    <!-- Metadata Grid -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0E1014; border: 1px solid ${EMAIL_THEME.border}; border-radius: 8px; margin: 16px 0; padding: 16px 20px; font-size: 13px;">
      <tr>
        <td style="color: ${EMAIL_THEME.textMuted}; width: 35%; padding-bottom: 8px;">EMAIL</td>
        <td style="color: ${EMAIL_THEME.textPrimary}; font-weight: 600; padding-bottom: 8px;">
          <a href="mailto:${payload.email}" style="color: ${EMAIL_THEME.accentGold}; text-decoration: none;">${payload.email}</a>
        </td>
      </tr>
      ${
        payload.company
          ? `<tr>
              <td style="color: ${EMAIL_THEME.textMuted}; padding-bottom: 8px;">COMPANY</td>
              <td style="color: ${EMAIL_THEME.textPrimary}; padding-bottom: 8px;">${payload.company}</td>
            </tr>`
          : ""
      }
      ${
        payload.phone
          ? `<tr>
              <td style="color: ${EMAIL_THEME.textMuted}; padding-bottom: 8px;">PHONE</td>
              <td style="color: ${EMAIL_THEME.textPrimary}; padding-bottom: 8px;">${payload.phone}</td>
            </tr>`
          : ""
      }
      <tr>
        <td style="color: ${EMAIL_THEME.textMuted}; padding-bottom: 8px;">DISCIPLINE</td>
        <td style="color: ${EMAIL_THEME.textPrimary}; font-weight: 600; padding-bottom: 8px;">${payload.projectType}</td>
      </tr>
      <tr>
        <td style="color: ${EMAIL_THEME.textMuted}; padding-bottom: 8px;">BUDGET</td>
        <td style="color: ${EMAIL_THEME.textPrimary}; padding-bottom: 8px;">${payload.budgetCurrency || "USD"} &middot; ${payload.budgetRange || "Flexible"}</td>
      </tr>
      <tr>
        <td style="color: ${EMAIL_THEME.textMuted};">TIMELINE</td>
        <td style="color: ${EMAIL_THEME.textPrimary};">${payload.timeline || "Not specified"}</td>
      </tr>
    </table>

    <div style="margin: 20px 0;">
      <span style="font-family: monospace; font-size: 11px; color: ${EMAIL_THEME.textMuted}; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 6px;">
        CLIENT STATEMENT / GOALS
      </span>
      <div style="background-color: #0E1014; border: 1px solid ${EMAIL_THEME.border}; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: ${EMAIL_THEME.textSecondary}; line-height: 1.6; white-space: pre-wrap;">
        ${payload.goals}
      </div>
    </div>

    <!-- Admin CTA -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0 8px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: ${EMAIL_THEME.accentGold};">
          <a href="${adminUrl}" target="_blank" style="font-size: 13px; font-family: monospace; font-weight: 700; color: #08090B; text-decoration: none; padding: 12px 24px; display: inline-block; letter-spacing: 0.5px; text-transform: uppercase;">
            Open Lead in Studio CRM &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  return {
    subject,
    html: wrapInEmailShell({ preheader, title: subject, bodyContent }),
  };
}

/**
 * 3. Password Reset Email
 */
export function renderPasswordResetEmail(payload: {
  displayName: string;
  resetUrl: string;
  expiresInMinutes?: number;
}): { subject: string; html: string } {
  const subject = "Reset your EDIYREX Studio account password";
  const preheader = "Use this single-use link to reset your administrative portal credentials.";

  const bodyContent = `
    <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: ${EMAIL_THEME.textPrimary};">
      Password Reset Request
    </h1>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: ${EMAIL_THEME.textSecondary};">
      Hello ${payload.displayName}, we received a request to reset your password for the EDIYREX administrative portal.
    </p>
    <p style="margin: 0 0 24px 0; font-size: 14px; color: ${EMAIL_THEME.textSecondary};">
      Click the secure button below to set a new password. This link is single-use and will expire in ${payload.expiresInMinutes || 30} minutes.
    </p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: ${EMAIL_THEME.accentGold};">
          <a href="${payload.resetUrl}" target="_blank" style="font-size: 13px; font-family: monospace; font-weight: 700; color: #08090B; text-decoration: none; padding: 14px 28px; display: inline-block; text-transform: uppercase;">
            Reset Password &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 24px 0 0 0; font-size: 12px; color: ${EMAIL_THEME.textMuted}; line-height: 1.5;">
      If you did not request this change, you can safely disregard this email. Your password will remain unchanged.
    </p>
  `;

  return {
    subject,
    html: wrapInEmailShell({ preheader, title: subject, bodyContent }),
  };
}

/**
 * 4. General Studio Test Notification
 */
export function renderTestEmail(toEmail: string): { subject: string; html: string } {
  const subject = "EDIYREX Studio · Notification Infrastructure Active";
  const preheader = "Resend transactional email delivery test successful.";

  const bodyContent = `
    <div style="border-left: 3px solid ${EMAIL_THEME.accentGold}; padding-left: 14px; margin-bottom: 20px;">
      <span style="font-family: monospace; font-size: 11px; color: ${EMAIL_THEME.accentGold}; font-weight: 700; text-transform: uppercase;">
        INFRASTRUCTURE VERIFICATION
      </span>
      <h1 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 700; color: ${EMAIL_THEME.textPrimary};">
        Resend Transactional Delivery Verified
      </h1>
    </div>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: ${EMAIL_THEME.textSecondary};">
      This test message confirms that the EDIYREX central notification service is functioning and authorized to deliver emails to <strong style="color: ${EMAIL_THEME.textPrimary};">${toEmail}</strong>.
    </p>
    <div style="background-color: #0E1014; border: 1px solid ${EMAIL_THEME.border}; border-radius: 8px; padding: 14px 18px; font-family: monospace; font-size: 12px; color: ${EMAIL_THEME.accentGold}; margin: 20px 0;">
      TIMESTAMP: ${new Date().toISOString()}<br>
      PROVIDER: Resend Node.js SDK<br>
      STATUS: Connected
    </div>
  `;

  return {
    subject,
    html: wrapInEmailShell({ preheader, title: subject, bodyContent }),
  };
}
