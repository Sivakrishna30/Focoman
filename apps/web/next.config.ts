import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  transpilePackages: [
    "@focoman/db",
    "@focoman/auth",
    "@focoman/types",
    "@focoman/validation",
    "@focoman/domain",
  ],
};

export default nextConfig;
