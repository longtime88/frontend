export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const accessKey = process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;

  if (!q) {
    return Response.json({ elements: [] });
  }

  if (!accessKey) {
    return Response.json(
      { error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" },
      { status: 500 }
    );
  }

  const baseUrl = process.env.SHOPWARE_URL || process.env.BACKEND_API_URL || "http://localhost:8000";
  const cleanUrl = baseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const searchUrl = `${cleanUrl}/store-api/search`;

  try {
    let response;
    try {
      response = await fetch(searchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "sw-access-key": accessKey,
        },
        body: JSON.stringify({ search: q }),
        cache: "no-store",
      });
    } catch (error) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned) throw error;
      const previousTlsMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        response = await fetch(searchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "sw-access-key": accessKey,
          },
          body: JSON.stringify({ search: q }),
          cache: "no-store",
        });
      } finally {
        if (previousTlsMode === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsMode;
        }
      }
    }

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      { error: "Shopware Search API ist nicht erreichbar." },
      { status: 502 }
    );
  }
}
