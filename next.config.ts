import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", statusCode: 301 },
      { source: "/portfolio", destination: "/work", statusCode: 301 },
      { source: "/projects", destination: "/work", statusCode: 301 },
      { source: "/projects/:slug", destination: "/work/:slug", statusCode: 301 },
      { source: "/service/:division", destination: "/services/:division", statusCode: 301 },
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

export default nextConfig;
