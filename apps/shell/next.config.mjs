import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  transpilePackages: [
    '@holokai/design-system',
    '@holokai/contracts',
    '@holokai/runtime',
    '@holokai/event-bus',
    '@holokai/mfe-orchestrator',
    '@holokai/ui-composer',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react', '@holokai/design-system'],
  },
};

export default nextConfig;
