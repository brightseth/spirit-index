import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Map .well-known URLs to clean routes
      {
        source: "/.well-known/spirit-index.json",
        destination: "/well-known/spirit-index",
      },
    ];
  },
};

export default nextConfig;
