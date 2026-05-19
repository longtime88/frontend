import Image from "next/image";
import Link from "next/link";
import Category from "./components/Category";
import { Products } from "./components/hello";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

type ProductItem = {
  id: string;
  title: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

async function getProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch(`${process.env.SHOPWARE_URL || "http://localhost:8000"}/store-api/product`, {
      headers: { "sw-access-key": process.env.SHOPWARE_STORE_API_ACCESS_KEY || "" },
      next: { revalidate: 60 },
    });
    const data = await res.json().catch(() => ({ elements: [] }));
    const items = (data.elements || []) as Array<Record<string, unknown>>;
    return items.map((raw) => {
      const translated = typeof raw.translated === "object" && raw.translated !== null
        ? raw.translated as Record<string, unknown> : null;
      const price = (raw.calculatedPrice ?? raw.price) as Record<string, unknown> | undefined;
      const cover = raw.cover as Record<string, unknown> | null | undefined;
      const media = raw.media as Array<Record<string, unknown>> | undefined;
      const coverMedia = cover ?? (media && media[0]) ?? null;
      const image = coverMedia
        ? (coverMedia.url as string | undefined) ?? (coverMedia.previewImage as string | undefined) ?? ""
        : "";
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
      <section className="relative overflow-hidden border-b border-[rgba(100,140,255,0.15)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(15,25,60,0.8)] via-[rgba(20,40,90,0.6)] to-[rgba(15,30,70,0.8)]" />
        
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Main Banner */}
            <div className="glass-card relative rounded-2xl p-6 md:col-span-2 lg:col-span-3">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(40,80,200,0.15)] blur-3xl" />
              
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#5a8fbf]">
                Entdecken Sie unsere Leistungen
              </p>
              
              <h1 className="relative z-10 max-w-2xl text-3xl font-bold leading-tight tracking-[0.02em] text-white [font-family:var(--font-fraunces)] md:text-4xl">
                Portfolio &amp; Digital Produkte für moderne Webseiten
              </h1>
              
              <p className="relative z-10 mt-4 max-w-xl text-base leading-relaxed text-[#8892b0] md:text-lg">
                Professionelle Websites, digitale Produkte und Tools für Ihren Online-Auftritt.
                Sofort verfügbar für alle gängigen Plattformen.
              </p>
              
              <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                <Link
                  href="#produkte"
                  className="rounded-full bg-gradient-to-r from-[#2d6fd8] to-[#4f9eff] px-6 py-3 text-sm font-bold tracking-wide text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
                >
                  Jetzt shoppen
                </Link>
                <Link
                  href="/Warenkorb"
                  className="rounded-full border border-[rgba(100,140,255,0.22)] bg-[rgba(16,28,56,0.6)] px-6 py-3 text-sm font-bold text-[#b0c4e8] transition duration-300 hover:-translate-y-0.5 hover:border-[#4f9eff] hover:text-[#7bb8ff]"
                >
                  Zum Warenkorb
                </Link>
              </div>
            </div>

            {/* Side Banner */}
            <div className="glass-card relative hidden overflow-hidden rounded-2xl lg:block">
              <Image
                src="/images/Hintergrund.png"
                alt="Premium Produkte"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,25,60,0.9)] to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#38c8e0]">Premium</p>
                <p className="mt-1 text-sm font-semibold text-white">Exklusive Produkte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="border-b border-[rgba(100,140,255,0.1)] bg-[rgba(15,25,50,0.4)] py-3">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-[#f59e0b]">Deal des Tages</span>
            <span className="text-[#8892b0]">Bis zu 30% Rabatt auf ausgewählte Produkte</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-[rgba(100,140,255,0.1)] py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Category />
        </div>
      </section>

      {/* Products Grid - Amazon Style */}
      <section id="produkte" className="py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5a8fbf]">Sortiment</p>
              <h2 className="text-2xl font-bold tracking-[0.02em] text-white [font-family:var(--font-fraunces)] md:text-3xl">
                Digitale Bestseller
              </h2>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} className="glass-card flex flex-col overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                <div className="relative aspect-square overflow-hidden bg-[rgba(15,30,70,0.45)]">
                  <Image
                    src={p.image || "/next.svg"}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {p.price && (
                    <span className="absolute left-2 top-2 rounded bg-[rgba(0,0,0,0.7)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#f59e0b]">
                      Sale
                    </span>
                  )}
                </div>
                
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white [font-family:var(--font-fraunces)]">
                    {p.name}
                  </h3>
                  <p className="line-clamp-2 text-xs text-[#7a8aaa]">
                    {p.description || "Direkt einsetzbares Digital-Produkt"}
                  </p>
                  <div className="mt-auto pt-2">
                    <p className="text-lg font-extrabold text-[#7bb8ff]">
                      {typeof p.price === "number" ? `${p.price.toFixed(2)} €` : "Preis auf Anfrage"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
