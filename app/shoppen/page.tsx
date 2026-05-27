import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getMediaUrl, getShopwareApiBase } from "@/lib/shopwareStorefront";

type ProductItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

async function getProducts(category?: string): Promise<ProductItem[]> {
  const baseUrl = getShopwareApiBase();
  const url = `${baseUrl}/store-api/product${category ? `?category=${encodeURIComponent(category)}` : ""}`;
  const headers = { "sw-access-key": process.env.SHOPWARE_STORE_API_ACCESS_KEY || "" };

  try {
    const res = await fetch(url, { headers, next: { revalidate: 60 } });
    if (!res.ok) return [];

    const data = await res.json().catch(() => ({ elements: [] }));
    const items = (data.elements || []) as Array<Record<string, unknown>>;
    return items.map((raw) => {
      const translated = typeof raw.translated === "object" && raw.translated !== null
        ? raw.translated as Record<string, unknown> : null;
      const price = (raw.calculatedPrice ?? raw.price) as Record<string, unknown> | undefined;
      const cover = raw.cover as Record<string, unknown> | null | undefined;
      const coverMedia = (cover?.media as Record<string, unknown> | undefined) ?? null;
      const image = getMediaUrl(
        String(
          (coverMedia?.url as string | undefined) ??
          (coverMedia?.thumbnails as Array<Record<string, unknown>> | undefined)?.[0]?.url ??
          (cover?.url as string | undefined) ??
          ""
        )
      );
      return {
        id: String(raw.id ?? ""),
        name: String(translated?.name ?? raw.name ?? "Unbenanntes Produkt"),
        description: String(translated?.description ?? raw.description ?? ""),
        price: typeof price?.total === "number"
          ? price.total
          : typeof price?.unitPrice === "number"
            ? price.unitPrice
            : typeof price?.gross === "number"
              ? price.gross
              : 0,
        image,
      };
    });
  } catch {
    return [];
  }
}

const categories = [
  { id: "shopware", name: "Shopware Plugins", count: "24" },
  { id: "templates", name: "Frontend Templates", count: "18" },
  { id: "automation", name: "Automation", count: "12" },
  { id: "mentoring", name: "Mentoring", count: "8" },
];

export const dynamic = "force-dynamic";

type ShoppenPageProps = {
  searchParams?: {
    category?: string | string[];
  };
};

export default async function ShoppenPage({ searchParams }: ShoppenPageProps) {
  const selectedCategory = Array.isArray(searchParams?.category)
    ? searchParams?.category[0]
    : searchParams?.category;
  const products = await getProducts(selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Digitale Produkte</h1>
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:text-orange-600">Startseite</a> &rsaquo; Shoppen
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64">
            <div className="border border-gray-200 rounded-md p-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Kategorien</h2>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shoppen?category=${cat.id}`}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-gray-500">{cat.count}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="border border-gray-200 rounded-md p-12 text-center">
                <p className="text-gray-500">Keine Produkte in dieser Kategorie.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[4/3] bg-gray-100 relative">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-gray-300">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{p.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {p.description || "Direkt einsetzbares Digital-Produkt"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {typeof p.price === "number" ? `${p.price.toFixed(2)} €` : "Preis auf Anfrage"}
                        </span>
                        <Link
                          href={`/Checkout?product=${encodeURIComponent(p.id)}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5 px-4 rounded transition-colors"
                        >
                          In den Warenkorb
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}