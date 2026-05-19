import { NextResponse } from "next/server";
import { getShopwareApiBase } from "@/lib/shopwareStorefront";

function getEnv() {
  const key = process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;
  return key || "";
}

function makeHeaders(contextToken: string, includeAuth = false): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (includeAuth) headers["sw-access-key"] = getEnv();
  if (contextToken) headers["sw-context-token"] = contextToken;
  return headers;
}

async function shopwareFetch(
  path: string,
  options: RequestInit,
  contextToken: string
): Promise<{ response: Response; json: unknown; contextToken: string }> {
  const baseUrl = getShopwareApiBase();
  const url = `${baseUrl}/store-api${path}`;
  const headers = makeHeaders(contextToken, true);
  
  let resp: Response;
  try {
    resp = await fetch(url, { ...options, headers });
  } catch (err) {
    if (process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true") {
      const httpsUrl = url.replace(/^http:\/\//i, "https://");
      const prev = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        resp = await fetch(httpsUrl, { ...options, headers });
      } finally {
        if (prev === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = prev;
        }
      }
    } else {
      throw err;
    }
  }
  const json = await resp.json().catch(() => ({}));
  const token = resp.headers.get("sw-context-token") ||
                (typeof (json as Record<string, unknown>)?.token === "string"
                  ? (json as Record<string, string>).token! : "");
  return { response: resp, json, contextToken: token || contextToken };
}

export async function GET(request: Request) {
  const key = getEnv();
  if (!key) return NextResponse.json({ error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt." }, { status: 500 });

  const token = new URL(request.url).searchParams.get("contextToken") || "";

  try {
    const { response, json, contextToken } = await shopwareFetch(
      "/checkout/cart",
      { method: "GET", cache: "no-store" },
      token
    );

    if (!response.ok) {
      const err = json as Record<string, unknown>;
      return NextResponse.json(
        { error: (err?.errors as Array<Record<string, string>>)?.[0]?.detail || "Warenkorbfehler." },
        { status: response.status }
      );
    }

    const cart = json as Record<string, unknown>;
    return NextResponse.json({
      ok: true,
      cart,
      lineItems: cart.lineItems ?? {},
      contextToken: contextToken || undefined,
      price: cart.price ?? {},
    });
  } catch {
    return NextResponse.json({ error: "Shopware Cart nicht erreichbar." }, { status: 502 });
  }
}
