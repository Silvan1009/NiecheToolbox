/**
 * Gästezahl-Vergleich auf der Tool-Seite selbst – Ersatz für die 5
 * SEO-Unterseiten (je eine Gästezahl), die im Zuge der AdSense-
 * Konsolidierung entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md
 * und src/lib/retiredPaths.ts).
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst, mit denselben
 * Voreinstellungen wie die entfernten Seiten: Grillen, vier Stunden, 20
 * Prozent Vegetarier, Alkohol dabei.
 */

import { formatAmount, formatInteger } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { calculateParty, type PartyItem, type PartyResult } from "./logic";

const GUEST_COUNTS = [10, 15, 20, 30, 50];
const STUNDEN = 4;
const VEGGIE_PROZENT = 20;
/** Ab dieser Gästezahl wird ein einzelner Grill zum Nadelöhr (siehe logic.ts). */
const GRILL_GRENZE = 25;

function menge(item: PartyItem | undefined): string {
  if (!item) return "–";
  return item.unit === "Stück"
    ? `${formatInteger(item.amount)} Stück`
    : `${formatAmount(item.amount)} ${item.unit}`;
}

function finde(result: PartyResult, key: string): PartyItem | undefined {
  return [...result.food, ...result.drinks, ...result.supplies].find(
    (item) => item.key === key,
  );
}

export function buildUebersichtSection(): ContentSection {
  const rows = GUEST_COUNTS.map((gaeste) => {
    const r = calculateParty({
      adults: gaeste,
      children: 0,
      hours: STUNDEN,
      occasion: "grillen",
      vegetarianPercent: VEGGIE_PROZENT,
      alcohol: true,
      heartyEaters: false,
    });

    const salate = finde(r, "salat") ?? r.food[2];
    const brot = finde(r, "brot") ?? r.food[3];
    const kohle = r.supplies[0];

    return [
      `${gaeste}${gaeste >= GRILL_GRENZE ? " ⁽¹⁾" : ""}`,
      menge(r.primary),
      menge(salate),
      menge(brot),
      menge(r.drinks[1]),
      menge(r.drinks[2]),
      menge(kohle),
    ];
  });

  return {
    heading: "Gästezahl im Vergleich",
    blocks: [
      {
        type: "p",
        text: `Einkaufsmengen für einen vierstündigen Grillabend bei ${VEGGIE_PROZENT} Prozent Vegetariern und Alkohol dabei – für die eigene Runde mit abweichender Dauer oder Anlass rechnet der Planer oben.`,
      },
      {
        type: "table",
        caption: `Mengen bei ${STUNDEN} Stunden, ${VEGGIE_PROZENT} % Vegetarier`,
        head: ["Gäste", "Fleisch", "Salate", "Brot", "Bier", "Wein", "Grillkohle"],
        rows,
      },
      {
        type: "note",
        text: `⁽¹⁾ Ab ${GRILL_GRENZE} Gästen wird ein einzelner Kugelgrill zum Nadelöhr: Er schafft acht bis zehn Portionen je Durchgang à 15 bis 20 Minuten. Ein zweiter Grill, vorgegartes Fleisch aus dem Ofen oder ein Buffet mit kalten Komponenten lösen das.`,
      },
    ],
  };
}
