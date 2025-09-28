/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Capacitor configuration only
  output: process.env.BUILD_TARGET === 'capacitor' ? 'export' : undefined,
  trailingSlash: process.env.BUILD_TARGET === 'capacitor' ? true : false,
  assetPrefix: process.env.BUILD_TARGET === 'capacitor' ? './' : undefined,
  images: {
    unoptimized: process.env.BUILD_TARGET === 'capacitor' ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.nevaobjects.id',
        port: '',
        pathname: '/files-bucket/**',
      },
    ],
  },

  // Next.js 15 optimizations
  experimental: {
    staleTimes: {
      dynamic: 30, // Cache dynamic pages for 30 seconds
      static: 180, // Cache static pages for 3 minutes
    },
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  // Fix Fast Refresh issues for development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: false, // Disable polling for localhost
        aggregateTimeout: 300,
        ignored: ['node_modules/**', '.next/**'],
      };

      // Fix localhost HMR issues
      config.devServer = {
        ...config.devServer,
        host: 'localhost',
        allowedHosts: ['localhost', '127.0.0.1', '192.168.1.119'],
        client: {
          webSocketURL: 'auto://0.0.0.0:0/ws'
        }
      };
    }
    return config;
  },

  // Development optimizations
  devIndicators: {
    position: 'bottom-right',
  },

  // Fix localhost refresh loops
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: []
    };
  },

  // Optimized for Next.js 15
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Disable x-powered-by header to prevent conflicts
  poweredByHeader: false,


  // Security headers
  async headers() {
    return [
      {
        source: '/admin/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/employee/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/majelis/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/jemaat/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/onboarding',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
