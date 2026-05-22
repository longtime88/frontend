import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getShopwareUrl() {
  const raw = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "https://localhost:8000";
  return raw.replace(/\/api\/?$/, "").replace(/\/+$/, "");
}

export async function GET() {
  const cookieStore = await cookies();
  const contextToken = cookieStore.get("sw-context-token")?.value;
  const customerToken = cookieStore.get("sw-customer-token")?.value;

  if (!customerToken && !contextToken) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  const accessKey = process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt" },
      { status: 500 }
    );
  }

  const baseUrl = getShopwareUrl();
  const accountUrl = `${baseUrl}/store-api/account/customer`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sw-access-key": accessKey,
    "sw-context-token": contextToken || "",
    "sw-customer-token": customerToken || "",
  };

  try {
    const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
    const previousTlsMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

    if (allowSelfSigned) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    let upstream: Response;
    try {
      upstream = await fetch(accountUrl, {
        method: "POST",
        headers,
        cache: "no-store",
      });
    } finally {
      if (allowSelfSigned) {
        if (previousTlsMode === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsMode;
        }
      }
    }

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: data?.errors?.[0]?.detail || data?.errors?.[0]?.title || "Fehler beim Abrufen der Kundendaten.",
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json({
      loggedIn: true,
      salutation: data?.salutation || null,
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      customerEmail: data?.customerEmail || null,
    });
  } catch (error) {
    console.error("Fetch customer error:", error);
    return NextResponse.json(
      { error: "Shopware API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}
