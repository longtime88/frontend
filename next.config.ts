import type { NextConfig } from "next";

const rawBackendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000";
const BACKEND_API_BASE = rawBackendApiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
