/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/recruiter',
  assetPrefix: '/recruiter',
  experimental: {
    appDir: true,
  },
  async headers() {
    return [];
  },
  async redirects() {
    return [];
  },
  images: {
    remotePatterns: [],
    domains: ["www.iitbhu.ac.in"],
  },
};

module.exports = nextConfig;
