/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sem experimental
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['umbgtudgphbwpkeoebry.supabase.co', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
