import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Product from "@/app/components/Product";
import fallbackCatalog from "@/app/Data.json";
import { getMediaUrl, getShopwareApiBase } from "@/lib/shopwareStorefront";

export const dynamic = "force-dynamic";

type ProductItem = { id: string; shopwareProductId?: string; name: string; price: number; image: string; description: string };

async function getFeaturedProducts(): Promise<ProductItem[]> {
  try {
    const response = await fetch(`${getShopwareApiBase()}/store-api/product?limit=4`, {
      headers: { "sw-access-key": process.env.SHOPWARE_STORE_API_ACCESS_KEY || "" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const data = await response.json().catch(() => ({ elements: [] }));
    return (data.elements || []).slice(0, 4).map((raw: Record<string, unknown>) => {
      const translated = raw.translated as Record<string, unknown> | undefined;
      const price = (raw.calculatedPrice ?? raw.price) as Record<string, unknown> | undefined;
      const cover = raw.cover as Record<string, unknown> | undefined;
      const media = cover?.media as Record<string, unknown> | undefined;
      return {
        id: String(raw.id ?? ""), shopwareProductId: String(raw.id ?? ""),
        name: String(translated?.name ?? raw.name ?? "Produkt"),
        description: String(translated?.description ?? raw.description ?? ""),
        price: typeof price?.total === "number" ? price.total : typeof price?.unitPrice === "number" ? price.unitPrice : 0,
        image: getMediaUrl(String(media?.url ?? "")),
      };
    });
  } catch { return []; }
}

const categoryCards = [
  { title: "Shopware Plugins", href: "/shoppen?category=shopware", tone: "bg-[#faf0db]" },
  { title: "Frontend Templates", href: "/shoppen?category=templates", tone: "bg-[#e8edff]" },
  { title: "Automation", href: "/shoppen?category=automation", tone: "bg-[#dbf5f0]" },
  { title: "Mentoring", href: "/shoppen?category=mentoring", tone: "bg-[#f2e5fa]" },
];

export default async function Homepage() {
  const featuredProducts = await getFeaturedProducts();
  const products = featuredProducts.length > 0 ? featuredProducts : fallbackCatalog.products.map((product) => ({
    id: String(product.id), shopwareProductId: product.shopwareProductId, name: product.title,
    description: product.description, price: product.price, image: `/${product.image}`,
  }));

  return (
    <>
      <section className="bg-[#fafbfd] pb-20 text-[#0f172a]">
        <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 lg:px-10">
          <div className="relative overflow-hidden rounded-[28px] bg-[#e8edff] px-7 py-12 sm:px-12 lg:min-h-[520px] lg:px-[62px] lg:py-[61px]">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-[0.08em]">NEUE KOLLEKTION</span>
              <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[58px]">Schön ausgewählt.<br />Für jeden Tag.</h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#333f55] sm:text-lg">Entdecke digitale Produkte und Unterstützung, die deine Projekte einfacher und besser machen.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/shoppen" className="rounded-[10px] bg-[#0f172a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#26334d]">Jetzt entdecken</Link>
                <a href="#bestseller" className="rounded-[10px] bg-white px-6 py-3.5 text-sm font-semibold transition hover:bg-[#f5f7ff]">Bestseller ansehen</a>
              </div>
            </div>
            <Image src="/design/hero-orbit.svg" alt="" width={355} height={355} className="pointer-events-none absolute -bottom-12 -right-10 hidden h-[355px] w-[355px] lg:block" />
            <Image src="/design/category-orbit.svg" alt="" width={201} height={201} className="pointer-events-none absolute bottom-[108px] right-[124px] hidden h-[201px] w-[201px] lg:block" />
            <span className="pointer-events-none absolute bottom-[190px] right-[169px] hidden text-[27px] font-bold lg:block">NEU</span>
          </div>

          <section className="pt-20" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-3xl font-bold tracking-[-0.03em]">Entdecke unsere Kategorien</h2>
            <p className="mt-3 text-[#667287]">Alles auf einen Blick – finde genau das Richtige für dich.</p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {categoryCards.map((category) => (
                <Link key={category.title} href={category.href} className={`${category.tone} group min-h-[210px] rounded-[18px] p-6 transition hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="relative flex h-[82px] w-[82px] items-center justify-center text-[34px] font-medium text-[#0e66e0] transition group-hover:scale-105"><Image src="/design/product-focus.svg" alt="" fill className="object-contain" /><span className="relative">+</span></div>
                  <h3 className="mt-8 text-lg font-semibold">{category.title}</h3><span className="mt-2 block text-sm font-medium text-[#333f55]">Entdecken&nbsp; →</span>
                </Link>
              ))}
            </div>
          </section>

          <section id="bestseller" className="scroll-mt-28 pt-20" aria-labelledby="featured-heading">
            <div className="flex flex-wrap items-end justify-between gap-5"><div><h2 id="featured-heading" className="text-3xl font-bold tracking-[-0.03em]">Unsere Bestseller</h2><p className="mt-3 text-[#667287]">Von Kundinnen und Kunden besonders geliebt.</p></div><Link href="/shoppen" className="rounded-[10px] border border-[#e3e8f0] bg-white px-6 py-3 text-sm font-semibold transition hover:border-[#0f172a]">Alle Produkte</Link></div>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{products.slice(0, 4).map((product) => <Product key={product.id} product={product} />)}</div>
          </section>

          <section className="relative mt-20 overflow-hidden rounded-[24px] bg-[#0f172a] px-7 py-12 text-white sm:px-12 lg:min-h-[330px] lg:px-[62px] lg:py-[60px]">
            <div className="relative z-10 max-w-2xl"><p className="text-xs font-semibold tracking-[0.11em] text-[#1ac7b8]">UNSERE PHILOSOPHIE</p><h2 className="mt-6 text-4xl font-bold leading-[1.12] tracking-[-0.035em] sm:text-[42px]">Weniger suchen.<br />Mehr Freude finden.</h2><p className="mt-5 max-w-xl leading-relaxed text-[#d1dbeb]">Wir wählen Lösungen bewusst aus – mit Blick auf Qualität, Funktion und die kleinen Momente, die den Unterschied machen.</p><Link href="/ueber-uns" className="mt-7 inline-block rounded-[10px] bg-white px-6 py-3 text-sm font-semibold text-[#0f172a] transition hover:bg-[#e8edff]">Mehr über uns</Link></div>
            <Image src="/design/check-orbit.svg" alt="" width={220} height={220} className="pointer-events-none absolute bottom-8 right-16 hidden h-[220px] w-[220px] lg:block" />
          </section>

          <section className="pt-20" aria-labelledby="trust-heading"><h2 id="trust-heading" className="text-3xl font-bold tracking-[-0.03em]">Darauf kannst du dich verlassen</h2><div className="mt-9 grid gap-5 md:grid-cols-3">{[["Schneller Versand", "Deine Bestellung ist zügig bei dir."], ["Sicher bezahlen", "Mit bekannten Zahlungsmethoden."], ["Persönlicher Service", "Wir helfen dir gerne weiter."]].map(([title, description]) => <div key={title} className="flex gap-5 rounded-[16px] bg-white p-6"><span className="relative flex h-10 w-10 shrink-0 items-center justify-center font-bold text-[#0e66e0]"><Image src="/design/hero-focus.svg" alt="" fill className="object-contain" /><span className="relative">✓</span></span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-[#667287]">{description}</p></div></div>)}</div></section>
        </div>
      </section>
      <Analytics /><SpeedInsights />
    </>
  );
}
