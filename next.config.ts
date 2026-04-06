import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://backend.railway.internal:8000";

const nextConfig: NextConfig = {
  /**
   * Proxy all /api/* requests to the Symfony backend.
   * This avoids CORS issues: the browser always talks to the same origin
   * (the Next.js server), which then forwards the request internally.
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
