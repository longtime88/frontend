import { getMediaUrl } from "@/lib/shopwareStorefront";

const CONTEXT_TOKEN_KEY = "sw-context-token";
const SHOPWARE_HEX_ID_PATTERN = /^[0-9a-f]{32}$/i;

function normalizeShopwareId(value: string): string {
  return value.replace(/-/g, "").toLowerCase();
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";

  const entry = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.split("=").slice(1).join("=")) : "";
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined" || !value) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=2592000; samesite=lax`;
}

function readStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function writeStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

// ─── Context Token ────────────────────────────────────────────

export function getShopwareContextToken(): string {
  if (typeof window === "undefined") return "";
  return readStorageItem(CONTEXT_TOKEN_KEY) || readCookie(CONTEXT_TOKEN_KEY) || "";
}

export function setShopwareContextToken(token: string): void {
  if (typeof window === "undefined" || !token) return;
  writeStorageItem(CONTEXT_TOKEN_KEY, token);
  writeCookie(CONTEXT_TOKEN_KEY, token);
}

// ─── Produkt-ID auflösen ──────────────────────────────────────

export function resolveShopwareProductId(input: string | number | undefined, fallback?: string): string {
  if (typeof fallback === "string") {
    const normalized = normalizeShopwareId(fallback.trim());
    if (SHOPWARE_HEX_ID_PATTERN.test(normalized)) return normalized;
  }

  if (typeof input === "string") {
    const normalized = normalizeShopwareId(input.trim());
    if (SHOPWARE_HEX_ID_PATTERN.test(normalized)) return normalized;
  }

  return "";
}

// ─── Shopware Warenkorb (API) ─────────────────────────────────

const cartQueue: Array<() => Promise<void>> = [];
let cartBusy = false;

async function runCartQueue(): Promise<void> {
  if (cartBusy) return;

  cartBusy = true;

  try {
    while (cartQueue.length > 0) {
      const task = cartQueue.shift();
      if (!task) continue;

      try {
        await task();
      } catch {
        // Fehler wird bereits im Caller behandelt.
      }
    }
  } finally {
    cartBusy = false;
  }
}

function enqueueCart(task: () => Promise<void>): Promise<void> {
  cartQueue.push(task);
  return runCartQueue();
}

export async function addProductToShopwareCart(productId: string, quantity = 1): Promise<void> {
  const normalizedProductId = normalizeShopwareId(productId.trim());

  return enqueueCart(async () => {
    const contextToken = getShopwareContextToken();
    const previousToken = contextToken || "";

    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: normalizedProductId,
        quantity,
        contextToken: contextToken || undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || `Add-to-cart fehlgeschlagen (HTTP ${response.status}).`);
    }

    const returnedToken =
      (typeof data?.contextToken === "string" && data.contextToken) ||
      (typeof data?.token === "string" && data.token) ||
      previousToken;

    if (returnedToken) {
      setShopwareContextToken(returnedToken);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  });
}

export async function removeProductFromShopwareCart(itemId: string): Promise<void> {
  return enqueueCart(async () => {
    const contextToken = getShopwareContextToken();

    const response = await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        contextToken: contextToken || undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || `Entfernen fehlgeschlagen (HTTP ${response.status}).`);
    }

    if (data.contextToken && typeof window !== "undefined") {
      writeStorageItem(CONTEXT_TOKEN_KEY, data.contextToken);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  });
}

export type ShopwareCartLineItem = {
  id: string;
  referencedId: string;
  label: string;
  quantity: number;
  priceTotal: number;
  image: string;
};

export type ShopwareCartSnapshot = {
  items: ShopwareCartLineItem[];
  totalPrice: number;
  contextToken: string;
};

export async function fetchShopwareCart(): Promise<ShopwareCartSnapshot> {
  const contextToken = getShopwareContextToken();
  const response = await fetch(`/api/cart/details?contextToken=${encodeURIComponent(contextToken)}`, { cache: "no-store" });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || "Shopware-Warenkorb konnte nicht geladen werden.");
  }

  const nextContextToken = typeof data.contextToken === "string" && data.contextToken
    ? data.contextToken
    : contextToken;
  if (nextContextToken) setShopwareContextToken(nextContextToken);

  const rawItems = data.lineItems && typeof data.lineItems === "object"
    ? Object.values(data.lineItems as Record<string, Record<string, unknown>>)
    : Array.isArray(data.cart?.lineItems)
      ? data.cart.lineItems as Array<Record<string, unknown>>
      : [];

  const items = rawItems.map((item) => {
    const price = item.price as Record<string, unknown> | undefined;
    const cover = item.cover as Record<string, unknown> | undefined;
    const media = cover?.media as Record<string, unknown> | undefined;
    return {
      id: String(item.id ?? ""),
      referencedId: String(item.referencedId ?? ""),
      label: String(item.label ?? "Produkt"),
      quantity: Number(item.quantity ?? 1) || 1,
      priceTotal: typeof price?.totalPrice === "number" ? price.totalPrice : 0,
      image: getMediaUrl(String(media?.url ?? "")),
    };
  }).filter((item) => item.id);

  const cartPrice = data.cart?.price as Record<string, unknown> | undefined;
  const totalPrice = typeof cartPrice?.totalPrice === "number"
    ? cartPrice.totalPrice
    : items.reduce((sum, item) => sum + item.priceTotal, 0);

  return { items, totalPrice, contextToken: nextContextToken };
}
