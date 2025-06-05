import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'development' ? '/' : '/seller',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
