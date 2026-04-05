import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Ash-Flow', // CRITICAL: This must match your repo name exactly
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;