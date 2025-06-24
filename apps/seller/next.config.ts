import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'retrade.hcm.ss.bfcplatform.vn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
