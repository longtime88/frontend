const CONTEXT_TOKEN_KEY = "sw-context-token";
const CUSTOM_CART_KEY = "custom-cart-items";
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

function stripCustomPrefix(id: string): string {
  return id.startsWith("custom:") ? id.slice("custom:".length) : id;
}

function dedupeCustomItems(customItems: CustomCartItem[]): CustomCartItem[] {
  const seen = new Set<string>();
  const uniqueCustom: CustomCartItem[] = [];

  for (let index = customItems.length - 1; index >= 0; index -= 1) {
    const item = customItems[index];
    if (!seen.has(item.shopwareId)) {
      seen.add(item.shopwareId);
      uniqueCustom.push(item);
    }
  }

  return uniqueCustom.reverse();
}

function createSyntheticCustomCartLine(custom: CustomCartItem): Record<string, unknown> {
  const totalPrice = custom.price * custom.quantity * 100;

  return {
    id: `custom:${custom.id}`,
    referencedId: custom.shopwareId,
    label: custom.name,
    quantity: custom.quantity,
    priceTotal: totalPrice,
    price: { totalPrice },
    cover: {
      media: {
        url: custom.image,
        translated: { alt: custom.name },
      },
    },
  };
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

// ─── Eigener Warenkorb (Bild + Preis bleiben erhalten) ─────────

export type CustomCartItem = {
  id: string;
  shopwareId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export function addCustomCartItem(item: CustomCartItem): void {
  if (typeof window === "undefined") return;

  const items = getCustomCartItems();
  const existing = items.find((currentItem) => currentItem.shopwareId === item.shopwareId);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    items.push(item);
  }

  writeStorageItem(CUSTOM_CART_KEY, JSON.stringify(items));
}

export function getCustomCartItems(): CustomCartItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(readStorageItem(CUSTOM_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function removeCustomCartItem(id: string): void {
  if (typeof window === "undefined") return;

  const normalizedId = stripCustomPrefix(id);
  const items = getCustomCartItems().filter(
    (item) => item.id !== id && item.id !== normalizedId && item.shopwareId !== id
  );

  writeStorageItem(CUSTOM_CART_KEY, JSON.stringify(items));
}

export function mergeCartWithCustom(
  shopwareItems: Record<string, unknown>,
  customItems: CustomCartItem[]
): Array<Record<string, unknown>> {
  const uniqueCustom = dedupeCustomItems(customItems);
  const mergedMap = new Map<string, Record<string, unknown>>();

  for (const lineItem of Object.values(shopwareItems)) {
    const shopwareId = String((lineItem as Record<string, unknown>).id ?? "");
    if (shopwareId && !mergedMap.has(shopwareId)) {
      mergedMap.set(shopwareId, lineItem as Record<string, unknown>);
    }
  }

  const byShopware = new Map<string, string>();
  for (const [lineId, lineItem] of mergedMap) {
    const referencedId = String((lineItem as Record<string, unknown>).referencedId ?? "");
    if (referencedId) byShopware.set(referencedId, lineId);
  }

  for (const custom of uniqueCustom) {
    const matchingLineId = byShopware.get(custom.shopwareId);

    if (matchingLineId) {
      const existing = mergedMap.get(matchingLineId);
      if (!existing) continue;

      mergedMap.set(matchingLineId, {
        ...existing,
        label: custom.name,
        price: { totalPrice: custom.price * 100 },
        priceTotal: custom.price * custom.quantity * 100,
        cover: {
          media: {
            url: custom.image,
            translated: { alt: custom.name },
          },
        },
        quantity: custom.quantity,
      });

      continue;
    }

    mergedMap.set(`custom:${custom.id}`, createSyntheticCustomCartLine(custom));
  }

  const byReference = new Map<string, Record<string, unknown>>();
  const result: Array<Record<string, unknown>> = [];

  for (const lineItem of mergedMap.values()) {
    const referencedId = String((lineItem as Record<string, unknown>).referencedId ?? "");
    const dedupeKey = referencedId || `rand-${Math.random()}`;

    if (!byReference.has(dedupeKey)) {
      byReference.set(dedupeKey, lineItem);
      result.push(lineItem);
    }
  }

  return result;
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
