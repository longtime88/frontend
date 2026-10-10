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
  const paymentMethodId = String(payload.paymentMethodId ?? payload.paymentMethod ?? "").trim();
  const shippingMethodId = String(payload.shippingMethodId ?? payload.shippingMethod ?? "").trim();

  logCheckout("request-received", {
    hasContextToken: Boolean(contextToken),
    contextToken: maskToken(contextToken),
    hasCustomerToken: Boolean(cookieCustomerToken),
    paymentMethod: paymentMethodId ? paymentMethodId.slice(0, 8) : "",
    shippingMethod: shippingMethodId ? shippingMethodId.slice(0, 8) : "",
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
    let activeContextToken = contextToken;

    if (paymentMethodId || shippingMethodId) {
      const contextResponse = await shopwareFetch("/context", {
        method: "PATCH",
        body: JSON.stringify({
          ...(paymentMethodId ? { paymentMethodId } : {}),
          ...(shippingMethodId ? { shippingMethodId } : {}),
        }),
        cache: "no-store",
      }, headers);
      const contextData = contextResponse.json as Record<string, unknown>;
      const contextTokenFromResponse = contextResponse.response.headers.get("sw-context-token") ||
        (typeof contextData?.token === "string" ? contextData.token : "");
      if (!contextResponse.response.ok) {
        const errors = contextData?.errors as Array<Record<string, unknown>> | undefined;
        return NextResponse.json({ error: errors?.[0]?.detail || "Zahlungs- oder Versandart konnte in Shopware nicht gesetzt werden." }, { status: contextResponse.response.status });
      }
      if (contextTokenFromResponse) {
        activeContextToken = contextTokenFromResponse;
        headers["sw-context-token"] = activeContextToken;
      }
    }

    const body = {};

    const { response, json } = await shopwareFetch("/checkout/order", {
      method: "POST",
      body: JSON.stringify(body),
      cache: "no-store",
    }, headers);

    const data = json as Record<string, unknown>;
    const nextContextToken =
      response.headers.get("sw-context-token") ||
      (typeof data?.token === "string" ? data.token : "") ||
      activeContextToken;

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

    const orderId = typeof data?.id === "string" ? data.id : "";
    let payment: { redirectUrl?: string | null } = {};

    if (orderId) {
      const origin = new URL(request.url).origin;
      const paymentResponse = await shopwareFetch("/handle-payment", {
        method: "POST",
        body: JSON.stringify({
          orderId,
          finishUrl: `${origin}/Checkout?payment=success&orderId=${encodeURIComponent(orderId)}`,
          errorUrl: `${origin}/Checkout?payment=failed&orderId=${encodeURIComponent(orderId)}`,
        }),
        cache: "no-store",
      }, headers);
      const paymentData = paymentResponse.json as Record<string, unknown>;
      if (!paymentResponse.response.ok) {
        const errors = paymentData?.errors as Array<Record<string, unknown>> | undefined;
        return NextResponse.json({ error: errors?.[0]?.detail || "Shopware-Zahlung konnte nicht gestartet werden.", order: data }, { status: paymentResponse.response.status });
      }
      payment = { redirectUrl: typeof paymentData?.redirectUrl === "string" ? paymentData.redirectUrl : null };
    }

    return NextResponse.json({
      ok: true,
      order: data,
      payment,
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
