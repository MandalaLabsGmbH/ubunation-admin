import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    USER_POOL_ID: process.env.USER_POOL_ID,
    CLIENT_ID: process.env.CLIENT_ID,
  },
};

export default nextConfig;
