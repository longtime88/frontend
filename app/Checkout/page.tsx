'use client'

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

       

        <div className="grid gap-10 lg:grid-cols-[1.7fr,1fr]">

          {/* LEFT */}
          <div className="space-y-8">

            {/* Lieferadresse */}
            <Card title="Checkout">
              <div className="grid gap-4">
                <Input label="Vorname" placeholder="Max" />
                <Input label="Nachname" placeholder="Mustermann" />
                <Input label="Straße" placeholder="Musterstraße 12" />
                <Input label="Stadt" placeholder="Berlin" />
                <Input label="PLZ" placeholder="12345" />
                <Input label="Land" placeholder="Deutschland" />
              </div>
            </Card>

            {/* Versandart */}
            <Card title="Versandart">
              <Input label="Versandoption" placeholder="Standard / Express" />
            </Card>

            {/* Zahlungsmethode */}
            <Card title="Zahlungsmethode">
              <div className="space-y-4">

                <PaymentOption
                  title="Kreditkarte"
                  icon={<CreditCardIcons />}
                />

                <PaymentOption
                  title="PayPal"
                  icon={<PayPalIcon />}
                />

                {/* Kreditkartenfelder */}
                <div className="grid gap-4 mt-4">
                  <Input label="Kartennummer" placeholder="1234 5678 9012 3456" />
                  <Input label="Name auf der Karte" placeholder="Max Mustermann" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Gültig bis" placeholder="MM/YY" />
                    <Input label="CVC" placeholder="123" />
                  </div>
                </div>

              </div>
            </Card>

          </div>

          {/* RIGHT */}
          <aside className="space-y-6">
            <Card title="Bestellübersicht">
              <div className="grid gap-4">
                <Input label="Zwischensumme" placeholder="69,80 €" />
                <Input label="Versand" placeholder="0,00 €" />
                <Input label="Gesamt" placeholder="83,06 €" />
              </div>
            </Card>

            <button className="w-full rounded-xl bg-black py-4 text-white text-sm font-medium tracking-wide transition-all hover:bg-neutral-900 active:scale-[0.98]">
              Bestellung abschließen
            </button>
          </aside>

        </div>
      </div>
    </div>
  );
}

/* --- COMPONENTS --- */

function Card({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-200">
      <h2 className="text-lg font-medium tracking-tight mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Input({ label, placeholder }: any) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-black focus:ring-0"
      />
    </label>
  );
}

function PaymentOption({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between p-4 border rounded-xl hover:bg-neutral-50 cursor-pointer transition">
      <div className="flex items-center gap-3">
        <input type="radio" name="payment" className="h-4 w-4" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      {icon}
    </label>
  );
}

/* --- ICONS --- */

function PayPalIcon() {
  return (
    <svg width="50" viewBox="0 0 24 24" fill="none">
      <path fill="#003087" d="M7.5 20L9 4h8.5c2.5 0 4 1.5 3.5 4l-1 6c-.5 2.5-2 4-4.5 4H7.5z" />
      <path fill="#009CDE" d="M9.5 20l1.2-8h7c1.5 0 2.5 1 2.2 2.5l-.6 3c-.3 1.5-1.3 2.5-2.8 2.5H9.5z" />
    </svg>
  );
}

function CreditCardIcons() {
  return (
    <div className="flex items-center gap-2">
      <svg width="36" viewBox="0 0 48 32">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text x="50%" y="55%" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">
          VISA
        </text>
      </svg>

      <svg width="36" viewBox="0 0 48 32">
        <rect width="48" height="32" rx="4" fill="#ECECEC" />
        <circle cx="18" cy="16" r="10" fill="#EB001B" />
        <circle cx="30" cy="16" r="10" fill="#F79E1B" />
      </svg>
    </div>
  );
}
