/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@holokai/ui', '@holokai/design-system', '@holokai/contracts', '@holokai/event-bus'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@holokai/ui', '@holokai/design-system'],
  },
};

export default nextConfig;
