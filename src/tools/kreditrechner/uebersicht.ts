/**
 * Kreditbetrags-Vergleich auf der Tool-Seite selbst – Ersatz für fünf
 * SEO-Unterseiten (annuitaetendarlehen-berechnen, autokredit-rechner,
 * 10000-/20000-/50000-euro-kredit), die im Zuge der AdSense-Konsolidierung
 * entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md und
 * src/lib/retiredPaths.ts).
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst, mit denselben
 * Voreinstellungen wie die vier entfernten Ratenkredit-Seiten.
 */

import { formatEuroRounded, formatInteger, formatRate } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { calculateKredit, type KreditInput } from "./logic";

/** Dieselben vier Kreditbeträge, die vorher je eine eigene Seite hatten. */
const BETRAEGE: { label: string; input: KreditInput }[] = [
  {
    label: "10.000 €",
    input: {
      modus: "rate-aus-laufzeit",
      kreditbetrag: 10000,
      sollzinsPercent: 6.5,
      laufzeitJahre: 5,
      wunschrateMonat: 0,
      sondertilgungJahr: 0,
      bearbeitungsgebuehrPercent: 0,
      restschuldversicherung: 0,
      zinsbindungJahre: 0,
    },
  },
  {
    label: "20.000 €",
    input: {
      modus: "rate-aus-laufzeit",
      kreditbetrag: 20000,
      sollzinsPercent: 6.5,
      laufzeitJahre: 6,
      wunschrateMonat: 0,
      sondertilgungJahr: 0,
      bearbeitungsgebuehrPercent: 0,
      restschuldversicherung: 0,
      zinsbindungJahre: 0,
    },
  },
  {
    label: "25.000 € (Autokredit)",
    input: {
      modus: "rate-aus-laufzeit",
      kreditbetrag: 25000,
      sollzinsPercent: 4.9,
      laufzeitJahre: 5,
      wunschrateMonat: 0,
      sondertilgungJahr: 0,
      bearbeitungsgebuehrPercent: 0,
      restschuldversicherung: 0,
      zinsbindungJahre: 0,
    },
  },
  {
    label: "50.000 €",
    input: {
      modus: "rate-aus-laufzeit",
      kreditbetrag: 50000,
      sollzinsPercent: 6,
      laufzeitJahre: 10,
      wunschrateMonat: 0,
      sondertilgungJahr: 0,
      bearbeitungsgebuehrPercent: 0,
      restschuldversicherung: 0,
      zinsbindungJahre: 0,
    },
  },
];

/** Anfangstilgung im Vergleich: dieselbe Beispielfinanzierung wie die entfernte annuitaetendarlehen-Seite. */
const ANFANGSTILGUNGEN = [1, 2, 3];
const BAUFI_BETRAG = 300000;
const BAUFI_ZINS = 3.5;

export function buildUebersichtSection(): ContentSection[] {
  const kreditRows = BETRAEGE.map(({ label, input }) => {
    const r = calculateKredit(input);
    return [
      label,
      `${formatRate(input.sollzinsPercent)} %`,
      `${input.laufzeitJahre} Jahre`,
      formatEuroRounded(r.monatsrate),
      formatEuroRounded(r.gesamtzinsen),
      r.effektiverJahreszins !== null ? `${formatRate(r.effektiverJahreszins)} %` : "–",
    ];
  });

  const baufiRows = ANFANGSTILGUNGEN.map((tilgung) => {
    const rateMonat = Math.round(
      (BAUFI_BETRAG * (BAUFI_ZINS + tilgung)) / 100 / 12,
    );
    const r = calculateKredit({
      modus: "laufzeit-aus-rate",
      kreditbetrag: BAUFI_BETRAG,
      sollzinsPercent: BAUFI_ZINS,
      laufzeitJahre: 0,
      wunschrateMonat: rateMonat,
      sondertilgungJahr: 0,
      bearbeitungsgebuehrPercent: 0,
      restschuldversicherung: 0,
      zinsbindungJahre: 0,
    });

    return [
      `${formatRate(tilgung)} %`,
      formatEuroRounded(rateMonat),
      `${formatInteger(r.laufzeitMonate)} Monate`,
      formatEuroRounded(r.gesamtzinsen),
    ];
  });

  return [
    {
      heading: "Kreditbeträge im Vergleich",
      blocks: [
        {
          type: "p",
          text: "Monatsrate, Gesamtzinsen und effektiver Jahreszins für vier typische Kreditbeträge – für die eigene Summe, Laufzeit und Zinssatz rechnet der Rechner oben.",
        },
        {
          type: "table",
          caption: "Ratenkredit ohne Gebühren oder Restschuldversicherung",
          head: ["Betrag", "Sollzins", "Laufzeit", "Monatsrate", "Gesamtzinsen", "Effektiver Jahreszins"],
          rows: kreditRows,
        },
      ],
    },
    {
      heading: "Baufinanzierung: Wirkung der Anfangstilgung",
      blocks: [
        {
          type: "p",
          text: `Am Beispiel von ${formatEuroRounded(BAUFI_BETRAG)} zu ${formatRate(BAUFI_ZINS)} Prozent Zins: Je höher die Anfangstilgung, desto kürzer die Laufzeit und desto niedriger die Gesamtzinsen – bei spürbar höherer Monatsrate. Die Anfangstilgung ist deshalb neben dem Zins die wichtigste Zahl im Baufinanzierungsangebot.`,
        },
        {
          type: "table",
          caption: `${formatEuroRounded(BAUFI_BETRAG)} zu ${formatRate(BAUFI_ZINS)} % Zins`,
          head: ["Anfangstilgung", "Monatsrate", "Laufzeit", "Gesamtzinsen"],
          rows: baufiRows,
        },
      ],
    },
  ];
}
