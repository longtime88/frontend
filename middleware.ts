import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous";
  const ua = request.headers.get("user-agent") || "unknown";
  return `${ip}-${ua.substring(0, 50)}`;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const rateLimitKey = getRateLimitKey(request);
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 30;

  const record = rateLimitMap.get(rateLimitKey);
  if (record && record.resetTime < now) {
    rateLimitMap.delete(rateLimitKey);
  }

  const currentRecord = rateLimitMap.get(rateLimitKey);
  if (currentRecord && currentRecord.count >= maxRequests) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  if (currentRecord) {
    currentRecord.count++;
  } else {
    rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", maxRequests.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    String(maxRequests - (currentRecord?.count || 1))
  );

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};