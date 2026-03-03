/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA/Service Worker disabled to prevent network interception issues with Supabase.
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wygsrnmffypsbjbtjdn.supabase.co'
      }
    ]
  }
}

module.exports = nextConfig
