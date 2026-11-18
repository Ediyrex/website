const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptLoadingPromise: Promise<void> | null = null;

export function getTurnstileSiteKey(): string {
  const envKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (envKey) return envKey;

  // Cloudflare official test passing sitekey for development preview
  return "1x00000000000000000000AA";
}

/**
 * Ensures the Cloudflare Turnstile explicit script is loaded into the document once.
 */
export function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if script tag is already in DOM
    const existingScript = document.querySelector(
      `script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`
    );

    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = (err) => {
      scriptLoadingPromise = null;
      reject(new Error("Failed to load Cloudflare Turnstile script"));
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}
