import { CakeSlice } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { backformAffiliate } from "./affiliate";
import { buildUebersichtSection } from "./uebersicht";

const about: string[] = [
  "Das Rezept ist für eine 26er-Springform, im Schrank steht eine 20er. Der Reflex ist, die Mengen zu dritteln oder zu halbieren – beides ist falsch. Entscheidend ist nicht der Durchmesser, sondern die Fläche, und die wächst im Quadrat: Eine 26er-Form hat nicht 30 Prozent mehr Platz als eine 20er, sondern 69 Prozent.",
  "Der Rechner nimmt dir beides ab: Er nennt den Faktor und rechnet eine eingefügte Zutatenliste Zeile für Zeile mit. Dabei rundet er auf Maße, die sich abmessen lassen – Gramm auf ganze Zahlen, Löffel auf Viertel, Eier auf halbe, denn ein halbes Ei lässt sich verquirlt abmessen, ein Viertel Päckchen Backpulver nicht.",
  "Beim Wechsel der Bauart zählt zusätzlich die Teighöhe. Eine Kastenform ist deutlich tiefer als eine Springform, ein Backblech viel flacher. Deshalb rechnet dieser Rechner über das Teigvolumen und nicht nur über die Grundfläche: Ein Rezept für eine 26er-Springform passt fast unverändert in eine 30er Kastenform, obwohl deren Grundfläche kleiner ist. Zwischen zwei Formen derselben Bauart kürzt sich die Höhe heraus – dort ist das Ergebnis reine Geometrie.",
  "Die angenommenen Teighöhen stehen offen unter jedem Formularfeld: 3,5 cm für flache Formen, 6,5 cm für die Kastenform, 1,8 cm fürs Blech und 75 ml je Muffinmulde. Wer es genauer weiß, kann die Maße direkt anpassen.",
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie rechne ich ein Rezept auf eine andere Formgröße um?",
    answer:
      "Über das Verhältnis der Flächen, also der Quadrate der Durchmesser. Von einer 26er auf eine 20er Springform: 20² geteilt durch 26² ergibt 0,59. Alle Mengen werden mit 0,59 multipliziert, also rund 41 Prozent weniger. Aus 250 g Mehl werden 148 g, aus vier Eiern zweieinhalb. Halbieren wäre zu wenig, ein Drittel abziehen deutlich zu viel.",
  },
  {
    question: "Warum reicht der Durchmesser nicht als Verhältnis?",
    answer:
      "Weil der Teig eine Fläche bedeckt, keine Linie. Verdoppelst du den Durchmesser, vervierfacht sich die Fläche. Zwischen einer 20er und einer 26er liegen nur sechs Zentimeter, aber 69 Prozent mehr Platz. Genau hier gehen die meisten Umrechnungen im Kopf schief.",
  },
  {
    question: "Passt ein Springform-Rezept in eine Kastenform?",
    answer:
      "Oft überraschend gut. Eine Kastenform hat eine kleinere Grundfläche, ist aber viel tiefer, sodass sich das weitgehend ausgleicht: Ein Rezept für eine 26er-Springform passt fast unverändert in eine 30-cm-Kastenform. Weil der Teig dort höher steht, braucht er allerdings länger und sollte etwas niedriger gebacken werden – sonst ist der Rand fertig, bevor die Mitte durch ist.",
  },
  {
    question: "Ändert sich die Backzeit, wenn ich die Form wechsle?",
    answer:
      "Innerhalb derselben Bauart kaum: Wenn die Mengen mitwachsen, bleibt die Teighöhe gleich, und die bestimmt die Backzeit. Beim Wechsel der Bauart schon – flacher heißt schneller, tiefer heißt länger. Der Rechner weist darauf hin, wenn sich die Höhe deutlich ändert. Verlass dich in jedem Fall auf die Stäbchenprobe und nicht auf die Uhr.",
  },
  {
    question: "Wie viele Muffins ergibt ein Kuchenrezept?",
    answer:
      "Stell als Zielform „Muffins“ ein, dann rechnet der Rechner mit 75 ml Teig pro Mulde. Ein Rezept für eine 26er-Springform ergibt so etwa 25 Muffins, eines für eine 20er rund 15. Muffins sind deutlich schneller fertig als ein ganzer Kuchen: 20 bis 25 Minuten statt 50 bis 60.",
  },
  {
    question: "Was passiert mit Backpulver, Hefe und Gewürzen?",
    answer:
      "Sie werden wie alles andere skaliert, aber auf abmessbare Maße gerundet – Päckchen auf ganze, Teelöffel auf Viertel. Bei starkem Verkleinern kann daraus ein krummes Ergebnis werden; solche Zeilen sind als „gerundet“ markiert. Ein Päckchen Backpulver auf 500 g Mehl ist die übliche Faustregel, daran kannst du das Ergebnis gegenprüfen.",
  },
  {
    question: "Bleibt meine Zutatenliste privat?",
    answer:
      "Ja. Die Formen und Maße stehen in der Adresszeile, damit du das Ergebnis teilen kannst – der eingefügte Text nicht. Er wird nur in deinem Browser verarbeitet und nirgends gespeichert oder übertragen.",
  },
];

/**
 * Der ausführliche Teil unter dem Einstieg – Teighöhen als Tabelle statt nur
 * im Fließtext, plus die Grenzen des Modells: Was reine Geometrie nicht
 * abbildet (Material, Farbe, Umluft, Höhenlage).
 */
const sections: ContentSection[] = [
  {
    heading: "Teighöhen der Standardformen",
    blocks: [
      {
        type: "p",
        text: "Diese Werte stehen auch offen unter jedem Formularfeld im Rechner und lassen sich dort anpassen, falls deine Form abweicht.",
      },
      {
        type: "table",
        caption: "Angenommene Teighöhe je Bauart",
        head: ["Bauart", "Teighöhe"],
        rows: [
          ["Springform (rund oder quadratisch)", "3,5 cm"],
          ["Rechteckig", "3,5 cm"],
          ["Kastenform", "6,5 cm"],
          ["Backblech", "1,8 cm"],
          ["Muffinmulde", "75 ml je Mulde"],
        ],
      },
    ],
  },
  {
    heading: "Grenzen des Modells",
    blocks: [
      {
        type: "p",
        text: "Die Umrechnung selbst ist reine Geometrie – Fläche beziehungsweise Volumen der Form. Wie lange und bei welcher Temperatur der Teig darin gart, hängt aber auch von Dingen ab, die sich nicht messen lassen: Dunkle oder mattschwarze Formen nehmen mehr Wärme auf als helle, blanke, Umluft backt gleichmäßiger, aber oft etwas schneller als Ober- und Unterhitze, und in größerer Höhenlage verdunstet Flüssigkeit schneller.",
      },
      {
        type: "note",
        text: "Der Rechner liefert die Mengen, nicht die Backzeit. Stell den Timer eher zu kurz als zu lang und prüfe mit der Stäbchenprobe – gerade beim ersten Versuch in einer neuen Form.",
      },
    ],
  },
  {
    heading: "Die Flächenformeln dahinter",
    blocks: [
      {
        type: "table",
        caption: "Grundfläche je Bauart",
        head: ["Bauart", "Formel"],
        rows: [
          ["Rund", "π × Radius²"],
          ["Quadratisch", "Seitenlänge²"],
          ["Rechteckig, Kastenform, Blech", "Länge × Breite"],
        ],
      },
      {
        type: "note",
        text: "Bei Muffins zählt statt einer Fläche direkt die Anzahl der Mulden zu je 75 Milliliter – deshalb steht dort im Rechner ein Zähler statt zweier Maße. Bei allen anderen Bauarten multipliziert sich diese Grundfläche mit der jeweiligen Teighöhe zum Volumen, und genau dieses Volumen – nicht die Fläche allein – ist die Größe, die beim Wechsel der Bauart wirklich zählt.",
      },
    ],
  },
  buildUebersichtSection(),
];

export const backform: ToolManifest = {
  slug: "backform",
  name: "Backform-Umrechner",
  tagline:
    "Rezept für eine andere Form? Faktor berechnen und die ganze Zutatenliste mit umrechnen.",
  seoTitle: "Backform umrechnen: Rezept auf andere Formgröße",
  metaDescription:
    "Rezept von einer Backform auf eine andere umrechnen: Faktor für runde und eckige Formen berechnen und die ganze Zutatenliste automatisch anpassen.",
  category: "essen",
  icon: CakeSlice,
  status: "live",
  keywords: [
    "backform umrechnen",
    "springform umrechnen",
    "26 auf 20 backform",
    "rezept umrechnen",
    "backform größe",
    "kastenform springform",
    "zutaten umrechnen",
  ],

  about,
  sections,
  faq: sharedFaq,

  monetization: {
    adDensity: "low",
    affiliate: backformAffiliate,
  },
};
