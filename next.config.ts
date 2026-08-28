import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      afterFiles: [
        { source: "/manage", destination: "/manage/index.html" },
        { source: "/manage/", destination: "/manage/index.html" },
        { source: "/manage/:path*", destination: "/manage/index.html" },
      ],
    };
  },
};

export default nextConfig;
