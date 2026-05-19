import { NextResponse } from "next/server";

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
    const cartUrl = "/store-api/checkout/cart";
    const fetchOptions: RequestInit = {
      method: "GET",
      headers,
      cache: "no-store",
    };

    let upstream: Response;
    try {
      upstream = await fetch(cartUrl, fetchOptions);
    } catch (err) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) throw err;
      const httpsUrl = cartUrl.startsWith("https://") ? cartUrl : cartUrl.replace(/^http:\/\//i, "https://");
      const prev = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        upstream = await fetch(httpsUrl, fetchOptions);
      } finally {
        if (prev === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = prev;
        }
      }
    }

    const data = await upstream.json().catch(() => ({}));
    const nextContextToken =
      upstream.headers.get("sw-context-token") ||
      (typeof (data as Record<string, unknown>)?.token === "string"
        ? (data as Record<string, string>).token
        : "");

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.detail ||
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.title ||
            "Warenkorb konnte nicht geladen werden.",
          contextToken: nextContextToken || undefined,
        },
        { status: upstream.status }
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

  const contextToken = String(payload.contextToken ?? "").trim();
  const shippingAddress = payload.shippingAddress || {};
  const billingAddress = payload.billingAddress || {};
  const paymentMethod = String(payload.paymentMethod ?? "").trim();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };

  if (contextToken) headers["sw-context-token"] = contextToken;

  try {
    const orderUrl = "/store-api/checkout/order";
    const countryId = shippingAddress.countryId || billingAddress.countryId || "f3e1b85c74df4e8fae2f3ef2da38e44f";

    const body = {
      lineItems: payload.lineItems || [],
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
      shippingMethod: payload.shippingMethod || undefined,
    };

    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    };

    let upstream: Response;
    try {
      upstream = await fetch(orderUrl, fetchOptions);
    } catch (err) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) throw err;
      const httpsUrl = orderUrl.startsWith("https://") ? orderUrl : orderUrl.replace(/^http:\/\//i, "https://");
      const prev = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        upstream = await fetch(httpsUrl, fetchOptions);
      } finally {
        if (prev === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = prev;
        }
      }
    }

    const data = await upstream.json().catch(() => ({}));
    const nextContextToken =
      upstream.headers.get("sw-context-token") ||
      (typeof (data as Record<string, unknown>)?.token === "string"
        ? (data as Record<string, string>).token
        : "");

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.detail ||
            (data as Record<string, Array<Record<string, string>>>)?.errors?.[0]?.title ||
            "Bestellung fehlgeschlagen.",
          contextToken: nextContextToken || undefined,
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json({
      ok: true,
      order: data,
      contextToken: nextContextToken || undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Shopware Order API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}
