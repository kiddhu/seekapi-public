import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_INQUIRIES_ENABLED: process.env.NEXT_PUBLIC_INQUIRIES_ENABLED || (process.env.VERCEL_ENV==='preview' && process.env.VERCEL_GIT_COMMIT_REF==='website-inquiries-v1'?'1':'0'),
    NEXT_PUBLIC_INQUIRY_PREVIEW: process.env.VERCEL_ENV==='preview' && process.env.INQUIRIES_ENABLED!=='1'?'1':'0',
  },
  async headers(){return [
    {source:'/admin/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'Cache-Control',value:'no-store'},{key:'Referrer-Policy',value:'no-referrer'},{key:'X-Frame-Options',value:'DENY'}]},
    {source:'/api/:path*',headers:[{key:'Cache-Control',value:'no-store'},{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'X-Content-Type-Options',value:'nosniff'}]},
  ];},
};

export default nextConfig;
