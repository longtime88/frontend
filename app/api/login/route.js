import { NextResponse } from "next/server";

export async function POST(request) {
  const rawShopwareUrl = process.env.SHOPWARE_URL || "http://localhost:8000";
  const shopwareBaseUrl = rawShopwareUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const accessKey =
    process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body." }, { status: 400 });
  }

  const username = String(payload.username ?? "").trim();
  const password = String(payload.password ?? "").trim();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username und Passwort sind erforderlich." },
      { status: 400 }
    );
  }

  try {
    const loginUrl = `${shopwareBaseUrl}/store-api/account/login`;
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sw-access-key": accessKey,
      },
      body: JSON.stringify({
        username,
        password,
      }),
      cache: "no-store",
    };

    let upstream;
    try {
      upstream = await fetch(loginUrl, fetchOptions);
    } catch (error) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) {
        throw error;
      }

      const fallbackUrl = loginUrl.startsWith("https://")
        ? loginUrl
        : loginUrl.replace(/^http:\/\//i, "https://");
      const previousTlsMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        upstream = await fetch(fallbackUrl, fetchOptions);
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

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            data?.errors?.[0]?.detail ||
            data?.errors?.[0]?.title ||
            "Login fehlgeschlagen.",
          details: data,
          contextToken: contextToken || undefined,
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json({
      ok: true,
      customer: data.customer || null,
      contextToken: contextToken || undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Shopware Login API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}
