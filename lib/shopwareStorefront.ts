const rawStorefrontBaseUrl =
  process.env.NEXT_PUBLIC_SHOPWARE_STOREFRONT_URL ?? "https://localhost:8000";

const storefrontBaseUrl = rawStorefrontBaseUrl.replace(/\/+$/, "");

// Diese URLs sind für die Shopware Storefront (wenn man direkt zu Shopware navigiert)
// Für API-Aufrufe sollten stattdessen die /api/* Routen verwendet werden
export const SHOPWARE_CART_URL = `${storefrontBaseUrl}/checkout/cart`;
export const SHOPWARE_CONFIRM_URL = `${storefrontBaseUrl}/checkout/confirm`;
export const SHOPWARE_ACCOUNT_REGISTER_URL = `${storefrontBaseUrl}/account/login#register`;

// Store-API Base URL (ohne /api Pfad)
export function getShopwareApiBase(): string {
  const raw = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "https://localhost:8000";
  return raw.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}
