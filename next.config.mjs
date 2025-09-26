/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Fix untuk messaging timeout issues
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  // Fix Fast Refresh issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  
  // WebSocket configuration untuk development
  devIndicators: {
    position: 'bottom-right',
  },
  
  // Optimisasi untuk development
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.nevaobjects.id',
        port: '',
        pathname: '/files-bucket/**',
      },
    ],
  },

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
