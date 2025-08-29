import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // or "http" if your CDN uses it
        hostname: "shettyclothing.in", // your domain or CDN host
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https", // or "http" if your CDN uses it
        hostname: "picsum.photos", // your domain or CDN host
        pathname: "/**", // allow all paths
      },
    ]
  }
};

export default nextConfig;
