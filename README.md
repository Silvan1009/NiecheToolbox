# Nützlich

Eine Sammlung kleiner Web-Rechner, die echte Alltagsfragen beantworten. Alles
rechnet im Browser, jedes Ergebnis ist über die URL teilbar, jede Seite wird
statisch vorgerendert.

Der Name ist ein Platzhalter – er steht an genau einer Stelle:
[`src/config/site.ts`](src/config/site.ts).

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

- **Kein Werbe-Skript ohne Einwilligung.** [`AdSlot`](src/components/AdSlot.tsx)
  rendert nichts, solange keine Zustimmung vorliegt – kein Script, kein Request.
  Ohne konfigurierte IDs zeigt es im Dev-Modus eine erkennbare Fläche.
- **Consent Mode v2** wird mit `denied` initialisiert und erst bei Zustimmung
  aktualisiert ([`lib/consent.ts`](src/lib/consent.ts)). Die Entscheidung liegt
  mit Zeitstempel im Local Storage und verlässt das Gerät nicht.
- **Ablehnen ist gleichwertig**: gleiche Größe, gleiche Position, gleiche
  Erreichbarkeit. Keine Entscheidung zählt als Ablehnung. Widerruf jederzeit
  über den Footer.
- **Platzierung**: ein Slot unter dem Tool, ein zweiter nur bei
  `adDensity: "medium"` unter dem Erklärtext. Nie über dem Tool, nie zwischen
  Eingabefeldern.
- **Affiliate** läuft über `monetization.affiliate` mit `when(result)`: die
  Empfehlung erscheint nur, wenn das Ergebnis sie rechtfertigt – der Reise-Tipp
  erst ab sieben freien Tagen am Stück. Höchstens eine, immer gekennzeichnet,
  immer `rel="sponsored nofollow noopener"`. Ziel-URLs stehen in
  `config/site.ts`, nie im Tool.
- **Analytics** ist cookiefrei (Umami oder Plausible) und läuft deshalb
  unabhängig vom Werbe-Consent.

## Vor dem Livegang

- [ ] Echte Angaben in `legal.operator` (`src/config/site.ts`) eintragen und
      `legal.isPlaceholder` auf `false` setzen. Impressum und
      Datenschutzerklärung sind derzeit **Platzhaltertexte** und als solche
      markiert – vor Veröffentlichung fachkundig prüfen lassen.
- [ ] Hosting-Anbieter in der Datenschutzerklärung ergänzen (Abschnitt
      Server-Logfiles), gegebenenfalls Auftragsverarbeitungsvertrag abschließen.
- [ ] Für **personalisierte** Anzeigen verlangt Google in der EU eine
      zertifizierte Consent-Management-Plattform. Der eingebaute Banner erfüllt
      die technische Seite (Consent Mode v2, gleichwertiges Ablehnen, Widerruf);
      für personalisierte Anzeigen muss eine zertifizierte CMP davor. Vorgaben
      kurz vor Launch gegenprüfen.
- [ ] `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen – sonst zeigen
      canonical-URLs, Sitemap und OG-Bilder ins Leere.
- [ ] AdSense-IDs eintragen und `NEXT_PUBLIC_ADS_ENABLED=true` setzen.
- [ ] Affiliate-Platzhalterlinks in `config/site.ts` durch echte Partnerlinks
      ersetzen.
- [ ] Die Vergütungserwartung (Display-Werbung, grob 2–8 € pro 1000
      Seitenaufrufe bei deutschem Publikum) und die Rechtsvorgaben gegen den
      aktuellen Stand prüfen – beides ändert sich.
