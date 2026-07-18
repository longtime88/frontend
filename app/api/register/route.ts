import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getShopwareUrl() {
  const raw = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8080";
  return raw.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

function getAccessKey() {
  return process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY || "";
}

async function getFirstEntityId(path: "/salutation" | "/country", headers: HeadersInit) {
  const response = await fetch(`${getShopwareUrl()}/store-api${path}`, {
    headers,
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  const elements = Array.isArray(data?.elements) ? data.elements : [];
  const entity = elements.find((item: { id?: unknown; active?: unknown; shippingAvailable?: unknown }) => {
    if (typeof item.id !== "string") return false;
    return path === "/salutation" || (item.active === true && item.shippingAvailable === true);
  }) || elements.find((item: { id?: unknown }) => typeof item.id === "string");

  return typeof entity?.id === "string" ? entity.id : "";
}

export async function POST(request: Request) {
  const accessKey = getAccessKey();
  if (!accessKey) {
    return NextResponse.json({ error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" }, { status: 500 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltige Formulardaten." }, { status: 400 });
  }

  const firstName = String(payload.firstName ?? "").trim();
  const lastName = String(payload.lastName ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const password = String(payload.password ?? "");
  const street = String(payload.street ?? "").trim();
  const zipcode = String(payload.zipcode ?? "").trim();
  const city = String(payload.city ?? "").trim();

  if (!firstName || !lastName || !email || !password || !street || !zipcode || !city) {
    return NextResponse.json({ error: "Bitte fuelle alle Pflichtfelder aus." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Das Passwort muss mindestens 8 Zeichen haben." }, { status: 400 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
  };
  const cookieStore = await cookies();
  const contextToken = cookieStore.get("sw-context-token")?.value;
  if (contextToken) headers["sw-context-token"] = contextToken;

  try {
    const [salutationId, countryId] = await Promise.all([
      getFirstEntityId("/salutation", headers),
      getFirstEntityId("/country", headers),
    ]);
    if (!salutationId || !countryId) {
      return NextResponse.json({ error: "Shopware-Standarddaten fuer die Registrierung fehlen." }, { status: 500 });
    }

    const storefrontUrl = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const address = { salutationId, firstName, lastName, street, zipcode, city, countryId };
    const upstream = await fetch(`${getShopwareUrl()}/store-api/account/register`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        accountType: "private",
        salutationId,
        firstName,
        lastName,
        email,
        password,
        acceptedDataProtection: true,
        storefrontUrl,
        billingAddress: address,
      }),
      cache: "no-store",
    });
    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.errors?.[0]?.detail || data?.errors?.[0]?.title || "Registrierung fehlgeschlagen." },
        { status: upstream.status }
      );
    }

    const response = NextResponse.json({ ok: true });
    const nextContextToken = upstream.headers.get("sw-context-token");
    const customerToken = upstream.headers.get("sw-customer-token");
    for (const [name, value] of [["sw-context-token", nextContextToken], ["sw-customer-token", customerToken]] as const) {
      if (value) {
        response.cookies.set(name, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }
    }
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Shopware ist fuer die Registrierung nicht erreichbar." }, { status: 502 });
  }
}
