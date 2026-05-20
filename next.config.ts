import type { NextConfig } from "next";

const rawBackendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000";
const BACKEND_API_BASE = rawBackendApiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "" },
      { protocol: "https", hostname: "localhost", port: "" },
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "https", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "https", hostname: "127.0.0.1", port: "8000" },
    ],
  },
  /**
   * Proxy selected frontend calls to the backend API.
   * This avoids CORS issues: the browser always talks to the same origin
   * (the Next.js server), which then forwards the request internally.
   */
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${BACKEND_API_BASE}/api/:path*`,
      },
      {
        source: "/store-api/:path*",
        destination: `${BACKEND_API_BASE}/store-api/:path*`,
      },
    ];
  },
};

export default nextConfig;
