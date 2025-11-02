/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.openai.com', 'oaidalleapiprodscus.blob.core.windows.net'],
  },
};

module.exports = nextConfig;
