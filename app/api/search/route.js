export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const shopwareUrl = process.env.SHOPWARE_URL || "http://localhost";
    const accessKey =
      process.env.SHOPWARE_STORE_API_ACCESS_KEY || process.env.SHOPWARE_ACCESS_KEY;

    if (!q) {
        return Response.json({ elements: [] });
    }

    if (!accessKey) {
        return Response.json(
            { error: "SHOPWARE_STORE_API_ACCESS_KEY fehlt in .env.local" },
            { status: 500 }
        );
    }

    const response = await fetch(`${shopwareUrl}/store-api/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "sw-access-key": accessKey,
        },
        body: JSON.stringify({ search: q }),
        cache: "no-store",
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
}

