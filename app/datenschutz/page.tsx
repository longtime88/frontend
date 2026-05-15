export default function DatenschutzPage() {
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-14">
      <div className="pointer-events-none absolute -left-8 top-8 h-44 w-44 rounded-full bg-[#ffe5cc]/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-[#e3f1ff]/45 blur-3xl" />

      <div className="relative rounded-3xl border border-[color:var(--line)] bg-white p-7 shadow-[0_16px_40px_rgba(45,29,15,0.08)] md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--accent)]">Rechtliches</p>
        <h1 className="mt-2 text-3xl font-bold text-[color:var(--ink)] [font-family:var(--font-fraunces)] md:text-5xl">
          Datenschutzerklaerung
        </h1>

        <div className="mt-7 space-y-5 text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
          <p>
            Der Schutz deiner persoenlichen Daten ist uns wichtig. Diese Seite informiert ueber Art, Umfang und Zweck
            der Verarbeitung personenbezogener Daten.
          </p>
          <p>
            Erhobene Daten:
            <br />
            Bei der Nutzung dieser Website koennen technisch notwendige Daten (z. B. IP-Adresse, Browserdaten,
            Zugriffszeit) verarbeitet werden.
          </p>
          <p>
            Kontaktformular:
            <br />
            Wenn du uns eine Anfrage sendest, werden die eingegebenen Daten zur Bearbeitung deiner Anfrage genutzt.
          </p>
          <p>
            Deine Rechte:
            <br />
            Du hast jederzeit das Recht auf Auskunft, Berichtigung, Loeschung und Einschraenkung der Verarbeitung
            deiner Daten.
          </p>
          <p className="rounded-xl border border-[#efe2d3] bg-[#fff9f2] px-3 py-2 text-xs">
            Hinweis: Diese Vorlage ersetzt keine rechtliche Beratung. Bitte rechtlich pruefen und anpassen.
          </p>
        </div>
      </div>
    </section>
  );
}
