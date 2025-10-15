import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET,
    NEXT_PUBLIC_USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
    NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'deins.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ubunation.s3.eu-central-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
