import { NextResponse } from "next/server";
import { getShopwareApiBase } from "@/lib/shopwareStorefront";



function getEnv() {
  const key = process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;
  return key || "";
}

function makeHeaders(contextToken: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = getEnv();
  if (key) headers["sw-access-key"] = key;
  if (contextToken) headers["sw-context-token"] = contextToken;
  return headers;
}

async function shopwareFetch(path: string, options: RequestInit, headers: Record<string, string>): Promise<{ response: Response; json: unknown }> {
  const baseUrl = getShopwareApiBase();
  const url = `${baseUrl}/store-api${path}`;
  
  let resp: Response;
  try {
    resp = await fetch(url, { ...options, headers });
  } catch {
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
      throw new Error("Request failed");
    }
  }
  return { response: resp, json: await resp.json().catch(() => ({})) };
}

export async function GET(request: Request) {
  const key = getEnv();
  if (!key) {
    return NextResponse.json({ error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt." }, { status: 500 });
  }

  const token = new URL(request.url).searchParams.get("contextToken") || "";
  const headers = makeHeaders(token);

  try {
    const { response, json } = await shopwareFetch("/checkout/gateway", { method: "GET", cache: "no-store" }, headers);
    if (!response.ok) {
      const errors = (json as Record<string, unknown>)?.errors as Array<Record<string, unknown>> | undefined;
      return NextResponse.json({ error: errors?.[0]?.detail || "Shopware-Checkout-Methoden konnten nicht geladen werden." }, { status: response.status });
    }

    // Normalize: expected output is { id, name, description, media, formUrl }
    const norm = (item: Record<string, unknown>) => {
      const raw = item as Record<string, unknown>;
      const translated = typeof raw.translated === "object" && raw.translated !== null
        ? raw.translated as Record<string, unknown>
        : null;
      return {
        id: String(raw.id ?? ""),
        name: String(translated?.name ?? raw.name ?? ""),
        description: String(raw.description ?? ""),
        media: raw.media as { url?: string } | undefined,
        formUrl: raw.formUrl as string | undefined,
      };
    };

    const gateway = json as Record<string, unknown>;
    const paymentMethods = ((gateway.paymentMethods as Record<string, unknown>)?.elements || []) as Array<Record<string, unknown>>;
    const shippingMethods = ((gateway.shippingMethods as Record<string, unknown>)?.elements || []) as Array<Record<string, unknown>>;

    return NextResponse.json({
      ok: true,
      paymentMethods: paymentMethods.map(norm),
      shippingMethods: shippingMethods.map(norm),
    });
  } catch {
    return NextResponse.json({ error: "Zahlungs- und Versandarten konnten nicht geladen werden." }, { status: 502 });
  }
}
