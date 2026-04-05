/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Ash-Flow',
  assetPrefix: '/Ash-Flow/', // ADD THIS LINE
  images: {
    unoptimized: true,
  },
};

export default nextConfig;