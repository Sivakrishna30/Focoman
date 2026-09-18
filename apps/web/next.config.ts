import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["firebase-admin"],
  transpilePackages: [
    "@focoman/db",
    "@focoman/auth",
    "@focoman/types",
    "@focoman/validation",
    "@focoman/domain",
    "@focoman/config",
  ],
  devIndicators: false,
  eslint: {
    // Run eslint separately via npm run lint to avoid OOM crashes during build on Cloud Run
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
