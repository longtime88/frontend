import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Product from "@/app/components/Product";
import fallbackCatalog from "@/app/Data.json";
import { getMediaUrl, getShopwareApiBase } from "@/lib/shopwareStorefront";

export const dynamic = "force-dynamic";

type ProductItem = { id: string; shopwareProductId?: string; name: string; price: number; image: string; description: string; category?: string; badge?: string };

async function getFeaturedProducts(): Promise<ProductItem[]> {
  try {
    const response = await fetch(`${getShopwareApiBase()}/store-api/product?limit=4`, { headers: { "sw-access-key": process.env.SHOPWARE_STORE_API_ACCESS_KEY || "" }, next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json().catch(() => ({ elements: [] }));
    return (data.elements || []).slice(0, 4).map((raw: Record<string, unknown>, index: number) => {
      const translated = raw.translated as Record<string, unknown> | undefined;
      const price = (raw.calculatedPrice ?? raw.price) as Record<string, unknown> | undefined;
      const cover = raw.cover as Record<string, unknown> | undefined;
      const media = cover?.media as Record<string, unknown> | undefined;
      return { id: String(raw.id ?? ""), shopwareProductId: String(raw.id ?? ""), name: String(translated?.name ?? raw.name ?? "Produkt"), description: String(translated?.description ?? raw.description ?? ""), price: typeof price?.total === "number" ? price.total : typeof price?.unitPrice === "number" ? price.unitPrice : 0, image: getMediaUrl(String(media?.url ?? "")), category: "Shopware Lösung", badge: index === 0 ? "Neu" : undefined };
    });
  } catch { return []; }
}

const categories = [
  { title: "Shopware Plugins", detail: "Erweiterungen, die direkt weiterhelfen.", href: "/shoppen?category=shopware", style: "from-[#e9e0d3] to-[#f7f5f2]" },
  { title: "Frontend Templates", detail: "Klarer Start für moderne Interfaces.", href: "/shoppen?category=templates", style: "from-[#dedfe5] to-[#f7f5f2]" },
  { title: "Automation", detail: "Weniger Routine, mehr Fokus.", href: "/shoppen?category=automation", style: "from-[#d9dfd7] to-[#f7f5f2]" },
  { title: "Mentoring", detail: "Dein Projekt. Mein Know-how.", href: "/shoppen?category=mentoring", style: "from-[#e8dcd4] to-[#f7f5f2]" },
];

export default async function Homepage() {
  const remoteProducts = await getFeaturedProducts();
  const products = remoteProducts.length > 0 ? remoteProducts : fallbackCatalog.products.map((product, index) => ({ id: String(product.id), name: product.title, description: product.description, price: product.price, image: "", category: index % 2 === 0 ? "Shopware Lösung" : "Frontend Template", badge: index === 0 ? "Bestseller" : undefined }));

  return <>
    <div className="bg-[#f7f5f2]">
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="mx-auto grid min-h-[560px] max-w-7xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-16 lg:py-20">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#c8a97e]">Digitale Kollektion — Herbst 2026</p>
            <h1 className="font-display text-5xl font-medium leading-[1.04] sm:text-6xl">Dein Projekt.<br /><em>Schön gelöst.</em></h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-[#a8a8a8]">Durchdachte digitale Produkte und persönliche Unterstützung für moderne Shopware- und Frontend-Projekte.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Link href="/shoppen" className="bg-[#c8a97e] px-7 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#a8895e]">Jetzt entdecken</Link><Link href="/#featured" className="border border-white/30 px-7 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:border-white/70">Produkte ansehen</Link></div>
          </div>
          <div className="relative hidden min-h-[420px] lg:block" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558655146-d09347e92766?w=1100&h=800&fit=crop&auto=format)", backgroundPosition: "center", backgroundSize: "cover" }}><div className="absolute inset-0 bg-gradient-to-r from-[#111111]/65 via-transparent to-transparent" /></div>
        </div>
        <div className="border-t border-white/10 px-8 py-4 sm:px-12 lg:px-16"><div className="grid max-w-md grid-cols-3 gap-8"><div><p className="text-lg font-semibold text-[#c8a97e]">12k+</p><p className="text-xs tracking-wide text-[#888888]">zufriedene Kunden</p></div><div><p className="text-lg font-semibold text-[#c8a97e]">350+</p><p className="text-xs tracking-wide text-[#888888]">digitale Produkte</p></div><div><p className="text-lg font-semibold text-[#c8a97e]">100%</p><p className="text-xs tracking-wide text-[#888888]">persönlicher Support</p></div></div></div>
      </section>

      <section id="categories-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#c8a97e]">Ausgewählt für dich</p><h2 className="font-display text-3xl font-medium text-[#0d0d0d]">Finde, was du brauchst.</h2></div><Link href="/shoppen" className="hidden text-sm text-[#888888] transition hover:text-[#0d0d0d] sm:block">Alle Kategorien →</Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category) => <Link key={category.title} href={category.href} className={`group min-h-48 bg-gradient-to-br ${category.style} p-6 transition-transform duration-300 hover:-translate-y-1`}><div className="flex h-12 w-12 items-center justify-center border border-[#c8a97e]/50 font-display text-2xl text-[#a8895e] transition group-hover:rotate-12">+</div><h3 className="mt-8 font-display text-lg font-medium">{category.title}</h3><p className="mt-2 text-sm text-[#888888]">{category.detail}</p></Link>)}</div></section>

      <section id="featured" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-16 sm:px-6"><div className="mb-8 flex items-end justify-between"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#c8a97e]">Unsere Auswahl</p><h2 className="font-display text-3xl font-medium text-[#0d0d0d]">Featured Products</h2></div><span className="text-sm text-[#888888]">{products.length} Produkte</span></div><div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <Product key={product.id} product={product} />)}</div></section>

      <section id="sale" className="mx-4 mb-16 max-w-7xl overflow-hidden bg-[#0d0d0d] sm:mx-6 lg:mx-auto"><div className="grid lg:grid-cols-2"><div className="flex flex-col justify-center px-10 py-14 lg:py-16"><p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#c8a97e]">Limitierte Auswahl</p><h2 className="font-display text-4xl font-medium text-white">Weniger suchen.<br /><em>Mehr umsetzen.</em></h2><p className="mt-4 max-w-xs text-sm leading-relaxed text-[#888888]">Starte mit Lösungen, die nicht nur funktionieren, sondern sich auch richtig anfühlen.</p><Link href="/shoppen" className="mt-6 self-start bg-[#c8a97e] px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-[#a8895e]">Shop entdecken</Link></div><div className="hidden min-h-64 bg-cover bg-center opacity-60 lg:block" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&auto=format)" }} /></div></section>

      <section className="mx-auto mb-16 max-w-7xl border-y border-[#e5e1dc] px-4 py-8 sm:px-6"><div className="grid grid-cols-2 gap-8 lg:grid-cols-4"><div className="text-center"><div className="mb-2 text-2xl">↗</div><p className="text-sm font-semibold">Schneller Start</p><p className="text-xs text-[#888888]">Direkt einsetzbare Lösungen</p></div><div className="text-center"><div className="mb-2 text-2xl">↩</div><p className="text-sm font-semibold">Faire Rückgabe</p><p className="text-xs text-[#888888]">30 Tage Zeit zum Prüfen</p></div><div className="text-center"><div className="mb-2 text-2xl">◇</div><p className="text-sm font-semibold">Sicher bezahlen</p><p className="text-xs text-[#888888]">Geschützter Checkout</p></div><div className="text-center"><div className="mb-2 text-2xl">✦</div><p className="text-sm font-semibold">Persönlicher Support</p><p className="text-xs text-[#888888]">Mo–Fr, 9–18 Uhr</p></div></div></section>

      <section className="bg-[#ede9e4] px-4 py-16 text-center"><div className="mx-auto max-w-xl"><p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#c8a97e]">Bleib auf dem Laufenden</p><h2 className="font-display text-3xl font-medium">Die Molinka Community</h2><p className="mt-3 text-sm leading-relaxed text-[#888888]">Neue Produkte, praktische Tipps und Inspiration direkt in dein Postfach.</p><form className="mx-auto mt-6 flex max-w-sm gap-2"><input type="email" required placeholder="deine@email.de" className="min-w-0 flex-1 bg-white px-4 py-3 text-sm outline-none placeholder:text-[#888888] focus:ring-1 focus:ring-[#0d0d0d]" /><button type="submit" className="bg-[#0d0d0d] px-5 py-3 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-[#3a3a3a]">Anmelden</button></form><p className="mt-3 text-xs text-[#888888]">Kein Spam. Jederzeit abbestellbar.</p></div></section>
    </div>
    <Analytics /><SpeedInsights />
  </>;
}
