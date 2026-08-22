import { PartyPopper } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { partymengenAffiliate } from "./affiliate";
import { variantenTexte } from "./varianten";

const about: string[] = [
  "Die Frage kommt bei jedem Grillfest: Wie viel kauft man ein? Zu wenig ist peinlich, zu viel landet im Müll. Der Rechner nimmt die übliche Faustregel – etwa 350 Gramm Fleisch, 200 Gramm Beilagen und anderthalb Brötchen je Erwachsenem – und rechnet Kinder, Vegetarier und die Dauer mit ein.",
  "Ein Punkt wird dabei fast immer übersehen: Essen und Getränke skalieren unterschiedlich. Wer sechs Stunden bleibt, isst nicht doppelt so viel wie in drei Stunden – aber er trinkt doppelt so viel. Deshalb hängen die Getränke hier an der Dauer und das Essen nur an der Zahl der Gäste.",
  "Kinder zählen als halbe Portion beim Essen und bei den Getränken, beim Geschirr dagegen voll: Einen eigenen Teller braucht jedes Kind. Alkohol wird nur für Erwachsene gerechnet, und der Rechner erinnert daran, dass gut ein Viertel der Erwachsenen keinen trinkt.",
  "Alle Werte sind Erfahrungswerte und stehen als Hinweis unter jeder Zeile. Wer seine Runde kennt, korrigiert nach oben oder unten – der Schalter für kräftige Esser legt ein Viertel auf das Essen, ohne die Getränke anzufassen.",
];

const sections: ContentSection[] = [
  {
    heading: "Essen skaliert mit Gästen, Getränke mit der Zeit",
    blocks: [
      {
        type: "p",
        text: "Konkret gerechnet: Bei 10 Gästen setzt der Rechner für alkoholfreie Getränke 250 Milliliter pro Person und Stunde an. In drei Stunden sind das 7,5 Liter, in sechs Stunden 15 Liter – exakt doppelt so viel, obwohl die Zahl der Gäste gleichbleibt. Die Essensmenge dagegen ändert sich zwischen beiden Fällen nicht, weil sie von der Gästezahl abhängt, nicht von der Feierdauer.",
      },
    ],
  },
  {
    heading: "Kinder und Alkohol getrennt gerechnet",
    blocks: [
      {
        type: "p",
        text: "Bei den alkoholischen Getränken unterscheidet der Rechner zusätzlich zwischen Bier und Wein: Bier ist mit 300 Millilitern pro Person und Stunde angesetzt, Wein mit 150 – Wein wird also nur halb so schnell getrunken wie Bier, entsprechend der üblichen Glasgröße und Trinkgeschwindigkeit.",
      },
      {
        type: "note",
        text: "Diese Verhältnisse sind Durchschnittswerte für eine gemischte Runde. Weiß eine Gastgeberin oder ein Gastgeber, dass die eigene Gesellschaft überwiegend Wein statt Bier trinkt, lässt sich das nur über die Gesamtmenge grob nachjustieren – eine feste Bier-Wein-Aufteilung fragt der Rechner nicht ab.",
      },
    ],
  },
  {
    heading: "Grenzen des Modells",
    blocks: [
      {
        type: "p",
        text: "Die hinterlegten Faustwerte sind auf ein klassisches deutsches Grillfest kalibriert – Fleisch, Salate, Brötchen, Bier und Wein. Für ein rein veganes Buffet, eine Feier mit überwiegend anderen Küchen oder eine Kindergeburtstagsparty ohne Alkoholanteil passen die Grundannahmen weniger gut und sollten stärker über die manuellen Korrekturschalter angepasst werden.",
      },
    ],
  },
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie viel Fleisch braucht man zum Grillen pro Person?",
    answer:
      "Als Faustregel 300 bis 400 Gramm je Erwachsenem, wenn es Beilagen und Brot dazu gibt. Der Rechner setzt 350 Gramm an. Kinder essen etwa die Hälfte. Wenn das Fleisch die einzige Hauptkomponente ist und es wenig Beilagen gibt, rechne eher mit 400 bis 500 Gramm – dafür ist der Schalter für kräftige Esser da.",
  },
  {
    question: "Wie viele Getränke pro Person und Stunde?",
    answer:
      "Etwa einen Viertelliter alkoholfreie Getränke je Person und Stunde, plus rund 0,3 Liter Bier und 0,15 Liter Wein je Erwachsenem und Stunde, der Alkohol trinkt. Bei einem vierstündigen Grillfest sind das pro Erwachsenem rund ein Liter Wasser oder Softdrink und gut ein Liter Bier. An heißen Tagen deutlich mehr – dann eher das Doppelte an alkoholfreien Getränken.",
  },
  {
    question: "Wie viel Salat und Beilagen rechnet man?",
    answer:
      "Rund 200 Gramm je Person, verteilt auf zwei bis drei Sorten. Mehrere kleine Schüsseln kommen besser an als eine große: Die Auswahl wirkt größer, und wenn etwas übrig bleibt, ist es meist nur eine Sorte. Kartoffel- und Nudelsalat sättigen stärker als Blattsalate, davon reicht entsprechend weniger.",
  },
  {
    question: "Wie viel Grillkohle brauche ich?",
    answer:
      "Der Rechner setzt 700 Gramm je Person an, also für zehn Gäste rund sieben Kilo. Das ist bewusst großzügig gerechnet: Kohle nachzukaufen ist am Grillabend keine Option, und geöffnete Säcke halten sich trocken gelagert problemlos bis zum nächsten Mal. Bei einem Gasgrill entfällt der Posten natürlich.",
  },
  {
    question: "Wie viele Kuchenstücke pro Person?",
    answer:
      "Zwei Stück je Person ist die verlässliche Faustregel – die meisten nehmen einmal nach, gerade wenn es mehrere Sorten gibt. Zwei verschiedene Kuchen kommen deshalb besser an als ein großer: Man probiert beide. Ein Blechkuchen ergibt je nach Schnitt 15 bis 20 Stück, eine 26er-Springform etwa 12 bis 16.",
  },
  {
    question: "Ab wann wird ein Grill zu klein?",
    answer:
      "Etwa ab 25 Gästen. Ein üblicher Kugelgrill schafft rund acht bis zehn Portionen gleichzeitig, ein Durchgang dauert 15 bis 20 Minuten – bei 30 Leuten sitzt die erste Hälfte längst satt da, während die zweite noch wartet. Zwei Grills, ein vorgegartes Hauptgericht aus dem Ofen oder ein Buffet mit kalten Komponenten lösen das Problem.",
  },
];

export const partymengen: ToolManifest = {
  slug: "partymengen",
  name: "Party- und Grillmengen",
  tagline:
    "Wie viel Fleisch, Salat und Getränke pro Person? Einkaufsliste für die ganze Runde.",
  category: "essen",
  icon: PartyPopper,
  status: "live",
  keywords: [
    "grillen mengen pro person",
    "wie viel fleisch pro person grillen",
    "party mengen berechnen",
    "getränke pro person party",
    "buffet mengen",
    "grillfest planen",
    "einkaufsliste party",
  ],

  getVariants: () => buildVariants(variantenTexte, about, sharedFaq),

  about,
  sections,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: partymengenAffiliate,
  },
};
