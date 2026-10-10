# Molinka Frontend

Dieses Repository ist ein Next.js-Frontend für einen modernen Shopware-Storefront-Workflow mit App Router, TypeScript und mehreren Shop- und Kundenfunktionen.

Das Frontend kommuniziert mit einem Backend über Next.js-Rewrites und behandelt dabei Warenkorb, Checkout, Anmeldung, Registrierung, Kundenprofil, Suche und Kontaktformulare.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MUI / Emotion
- Vercel Analytics + Speed Insights
- nodemailer

## Projektstruktur

```text
frontend/
├── app/
│   ├── api/
│   │   ├── cart/
│   │   │   ├── add/
│   │   │   ├── details/
│   │   │   ├── drop/
│   │   │   └── remove/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── customer/
│   │   │   └── me/
│   │   ├── login/
│   │   ├── logout/
│   │   ├── register/
│   │   └── search/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartLayout.tsx
│   │   ├── Category.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Product.tsx
│   │   └── ScrollAnimations.tsx
│   ├── Checkout/
│   ├── Warenkorb/
│   ├── anmelden/
│   ├── datenschutz/
│   ├── impressum/
│   ├── kontakt/
│   ├── konto/
│   ├── registrieren/
│   ├── search/
│   ├── shoppen/
│   ├── ueber-uns/
│   ├── Data.json
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── manifest.json
│   └── page.tsx
├── lib/
│   ├── shopwareCart.ts
│   └── shopwareStorefront.ts
├── public/
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── frontend-api.js
├── middleware.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── composer.json
├── composer.lock
└── README.md
```

## Wichtige Ordner

### app/
Der Hauptbereich der App mit dem App Router von Next.js.

- `app/page.tsx`: Startseite mit Produkt-Highlight, Kategorien und Shop-CTA
- `app/layout.tsx`: globale Layout-Struktur mit Header und Footer
- `app/globals.css`: globale Styles
- `app/components/`: wiederverwendbare UI-Komponenten wie Header, Footer, Produktkarten, Warenkorb
- `app/api/`: API-Routen für Login, Cart, Search, Contact usw.
- `app/shoppen`, `app/Warenkorb`, `app/konto`, `app/registrieren` etc.: Routen für die Shop- und Kundenfunktionen

### lib/
Enthält Logik für die Verbindung mit Shopware:

- `lib/shopwareStorefront.ts`: generische Shopware-Storefront-Funktionen
- `lib/shopwareCart.ts`: Warenkorb-Logik und API-Aufrufe

### middleware.ts
Implementiert einen einfachen Rate-Limit-Schutz für API-Endpunkte.

### next.config.ts
Konfiguriert:

- Bild-Remote-Patterns
- Rewrites für Backend- und Store-API-Aufrufe
- Proxying von `/backend-api`, `/store-api` und `/media`

## Entwicklung

1. Abhängigkeiten installieren:

```bash
npm install
```

2. Entwicklungsserver starten:

```bash
npm run dev
```

Danach öffnest du:

```text
http://localhost:3000
```

## Scripts

```json
{
  "scripts": {
    "dev": "NODE_TLS_REJECT_UNAUTHORIZED=0 next dev -p 3000 -H 0.0.0.0",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

## Umgebungsvariablen

Das Frontend erwartet in der Regel eine Verbindung zum Backend:

```env
BACKEND_API_URL=http://localhost:8000
SHOPWARE_STORE_API_ACCESS_KEY=your_key_here
```

Diese Werte werden für den Zugriff auf das Shopware-Backend und die internen Rewrite-Regeln verwendet.

## API-/Backend-Anbindung

Die App nutzt Next.js-Rewrites, damit der Browser immer dieselbe Origin nutzt und CORS-Probleme vermieden werden.

Beispiele:

- `/backend-api/...` -> Backend API
- `/store-api/...` -> Shopware Store API
- `/media/...` -> Media-Assets des Backends

## Hinweise

- Die App nutzt ein App-Router-Setup (`app/`)
- Für Produktdaten gibt es eine Fallback-Katalogdatei in `app/Data.json`
- Die Startseite lädt Produkte dynamisch und fällt bei Problemen auf lokale Fallback-Daten zurück
- Viele Seiten sind deutschsprachig und auf einen Shopware-/E-Commerce-Kontext zugeschnitten

## Ziel

Die Frontend-App dient als digitale Storefront für Produkte, Services und Kundenprozesse rund um einen modernen Shopware-Shop mit eigener Oberfläche und API-Integration.
