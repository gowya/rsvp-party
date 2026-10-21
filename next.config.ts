import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // AVIF en priorité pour les photos (plus léger que le WebP)
  images: { formats: ["image/avif", "image/webp"] },
  partialPrefetching: true,
};

export default nextConfig;
