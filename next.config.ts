import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React Strict Mode for better debugging and development
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during production builds (useful for faster builds in CI/CD)
  },
  images: {
    domains: ['uploadcare.com', 'ucarecdn.com'], // Allows images from these domains to be used in the app
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Exposes environment variable to the client-side
  },
  webpack(config) {
    // Adding custom path alias
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  typescript: {
    ignoreBuildErrors: false, // Set to false to ensure TypeScript errors block production builds
  },
};

export default nextConfig;
