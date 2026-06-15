/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/recruiter',
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [],
    domains: ["www.iitbhu.ac.in"],
  },
};

module.exports = nextConfig;
