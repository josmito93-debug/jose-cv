/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/showcase',
  // Ensure images are correctly handled if they are in public/images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
