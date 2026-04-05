/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Ash-Flow',
  assetPrefix: '/Ash-Flow', // No trailing slash here
  images: {
    unoptimized: true,
  },
};

export default nextConfig;