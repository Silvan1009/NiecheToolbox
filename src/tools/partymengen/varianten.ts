/**
 * Inhalte der SEO-Unterseiten des Party- und Grillmengen-Rechners – je
 * Gästezahl eine Seite ("grillen für 20 personen mengen").
 *
 * Alle Mengen im Text kommen aus `calculateParty()` mit genau den
 * Voreinstellungen der Seite: Grillen, vier Stunden, 20 Prozent Vegetarier,
 * Alkohol dabei. Wer den Text liest und dann auf die Einkaufsliste schaut,
 * findet dieselben Zahlen.
 */

import { formatAmount, formatInteger } from "@/lib/format";
import type { VariantContent } from "@/tools/variants";
import { calculateParty, type PartyItem, type PartyResult } from "./logic";

const GUEST_COUNTS = [10, 15, 20, 30, 50];

/** Voreinstellungen der Seite – dieselben, mit denen der Rechner startet. */
const STUNDEN = 4;
const VEGGIE_PROZENT = 20;

/** Ab dieser Gästezahl wird ein einzelner Grill zum Nadelöhr (siehe logic.ts). */
const GRILL_GRENZE = 25;

function menge(item: PartyItem | undefined): string {
  if (!item) return "";
  return item.unit === "Stück"
    ? `${formatInteger(item.amount)} Stück`
    : `${formatAmount(item.amount)} ${item.unit}`;
}

function finde(result: PartyResult, key: string): PartyItem | undefined {
  return [...result.food, ...result.drinks, ...result.supplies].find(
    (item) => item.key === key,
  );
}

function seite(gaeste: number): VariantContent {
  const r = calculateParty({
    adults: gaeste,
    children: 0,
    hours: STUNDEN,
    occasion: "grillen",
    vegetarianPercent: VEGGIE_PROZENT,
    alcohol: true,
    heartyEaters: false,
  });

  const fleisch = r.primary;
  const veggie = r.food[1];
  const salate = finde(r, "salat") ?? r.food[2];
  const brot = finde(r, "brot") ?? r.food[3];
  const alkoholfrei = r.drinks[0];
  const bier = r.drinks[1];
  const wein = r.drinks[2];
  const kohle = r.supplies[0];
  const eis = r.supplies[1];
  const teller = finde(r, "teller") ?? r.supplies[2];

  const grillEng = gaeste >= GRILL_GRENZE;

  // Was ein einzelner Kugelgrill in einem Durchgang schafft: acht bis zehn
  // Portionen in 15 bis 20 Minuten.
  const durchgaenge = Math.ceil(gaeste / 9);

  return {
    slug: `grillen-fuer-${gaeste}-personen`,
    title: `Grillen für ${gaeste} Personen: Mengen berechnen`,
    description: `Für ${gaeste} Personen rechnet der Planer mit ${menge(fleisch)} Fleisch, ${menge(salate)} Salat und ${menge(bier)} Bier. Mit Brot, Kohle, Geschirr und fertiger Einkaufsliste.`,
    heading: `Grillen für ${gaeste} Personen`,
    params: { anlass: "grillen", erwachsene: gaeste },
    about: [
      `Für ${gaeste} erwachsene Gäste an einem vierstündigen Grillabend rechnet der Planer mit ${menge(fleisch)} Fleisch und Würstchen, dazu ${menge(veggie)} Vegetarisches bei einem Anteil von ${VEGGIE_PROZENT} Prozent. Grundlage sind 350 Gramm je Person – die übliche Faustregel, wenn es Beilagen und Brot dazu gibt. Ohne nennenswerte Beilagen wären eher 400 bis 500 Gramm richtig; dafür ist der Schalter für kräftige Esser da, der ein Viertel auf das Essen legt, ohne die Getränke anzufassen.`,
      `Dazu kommen ${menge(salate)} Salate und Beilagen sowie ${menge(brot)} Brot oder Brötchen. Bei den Salaten kommen mehrere kleine Schüsseln besser an als eine große: Die Auswahl wirkt größer, und wenn etwas übrig bleibt, ist es meist nur eine Sorte. Für ${gaeste} Personen sind zwei bis drei Sorten die richtige Zahl – Kartoffel- und Nudelsalat sättigen dabei deutlich stärker als Blattsalate, davon reicht entsprechend weniger.`,
      `Bei den Getränken ist die Dauer entscheidend, nicht die Gästezahl allein: Wer sechs Stunden bleibt, isst nicht doppelt so viel wie in drei Stunden – aber er trinkt doppelt so viel. Für vier Stunden ergeben sich ${menge(alkoholfrei)} Wasser und Softdrinks, ${menge(bier)} Bier und ${menge(wein)} Wein. An einem heißen Tag verdoppelt sich der alkoholfreie Anteil erfahrungsgemäß. Rechne außerdem damit, dass gut ein Viertel der Erwachsenen keinen Alkohol trinkt – die Menge alkoholfreier Getränke ist die, bei der am häufigsten zu knapp eingekauft wird.`,
      grillEng
        ? `Bei ${gaeste} Gästen ist nicht die Einkaufsmenge das Problem, sondern der Grill. Ein üblicher Kugelgrill schafft acht bis zehn Portionen gleichzeitig, ein Durchgang dauert 15 bis 20 Minuten – bei ${gaeste} Leuten wären das ${durchgaenge} Durchgänge und damit rund ${durchgaenge * 20} Minuten, in denen die erste Hälfte längst satt dasitzt, während die zweite noch wartet. Zwei Grills, ein im Ofen vorgegartes Hauptgericht oder ein Buffet mit kalten Komponenten lösen das zuverlässig. An Material gehen ${menge(kohle)} Grillkohle, ${menge(eis)} Eis zum Kühlen und ${menge(teller)} Teller mit.`
        : `An Material gehen ${menge(kohle)} Grillkohle, ${menge(eis)} Eis zum Kühlen und ${menge(teller)} Teller mit – bei Tellern und Gläsern wird großzügig gerechnet, weil im Lauf des Abends fast jeder ein zweites nimmt. Die Kohlemenge ist bewusst reichlich angesetzt: Nachkaufen ist am Grillabend keine Option, und ein geöffneter Sack hält sich trocken gelagert bis zum nächsten Mal. Ein einzelner Kugelgrill reicht für ${gaeste} Gäste noch gut aus; ab etwa ${GRILL_GRENZE} wird er zum Nadelöhr.`,
    ],
    faq: [
      {
        question: `Wie viel Fleisch für ${gaeste} Personen zum Grillen?`,
        answer: `${menge(fleisch)} bei 350 Gramm je Erwachsenem, plus ${menge(veggie)} Vegetarisches für ${VEGGIE_PROZENT} Prozent der Runde. Wenn Beilagen knapp sind oder die Runde hungrig, rechne mit 400 bis 500 Gramm – das sind dann rund ${formatAmount((gaeste * 450) / 1000)} kg. Kinder zählen als halbe Portion; trage sie oben getrennt ein.`,
      },
      {
        question: `Wie viele Getränke für ${gaeste} Personen?`,
        answer: `Für vier Stunden: ${menge(alkoholfrei)} Wasser und Softdrinks, ${menge(bier)} Bier und ${menge(wein)} Wein. Das sind ${menge(bier)} Bier – umgerechnet etwa ${formatInteger(Math.round((bier?.amount ?? 0) / 0.5))} Flaschen zu 0,5 Litern. Bei einer längeren Feier steigen nur die Getränke, nicht das Essen: Stell oben die Dauer um, dann rechnet der Planer neu.`,
      },
      {
        question: `Wie viel Salat und Brot für ${gaeste} Personen?`,
        answer: `${menge(salate)} Salate und Beilagen sowie ${menge(brot)} Brot oder Brötchen, also anderthalb Stück je Person. Bei den Salaten sind ${gaeste <= 15 ? "zwei Sorten" : gaeste <= 30 ? "drei Sorten" : "vier Sorten"} eine gute Aufteilung. Wenn Gäste etwas mitbringen wollen, ist der Salat der Posten, bei dem sich das am einfachsten koordinieren lässt – beim Fleisch wird es schnell doppelt.`,
      },
      {
        question: grillEng
          ? `Reicht ein Grill für ${gaeste} Personen?`
          : `Wie viel Grillkohle für ${gaeste} Personen?`,
        answer: grillEng
          ? `Nein, nicht komfortabel. Ein Kugelgrill schafft acht bis zehn Portionen je Durchgang à 15 bis 20 Minuten, für ${gaeste} Gäste wären das ${durchgaenge} Durchgänge. Plane einen zweiten Grill ein, gare Fleisch im Ofen vor oder stell das Konzept auf ein Buffet mit kalten Komponenten um. An Kohle brauchst du bei einem Grill ${menge(kohle)}.`
          : `${menge(kohle)} bei 700 Gramm je Person. Das ist bewusst großzügig gerechnet, weil Nachkaufen am Grillabend keine Option ist und ein geöffneter Sack sich trocken gelagert problemlos hält. Bei einem Gasgrill entfällt der Posten; rechne dort mit etwa einer Füllung der 11-Kilo-Flasche für mehrere Abende dieser Größe.`,
      },
    ],
  };
}

export const variantenTexte: VariantContent[] = GUEST_COUNTS.map(seite);
