import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_URI: process.env.BACKEND_URI
  }
};

export default nextConfig;
