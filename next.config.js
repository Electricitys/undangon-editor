/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    serverApiKey: process.env.SERVER_API_KEY,
    serverUrl: process.env.SERVER,
    appName: process.env.APP_NAME,
    appDomain: process.env.APP_DOMAIN,
    currentHostName: process.env.CURRENT_HOSTNAME,
    googleApiKey: process.env.GOOGLE_API_KEY,
    mapboxApiKey: process.env.MAPBOX_API_KEY,
    imagekitUrl: process.env.IMAGEKIT_URL,
    imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/drop/:path*',
        // destination: 'https://cc91-36-85-220-232.ngrok-free.app/:path*' // Proxy to Backend
        destination: 'http://localhost:3020/:path*' // Proxy to Backend
        // destination: 'https://drop.manjo.space/:path*' // Proxy to Backend
        // destination: 'http://drop.manjo.space/:path*' // Proxy to Backend
      }
    ]
  }
};

module.exports = nextConfig;


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "manjo",
    project: "undangon",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
