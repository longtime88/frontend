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

// ─── Context Token ────────────────────────────────────────────

export function getShopwareContextToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CONTEXT_TOKEN_KEY) || readCookie(CONTEXT_TOKEN_KEY) || "";
}

export function setShopwareContextToken(token: string): void {
  if (typeof window === "undefined" || !token) return;
  localStorage.setItem(CONTEXT_TOKEN_KEY, token);
  writeCookie(CONTEXT_TOKEN_KEY, token);
}

// ─── Produkt-ID auflösen ──────────────────────────────────────

export function resolveShopwareProductId(input: string | number | undefined, fallback?: string): string {
  if (typeof fallback === "string") {
    const n = normalizeShopwareId(fallback.trim());
    if (SHOPWARE_HEX_ID_PATTERN.test(n)) return n;
  }
  if (typeof input === "string") {
    const n = normalizeShopwareId(input.trim());
    if (SHOPWARE_HEX_ID_PATTERN.test(n)) return n;
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
  const existing = items.find((i) => i.shopwareId === item.shopwareId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    items.push(item);
  }
  localStorage.setItem(CUSTOM_CART_KEY, JSON.stringify(items));
}

export function getCustomCartItems(): CustomCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function removeCustomCartItem(id: string): void {
  if (typeof window === "undefined") return;
  const normalizedId = id.startsWith("custom:") ? id.slice("custom:".length) : id;
  const items = getCustomCartItems().filter(
    (i) => i.id !== id && i.id !== normalizedId && i.shopwareId !== id
  );
  localStorage.setItem(CUSTOM_CART_KEY, JSON.stringify(items));
}

export function mergeCartWithCustom(
  shopwareItems: Record<string, unknown>,
  customItems: CustomCartItem[]
): Array<Record<string, unknown>> {

  // Normalisiere customItems: behalte pro shopwareId nur den letzten Eintrag
  const seenCustom = new Set<string>();
  const uniqueCustom: CustomCartItem[] = [];
  for (let i = customItems.length - 1; i >= 0; i--) {
    const c = customItems[i];
    if (!seenCustom.has(c.shopwareId)) {
      seenCustom.add(c.shopwareId);
      uniqueCustom.push(c);
    }
  }
  uniqueCustom.reverse();

  // Set zum kollisionsfreien Zusammenführen (dedup nach id UND nach shopwareId)
  const mergedMap = new Map<string, Record<string, unknown>>();
  for (const li of Object.values(shopwareItems)) {
    const swId = String((li as Record<string, unknown>).id ?? "");
    if (!mergedMap.has(swId)) {
      mergedMap.set(swId, li as Record<string, unknown>);
    }
  }

  // Custom-Overlay anwenden und conflikt durch shopwareId auflösen
  const byShopware = new Map<string, string>(); // shopwareId -> lineItem id
  for (const [lineId, li] of mergedMap) {
    const refId = String((li as Record<string, unknown>).referencedId ?? "");
    if (refId) byShopware.set(refId, lineId);
  }

   for (const custom of uniqueCustom) {
     if (byShopware.has(custom.shopwareId)) {
       const existing = mergedMap.get(byShopware.get(custom.shopwareId)!)!;
       mergedMap.set(byShopware.get(custom.shopwareId)!, {
         ...existing,
         label: custom.name,
         price: { totalPrice: custom.price * 100 },
         priceTotal: custom.price * custom.quantity * 100,
         cover: { media: { url: custom.image, translated: { alt: custom.name } } },
         quantity: custom.quantity,
       });
     } else {
       const syntheticId = `custom:${custom.id}`;
       mergedMap.set(syntheticId, {
         id: syntheticId,
         referencedId: custom.shopwareId,
         label: custom.name,
         quantity: custom.quantity,
         priceTotal: custom.price * custom.quantity * 100,
         price: { totalPrice: custom.price * custom.quantity * 100 },
         cover: { media: { url: custom.image, translated: { alt: custom.name } } },
       });
     }
   }

  // Finale Dedup: Falls mehrere Shopware-lineItems die gleiche referencedId tragen,
  // behalte nur den ersten pro referencedId.
  const byRef = new Map<string, Record<string, unknown>>();
  const result: Array<Record<string, unknown>> = [];
  for (const li of mergedMap.values()) {
    const refId = String((li as Record<string, unknown>).referencedId ?? "");
    if (!refId || !byRef.has(refId)) {
      byRef.set(refId || `rand-${Math.random()}`, li);
      result.push(li);
    }
  }
  return result;
}

// ─── Shopware Warenkorb (API) ─────────────────────────────────

// Serielle Warteschlange: verhindert "concurrent write" Sperrungen in Shopware
const cartQueue: Array<() => Promise<void>> = [];
let cartBusy = false;
async function runCartQueue(): Promise<void> {
  if (cartBusy) return; // bereits aktiv, neuer Aufrufer warte via Promise-Kette
  cartBusy = true;
  try {
    while (cartQueue.length > 0) {
      const task = cartQueue.shift()!;
      try {
        await task();
      } catch { /* Fehler wird bereits im Caller behandelt */ }
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
      body: JSON.stringify({ productId: normalizedProductId, quantity, contextToken: contextToken || undefined }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || `Add-to-cart fehlgeschlagen (HTTP ${response.status}).`);
    }

    // Token aus Response oder Cookie zurückholen und speichern
    const returnedToken =
      (typeof data?.contextToken === "string" && data.contextToken) ||
      (typeof data?.token === "string" && data.token) ||
      previousToken;

    if (returnedToken) {
      setShopwareContextToken(returnedToken);
    }

    // Kurze Pause, bis Shopware den Write abgeschlossen hat
    await new Promise(resolve => setTimeout(resolve, 300));
  });
}

export async function removeProductFromShopwareCart(itemId: string): Promise<void> {
  return enqueueCart(async () => {
    const contextToken = getShopwareContextToken();

    const response = await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, contextToken: contextToken || undefined }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || `Entfernen fehlgeschlagen (HTTP ${response.status}).`);
    }

    if (data.contextToken && typeof window !== "undefined") {
      localStorage.setItem("sw-context-token", data.contextToken);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  });
}
