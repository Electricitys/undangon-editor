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
};

module.exports = nextConfig;
