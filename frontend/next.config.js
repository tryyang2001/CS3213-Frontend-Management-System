module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend/api/:path*", // Proxy to backend service
      },
    ];
  },
};
