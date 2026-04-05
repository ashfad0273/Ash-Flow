/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Ash-Flow', // This MUST match your GitHub repo name exactly
  images: {
    unoptimized: true,
  },
};

export default nextConfig;