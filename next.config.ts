import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // 15. Clickjacking mitigation (X-Frame-Options)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // MIME-sniffing prevention
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Strict referrer policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Restrict browser features & sensors
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          // HSTS enforcement for HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // 14. Content Security Policy (CSP) + Clickjacking (frame-ancestors 'none')
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://plausible.io https://www.googletagmanager.com https://app.cal.com https://cal.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://www.google.com https://*.google.com https://images.unsplash.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://challenges.cloudflare.com https://plausible.io https://*.google-analytics.com https://api.cal.com https://app.cal.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://res.cloudinary.com",
              "frame-src 'self' https://challenges.cloudflare.com https://app.cal.com https://cal.com",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", statusCode: 301 },
      { source: "/portfolio", destination: "/work", statusCode: 301 },
      { source: "/projects", destination: "/work", statusCode: 301 },
      { source: "/projects/:slug", destination: "/work/:slug", statusCode: 301 },
      { source: "/service/:division", destination: "/services/:division", statusCode: 301 },
      { source: "/services/branding-marketing", destination: "/services/branding", statusCode: 301 },
      { source: "/services/web-dev", destination: "/services/digital", statusCode: 301 },
      { source: "/services/agents-and-automation", destination: "/services/ai", statusCode: 301 },
      { source: "/privacy-policy", destination: "/privacy", statusCode: 301 },
      { source: "/terms-and-conditions", destination: "/terms", statusCode: 301 },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withSentryConfig(nextConfig, {
  org: "ediyrex",
  project: "website",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Disabled to prevent conflicts with React Three Fiber (R3F) 3D canvas primitives
  reactComponentAnnotation: { enabled: false },
  tunnelRoute: "/monitoring",
});
