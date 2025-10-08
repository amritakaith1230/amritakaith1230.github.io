/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'placeholder.svg'
    ],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: 'cruise-ship-management',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig