
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'theextravaganthobo.com', 'admin.theextravaganthobo.com'],
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
}

module.exports = nextConfig