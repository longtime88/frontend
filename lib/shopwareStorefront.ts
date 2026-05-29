const rawStorefrontBaseUrl =
  process.env.NEXT_PUBLIC_SHOPWARE_STOREFRONT_URL ?? "http://localhost:8080";

const storefrontBaseUrl = rawStorefrontBaseUrl.replace(/\/+$/, "");

// Diese URLs sind für die Shopware Storefront (wenn man direkt zu Shopware navigiert)
// Für API-Aufrufe sollten stattdessen die /api/* Routen verwendet werden
export const SHOPWARE_CART_URL = `${storefrontBaseUrl}/checkout/cart`;
export const SHOPWARE_CONFIRM_URL = `${storefrontBaseUrl}/checkout/confirm`;
export const SHOPWARE_LINE_ITEM_ADD_URL = `${storefrontBaseUrl}/checkout/line-item/add`;
export const SHOPWARE_ACCOUNT_REGISTER_URL = `${storefrontBaseUrl}/account/login#register`;

export function getMediaUrl(mediaUrl: string | null | undefined): string {
  if (!mediaUrl) return "";
  const pathWithoutQuery = mediaUrl.replace(/\?.*$/, "");
  return pathWithoutQuery.replace(/^https?:\/\/[^\/]+(\/media)?/, "/media");
}

export function getShopwareApiBase(): string {
  const raw = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8080";
  return raw.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

export function getStoreApiAccessKey(): string {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY || "";
}

async function shopwareFetch(
  path: string,
  options: RequestInit,
  headers: Record<string, string>
): Promise<{ rawText: string; response: Response }> {
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
        if (prev === undefined) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        else process.env.NODE_TLS_REJECT_UNAUTHORIZED = prev;
      }
    } else {
      throw new Error("Shopware request failed");
    }
  }
  const rawText = await resp.text();
  return { rawText, response: resp };
}

export { shopwareFetch };
