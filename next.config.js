/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
   domains: [
      'azure-blogathon-blog-images.s3.ap-south-1.amazonaws.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
  },
};

module.exports = nextConfig; 