/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [{
      source: '/',
      destination: '/',
      permanent: true
    }]
  },
  images: {
    domains: ['127.0.0.1', 'api.bookairticket.pk', 'uat-api.bookairticket.pk']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  i18n: {
    locales: ['en'],       // <- explicitly define
    defaultLocale: 'en',   // <- avoid redirecting
    localeDetection: false // <- key: disables detection from browser
  }
}

export default nextConfig
