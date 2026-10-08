/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/favicon.ico",
          destination: "/images/logo.png",
        },
      ],
      afterFiles: [
        {
          source: "/admin",
          destination: "/Admin",
        },
      ],
    };
  },
};

export default nextConfig;
