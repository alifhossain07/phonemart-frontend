/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    domains: [
      "sannai.test",
      "ibb.co",
      "i.ibb.co",
      "ibb.co.com",
      "i.ibb.co.com",
      "localhost",
      "127.0.0.1",
    ],
  },
};

export default nextConfig;