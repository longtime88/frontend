import { NextResponse } from "next/server";
import { getStoreApiAccessKey, getShopwareApiBase } from "@/lib/shopwareStorefront";

async function shopwareDelete(
  path: string,
  ids: string[],
  headers: Record<string, string>
): Promise<{ ok: boolean; status: number }> {
  // Shopware erwartet DELETE /checkout/cart/line-item
  // mit JSON-Body { "ids": ["id1", "id2", ...] }
  const baseUrl = getShopwareApiBase();
  const url = `${baseUrl}/store-api${path}`;

  const body = JSON.stringify({ ids });

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "DELETE",
      headers,
      body,
      cache: "no-store",
    });
  } catch (err) {
    if (process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true") {
      const httpsUrl = url.replace(/^http:\/\//i, "https://");
      const prev = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        resp = await fetch(httpsUrl, {
          method: "DELETE",
          headers,
          body,
          cache: "no-store",
        });
      } finally {
        if (prev === undefined) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        else process.env.NODE_TLS_REJECT_UNAUTHORIZED = prev;
      }
    } else {
      console.error("[api/cart/drop] delete error:", err);
      return { ok: false, status: 0 };
    }
  }
  return { ok: resp.ok, status: resp.status };
}

export async function POST(request: Request) {
  const accessKey = getStoreApiAccessKey();

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

  const contextToken = String(payload.contextToken ?? "").trim();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };

  if (contextToken) {
    headers["sw-context-token"] = contextToken;
  }

  try {
    const baseUrl = getShopwareApiBase();

    // 1. Warenkorb lesen
    let cartResp: Response;
    try {
      cartResp = await fetch(`${baseUrl}/store-api/checkout/cart`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
    } catch {
      if (process.env.SHOPWARE_ALLOW_SELF_SIGNED !== "true") throw new Error("cart fetch failed");
      const httpsUrl = baseUrl.replace(/^http:\/\//i, "https://");
      const prev = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        cartResp = await fetch(`${httpsUrl}/store-api/checkout/cart`, {
          method: "GET",
          headers,
          cache: "no-store",
        });
      } finally {
        if (prev === undefined) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        else process.env.NODE_TLS_REJECT_UNAUTHORIZED = prev;
      }
    }

    const raw = await cartResp.text();
    let cartData: Record<string, unknown> | null = null;
    try {
      cartData = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      cartData = null;
    }

    if (!cartResp.ok) {
      return NextResponse.json(
        { error: `Warenkorb konnte nicht gelesen werden (HTTP ${cartResp.status}).` },
        { status: cartResp.status }
      );
    }

    // Shopware gibt lineItems als ARRAY zurück
    const rawItems = (cartData?.lineItems ?? []) as Array<Record<string, unknown>>;
    const ids = rawItems
      .map((li) => String(li?.id ?? "").trim())
      .filter((id) => id.length > 0);

    console.log("[api/cart/drop] ids:", ids);

    if (ids.length === 0) {
      return NextResponse.json({ ok: true, removed: 0 });
    }

    // Alle Line-Items als Array entfernen (Shopware DELETE erwartet { "ids": [...] })
    const { ok } = await shopwareDelete("/checkout/cart/line-item", ids, headers);
    const removed = ok ? ids.length : 0;

    console.log("[api/cart/drop] done, removed:", removed, "of", ids.length);

    return NextResponse.json({ ok: true, removed, total: ids.length });
  } catch (err) {
    console.error("[api/cart/drop] error:", err);
    return NextResponse.json(
      { error: "Warenkorb konnte nicht geleert werden." },
      { status: 502 }
    );
  }
}
