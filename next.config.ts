/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // CRITICAL: This allows GitHub to host it
  images: { 
    unoptimized: true    // Required for static export
  },
};

export default nextConfig;