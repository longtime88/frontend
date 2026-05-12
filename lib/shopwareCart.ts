const CONTEXT_TOKEN_KEY = "sw-context-token";

const SHOPWARE_HEX_ID_PATTERN = /^[0-9a-f]{32}$/i;

function normalizeShopwareId(value: string): string {
  return value.replace(/-/g, "").toLowerCase();
}

function readCookie(name: string): string {
  if (typeof document === "undefined") {
    return "";
  }

  const entry = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : "";
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=2592000; samesite=lax`;
}

export function getShopwareContextToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(CONTEXT_TOKEN_KEY) || readCookie(CONTEXT_TOKEN_KEY) || "";
}

export function setShopwareContextToken(token: string): void {
  if (typeof window === "undefined" || !token) {
    return;
  }

  localStorage.setItem(CONTEXT_TOKEN_KEY, token);
  writeCookie(CONTEXT_TOKEN_KEY, token);
}

export function resolveShopwareProductId(input: string | number | undefined, fallback?: string): string {
  if (typeof fallback === "string") {
    const normalizedFallback = normalizeShopwareId(fallback.trim());
    if (SHOPWARE_HEX_ID_PATTERN.test(normalizedFallback)) {
      return normalizedFallback;
    }
  }

  if (typeof input === "string") {
    const normalizedInput = normalizeShopwareId(input.trim());
    if (SHOPWARE_HEX_ID_PATTERN.test(normalizedInput)) {
      return normalizedInput;
    }
  }

  return "";
}

export async function addProductToShopwareCart(productId: string, quantity = 1): Promise<void> {
  const contextToken = getShopwareContextToken();

  const response = await fetch("/api/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
      contextToken: contextToken || undefined,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || `Add-to-cart fehlgeschlagen (HTTP ${response.status}).`);
  }

  if (typeof data?.contextToken === "string" && data.contextToken.length > 0) {
    setShopwareContextToken(data.contextToken);
  }
}
