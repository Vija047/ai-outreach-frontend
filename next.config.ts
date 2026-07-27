import type { NextConfig } from "next";

const backendOrigin = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  ""
).replace(/\/$/, "");

const devAllowedOrigins = (
  process.env.NEXT_DEV_ALLOWED_ORIGINS ?? "169.254.88.34"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins: devAllowedOrigins,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
    ],
  },
  async rewrites() {
    // Same-origin /api/v1 → backend (avoids CORS + localhost on Vercel)
    if (!backendOrigin) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
