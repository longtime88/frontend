const rawStorefrontBaseUrl =
  process.env.NEXT_PUBLIC_SHOPWARE_STOREFRONT_URL ?? "http://localhost:8080";

const storefrontBaseUrl = rawStorefrontBaseUrl.replace(/\/+$/, "");

// URLs für die Shopware Storefront-Navigation (externe URLs)
// Für API-Aufrufe sollten stattdessen die /api/* Routen verwendet werden
export const SHOPWARE_CART_URL = `${storefrontBaseUrl}/checkout/cart`;
export const SHOPWARE_CONFIRM_URL = `${storefrontBaseUrl}/checkout/confirm`;
export const SHOPWARE_LINE_ITEM_ADD_URL = `${storefrontBaseUrl}/checkout/line-item/add`;
export const SHOPWARE_ACCOUNT_REGISTER_URL = `${storefrontBaseUrl}/account/login#register`;

/**
 * Transformiert externe Media-URLs in lokale Pfade für Next.js Image-Komponente.
 * Entfernt Query-Parameter (?ts=...), da Next.js Image Loader diese nicht unterstützt.
 * Beispiel: "http://shopware/media/.../image.png?t=123" → "/media/.../image.png"
 */
export function getMediaUrl(mediaUrl: string | null | undefined): string {
  if (!mediaUrl) return "";
  const pathWithoutQuery = mediaUrl.replace(/\?.*$/, "");
  return pathWithoutQuery.replace(/^https?:\/\/[^\/]+(\/media)?/, "/media");
}

/**
 * Gibt die Basis-URL für Shopware Store-API Aufrufe zurück.
 * Wird aus den Umgebungsvariablen SHOPWARE_URL oder BACKEND_API_URL gelesen.
 */
export function getShopwareApiBase(): string {
  const raw = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8080";
  return raw.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

/**
 * Gibt den Store-API Access Key zurück.
 * Wird für authentifizierte API-Anfragen benötigt.
 */
export function getStoreApiAccessKey(): string {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY || "";
}

/**
 * Führt einen Fetch-Request zur Shopware API durch.
 * Beinhaltet Fallback für selbst-signierte SSL-Zertifikate (SHOPWARE_ALLOW_SELF_SIGNED=true).
 */
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
