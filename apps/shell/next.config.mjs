import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  transpilePackages: [
    '@holokai/ui',
    '@holokai/design-system',
    '@holokai/contracts',
    '@holokai/event-bus',
    '@holokai/runtime',
    '@holokai/branding',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return [
      {
        source: '/api/engine/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/api/bff/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
      {
        source: '/oracle',
        destination: 'http://localhost:3001/oracle',
      },
      {
        source: '/oracle/:path*',
        destination: 'http://localhost:3001/oracle/:path*',
      },
      {
        source: '/home',
        destination: 'http://localhost:3002/home',
      },
      {
        source: '/home/:path*',
        destination: 'http://localhost:3002/home/:path*',
      },
      {
        source: '/research',
        destination: 'http://localhost:3003/research',
      },
      {
        source: '/research/:path*',
        destination: 'http://localhost:3003/research/:path*',
      },
      {
        source: '/archive',
        destination: 'http://localhost:3004/archive',
      },
      {
        source: '/archive/:path*',
        destination: 'http://localhost:3004/archive/:path*',
      },
      {
        source: '/cart',
        destination: 'http://localhost:3005/cart',
      },
      {
        source: '/cart/:path*',
        destination: 'http://localhost:3005/cart/:path*',
      },
      {
        source: '/dataset',
        destination: 'http://localhost:3006/dataset',
      },
      {
        source: '/dataset/:path*',
        destination: 'http://localhost:3006/dataset/:path*',
      }
    ];
  }
};

export default nextConfig;
