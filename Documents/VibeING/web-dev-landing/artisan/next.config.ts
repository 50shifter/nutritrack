import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Required for src/app/ directory detection — fixes first-load rendering.
    // Without this, Next.js may not find pages on initial compilation,
    // causing empty HTML responses (HTTP 200 but no content).
    srcDir: true,
  },
  devIndicators: false,
  // Image optimization enabled by default — remove unoptimized: true
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
