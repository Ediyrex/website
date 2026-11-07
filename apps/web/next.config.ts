import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable built-in ESLint during builds — we run it separately
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/testimonials',
        destination: '/reviews',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    const apiPort = process.env.API_PORT || '4000'
    return [
      {
        source: '/api/v1/:path*',
        destination: `http://localhost:${apiPort}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
