/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development',
    domains: [
      'localhost',
      'vercel.app',
      'now.sh'
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

module.exports = nextConfig; 