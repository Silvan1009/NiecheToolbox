# Rechnerkiste

Eine Sammlung kleiner Web-Rechner, die echte Alltagsfragen beantworten. Alles
rechnet im Browser, jedes Ergebnis ist über die URL teilbar, jede Seite wird
statisch vorgerendert.

Name und Domain stehen an genau einer Stelle:
[`src/config/site.ts`](src/config/site.ts). Sie müssen zueinander passen –
`rechnerkiste.app` heißt „Rechnerkiste“.

## Loslegen

```bash
npm install
```

```bash
npm run dev
```

| Befehl              | Zweck                                          |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Entwicklungsserver auf <http://localhost:3000> |
| `npm run build`     | Produktionsbuild inkl. aller statischen Seiten |
| `npm test`          | Vitest – die komplette Tool-Logik              |
| `npm run typecheck` | `tsc --noEmit`                                 |
| `npm run lint`      | ESLint (inkl. React-Compiler-Regeln)           |

Konfiguration über Umgebungsvariablen: [`.env.example`](.env.example) nach
`.env.local` kopieren. Ohne Werte läuft alles – nur ohne Werbung und ohne
Reichweitenmessung.

## Ein neues Tool hinzufügen

Ein Tool ist ein Ordner unter `src/tools/` plus **eine Zeile** in der Registry.
Kern-Code wird dabei nicht angefasst: Startseite, Routing, Navigation, Sitemap
und Footer ergeben sich automatisch aus dem Manifest.

```
src/tools/mein-tool/
├─ logic.ts        # reine Berechnung, keine React-/DOM-Abhängigkeit
├─ logic.test.ts   # Unit-Tests dazu
├─ Component.tsx   # "use client" – nur UI, ruft logic.ts auf
├─ affiliate.ts    # optional: kontextuelle Empfehlungen
└─ manifest.ts     # Metadaten, SEO-Texte, Monetarisierung
```

1. **`logic.ts`** – die Berechnung als reine Funktion. Keine Imports aus `react`
   oder `next`. Datums-Primitiven kommen aus [`src/lib/date.ts`](src/lib/date.ts).
2. **`logic.test.ts`** – Unit-Tests. Für jede Zahl, die jemand aus der Seite
   mitnimmt, gehören belegte Beispielwerte und Invarianten hinein.
3. **`Component.tsx`** – `"use client"`, macht nur UI. Zustand, der ein Ergebnis
   erzeugt, läuft über [`useUrlState`](src/lib/useUrlState.ts) und landet damit
   in der Adresszeile: jedes Ergebnis ist teil- und verlinkbar.
4. **`manifest.ts`** – füllt [`ToolManifest`](src/tools/types.ts) aus:
   `slug`, `name`, `tagline`, `category`, `icon`, `keywords`, `status`,
   `Component`. Optional `about`, `faq`, `getVariants`, `getDefaultParams`,
   `monetization`.
5. **Registrieren** – in [`src/tools/registry.ts`](src/tools/registry.ts)
   importieren und ins `tools`-Array aufnehmen. Fertig.

Statusfeld: `live` erscheint überall, `beta` ist erreichbar und als Beta
gekennzeichnet, `draft` ist nicht auffindbar (404).

Kategorien stehen in [`src/tools/types.ts`](src/tools/types.ts). Sie sind kein
Filter, sondern steuern die interne Verlinkung: `relatedTools` gewichtet gleiche
Kategorie höher als Keyword-Überschneidung. Eine neue Kategorie ist eine Zeile
im Union-Typ und eine im Label-Objekt.

Rechnet ein Tool mit Feiertagen, kommen sie aus
[`src/tools/brueckentage/logic.ts`](src/tools/brueckentage/logic.ts) –
`holidaysFor(jahr, bundesland)` ist die gemeinsame Quelle für Brückentage,
Arbeitstage und die Werktagsfristen im Kündigungsrechner. Keine zweite
Feiertagsliste anlegen.

### Ergebnisse teilbar halten

`useUrlState` spiegelt den Zustand gedrosselt über `history.replaceState` in die
Query-Params – kein Server-Roundtrip pro Tastendruck. Der erste Render kommt aus
`initialState`, damit SSR-HTML und erster Client-Render identisch sind; direkt
nach dem Mount wird der Zustand aus der URL übernommen.

Faustregel: nur Werte in die URL, die das Ergebnis bestimmen – und nichts
Persönliches. Der Lesezeit-Rechner schreibt deshalb die Wortzahl in den Link,
nie den Text.

### Programmatische SEO-Seiten

`getVariants()` erzeugt statische Unterseiten unter `/tools/<slug>/<variant>`.
Der Brückentage-Rechner legt so je Bundesland und Jahr eine eigene Landing-Page
an (`/tools/brueckentage/bayern-2026`), jede mit eigenem Titel, eigener
Description, eigenem OG-Bild und eigenem JSON-LD. Sitemap und Routing lesen das
direkt aus dem Manifest.

## Aufbau

```
src/
├─ app/                  # Routen. Für Tools gibt es genau zwei generische Seiten.
│  ├─ tools/[slug]/               # Tool-Seite
│  ├─ tools/[slug]/[variant]/     # SEO-Variante
│  ├─ rechtliches/                # Impressum + Datenschutz (Pflicht in DE)
│  ├─ api/og/                     # dynamische Open-Graph-Bilder
│  └─ sitemap.ts, robots.ts       # aus der Registry erzeugt
├─ tools/                # die Tools selbst + registry.ts + types.ts
├─ components/           # geteilte UI (ui/ = Design-System-Bausteine)
├─ design/tokens.css     # Farben, Radien, Schatten, Bewegung
├─ lib/                  # date, format, seo, consent, useUrlState
└─ config/site.ts        # Name, Domain, Werbe-IDs, Affiliate-Links
```

## Design-System

[`src/design/tokens.css`](src/design/tokens.css) ist die einzige Quelle der
Wahrheit für Farben, Radien und Schatten; `globals.css` mappt die Tokens per
`@theme inline` auf Tailwind-Utilities (`bg-surface`, `text-muted`,
`rounded-card`, `shadow-soft`, …). Kein Komponenten-Code definiert eigene
Farbwerte.

Akzentfarbe tauschen: nur `--accent` und `--accent-600` in `tokens.css` ändern.

Das Signature-Element ist die **Payoff-Zahl**
([`NumberDisplay`](src/components/ui/NumberDisplay.tsx)): groß, in Mono, in der
Erfolgsfarbe, mit kurzer Count-up-Animation – deren Dauer aus dem Token
`--dur-payoff` kommt und die bei `prefers-reduced-motion: reduce` entfällt.
Grün (`--positive`) ist ausschließlich für positive Ergebniszahlen reserviert.

Das Design ist bewusst ein reines Light-Theme: ein Akzent, ein Payoff-Moment.

## Werbung, Einwilligung, Affiliate

- **Zertifizierte CMP.** Die Einwilligung erhebt Google Funding Choices,
  zertifiziert nach IAB TCF v2.2. Das ist keine Geschmacksfrage: Google liefert
  AdSense im EWR und im Vereinigten Königreich seit Januar 2024 nur noch an
  Seiten mit zertifizierter CMP aus. Ein selbstgebauter Banner erfüllt die
  Anforderung nicht, egal wie sauber er ist.
- **Die Wahrheit steht in der TCF-API**, nicht im Local Storage.
  [`lib/consent.ts`](src/lib/consent.ts) hört über `window.__tcfapi` zu,
  [`lib/tcf.ts`](src/lib/tcf.ts) übersetzt das Signal: geladen wird nur bei
  Einwilligung in Zweck 1 **und** für Google als Anbieter. Berechtigtes
  Interesse genügt für Zweck 1 nicht – § 25 TDDDG kennt diese Grundlage für den
  Zugriff aufs Endgerät nicht.
- **Consent Mode v2** wird von [`lib/adsBootstrap.ts`](src/lib/adsBootstrap.ts)
  auf `denied` vorbelegt, bevor irgendein Google-Tag lädt. Die Aktualisierung
  schreibt allein die CMP – **niemals** zusätzlich eigener Code. Zwei Schreiber
  auf demselben Signal sind der klassische Grund für scheinbar grundlos
  verlorene Einwilligungen.
- **Kein Werbe-Skript ohne Einwilligung.**
  [`AdSlot`](src/components/ads/AdSlot.tsx) rendert nichts, solange keine
  Zustimmung vorliegt – kein Script, kein Request. Ohne konfigurierte IDs zeigt
  es im Dev-Modus eine erkennbare Fläche. `adsbygoogle.js` lädt einmal pro
  Dokument über [`AdsenseLoader`](src/components/ads/AdsenseLoader.tsx), nicht
  je Slot.
- **Fällt die CMP aus** – Adblocker, Netzwerkfehler –, bleibt der Status
  `unknown` und es lädt nichts. Scheitern in die sichere Richtung.
- **Platzierung**: ein Slot unter dem Tool, ein zweiter nur bei
  `adDensity: "medium"` unter dem Erklärtext. Nie über dem Tool, nie zwischen
  Eingabefeldern. Die Regel steht als geprüfte Funktion in
  [`lib/adPlacement.ts`](src/lib/adPlacement.ts). **Auto Ads bleiben aus** – sie
  würden Anzeigen mitten in die Rechner setzen.
- **Layout bleibt ruhig**: Slots reservieren ihre Höhe und fordern die Anzeige
  erst an, wenn sie in Sichtweite kommt ([`lib/useInView.ts`](src/lib/useInView.ts)).
  Bleibt eine Fläche unbefüllt, klappt sie per CSS über `data-ad-status`
  zusammen – ohne MutationObserver, ohne zusätzliches Rendern.
- **[`/ads.txt`](src/app/ads.txt/route.ts)** wird aus der Publisher-ID erzeugt.
  Ohne ID liefert die Route 404 statt einer leeren Datei: eine ads.txt ohne
  Einträge lesen manche Prüfer als „autorisiert niemanden".
- **Affiliate** läuft über `monetization.affiliate` mit `when(result)`: die
  Empfehlung erscheint nur, wenn das Ergebnis sie rechtfertigt – der Reise-Tipp
  erst ab sieben freien Tagen am Stück. Höchstens eine, immer gekennzeichnet,
  immer `rel="sponsored nofollow noopener"`. Ziel-URLs stehen in
  `config/site.ts`, nie im Tool.
- **Analytics** ist cookiefrei (Umami oder Plausible) und läuft deshalb
  unabhängig vom Werbe-Consent.

## Sicherheits-Header

[`lib/securityHeaders.ts`](src/lib/securityHeaders.ts) baut die Header,
[`next.config.ts`](next.config.ts) hängt sie an jede Antwort. Header wirken zur
Antwortzeit und lassen Rendering-Modus und Route-Cache unberührt – deshalb dort
und nicht in `proxy.ts` (in Next 16 der neue Name für `middleware.ts`). Ein
CSP-Nonce bräuchte pro Anfrage einen frischen Wert, würde dynamisches Rendern
erzwingen und das `revalidate = 86400` der Tool-Seiten aushebeln.

- **Die Permissions-Policy gibt die Privacy-Sandbox-Signale frei**, über die
  AdSense aussteuert und abrechnet. **Hier nichts entfernen.** Den Header ganz
  wegzulassen ist unproblematisch; einen restriktiven zu schreiben nicht. Ein
  blankes `browsing-topics=()` schaltet die Signale stumm ab: keine Warnung,
  kein Fehler, nur weniger Umsatz. `securityHeaders.test.ts` hält das fest.
- **Die CSP läuft als `Report-Only`** (`CSP_MODE`). Sie ist ehrlicherweise eine
  Origin-Allowlist und kein XSS-Schutz: `script-src` braucht `'unsafe-inline'`,
  weil Next die RSC-Payload inline streamt, `style-src` wegen
  `experimental.inlineCss`. Der Gewinn liegt darin, dass Skripte, Bilder,
  Verbindungen und Frames nur von bekannten Hosts kommen.
- **Vor dem Umschalten auf `enforce`**: mit echten IDs und
  `NEXT_PUBLIC_ADS_TEST=true` bauen, jede Tool-Seite mit offener Konsole laden,
  auf `[Report Only]` filtern und blockierte Hosts nachtragen. Nach einer Woche
  echtem Traffic wiederholen – Anzeigenmotive ziehen von Domains, die keine
  Testsitzung trifft.

## Vor dem Livegang

- [ ] Echte Angaben in `legal.operator` (`src/config/site.ts`) eintragen und
      `legal.isPlaceholder` auf `false` setzen. Impressum und
      Datenschutzerklärung sind derzeit **Platzhaltertexte** und als solche
      markiert – vor Veröffentlichung fachkundig prüfen lassen.
- [ ] Hosting-Anbieter in der Datenschutzerklärung ergänzen (Abschnitt
      Server-Logfiles), gegebenenfalls Auftragsverarbeitungsvertrag abschließen.
- [ ] `SITE_URL` auf die echte Domain setzen – sonst zeigen
      canonical-URLs, Sitemap und OG-Bilder ins Leere.
- [ ] Affiliate-Platzhalterlinks in `config/site.ts` durch echte Partnerlinks
      ersetzen **oder** `affiliate.enabled` auf `false` setzen. Links auf
      `example.com` sind ein dokumentierter Ablehnungsgrund bei AdSense.

### AdSense-Freigabe

Vor der Bewerbung muss all das stimmen – AdSense prüft die Seite, wie sie ist:

- [ ] Echte Angaben in `legal.operator`, `legal.isPlaceholder = false`. Ein
      Impressum mit `PLATZHALTER` führt zur Ablehnung.
- [ ] Inhaltstiefe je Tool (`about` + `faq`). **Größtes Risiko sind die
      Variantenseiten** (Brückentage je Bundesland und Jahr): über hundert
      nahezu identische Seiten sind der klassische Auslöser für „low value
      content". Entweder variantenspezifischer Text oder die dünnste Ebene
      vorher auf `noindex`.
- [ ] Etwas organischer Traffic, kein bezahlter oder incentivierter.
- [ ] Seitenverifizierung über den `google-adsense-account`-Meta-Tag oder
      `/ads.txt` – **nicht** über ein ungegatetes Werbe-Skript. Der übliche Weg
      („Snippet in den `<head>`") würde einem Prüfer, der ablehnt, gar nichts
      zeigen. Der Meta-Tag steht cookielos immer im HTML.

Nach der Freigabe, in dieser Reihenfolge:

- [ ] In AdSense unter **Datenschutz & Mitteilungen → Europäische Vorschriften**
      eine Funding-Choices-Mitteilung anlegen und für EWR + UK veröffentlichen.
- [ ] **Auto Ads ausschalten.** Sie ignorieren die Platzierungsregel und setzen
      Anzeigen über den Rechner und zwischen die Eingabefelder.
- [ ] Zwei Anzeigenblöcke anlegen, IDs eintragen, `NEXT_PUBLIC_ADS_ENABLED=true`.
- [ ] **Rebuild und ISR-Cache leeren.** `NEXT_PUBLIC_*` wird zur Buildzeit
      eingebacken; ohne Purge liegt bis zu 24 Stunden altes HTML ohne Werbung
      aus.
- [ ] `curl https://<domain>/ads.txt` prüfen.
- [ ] Mit dem TCF-Debugger gegenprüfen: `gdprApplies: true`, und Ablehnen
      erzeugt null Requests an `pagead2`.
- [ ] Die Vergütungserwartung (Display-Werbung, grob 2–8 € pro 1000
      Seitenaufrufe bei deutschem Publikum) und die Rechtsvorgaben gegen den
      aktuellen Stand prüfen – beides ändert sich.
