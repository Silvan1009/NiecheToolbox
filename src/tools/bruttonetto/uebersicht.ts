/**
 * Steuerklassen-Vergleich auf der Tool-Seite selbst – Ersatz für fünf
 * SEO-Unterseiten (steuerklasse-1/3/4/5, lohnsteuer-berechnen), die im Zuge
 * der AdSense-Konsolidierung entfernt wurden (siehe
 * docs/adsense/etappe-0-ausgangslage.md und src/lib/retiredPaths.ts).
 * gehaltserhoehung-netto wurde ebenfalls entfernt und leitet auf
 * /wege/gehalt/ weiter, das dieselbe Frage mit echten Prozentstufen
 * ausführlich beantwortet.
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst, bei 4.000 Euro brutto –
 * derselben Voreinstellung wie die vier entfernten Seiten.
 */

import { formatEuroRounded, formatRate } from "@/lib/format";
import { getRegion } from "@/lib/regionen";
import type { ContentSection } from "@/tools/types";
import type { Steuerklasse } from "@/lib/steuerdaten";
import { calculateBruttoNetto, defaultInput } from "./logic";

/** Dieselben vier Steuerklassen, die vorher je eine eigene Seite hatten. */
const KLASSEN: Steuerklasse[] = [1, 3, 4, 5];

export function buildUebersichtSection(): ContentSection {
  const basis = defaultInput();

  const rows = KLASSEN.map((steuerklasse) => {
    const r = calculateBruttoNetto({ ...basis, steuerklasse });
    return [
      `Klasse ${steuerklasse}`,
      formatEuroRounded(r.nettoMonat),
      formatEuroRounded(r.abzuegeGesamtJahr / 12),
      `${formatRate(r.abgabenquoteProzent)} %`,
    ];
  });

  return {
    heading: "Steuerklassen im Vergleich",
    blocks: [
      {
        type: "p",
        text: `Netto, monatliche Abzüge und Abgabenquote bei ${formatEuroRounded(basis.brutto)} brutto in ${getRegion(basis.region)?.name ?? basis.region}, ohne Kirchensteuer, kinderlos, gesetzlich versichert – für die eigenen Angaben rechnet der Rechner oben.`,
      },
      {
        type: "table",
        caption: `${formatEuroRounded(basis.brutto)} brutto im Monat`,
        head: ["Steuerklasse", "Netto", "Abzüge insgesamt", "Abgabenquote"],
        rows,
      },
      {
        type: "note",
        text: "Über das ganze Jahr gerechnet ändert die Steuerklasse nichts an der tatsächlichen Steuerschuld – sie verschiebt nur, wann gezahlt wird. Bei einer Ehe mit deutlich unterschiedlichen Einkommen bringt III/V monatlich mehr Netto im Haushalt, führt aber zur Pflichtveranlagung mit möglicher Nachzahlung; das Faktorverfahren IV/IV mit Faktor verteilt die Steuer stattdessen nach dem tatsächlichen Einkommensverhältnis.",
      },
    ],
  };
}
