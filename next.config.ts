import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.dog.ceo',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/bigbang",
        destination: "/bigbang.html",
      },
      {
        source: "/print",
        destination: "/print.html",
      },
      {
        source: "/links",
        destination: "/links.html",
      },
      {
        source: "/ilustraciones",
        destination: "/ilustraciones.html",
      },
      {
        source: "/servicios/web-develop",
        destination: "/servicios/web-develop.html",
      },
      {
        source: "/servicios/meta-ads",
        destination: "/servicios/meta-ads.html",
      },
      {
        source: "/servicios/google-seo",
        destination: "/servicios/google-seo.html",
      },
      {
        source: "/servicios/graphic-design",
        destination: "/servicios/graphic-design.html",
      },
    ];
  },
};

export default nextConfig;
