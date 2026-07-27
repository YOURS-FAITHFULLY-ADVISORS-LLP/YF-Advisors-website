/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
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
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
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
