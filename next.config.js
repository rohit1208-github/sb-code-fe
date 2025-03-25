/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: ["34.60.128.41", "via.placeholder.com"],
  },
  poweredByHeader: false,
  compress: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "http://34.60.128.41:8000/api/:path*/",
      },
    ];
  },
  devIndicators: false,
  experimental: {
    disableOptimizedLoading: true,
    disablePostcssPresetEnv: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable React DevTools in development
    if (dev && !isServer) {
      config.resolve.alias["react-devtools-core"] =
        "react-devtools-core/dist/backend";

      // Add this to disable error overlay
      if (config.plugins) {
        config.plugins = config.plugins.filter(
          (plugin) => !(plugin.constructor.name === "ReactFastRefreshPlugin")
        );
      }
    }
    return config;
  },
};

module.exports = nextConfig;
