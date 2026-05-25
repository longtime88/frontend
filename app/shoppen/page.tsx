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
  { id: "shopware", name: "Shopware Plugins", icon: "🧩", count: "24" },
  { id: "templates", name: "Frontend Templates", icon: "🎨", count: "18" },
  { id: "automation", name: "Automation", icon: "⚙️", count: "12" },
  { id: "mentoring", name: "Mentoring", icon: "👨‍🏫", count: "8" },
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
    <section className="min-h-screen bg-[color:var(--bg)]">
      {/* Amazon-style Header */}
      <div className="border-b border-[color:var(--line)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-2xl font-bold text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
            Digitale Produkte entdecken
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Kategorien links */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">
                Kategorien
              </h2>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shoppen?category=${cat.id}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[color:var(--ink)] hover:bg-[color:var(--surface-subtle)] transition-colors"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="flex-1 text-sm">{cat.name}</span>
                    <span className="text-xs text-[color:var(--muted)]">{cat.count}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-12 text-center">
                <p className="text-[color:var(--muted)]">Keine Produkte in dieser Kategorie.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="group glass-card flex flex-col overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)]"
                  >
                    <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[rgba(79,158,255,0.1)] to-[rgba(56,200,224,0.1)]">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl opacity-20">📦</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,20,60,0.5)] to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <h3 className="text-[color:var(--ink)] font-semibold line-clamp-2 [font-family:var(--font-fraunces)]">
                        {p.name}
                      </h3>
                      <p className="text-sm text-[color:var(--muted)] line-clamp-2 flex-1">
                        {p.description || "Direkt einsetzbares Digital-Produkt"}
                      </p>
                      <div className="mt-auto pt-3 space-y-3">
                        <p className="text-xl font-extrabold text-[color:var(--brand-light)]">
                          {typeof p.price === "number" ? `${p.price.toFixed(2)} €` : "Preis auf Anfrage"}
                        </p>
                        <Link
                          href={`/Checkout?product=${encodeURIComponent(p.id)}`}
                          className="block w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] py-2 text-center text-sm font-semibold text-[color:var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_var(--line),0_0_40px_var(--glow),0_8px_30px_rgba(0,0,0,0.22)]"
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
    </section>
  );
}
