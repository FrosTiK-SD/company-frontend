/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/company',
  assetPrefix: '/company',
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [],
    domains: ["www.iitbhu.ac.in"],
  },
};

module.exports = nextConfig;
