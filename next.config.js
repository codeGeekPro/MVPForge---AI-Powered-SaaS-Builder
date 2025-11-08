const { withSentryConfig } = require('@sentry/nextjs');

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

const sentryWebpackPluginOptions = {
  // La config org/projet/token provient d'env (SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN)
  // ou du fichier sentry.properties à la racine.
  silent: true,
  telemetry: false,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
