export const CONSENT_STORAGE_KEY = "ediyrex_cookie_consent";

export type ConsentLevel = "essential" | "analytics";

export function getConsentChoice(): ConsentLevel | null {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (val === "essential" || val === "analytics") return val;
    return null;
  } catch {
    return null;
  }
}

export function setConsentChoice(choice: ConsentLevel): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    window.dispatchEvent(new Event("ediyrex:consent-updated"));
  } catch {
    // Ignore storage errors
  }
}

export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (getConsentChoice() !== "analytics") return;

  const plausible = (
    window as unknown as {
      plausible?: (
        name: string,
        opts?: { props?: Record<string, string | number | boolean> }
      ) => void;
    }
  ).plausible;

  if (typeof plausible === "function") {
    plausible(eventName, props ? { props } : undefined);
  }
}
