/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.freetogame.com",
        pathname: "/g/**",
      },
    ],
  },
};

export default nextConfig;
