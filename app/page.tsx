import Image from "next/image";
import Link from "next/link";
import Category from "./components/Category";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getShopwareApiBase } from "@/lib/shopwareStorefront";

type ProductItem = {
  id: string;
  title: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

async function getProducts(): Promise<ProductItem[]> {
  const baseUrl = getShopwareApiBase();
  const url = `${baseUrl}/store-api/product`;
  const headers = { "sw-access-key": process.env.SHOPWARE_STORE_API_ACCESS_KEY || "" };

  try {
    let res: Response;
    try {
      res = await fetch(url, { headers, next: { revalidate: 60 } });
    } catch (error) {
      const allowSelfSigned = process.env.SHOPWARE_ALLOW_SELF_SIGNED === "true";
      if (!allowSelfSigned || !url.startsWith("https://")) {
        throw error;
      }

      const previousTlsMode = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      try {
        res = await fetch(url, { headers, next: { revalidate: 60 } });
      } finally {
        if (previousTlsMode === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsMode;
        }
      }
    }

    const data = await res.json().catch(() => ({ elements: [] }));
    const items = (data.elements || []) as Array<Record<string, unknown>>;
    return items.map((raw) => {
      const translated = typeof raw.translated === "object" && raw.translated !== null
        ? raw.translated as Record<string, unknown> : null;
      const price = (raw.calculatedPrice ?? raw.price) as Record<string, unknown> | undefined;
      const cover = raw.cover as Record<string, unknown> | null | undefined;
      const coverMedia = (cover?.media as Record<string, unknown> | undefined) ?? null;
      const image = String(
        (coverMedia?.url as string | undefined) ??
          (coverMedia?.thumbnails as Array<Record<string, unknown>> | undefined)?.[0]?.url ??
          (cover?.url as string | undefined) ??
          ""
      ).trim();
      return {
        id: String(raw.id ?? ""),
        title: String(translated?.name ?? raw.name ?? ""),
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
        shopwareProductId: String(raw.id ?? ""),
      };
    });
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function Homepage() {
  const products = await getProducts();

  return (
    <>
      {/* Amazon-style Hero Banner */}
      <section className="relative bg-[color:var(--bg)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">
                Willkommen bei unserem Digital Store
              </p>
              
              <h1 className="text-4xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl lg:text-6xl">
                Digitale Produkte für Profis<br />
                <span className="block mt-2 text-[color:var(--brand-light)]">
                  Sofort downloadbar & sofort einsetzbar
                </span>
              </h1>
              
              <p className="text-base text-[color:var(--muted)] max-w-2xl">
                Entdecken Sie hochwertige digitale Produkte, Plugins und Tools für Ihre Webprojekte.
                Alles sofort verfügbar nach Kauf - kein Warten, kein Versand.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  href="#produkte"
                  className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] text-[color:var(--ink)] font-semibold text-sm rounded-full hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-[0_0_0_1px_var(--line),0_0_40px_var(--glow),0_8px_30px_rgba(0,0,0,0.22)]"
                >
                  Jetzt shoppen
                </Link>
                <Link
                  href="/Checkout"
                  className="flex items-center justify-center px-6 py-3 border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink)] font-semibold text-sm rounded-full hover:-translate-y-0.5 transition-all duration-300 hover:bg-[color:var(--surface-subtle)] hover:border-[color:var(--brand)]"
                >
                  Zum Checkout
                </Link>
              </div>
            </div>
            
            {/* Featured Product/Image */}
            <div className="flex-shrink-0 w-[300px] hidden md:block">
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden glass-card">
                <Image
                  src="/images/Hintergrund.png"
                  alt="Featured Product"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,25,60,0.7)] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">
                    Featured
                  </p>
                  <p className="mt-1 text-[color:var(--ink)] font-semibold [font-family:var(--font-fraunces)]">
                    Premium Digital Product
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="border-b border-[color:var(--line)] bg-[color:var(--surface)] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[color:var(--brand)] rounded-full" />
              <span className="font-semibold text-[color:var(--brand-light)]">Deal des Tages</span>
            </span>
            <span className="text-[color:var(--muted)]">Bis zu 30% Rabatt auf ausgewählte Produkte</span>
            <span className="ml-auto text-[color:var(--muted)]">Nur heute verfügbar</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-[color:var(--line)] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">
                Kategorien
              </p>
              <h2 className="text-2xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-3xl">
                Entdecken Sie unsere Produktkategorien
              </h2>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { id: 1, name: "Shopware Plugins", products: ["Checkout Erweiterung", "Custom CMS Blocks", "B2B Features"], icon: "🧩" },
              { id: 2, name: "Frontend Templates", products: ["Landingpage Kits", "Next.js Storefront UI", "Responsive Components"], icon: "🎨" },
              { id: 3, name: "Automation", products: ["API Integrationen", "ERP Sync", "Lead Workflows"], icon: "⚙️" },
              { id: 4, name: "Mentoring", products: ["Code Review", "Pair Programming", "Tech Setup Sessions"], icon: "👨‍🏫" }
            ].map((cat) => (
              <div key={cat.id} className="glass-card group flex-1 flex-col rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                <div className="mb-4 text-2xl">{cat.icon}</div>
                <h3 className="mb-3 text-xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)]">
                  {cat.name}
                </h3>
                <p className="mb-4 text-[color:var(--muted)] text-sm line-clamp-3">
                  Entdecken Sie unsere {cat.name.toLowerCase()} für professionelle Webprojekte
                </p>
                <div className="mt-auto pt-4">
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-[color:var(--brand)] font-medium text-sm hover:text-[color:var(--brand-light)] transition-colors"
                  >
                    Mehr anzeigen
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid - Amazon Style */}
      <section id="produkte" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">
                Produkte
              </p>
              <h2 className="text-3xl font-bold tracking-[0.02em] text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-4xl">
                Digitale Bestseller
              </h2>
            </div>
            <Link
              href="#"
              className="text-[color:var(--muted)] hover:text-[color:var(--brand)] transition-colors text-sm"
            >
              Alle Produkte ansehen →
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} className="group glass-card flex flex-col overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--brand)] hover:shadow-glow">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={p.image || "/next.svg"}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {/* Sale Badge */}
                  {p.price && (
                    <span className="absolute left-3 top-3 rounded bg-[color:var(--brand)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[color:var(--ink)]">
                      Sale
                    </span>
                  )}
                  {/* Out of Stock Badge - placeholder */}
                  {/* {p.stock === 0 && (
                    <span className="absolute left-3 top-3 rounded bg-[color:var(--red)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[color:var(--ink)]">
                      Ausverkauft
                    </span>
                  )} */}
                </div>
                
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex-1">
                    <h3 className="mb-2 line-clamp-2 text-[color:var(--ink)] font-semibold text-lg [font-family:var(--font-fraunces)] hover:text-[color:var(--brand-light)] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[color:var(--muted)] text-sm line-clamp-3">
                      {p.description || "Direkt einsetzbares Digital-Produkt"}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <div className="mb-2 flex items-baseline gap-2">
                      <p className="text-[color:var(--muted)] line-through text-xs">
                        {/* Original price if on sale - placeholder */}
                        {/* {p.originalPrice ? `${p.originalPrice.toFixed(2)} €` : ""} */}
                      </p>
                      <p className="text-xl font-extrabold text-[color:var(--brand-light)]">
                        {typeof p.price === "number" ? `${p.price.toFixed(2)} €` : "Preis auf Anfrage"}
                      </p>
                    </div>
                    <Link
                      href={`/Checkout?product=${encodeURIComponent(p.id)}`}
                      className="w-full rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[#e18244] px-5 py-2 text-center text-[color:var(--ink)] font-medium text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_0_0_1px_var(--line),0_0_40px_var(--glow),0_8px_30px_rgba(0,0,0,0.22)]"
                      aria-label={`Bestellen: ${p.name}`}
                    >
                      In den Warenkorb
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show message if no products */}
          {products.length === 0 && (
            <div className="py-12 text-center text-[color:var(--muted)]">
              <p>Keine Produkte verfügbar.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[rgba(100,140,255,0.1)] py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Schnelle Lieferung", "Sofortiger Download nach Kauf"],
              ["Premium Qualität", "Geprüfte Produkte für Profis"],
              ["Support inklusive", "Kostenlose Hilfe via E-Mail"],
            ].map(([title, text]) => (
              <div key={title} className="glass rounded-xl p-5">
                <h3 className="font-bold text-white [font-family:var(--font-fraunces)]">{title}</h3>
                <p className="mt-1 text-sm text-[#8892b0]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Analytics />
      <SpeedInsights />
    </>
  );
}
