/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_WS_ROOT: process.env.API_WS_ROOT,
    BASE_URL: process.env.BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    ENV_NAME: process.env.ENV_NAME,
    SENTRY_DSN: process.env.SENTRY_DSN,
    TLD_LENGTH: process.env.TLD_LENGTH
  },
};

module.exports = nextConfig;
