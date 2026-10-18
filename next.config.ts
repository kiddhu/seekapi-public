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
  async rewrites() {
    return { beforeFiles: [
  {
    "source": "/docs/introduction",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/blog",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/status",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/refund",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/legal",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/blog/deepseek-v3-latency-and-batching",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/blog/seekapi-openai-sdk-migration",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/integrations/vercel-ai",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/integrations/pydantic-ai",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/integrations/litellm",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/integrations/haystack",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/integrations/langchain",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/integrations/autogpt",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/docs/api-status-codes",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/docs/endpoints",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/docs/reliability-playbook",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/docs/authentication",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/docs/token-saving-strategy",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/docs/pricing-calculator-logic",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/docs/latency-benchmarks",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  },
  {
    "source": "/favicon.ico",
    "destination": "/api/legacy-route-response",
    "has": [
      {
        "type": "host",
        "value": "seekapi.ai"
      }
    ]
  }
], afterFiles: [], fallback: [] };
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
