/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ['ar-EG'],
    defaultLocale: 'ar-EG',
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig