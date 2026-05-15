export default function ImpressumPage() {
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -left-8 top-8 h-44 w-44 rounded-full bg-[#ffe5cc]/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-[#e3f1ff]/45 blur-3xl" />

      <div className="relative rounded-3xl border border-[color:var(--line)] bg-white p-7 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Rechtliches</p>
        <h1 className="mt-2 text-3xl font-bold text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
          Impressum
        </h1>

        <div className="mt-7 space-y-5 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
          <p>Angaben gemaess Paragraf 5 TMG</p>
          <p>
            Max Mustermann
            <br />
            DevPortfolio Studio
            <br />
            Musterstrasse 1
            <br />
            12345 Musterstadt
          </p>
          <p>
            E-Mail: kontakt@beispiel.de
            <br />
            Telefon: +49 000 000000
          </p>
          <p>Umsatzsteuer-ID: DE123456789</p>
          <p className="rounded-xl border border-[#efe2d3] bg-[#fff9f2] px-3 py-2 text-xs">
            Hinweis: Bitte diese Platzhalter mit deinen echten Unternehmensdaten ersetzen.
          </p>
        </div>
      </div>
    </section>
  );
}
