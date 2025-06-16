/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cloudinary.com'],
    loader: 'default',
  },
};

module.exports = nextConfig;
