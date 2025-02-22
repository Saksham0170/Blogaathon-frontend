import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'azure-blogathon-blog-images.s3.ap-south-1.amazonaws.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
  },
};

export default nextConfig;
