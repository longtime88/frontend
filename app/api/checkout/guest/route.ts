import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getBaseUrl() {
  const raw = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8000";
  return raw.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

function getAccessKey() {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY || "";
}

type AddressPayload = {
  firstName?: string;
  lastName?: string;
  street?: string;
  streetAdditional?: string;
  city?: string;
  zipcode?: string;
  countryId?: string;
  countryStateId?: string | null;
  company?: string;
  salutationId?: string | null;
  email?: string;
};

async function shopwareFetch(
  path: string,
  options: RequestInit,
  headers: Record<string, string>
): Promise<{ response: Response; json: Record<string, unknown> }> {
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

  const json = (await resp.json().catch(() => ({}))) as Record<string, unknown>;
  return { response: resp, json };
}

async function getDefaultSalutationId(headers: Record<string, string>): Promise<string> {
  const { response, json } = await shopwareFetch("/salutation", { method: "GET", cache: "no-store" }, headers);
  if (!response.ok) return "";
  const elements = Array.isArray(json?.elements) ? (json.elements as Array<Record<string, unknown>>) : [];
  const first = elements.find((entry) => typeof entry?.id === "string" && String(entry.id));
  return first ? String(first.id) : "";
}

async function getDefaultCountryId(headers: Record<string, string>): Promise<string> {
  const { response, json } = await shopwareFetch("/country", { method: "GET", cache: "no-store" }, headers);
  if (!response.ok) return "";
  const elements = Array.isArray(json?.elements) ? (json.elements as Array<Record<string, unknown>>) : [];
  const preferred = elements.find((entry) => entry?.active === true && entry?.shippingAvailable === true && typeof entry?.id === "string");
  if (preferred) return String(preferred.id);
  const first = elements.find((entry) => typeof entry?.id === "string");
  return first ? String(first.id) : "";
}

function getFirstErrorCode(json: Record<string, unknown>): string {
  const errors = Array.isArray(json?.errors) ? (json.errors as Array<Record<string, unknown>>) : [];
  return typeof errors[0]?.code === "string" ? errors[0].code : "";
}

export async function POST(request: Request) {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return NextResponse.json({ error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" }, { status: 500 });
  }

  let payload: {
    contextToken?: string;
    email?: string;
    shippingAddress?: AddressPayload;
    billingAddress?: AddressPayload;
    salutationId?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const contextToken =
    String(payload.contextToken ?? "").trim() ||
    cookieStore.get("sw-context-token")?.value ||
    "";
  const shippingAddress = payload.shippingAddress || {};
  const billingAddress = payload.billingAddress || shippingAddress;

  const firstName = String(shippingAddress.firstName ?? billingAddress.firstName ?? "").trim();
  const lastName = String(shippingAddress.lastName ?? billingAddress.lastName ?? "").trim();
  const street = String(shippingAddress.street ?? billingAddress.street ?? "").trim();
  const city = String(shippingAddress.city ?? billingAddress.city ?? "").trim();
  const zipcode = String(shippingAddress.zipcode ?? billingAddress.zipcode ?? "").trim();
  const payloadCountryId = String(shippingAddress.countryId ?? billingAddress.countryId ?? "").trim();

  if (!firstName || !lastName || !street || !city || !zipcode) {
    return NextResponse.json(
      { error: "Fuer Gastbestellung fehlen Adressdaten (Vorname, Nachname, Strasse, PLZ, Ort)." },
      { status: 400 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };
  if (contextToken) {
    headers["sw-context-token"] = contextToken;
  }

  const guestEmail =
    String(payload.email ?? shippingAddress.email ?? "").trim() ||
    `gast.${Date.now()}@example.local`;

  let salutationId =
    String(payload.salutationId ?? shippingAddress.salutationId ?? billingAddress.salutationId ?? "").trim();
  if (!salutationId) {
    salutationId = await getDefaultSalutationId(headers);
  }

  if (!salutationId) {
    return NextResponse.json(
      { error: "Keine Anrede (salutationId) gefunden. Bitte Shopware-Salutations pruefen." },
      { status: 400 }
    );
  }

  const fallbackCountryId = await getDefaultCountryId(headers);
  const countryId = payloadCountryId || fallbackCountryId || "f3e1b85c74df4e8fae2f3ef2da38e44f";

  const password = `Guest-${Math.random().toString(36).slice(2)}-${Date.now()}`;
  const storefrontUrl = (process.env.NEXT_PUBLIC_SHOPWARE_STOREFRONT_URL || `${getBaseUrl()}/`).replace(/\/+$/, "");
  const makeRegisterBody = (countryIdForBody: string) => ({
    guest: true,
    accountType: "private",
    salutationId,
    firstName,
    lastName,
    email: guestEmail,
    storefrontUrl,
    acceptedDataProtection: true,
    password,
    billingAddress: {
      salutationId,
      firstName: String(billingAddress.firstName ?? firstName),
      lastName: String(billingAddress.lastName ?? lastName),
      street: String(billingAddress.street ?? street),
      streetAdditional: String(billingAddress.streetAdditional ?? ""),
      city: String(billingAddress.city ?? city),
      zipcode: String(billingAddress.zipcode ?? zipcode),
      countryId: countryIdForBody,
      countryStateId: billingAddress.countryStateId ?? null,
      company: String(billingAddress.company ?? ""),
    },
    shippingAddress: {
      salutationId,
      firstName,
      lastName,
      street,
      streetAdditional: String(shippingAddress.streetAdditional ?? ""),
      city,
      zipcode,
      countryId: countryIdForBody,
      countryStateId: shippingAddress.countryStateId ?? null,
      company: String(shippingAddress.company ?? ""),
    },
  });

  let registerBody = makeRegisterBody(countryId);
  let { response, json } = await shopwareFetch(
    "/account/register",
    {
      method: "POST",
      body: JSON.stringify(registerBody),
      cache: "no-store",
    },
    headers
  );

  if (
    !response.ok &&
    getFirstErrorCode(json) === "CHECKOUT__CUSTOMER_COUNTRY_NOT_FOUND" &&
    fallbackCountryId &&
    fallbackCountryId !== countryId
  ) {
    registerBody = makeRegisterBody(fallbackCountryId);
    ({ response, json } = await shopwareFetch(
      "/account/register",
      {
        method: "POST",
        body: JSON.stringify(registerBody),
        cache: "no-store",
      },
      headers
    ));
  }

  const nextContextToken =
    response.headers.get("sw-context-token") ||
    (typeof json?.token === "string" ? String(json.token) : "") ||
    contextToken;
  const customerToken =
    response.headers.get("sw-customer-token") ||
    (typeof json?.customerToken === "string" ? String(json.customerToken) : "");

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          (json?.errors as Array<Record<string, string>>)?.[0]?.detail ||
          (json?.errors as Array<Record<string, string>>)?.[0]?.title ||
          "Gastregistrierung fehlgeschlagen.",
        details: json,
        contextToken: nextContextToken || undefined,
      },
      { status: response.status }
    );
  }

  const res = NextResponse.json({
    ok: true,
    guestRegistered: true,
    contextToken: nextContextToken || undefined,
    customerToken: customerToken || undefined,
    customer: json?.customer || null,
  });

  if (nextContextToken) {
    res.cookies.set("sw-context-token", nextContextToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  if (customerToken) {
    res.cookies.set("sw-customer-token", customerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return res;
}
