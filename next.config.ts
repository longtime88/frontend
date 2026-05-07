import type { NextConfig } from "next";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost";

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
        destination: `${BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
