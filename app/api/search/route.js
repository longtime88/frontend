export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    const response = await fetch(`${process.env.SHOPWARE_URL}/store-api/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'sw-access-key': process.env.SHOPWARE_ACCESS_KEY
        },
        body: JSON.stringify({
            search: q
        })
    });

    const data = await response.json();
    return Response.json(data);
}

