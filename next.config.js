/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'firebasestorage.googleapis.com' }],
  },
  async redirects() {
    return [{ source: '/photography', destination: '/shoots', permanent: true }];
  },
};

module.exports = nextConfig;
