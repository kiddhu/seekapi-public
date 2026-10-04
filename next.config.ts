import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/pricing', destination: '/china-supply-check', statusCode: 301 },
      { source: '/compare', destination: '/china-supply-check/alternatives', statusCode: 301 },
      { source: '/integrations', destination: '/for-agents', statusCode: 301 },
      { source: '/docs', destination: '/for-agents', statusCode: 301 },
    ];
  },
};

export default nextConfig;
