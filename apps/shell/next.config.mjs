import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  transpilePackages: ['@holokai/ui', '@holokai/design-system', '@holokai/contracts', '@holokai/event-bus'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@holokai/ui', '@holokai/design-system'],
  },
};

export default nextConfig;
