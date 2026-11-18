"use client";

import { useState, useCallback } from "react";

export interface UseTurnstileReturn {
  token: string | null;
  isVerified: boolean;
  isExpired: boolean;
  hasError: boolean;
  errorMessage: string | null;
  onSuccess: (receivedToken: string) => void;
  onError: (error?: any) => void;
  onExpire: () => void;
  reset: () => void;
}

export function useTurnstile(): UseTurnstileReturn {
  const [token, setToken] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSuccess = useCallback((receivedToken: string) => {
    setToken(receivedToken);
    setIsExpired(false);
    setHasError(false);
    setErrorMessage(null);
  }, []);

  const onError = useCallback((error?: any) => {
    setToken(null);
    setHasError(true);
    setErrorMessage(
      typeof error === "string"
        ? error
        : "Verification challenge encountered an issue. Please retry."
    );
  }, []);

  const onExpire = useCallback(() => {
    setToken(null);
    setIsExpired(true);
    setErrorMessage("Verification challenge expired. Please retry.");
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setIsExpired(false);
    setHasError(false);
    setErrorMessage(null);
  }, []);

  return {
    token,
    isVerified: Boolean(token),
    isExpired,
    hasError,
    errorMessage,
    onSuccess,
    onError,
    onExpire,
    reset,
  };
}
