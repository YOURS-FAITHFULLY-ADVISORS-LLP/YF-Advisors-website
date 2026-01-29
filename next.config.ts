/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/cpanel',
        destination: 'https://cpanel.yfadvisors.in',
        permanent: false,
      },
      {
        source: '/webmail',
        destination: 'https://webmail.yfadvisors.in',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
