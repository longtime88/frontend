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

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body." }, { status: 400 });
  }

  const itemId = String(payload.itemId ?? "").trim();
  const contextToken = String(payload.contextToken ?? "").trim();

  if (!itemId) {
    return NextResponse.json(
      { error: "itemId ist erforderlich." },
      { status: 400 }
    );
  }

  const baseUrl = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8000";
  const cleanUrl = baseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const removeUrl = `${cleanUrl}/store-api/checkout/line-item?id=${encodeURIComponent(itemId)}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };

  if (contextToken) {
    headers["sw-context-token"] = contextToken;
  }

  try {
    let upstream: Response;
    try {
      upstream = await fetch(removeUrl, { method: "DELETE", headers, cache: "no-store" });
    } catch (error) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) throw error;
      const previousTlsMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        upstream = await fetch(removeUrl, { method: "DELETE", headers, cache: "no-store" });
      } finally {
        if (previousTlsMode === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsMode;
        }
      }
    }

    const data = await upstream.json().catch(() => ({}));
    const nextContextToken =
      upstream.headers.get("sw-context-token") ||
      (typeof data?.token === "string" ? data.token : "");

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            data?.errors?.[0]?.detail ||
            data?.errors?.[0]?.title ||
            "Artikel konnte nicht entfernt werden.",
          details: data,
          contextToken: nextContextToken || undefined,
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json({
      ok: true,
      cart: data,
      contextToken: nextContextToken || undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Shopware Cart API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}
