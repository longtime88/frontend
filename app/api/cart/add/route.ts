import { NextResponse } from "next/server";

const SHOPWARE_HEX_ID_PATTERN = /^[0-9a-f]{32}$/i;

function normalizeShopwareId(value: string): string {
  return value.replace(/-/g, "").toLowerCase();
}

export async function POST(request: Request) {
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

  const baseUrl = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8080";
  const cleanUrl = baseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const url = `${cleanUrl}/store-api/checkout/cart/line-item`;

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
      upstream = await fetch(url, {
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
      });
    } catch (error) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) throw error;
      const previousTlsMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        upstream = await fetch(url, {
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
        });
      } finally {
        if (previousTlsMode === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsMode;
        }
      }
    }


    const rawText = await upstream.text().catch(() => "(no body)");
    const data = (() => { try { return JSON.parse(rawText); } catch { return {}; } })();
    const nextContextToken =
      upstream.headers.get("sw-context-token") ||
      (typeof data?.token === "string" ? data.token : "");

    if (!upstream.ok) {
      const res = NextResponse.json(
        {
          error:
            (data?.errors?.[0]?.detail ||
              data?.errors?.[0]?.title ||
              (typeof data === "object" ? JSON.stringify(data) : "") ||
              `Add-to-cart fehlgeschlagen (HTTP ${upstream.status}).`),
          details: data,
          contextToken: nextContextToken || undefined,
        },
        { status: upstream.status }
      );

      if (nextContextToken) {
        res.cookies.set("sw-context-token", nextContextToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }

      return res;
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

    const res = NextResponse.json({
      ok: true,
      cart: data,
      contextToken: nextContextToken || undefined,
    });

    if (nextContextToken) {
      res.cookies.set("sw-context-token", nextContextToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return res;
  } catch {
    return NextResponse.json(
      { error: "Shopware Cart API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}
