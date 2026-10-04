import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{source:'/checkout/:path*',headers:[
      {key:'Cache-Control',value:'private, no-store, max-age=0'},
      {key:'X-Robots-Tag',value:'noindex, nofollow'},
      {key:'Referrer-Policy',value:'no-referrer'},
      {key:'X-Content-Type-Options',value:'nosniff'},
    ]}];
  },
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
