/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'www.theextravaganthobo.com',
      'theextravaganthobo.com', 
      'admin.theextravaganthobo.com'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.theextravaganthobo.com',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'theextravaganthobo.com',
          },
        ],
        destination: 'https://www.theextravaganthobo.com/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig