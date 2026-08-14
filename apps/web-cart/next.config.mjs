import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/cart',
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  transpilePackages: [
    '@holokai/ui',
    '@holokai/design-system',
    '@holokai/contracts',
    '@holokai/event-bus',
    '@holokai/runtime',
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
      }
    ];
  }
};

export default nextConfig;
