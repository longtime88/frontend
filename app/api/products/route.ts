import { NextResponse } from "next/server";

function getEnv() {
  const key = process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;
  return key || "";
}

function makeHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = getEnv();
  if (key) headers["sw-access-key"] = key;
  return headers;
}

async function shopwareFetch(url: string, options: RequestInit): Promise<{ json: unknown; response: Response }> {
  let resp: Response;
  try {
    resp = await fetch(url, options);
  } catch {
    if (process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true") {
      const https = url.startsWith("https://") ? url : url.replace(/^http:\/\//i, "https://");
      const prev = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        resp = await fetch(https, options);
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
  const json = await resp.json().catch(() => ({}));
  return { json, response: resp };
}

export async function GET() {
  const key = getEnv();
  if (!key) {
    return NextResponse.json({ error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt." }, { status: 500 });
  }

  try {
    const headers = makeHeaders();
    const { json, response } = await shopwareFetch("/store-api/product?limit=100", {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const err = json as Record<string, unknown>;
      return NextResponse.json(
        { error: (err?.errors as Array<Record<string, string>>)?.[0]?.detail || "Produkte konnten nicht geladen werden." },
        { status: response.status }
      );
    }

    const elements = (json as Record<string, unknown>)?.elements as Array<Record<string, unknown>> | undefined;

    const products = (elements || []).map((item) => {
      const raw = item as Record<string, unknown>;
      const translated = typeof raw.translated === "object" && raw.translated !== null
        ? raw.translated as Record<string, unknown>
        : null;

      const price = raw.calculatedPrice as Record<string, unknown> | undefined
        ?? raw.price as Record<string, unknown> | undefined;

      const cover = raw.cover as Record<string, unknown> | null | undefined;
      const media = raw.media as Array<Record<string, unknown>> | undefined;
      const coverMedia = cover ?? (media && media[0]) ?? null;
      const image = coverMedia
        ? (coverMedia.url as string | undefined) ?? (coverMedia.previewImage as string | undefined) ?? ""
        : "";

      return {
        id: raw.id ?? "",
        title: String(translated?.name ?? raw.name ?? ""),
        name: String(translated?.name ?? raw.name ?? "Unbenanntes Produkt"),
        description: String(translated?.description ?? raw.description ?? ""),
        price: typeof price?.total === "number"
          ? price.total
          : typeof price?.unitPrice === "number"
            ? price.unitPrice
            : typeof price?.gross === "number"
              ? price.gross
              : 0,
        image,
      };
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("[api/products] error:", err);
    return NextResponse.json({ error: "Produkte konnten nicht geladen werden." }, { status: 502 });
  }
}
