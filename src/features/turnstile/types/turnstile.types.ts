export type TurnstileTheme = "dark" | "light" | "auto";
export type TurnstileSize = "normal" | "compact" | "flexible";

export interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  cData?: string;
  callback?: (token: string) => void;
  "error-callback"?: (error: any) => void;
  "expired-callback"?: () => void;
  theme?: TurnstileTheme;
  size?: TurnstileSize;
  tabindex?: number;
}

export interface TurnstileObject {
  render: (
    container: string | HTMLElement,
    options: TurnstileRenderOptions
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
  getResponse: (widgetId?: string) => string;
}

declare global {
  interface Window {
    turnstile?: TurnstileObject;
    onloadTurnstileCallback?: () => void;
  }
}

export interface TurnstileWidgetProps {
  action?: string;
  onSuccess: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  theme?: TurnstileTheme;
  size?: TurnstileSize;
  className?: string;
  siteKey?: string;
  disabled?: boolean;
}

export interface TurnstileWidgetRef {
  reset: () => void;
  getToken: () => string;
}
