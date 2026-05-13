import { NextResponse } from "next/server";

const SHOPWARE_HEX_ID_PATTERN = /^[0-9a-f]{32}$/i;

function normalizeShopwareId(value: string): string {
  return value.replace(/-/g, "").toLowerCase();
}

export async function POST(request: Request) {
  const rawShopwareUrl = process.env.SHOPWARE_URL || "https://localhost:8000";
  const shopwareBaseUrl = rawShopwareUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const accessKey =
    process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" },
      { status: 500 }
    );
  }

  let payload: { productId?: string; quantity?: number; contextToken?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body." }, { status: 400 });
  }

  const productId = normalizeShopwareId(String(payload.productId ?? "").trim());
  const quantity = Number.isInteger(payload.quantity) && payload.quantity && payload.quantity > 0
    ? payload.quantity
    : 1;
  const contextToken = String(payload.contextToken ?? "").trim();

  if (!SHOPWARE_HEX_ID_PATTERN.test(productId)) {
    return NextResponse.json(
      {
        error:
          "productId muss eine gueltige Shopware Produkt-ID (32-stellige Hex-ID) sein.",
      },
      { status: 400 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };

  if (contextToken !== "") {
    headers["sw-context-token"] = contextToken;
  }

  try {
    const cartApiUrl = `${shopwareBaseUrl}/store-api/checkout/cart/line-item`;
    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify({
        items: [
          {
            type: "product",
            referencedId: productId,
            quantity,
          },
        ],
      }),
      cache: "no-store",
    };

    let upstream: Response;

    try {
      upstream = await fetch(cartApiUrl, fetchOptions);
    } catch (error) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) {
        throw error;
      }

      const fallbackUrl = cartApiUrl.startsWith("https://")
        ? cartApiUrl
        : cartApiUrl.replace(/^http:\/\//i, "https://");
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
    const nextContextToken =
      upstream.headers.get("sw-context-token") ||
      (typeof data?.token === "string" ? data.token : "");

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: data?.errors?.[0]?.detail || data?.errors?.[0]?.title || "Add-to-cart fehlgeschlagen.",
          details: data,
          contextToken: nextContextToken || undefined,
        },
        { status: upstream.status }
      );
    }

    const cartErrors =
      data && typeof data === "object" && data.errors && typeof data.errors === "object"
        ? Object.values(data.errors as Record<string, { translatedMessage?: string; message?: string }>)
        : [];

    if (cartErrors.length > 0) {
      const firstError = cartErrors[0];

      return NextResponse.json(
        {
          error:
            firstError?.translatedMessage ||
            firstError?.message ||
            "Produkt konnte nicht in den Warenkorb gelegt werden.",
          details: data,
          contextToken: nextContextToken || undefined,
        },
        { status: 400 }
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
