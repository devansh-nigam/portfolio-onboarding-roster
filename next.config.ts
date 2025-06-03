import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Same approach for ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
