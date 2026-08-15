import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // WARNING: Allows all domains. Better to list specific ones like 'i.imgur.com'
      },
    ],
  },
};

export default nextConfig;
