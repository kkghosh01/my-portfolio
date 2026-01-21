import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "astute-goldfish-964.convex.cloud",
        protocol: "https",
        port: "",
      },
    ],
  },
  reactCompiler: true,
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;
