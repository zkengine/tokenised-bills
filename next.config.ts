import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverSourceMaps: false,
  },
  serverExternalPackages: ['pino', 'thread-stream'],
};

export default nextConfig;
