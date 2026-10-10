import Link from "next/link";
import Product from "@/app/components/Product";
import fallbackCatalog from "@/app/Data.json";
import { getMediaUrl, getShopwareApiBase } from "@/lib/shopwareStorefront";

type ProductItem = { id: string; shopwareProductId?: string; name: string; price: number; image: string; description: string; category: string };

async function getProducts(category?: string): Promise<ProductItem[]> {
  try {
    const response = await fetch(`${getShopwareApiBase()}/store-api/product${category ? `?category=${encodeURIComponent(category)}` : ""}`, { headers: { "sw-access-key": process.env.SHOPWARE_STORE_API_ACCESS_KEY || "" }, next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json().catch(() => ({ elements: [] }));
    return (data.elements || []).map((raw: Record<string, unknown>) => {
      const translated = raw.translated as Record<string, unknown> | undefined;
      const price = (raw.calculatedPrice ?? raw.price) as Record<string, unknown> | undefined;
      const cover = raw.cover as Record<string, unknown> | undefined;
      const media = cover?.media as Record<string, unknown> | undefined;
      return { id: String(raw.id ?? ""), shopwareProductId: String(raw.id ?? ""), name: String(translated?.name ?? raw.name ?? "Produkt"), description: String(translated?.description ?? raw.description ?? ""), price: typeof price?.total === "number" ? price.total : typeof price?.unitPrice === "number" ? price.unitPrice : 0, image: getMediaUrl(String(media?.url ?? "")), category: "Shopware Lösung" };
    });
  } catch { return []; }
}

const categories = [
  { id: "", name: "Alle Produkte" },
  { id: "shopware", name: "Shopware Plugins" },
  { id: "templates", name: "Frontend Templates" },
  { id: "automation", name: "Automation" },
  { id: "mentoring", name: "Mentoring" },
];

export const dynamic = "force-dynamic";

export default async function ShoppenPage({ searchParams }: { searchParams?: Promise<{ category?: string | string[] }> }) {
  const params = await searchParams;
  const selectedCategory = Array.isArray(params?.category) ? params.category[0] : params?.category;
  const remoteProducts = await getProducts(selectedCategory);
  const products = remoteProducts.length > 0 ? remoteProducts : fallbackCatalog.products.map((product) => ({ id: String(product.id), name: product.title, description: product.description, price: product.price, image: "", category: product.category === "plugin" ? "Shopware Plugin" : product.category }));

  return <div className="min-h-screen bg-[#f7f5f2]"><section className="bg-[#111111] px-4 py-14 text-white sm:px-6"><div className="mx-auto max-w-7xl"><p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#c8a97e]">Die Auswahl</p><h1 className="font-display text-5xl font-medium">Alle Produkte</h1><p className="mt-4 max-w-lg text-sm leading-relaxed text-[#999999]">Digitale Werkzeuge, Templates und Wissen für deinen nächsten guten Schritt.</p></div></section><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div className="mb-10 flex gap-2 overflow-x-auto pb-2">{categories.map((category) => <Link key={category.id || "all"} href={category.id ? `/shoppen?category=${category.id}` : "/shoppen"} className={`shrink-0 border px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${selectedCategory === category.id || (!selectedCategory && !category.id) ? "border-[#0d0d0d] bg-[#0d0d0d] text-white" : "border-[#ddd8d1] text-[#888888] hover:border-[#0d0d0d] hover:text-[#0d0d0d]"}`}>{category.name}</Link>)}</div>{products.length === 0 ? <div className="py-20 text-center text-[#888888]">Keine Produkte gefunden.</div> : <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <Product key={product.id} product={product} />)}</div>}</div></div>;
}
