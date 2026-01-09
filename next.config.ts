import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.heygen.ai',
        pathname: '/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'files2.heygen.ai',
        pathname: '/avatar/**',
      },
    ],
  },
};

export default nextConfig;
