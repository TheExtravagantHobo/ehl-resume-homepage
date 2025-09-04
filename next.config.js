
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'sitename.com', 'admin.sitename.com'],
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'admin.sitename.com',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig