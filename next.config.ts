/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/services/mystery-audits',
        destination: '/services/mystery-audit-services',
        permanent: true,
      },
      {
        source: '/cpanel',
        destination: 'https://cpanel.yfadvisors.in:2083',
        permanent: false,
      },
      {
        source: '/webmail',
        destination: 'https://webmail.yfadvisors.in',
        permanent: false,
      },
      {
        source: '/mail',
        destination: 'https://mail.yfadvisors.in',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
