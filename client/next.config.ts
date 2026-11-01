import type { NextConfig } from "next";
import { OPTIMIZED_IMAGE_HOSTS } from "./src/utils/isOptimizedImage";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map(hostname => ({
      protocol: 'https',
      hostname
    }))
  }
};

export default nextConfig;
