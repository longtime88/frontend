import Link from "next/link";

export default function Footer() {
  const columns = [
    { title: "Shop", links: [["Neuheiten", "/shoppen"], ["Shopware Plugins", "/shoppen?category=shopware"], ["Templates", "/shoppen?category=templates"], ["Mentoring", "/shoppen?category=mentoring"]] },
    { title: "Service", links: [["Kontakt", "/kontakt"], ["Über uns", "/ueber-uns"], ["Mein Konto", "/konto"], ["Checkout", "/Checkout"]] },
    { title: "Rechtliches", links: [["Impressum", "/impressum"], ["Datenschutz", "/datenschutz"]] },
  ];

  return <footer className="bg-[#0d0d0d] py-12 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mb-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"><div><Link href="/" className="font-display text-2xl font-semibold">Molinka<span className="text-[#c8a97e]">.</span></Link><p className="mt-4 max-w-xs text-sm leading-relaxed text-[#888888]">Digitale Produkte und Shopware-Lösungen für Projekte, die gut funktionieren und sich gut anfühlen.</p></div>{columns.map((column) => <div key={column.title}><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a97e]">{column.title}</p><ul className="space-y-2">{column.links.map(([label, href]) => <li key={label}><Link href={href} className="text-sm text-[#888888] transition-colors hover:text-white">{label}</Link></li>)}</ul></div>)}</div><div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row"><p className="text-xs text-[#888888]">© {new Date().getFullYear()} Molinka. Alle Rechte vorbehalten.</p><div className="flex gap-5 text-xs text-[#888888]"><a href="https://instagram.com/molinka" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a><Link href="/kontakt" className="hover:text-white">Support</Link></div></div></div></footer>;
}
