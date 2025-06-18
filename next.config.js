/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cloudinary.com'],
    loader: 'default',
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
