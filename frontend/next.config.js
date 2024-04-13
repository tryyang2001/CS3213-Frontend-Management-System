/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
};

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend/api/:path*", // Proxy to backend service
      },
    ];
  },
  ...nextConfig,
};
