# Molinka Frontend — Next.js Shopware 6 Storefront

Dieses Repository ist die Frontend-Schicht eines modernen E-Commerce-Ökosystems basierend auf Next.js 16, React 19 und Shopware 6.7. Das Frontend kommuniziert über ein Shopware-Backend mit erweiterten MVC-Plugins und bietet eine schnelle, moderne Storefront für Produkte, Services und Kundenprozesse.

## Projektübersicht

Das System besteht aus zwei Hauptteilen:

- Frontend: dieses Repo (`longtime88/frontend`)
  - Next.js App Router
  - TypeScript
  - Tailwind CSS + MUI
  - Produktseiten, Warenkorb, Login, Registrierung, Checkout

- Backend: `longtime88/shopware-backend`
  - Shopware 6.7
  - PHP / Symfony
  - Custom MVC-Plugins
  - Store-API und Shopware Commerce-Logik

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MUI / Emotion
- Vercel Analytics + Speed Insights
- nodemailer
- Shopware 6.7
- PHP / Symfony

## Verwandte Repositories

- Frontend: `longtime88/frontend`
- Shopware Backend: `longtime88/shopware-backend`
- FastAPI: `longtime88/fastapi`
- E-Commerce Präsentation: `longtime88/fachinformatiker-ecommerce`

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
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── manifest.json
│   └── favicon.ico
├── lib/
│   ├── shopwareCart.ts
│   └── shopwareStorefront.ts
├── middleware.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── public/
├── .gitignore
├── AGENTS.md
├── README.md
└── composer.json
```

## Architektur und Backend-Integration

Die Frontend-App nutzt Next.js-Rewrites und Proxy-Mechanismen, damit der Browser immer dieselbe Origin verwendet und CORS-Probleme vermieden werden.

Beispiel:

- `/backend-api/:path*` → Backend API
- `/store-api/:path*` → Shopware Store API
- `/media/:path*` → Media-Dateien

Das Frontend arbeitet somit mit dem Shopware-Backend zusammen, ohne direkt aus dem Browser heraus auf verschiedene Domänen oder Ports zuzugreifen.

### Grundfluss

```text
Browser
  ↓
Next.js Frontend
  ↓
API Routes / Rewrites
  ↓
Shopware Store API / Backend
  ↓
Shopware Core + Plugins
  ↓
Datenbank / Produkte / Bestellungen / Kunden
```

## MVC-Plugin-System im Shopware-Backend

Shopware arbeitet mit einem MVC-Plugin-Architekturmodell. Ein Plugin besteht typischerweise aus:

- Model: Datenstrukturen und Entitäten
- View: Templates, UI-Komponenten, Storefront-Erweiterungen
- Controller: Logik für Requests / API-Aufrufe
- Service: Business-Logik
- Subscriber/Event-Listener: Reaktionen auf Shopware-Events

### Beispiel: CheckoutCustomizer

Das Plugin `custom/plugins/CheckoutCustomizer` ist ein gutes Beispiel für ein eigenes Shopware-MVC-Plugin.

Dateistruktur:

```text
custom/plugins/CheckoutCustomizer/
├── composer.json
├── src/
│   └── CheckoutCustomizer.php
├── README.md
└── tests/
```

Die zentrale Klasse sieht so aus:

```php
<?php declare(strict_types=1);

namespace CheckoutCustomizer;

use Shopware\Core\Framework\Plugin;

class CheckoutCustomizer extends Plugin
{
}
```

Das bedeutet:

- Das Plugin wird als Shopware-Plugin erkannt
- Es kann Symfony-Services, Controller, Events und Views registrieren
- Es kann die Storefront oder Checkout-Funktionalität erweitern

### Typische Plugin-Struktur

```text
custom/plugins/MyPlugin/
├── src/
│   ├── Controller/
│   ├── Service/
│   ├── Subscriber/
│   ├── Entity/
│   └── MyPlugin.php
├── Resources/
│   ├── config/
│   ├── views/
│   └── app/
├── composer.json
├── README.md
└── tests/
```

## Shopware-Plugins im Projekt

Im Backend-Repo gibt es mehrere relevante Plugins:

- `CheckoutCustomizer`
  - für Bestell- und Checkout-Anpassungen

- `SwagMigrationAssistant`
  - für Migration von alten Datenexporten oder Shopware-Versionen
  - unterstützt Migrationsprozesse zwischen Systemen

- `SwagPayPal`
  - Zahlung via PayPal

Diese Plugins werden über `custom/plugins` in der Shopware-Installation eingebunden und sind Teil der MVC-Architektur des Shops.

## Wichtige Dateien im Frontend

### app/page.tsx
Die Startseite zeigt unter anderem:

- Hero-Bereich
- Kategoriewahl
- Produkt-Highlights
- Shop-Calls
- Vercel Analytics / Speed Insights

### app/layout.tsx
Globales Layout mit:

- Header
- Main-Bereich
- Footer
- eingebaute Fonts (`Manrope`, `Fraunces`)

### middleware.ts
Diese Datei setzt ein einfaches Rate Limiting für API-Requests um:

- max. 30 Requests pro Minute
- IP + User-Agent als Kennung
- HTTP 429 bei Überschreitung

### next.config.ts
Hier wird die Backend-Anbindung konfiguriert:

- Rewrites für `/backend-api`, `/store-api` und `/media`
- Bildzugriffe für lokale und Remote-Hostnamen

## Entwicklung

1. Abhängigkeiten installieren

```bash
npm install
```

2. Entwicklungsserver starten

```bash
npm run dev
```

3. Browser öffnen

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

Im Frontend wird typischerweise eine `.env.local` verwendet:

```env
BACKEND_API_URL=http://localhost:8000
SHOPWARE_STORE_API_ACCESS_KEY=your_key_here
```

Diese Werte werden für die Verbindung zum Shopware-Backend und die Rewrites verwendet.

## API-Endpunkte

Das Frontend enthält mehrere API-Routen:

- `/api/cart/add`
- `/api/cart/details`
- `/api/cart/remove`
- `/api/cart/drop`
- `/api/login`
- `/api/logout`
- `/api/register`
- `/api/customer/me`
- `/api/search`
- `/api/contact`

Diese werden von der Frontend-UI genutzt und kommunizieren mit dem Shopware-Backend.

## Fazit

Dieses Projekt ist ein typisches Beispiel für eine moderne Full-Stack-E-Commerce-Architektur:

- Frontend in Next.js / React
- Commerce-Logik im Shopware-Backend
- Erweiterung durch MVC-Plugins
- API-Integration zwischen Frontend und Backend
- Flexible, modulare Architektur für digitale Shops

Das macht das Projekt gut für:

- E-Commerce-Prototypen
- Shopware-Storefronts
- individuelle Frontend-Erweiterungen
- Shopware-Integrationen mit eigener UI

## Lizenz

MIT License
