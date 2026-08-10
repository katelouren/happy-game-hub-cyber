/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
      {
        pathname: "/api/game-image",
      },
    ],
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
