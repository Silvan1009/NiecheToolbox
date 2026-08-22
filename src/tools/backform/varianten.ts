/**
 * Inhalte der SEO-Unterseiten des Backform-Umrechners – je gesuchtem
 * Formpaar eine Seite ("backform 26 auf 20").
 *
 * Faktor, Prozentangabe und die umgerechneten Beispielmengen kommen aus
 * `convertForm()` mit genau den Voreinstellungen der Seite. Wer den Text liest
 * und dann die Zutatenliste einfügt, bekommt dieselben Zahlen.
 */

import { formatAmount, formatRate } from "@/lib/format";
import type { FaqEntry } from "@/tools/types";
import type { VariantContent } from "@/tools/variants";
import { convertForm, type ConversionResult } from "./logic";

/** Die Umrechnungen, nach denen am häufigsten gesucht wird. */
const COMMON_PAIRS: [number, number][] = [
  [26, 20],
  [26, 18],
  [26, 24],
  [26, 28],
  [24, 20],
  [24, 26],
  [22, 26],
  [20, 26],
  [18, 26],
  [28, 26],
];

/**
 * Das Beispielrezept, an dem jede Seite die Umrechnung vorführt – ein
 * gewöhnlicher Rührteig, wie er in deutschen Rezepten steht.
 */
const BEISPIEL = [
  "250 g Mehl",
  "200 g Zucker",
  "200 g weiche Butter",
  "4 Eier",
  "1 Pck Backpulver",
  "100 ml Milch",
].join("\n");

/* ---------------------------------------------------------------------------
 * Fakten je Formpaar
 * ------------------------------------------------------------------------- */

interface Fakten {
  von: number;
  zu: number;
  ergebnis: ConversionResult;
  /** "0,59" */
  faktor: string;
  /** Betrag der Abweichung in Prozent, gerundet. */
  prozent: number;
  kleiner: boolean;
  /** Umgerechnete Zeilen als Text, in der Reihenfolge des Beispielrezepts. */
  zeilen: string[];
  /** Teigmenge der Zielform in Litern, "1,1". */
  literZu: string;
  literVon: string;
}

function faktenFor(von: number, zu: number): Fakten {
  const ergebnis = convertForm({
    source: { kind: "rund", a: von, b: 0, count: 0 },
    target: { kind: "rund", a: zu, b: 0, count: 0 },
    ingredients: BEISPIEL,
  });

  return {
    von,
    zu,
    ergebnis,
    faktor: formatRate(ergebnis.factor),
    prozent: Math.round(Math.abs(ergebnis.percentDelta)),
    kleiner: ergebnis.factor < 1,
    zeilen: ergebnis.ingredients.map((zutat) => zutat.text),
    literZu: formatAmount(Math.round(ergebnis.targetVolume / 100) / 10),
    literVon: formatAmount(Math.round(ergebnis.sourceVolume / 100) / 10),
  };
}

/* ---------------------------------------------------------------------------
 * Seiteninhalt
 * ------------------------------------------------------------------------- */

function about(fakten: Fakten): string[] {
  const { von, zu, faktor, prozent, kleiner, zeilen } = fakten;

  const geometrie = `Der Faktor ist ${faktor}: Jede Menge im Rezept wird damit multipliziert, unter dem Strich ${kleiner ? `rund ${prozent} Prozent weniger` : `rund ${prozent} Prozent mehr`}. Er ergibt sich nicht aus den Durchmessern, sondern aus deren Quadraten – ${zu} mal ${zu} geteilt durch ${von} mal ${von}. Der Teig bedeckt eine Fläche, und die wächst im Quadrat: Zwischen Ø ${von} und Ø ${zu} cm liegen nur ${Math.abs(von - zu)} Zentimeter, aber ${prozent} Prozent ${kleiner ? "weniger" : "mehr"} Platz.`;

  const beispiel = `Ein gewöhnlicher Rührteig aus 250 g Mehl, 200 g Zucker, 200 g weicher Butter, 4 Eiern, einem Päckchen Backpulver und 100 ml Milch wird damit zu: ${zeilen.join(", ")}. Genau diese Liste bekommst du, wenn du dein Rezept oben in das Textfeld einfügst – Zeile für Zeile, mit den Mengen, die auf einer Küchenwaage auch abmessbar sind.`;

  const eierZeile = zeilen[3];
  const halbesEi = eierZeile.includes("½");

  const praxis = [
    halbesEi
      ? `Die halben Eier in dieser Rechnung sind kein Rundungsfehler, sondern Absicht: Ein Ei wiegt ohne Schale rund 55 Gramm. Verquirl eines und wieg die Hälfte ab, dann stimmt das Verhältnis von Bindung zu Mehl. Auf ganze Eier aufzurunden macht den Teig fester und trockener, abzurunden krümeliger.`
      : `Die Eier gehen in dieser Rechnung glatt auf – das ist der angenehme Fall. Wo eine halbe Zahl herauskäme, verquirlst du ein Ei und wiegst die Hälfte ab; ein Ei wiegt ohne Schale rund 55 Gramm.`,
    `Beim Backpulver wird auf ganze Päckchen gerundet, weil sich ein Bruchteil eines Päckchens nicht sinnvoll abmessen lässt. Die Faustregel zum Gegenprüfen: ein Päckchen auf 500 g Mehl. Zeilen, bei denen die Rundung ins Gewicht fällt, sind im Ergebnis ausdrücklich als gerundet markiert.`,
    `An der Backzeit ändert sich zwischen zwei Springformen wenig: Wenn die Mengen mitwachsen, bleibt die Teighöhe gleich, und die bestimmt, wie lange der Kuchen braucht. In die Ø-${zu}-Form passen rund ${fakten.literZu} Liter Teig, in die Ø-${von}-Form ${fakten.literVon} Liter. Verlass dich trotzdem auf die Stäbchenprobe und nicht auf die Uhr.`,
  ];

  if (fakten.ergebnis.warnings.length > 0) {
    praxis.push(fakten.ergebnis.warnings.join(" "));
  }

  // Zweites, unabhängiges Zahlenbeispiel: Der Faktor gilt für jede Menge,
  // nicht nur für das Beispielrezept oben – hier an 500 g Mehl vorgeführt,
  // echt aus demselben ConversionResult gerechnet statt hingeschrieben.
  const faktorZahl = fakten.ergebnis.factor;
  const generalisierung = `Der Faktor ${faktor} gilt dabei für jede Menge in jedem Rezept für eine Ø-${von}-Form, nicht nur für das Beispiel oben: Aus 500 g Mehl würden ${formatAmount(Math.round(500 * faktorZahl))} g, aus 1 kg Äpfeln ${formatAmount(Math.round(1000 * faktorZahl))} g. Trag deine eigene Zutatenliste oben ins Textfeld ein, dann wendet der Rechner genau diesen Faktor Zeile für Zeile an.`;

  // Absolute Flächendifferenz in cm² – dieselbe Geometrie wie der Faktor,
  // nur als Zahl statt als Verhältnis. Rein aus von/zu gerechnet, nicht aus
  // dem Rechner übernommen, weil die Grundfläche selbst dort nicht ausgewiesen
  // wird.
  // Auf die bereits gerundeten Flächen bezogen, nicht auf die exakten Werte –
  // sonst geht die im Text gezeigte Subtraktion (Ø-zu minus Ø-von) nicht mehr
  // exakt auf, wenn beide Flächen einzeln gerundet dastehen.
  const flaecheVonGerundet = Math.round(Math.PI * (von / 2) ** 2);
  const flaecheZuGerundet = Math.round(Math.PI * (zu / 2) ** 2);
  const flaechenDiff = Math.abs(flaecheZuGerundet - flaecheVonGerundet);
  const flaechenSatz = `In Quadratzentimetern ausgedrückt: Die Ø-${von}-Form hat rund ${flaecheVonGerundet} cm² Grundfläche, die Ø-${zu}-Form rund ${flaecheZuGerundet} cm² – ein Unterschied von ${flaechenDiff} cm², also mehr als nur die ${Math.abs(von - zu)} Zentimeter Differenz im Durchmesser vermuten lassen.`;

  return [
    `Ein Rezept ist für eine Springform mit Ø ${von} cm gedacht, im Schrank steht eine mit Ø ${zu} cm. ${geometrie}`,
    beispiel,
    praxis.join(" "),
    `${generalisierung} ${flaechenSatz}`,
  ];
}

function faq(fakten: Fakten): FaqEntry[] {
  const { von, zu, faktor, prozent, kleiner, zeilen } = fakten;

  return [
    {
      question: `Wie rechne ich ein Rezept von ${von} cm auf ${zu} cm um?`,
      answer: `Multipliziere alle Mengen mit ${faktor}. Der Faktor ist das Verhältnis der Flächen, also ${zu}² geteilt durch ${von}² – nicht das der Durchmesser. Aus 250 g Mehl werden so ${zeilen[0].replace(" Mehl", "")}, aus 4 Eiern ${zeilen[3].replace(" Eier", "").replace(" Ei", "")}. Insgesamt brauchst du ${kleiner ? `rund ${prozent} Prozent weniger` : `rund ${prozent} Prozent mehr`} Teig.`,
    },
    {
      question: `Wie viel Teig passt in eine Springform mit ${zu} cm?`,
      answer: `Rund ${fakten.literZu} Liter, gerechnet mit einer Teighöhe von 3,5 cm. Zum Vergleich: In eine Ø-${von}-Form passen ${fakten.literVon} Liter. Die Höhe ist die einzige Annahme in dieser Rechnung – und sie kürzt sich zwischen zwei Springformen wieder heraus, weil sie bei beiden gleich ist. Zwischen zwei runden Formen ist das Ergebnis deshalb exakte Geometrie.`,
    },
    {
      question: `Warum kann ich die Mengen nicht einfach im Verhältnis ${von} zu ${zu} umrechnen?`,
      answer: `Weil der Teig eine Fläche bedeckt und keine Linie. Das Verhältnis der Durchmesser wäre ${formatRate(zu / von)}, richtig ist aber ${faktor} – das Quadrat davon. Bei ${von} auf ${zu} cm ist der Unterschied zwischen beiden Rechenwegen groß genug, dass der Kuchen sichtbar zu ${kleiner ? "hoch" : "flach"} wird. Genau an dieser Stelle gehen die meisten Umrechnungen im Kopf schief.`,
    },
    {
      question: `Muss ich die Backzeit anpassen, wenn ich von ${von} auf ${zu} cm wechsle?`,
      answer: `Kaum. Beide Formen sind 3,5 cm tief, und wenn die Mengen mit dem Faktor ${faktor} mitwachsen, steht der Teig in der Ø-${zu}-Form genauso hoch wie vorher in der Ø-${von}-Form – die Teighöhe bestimmt die Backzeit, nicht der Durchmesser. Plane trotzdem ${kleiner ? "fünf bis zehn Minuten weniger" : "fünf bis zehn Minuten mehr"} ein, weil ${kleiner ? `die kleinere Form die Wärme schneller bis in die Mitte trägt` : `die größere Form länger braucht, bis die Mitte durch ist`}, und prüfe mit einem Holzstäbchen. Anders ist es beim Wechsel der Bauart: Eine Kastenform ist mit 6,5 cm deutlich tiefer, ein Blech mit 1,8 cm viel flacher.`,
    },
    {
      question: `Funktioniert der Faktor ${faktor} auch für ein anderes Rezept als das Beispiel?`,
      answer: `Ja – der Faktor hängt nur von den beiden Formgrößen ab, ${von} cm und ${zu} cm, nicht vom Rezept. Aus 500 g Mehl würden damit ${formatAmount(Math.round(500 * fakten.ergebnis.factor))} g, aus 1 kg Äpfeln ${formatAmount(Math.round(1000 * fakten.ergebnis.factor))} g. Am schnellsten geht es trotzdem über das Textfeld oben: Rezept einfügen, Formen einstellen, fertig umgerechnet.`,
    },
  ];
}

/* ---------------------------------------------------------------------------
 * Aufbau
 * ------------------------------------------------------------------------- */

export const variantenTexte: VariantContent[] = COMMON_PAIRS.map(
  ([von, zu]) => {
    const fakten = faktenFor(von, zu);

    return {
      slug: `${von}-auf-${zu}`,
      title: `Backform ${von} cm auf ${zu} cm umrechnen`,
      description: `Rezept für eine ${von}-cm-Springform, aber nur eine ${zu}-cm-Form da? Der Faktor ist ${fakten.faktor} – ${fakten.kleiner ? `rund ${fakten.prozent} % weniger` : `rund ${fakten.prozent} % mehr`}. Mit Umrechnung der ganzen Zutatenliste.`,
      heading: `Von Ø ${von} cm auf Ø ${zu} cm`,
      params: { vonForm: "rund", vonA: von, zuForm: "rund", zuA: zu },
      about: about(fakten),
      faq: faq(fakten),
    };
  },
);
