import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "limitless-mink-108.convex.cloud",
        protocol: "https",
      },
      {
        hostname: "astute-goldfish-964.convex.cloud",
        protocol: "https",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
