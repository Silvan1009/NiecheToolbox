/**
 * Prozentstufen-Vergleich auf der Weg-Seite selbst – Ersatz für die 4
 * SEO-Unterseiten (je eine Erhöhungsgröße), die im Zuge der AdSense-
 * Konsolidierung entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md
 * und src/lib/retiredPaths.ts).
 *
 * Anders als bei den anderen eingeschmolzenen Tools rechnet dieser Weg nicht
 * selbst, sondern verkettet drei fremde Rechner. Die Tabelle tut hier
 * dasselbe: Sie ruft calculateBruttoNetto() zweimal (vorher/nachher) und
 * calculateSparplan() einmal auf, mit genau den defaultInput()-Werten der
 * beiden Tools – denselben Annahmen, mit denen die vier entfernten Seiten
 * schon gerechnet hatten (4.000 € Ausgangsgehalt, Steuerklasse I, NRW, ohne
 * Kirchensteuer, kinderlos, gesetzlich versichert mit dem durchschnittlichen
 * Zusatzbeitrag; Sparplan mit 7 % Rendite, 0,2 % Kosten, 2 % Inflation, 20
 * Jahre).
 */

import { formatEuroRounded, formatInteger } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import {
  calculateBruttoNetto,
  defaultInput as bruttoNettoDefaultInput,
} from "@/tools/bruttonetto/logic";
import {
  calculateSparplan,
  defaultInput as sparplanDefaultInput,
} from "@/tools/sparplan/logic";
import { bewerteGehalt } from "./urteil";

/** Dieselben vier Erhöhungsstufen, die vorher je eine eigene Seite hatten. */
const STUFEN = [3, 5, 10, 15];

export function buildUebersichtSection(): ContentSection {
  const basis = bruttoNettoDefaultInput();
  const vorher = calculateBruttoNetto(basis);

  const rows = STUFEN.map((prozent) => {
    const nachher = calculateBruttoNetto({
      ...basis,
      brutto: Math.round(basis.brutto * (1 + prozent / 100)),
    });

    const bruttoPlusMonat = nachher.bruttoMonat - vorher.bruttoMonat;
    const nettoPlusMonat = nachher.nettoMonat - vorher.nettoMonat;
    const urteil = bewerteGehalt({ bruttoPlusMonat, nettoPlusMonat });

    const sparplan = calculateSparplan({
      ...sparplanDefaultInput(),
      startkapital: 0,
      sparrateMonat: nettoPlusMonat,
    });

    return [
      `${prozent} %`,
      formatEuroRounded(bruttoPlusMonat),
      formatEuroRounded(nettoPlusMonat),
      urteil.grenzbelastungProzent !== null
        ? `${formatInteger(Math.round(urteil.grenzbelastungProzent))} %`
        : "–",
      formatEuroRounded(sparplan.endkapitalNachSteuer),
    ];
  });

  return {
    heading: "Erhöhungsstufen im Vergleich",
    blocks: [
      {
        type: "p",
        text: "Brutto-Plus, Netto-Plus, Grenzbelastung und die Sparplan-Projektion über 20 Jahre für vier gängige Erhöhungsgrößen – gerechnet mit 4.000 Euro Ausgangsgehalt, Steuerklasse I, Nordrhein-Westfalen, ohne Kirchensteuer, kinderlos, gesetzlich versichert. Für die eigenen Zahlen rechnen die drei Schritte oben mit den persönlichen Angaben.",
      },
      {
        type: "table",
        caption: "4.000 € brutto, Steuerklasse I, NRW, ohne Kirchensteuer, kinderlos",
        head: ["Erhöhung", "Brutto-Plus", "Netto-Plus", "Grenzbelastung", "Nach 20 Jahren angelegt"],
        rows,
      },
      {
        type: "note",
        text: "Die letzte Spalte unterstellt, dass die gesamte Netto-Differenz monatlich mit den Sparplan-Standardannahmen angelegt wird: 7 Prozent Rendite, 0,2 Prozent laufende Kosten, Abgeltungsteuer. Das ist eine Orientierung, keine Zusage – eine gleichbleibende Rendite gibt es an der Börse nicht.",
      },
    ],
  };
}
