"use client";

import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#08090B",
          color: "#F5F3EE",
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              backgroundColor: "#12151A",
              border: "1px solid #252A32",
              borderRadius: "16px",
              padding: "36px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(240, 100, 25, 0.12)",
                border: "1px solid rgba(240, 100, 25, 0.3)",
                color: "#F06419",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              !
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                margin: "0 0 8px 0",
                color: "#F5F3EE",
                letterSpacing: "-0.02em",
              }}
            >
              Global System Interruption
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#B2B4BA",
                margin: "0 0 24px 0",
                lineHeight: "1.5",
              }}
            >
              A critical layout exception was intercepted and automatically reported to Sentry.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                backgroundColor: "#F06419",
                color: "#08090B",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "13px",
                fontFamily: "monospace",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
