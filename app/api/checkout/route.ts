import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CHECKOUT_DEBUG = process.env.CHECKOUT_DEBUG === "true";

function maskToken(token: string): string {
  if (!token) return "";
  if (token.length <= 8) return "***";
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

function logCheckout(event: string, details: Record<string, unknown>): void {
  if (!CHECKOUT_DEBUG) return;
  console.info(`[checkout-debug] ${event}`, details);
}

function getBaseUrl() {
  const raw = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8080";
  return raw.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

async function shopwareFetch(path: string, options: RequestInit, headers: Record<string, string>) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/store-api${path}`;
  
  let resp: Response;
  try {
    resp = await fetch(url, { ...options, headers });
  } catch (err) {
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
      throw err;
    }
  }
  return { response: resp, json: await resp.json().catch(() => ({})) };
}

export async function GET(request: Request) {
  const accessKey = process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const contextToken = searchParams.get("contextToken") || "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };

  if (contextToken) headers["sw-context-token"] = contextToken;

  try {
    const { response, json } = await shopwareFetch("/checkout/cart", {
      method: "GET",
      cache: "no-store",
    }, headers);
    
    const data = json as Record<string, unknown>;
    const nextContextToken =
      response.headers.get("sw-context-token") ||
      (typeof data?.token === "string" ? data.token : "");

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.detail ||
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.title ||
            "Warenkorb konnte nicht geladen werden.",
          contextToken: nextContextToken || undefined,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      cart: data,
      contextToken: nextContextToken || undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Shopware Cart API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  const accessKey = process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;

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

  const cookieStore = await cookies();
  const cookieContextToken = cookieStore.get("sw-context-token")?.value || "";
  const cookieCustomerToken = cookieStore.get("sw-customer-token")?.value || "";

  const payloadContextToken = String(payload.contextToken ?? "").trim();
  const contextToken = payloadContextToken || cookieContextToken;
  const shippingAddress = payload.shippingAddress || {};
  const billingAddress = payload.billingAddress || {};
  const paymentMethod = String(payload.paymentMethod ?? "").trim();
  const shippingMethod = String(payload.shippingMethod ?? "").trim();
  const lineItems = Array.isArray(payload.lineItems) ? payload.lineItems : [];

  logCheckout("request-received", {
    hasContextToken: Boolean(contextToken),
    contextToken: maskToken(contextToken),
    hasCustomerToken: Boolean(cookieCustomerToken),
    lineItemsCount: lineItems.length,
    lineItems: lineItems.map((item: Record<string, unknown>) => ({
      type: String(item.type ?? ""),
      referencedId: String(item.referencedId ?? "").slice(0, 8),
      quantity: Number(item.quantity ?? 0),
    })),
    paymentMethod: paymentMethod ? paymentMethod.slice(0, 8) : "",
    shippingMethod: shippingMethod ? shippingMethod.slice(0, 8) : "",
    hasShippingAddress: Boolean(shippingAddress?.firstName || shippingAddress?.lastName || shippingAddress?.street),
    hasBillingAddress: Boolean(billingAddress?.firstName || billingAddress?.lastName || billingAddress?.street),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };

  if (contextToken) headers["sw-context-token"] = contextToken;
  if (cookieCustomerToken) headers["sw-customer-token"] = cookieCustomerToken;

  try {
    const countryId = shippingAddress.countryId || billingAddress.countryId || "f3e1b85c74df4e8fae2f3ef2da38e44f";

    const body = {
      lineItems,
      shippingAddress: {
        firstName: shippingAddress.firstName || "",
        lastName: shippingAddress.lastName || "",
        street: shippingAddress.street || "",
        streetAdditional: shippingAddress.streetAdditional || "",
        city: shippingAddress.city || "",
        zipcode: shippingAddress.zipcode || "",
        countryId,
        countryStateId: shippingAddress.countryStateId || null,
        company: shippingAddress.company || "",
      },
      billingAddress: {
        firstName: billingAddress.firstName || "",
        lastName: billingAddress.lastName || "",
        street: billingAddress.street || "",
        streetAdditional: billingAddress.streetAdditional || "",
        city: billingAddress.city || "",
        zipcode: billingAddress.zipcode || "",
        countryId,
        countryStateId: billingAddress.countryStateId || null,
        company: billingAddress.company || "",
      },
      paymentMethod: paymentMethod || undefined,
      shippingMethod: shippingMethod || undefined,
    };

    const { response, json } = await shopwareFetch("/checkout/order", {
      method: "POST",
      body: JSON.stringify(body),
      cache: "no-store",
    }, headers);

    const data = json as Record<string, unknown>;
    const nextContextToken =
      response.headers.get("sw-context-token") ||
      (typeof data?.token === "string" ? data.token : "");

    if (!response.ok) {
      logCheckout("shopware-order-failed", {
        status: response.status,
        contextToken: maskToken(nextContextToken || contextToken),
        errorDetail:
          (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.detail ||
          (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.title ||
          "Bestellung fehlgeschlagen.",
        orderId: typeof data?.id === "string" ? data.id : "",
      });
      return NextResponse.json(
        {
          error:
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.detail ||
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.title ||
            "Bestellung fehlgeschlagen.",
          contextToken: nextContextToken || undefined,
        },
        { status: response.status }
      );
    }

    logCheckout("shopware-order-success", {
      status: response.status,
      contextToken: maskToken(nextContextToken || contextToken),
      orderId: typeof data?.id === "string" ? data.id : "",
      orderNumber: typeof data?.orderNumber === "string" ? data.orderNumber : "",
    });

    return NextResponse.json({
      ok: true,
      order: data,
      contextToken: nextContextToken || undefined,
    });
  } catch (error) {
    logCheckout("shopware-order-exception", {
      message: error instanceof Error ? error.message : "unknown error",
      contextToken: maskToken(contextToken),
    });
    return NextResponse.json(
      { error: "Shopware Order API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}
