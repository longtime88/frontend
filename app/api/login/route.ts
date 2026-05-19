import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const accessKey =
    process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" },
      { status: 500 }
    );
  }

  let payload: { email?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body." }, { status: 400 });
  }

  const email = String(payload.email ?? "").trim();
  const password = String(payload.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-Mail und Passwort sind erforderlich." },
      { status: 400 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };

  try {
    const loginUrl = "/store-api/account/login";
    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    };

    let upstream: Response;

    try {
      upstream = await fetch(loginUrl, fetchOptions);
    } catch (error) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) throw error;
      const previousTlsMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        upstream = await fetch(loginUrl, fetchOptions);
      } finally {
        if (previousTlsMode === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsMode;
        }
      }
    }

    const data = await upstream.json().catch(() => ({}));
    const contextToken =
      upstream.headers.get("sw-context-token") ||
      (typeof data?.token === "string" ? data.token : "");
    const customerToken =
      upstream.headers.get("sw-customer-token") ||
      (typeof data?.customerToken === "string" ? data.customerToken : "");

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            data?.errors?.[0]?.detail ||
            data?.errors?.[0]?.title ||
            "Login fehlgeschlagen.",
          details: data,
        },
        { status: upstream.status }
      );
    }

    const response = NextResponse.json({
      ok: true,
      message: "Login erfolgreich!",
      customer: data?.customer || null,
    });

    if (contextToken) {
      response.cookies.set("sw-context-token", contextToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    if (customerToken) {
      response.cookies.set("sw-customer-token", customerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Shopware Login API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Methode nicht erlaubt." },
    { status: 405 }
  );
}
