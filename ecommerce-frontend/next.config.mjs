let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable type checking and linting during builds for more reliable code
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'features', 'lib', 'hooks'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Use image optimization for better performance
    unoptimized: false,
    // Configure domains for remote images if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Add rewrites to proxy API requests to backend services
  async rewrites() {
    return [
      {
        source: '/api/catalog/:path*',
        destination: process.env.CATALOG_API_URL || 'http://localhost:8082/api/v1/catalog/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: process.env.ORDERS_API_URL || 'http://localhost:8083/api/v1/orders/:path*',
      }
    ];
  },
  // Improve CORS headers with more specific settings
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          // Restrict CORS to specific domains in production, allow all in development
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NODE_ENV === 'production' 
              ? process.env.ALLOWED_ORIGINS || '*' 
              : '*' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
