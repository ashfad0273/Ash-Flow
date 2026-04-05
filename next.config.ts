/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Ash-Flow',
  assetPrefix: '/Ash-Flow/',  // trailing slash recommended
  trailingSlash: true,         // add this — prevents 404s on direct URL visits
  images: {
    unoptimized: true,
  },
};

export default nextConfig;