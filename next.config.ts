import type { NextConfig } from "next";

const rawBackendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000";
const BACKEND_API_BASE = rawBackendApiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "https", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "127.0.0.1" },
    ],
    localPatterns: [
      {
        pathname: "/images/**",
        search: "",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
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
      {
        source: "/media/:path*",
        destination: `${BACKEND_API_BASE}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
