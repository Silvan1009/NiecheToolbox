/**
 * Inhalte der SEO-Unterseiten des Umzugs-Rechners – je Wohnungsgröße eine
 * Seite ("wie viele umzugskartons für 70 qm").
 *
 * Kartonzahlen, Volumen, Fahrzeugklasse und Packzeit kommen aus
 * `calculateMove()` mit genau den Voreinstellungen der Seite. Zusätzlich
 * rechnet jede Seite die Zwei-Fahrten-Variante mit: Ab 70 Quadratmetern
 * empfiehlt der Rechner für eine einzige Fahrt einen 7,5-Tonner, und den darf
 * ohne Führerschein der Klasse C1 niemand fahren, der ihn nach 1999 gemacht
 * hat. Diese Einschränkung gehört in den Text und nicht ins Kleingedruckte.
 */

import { formatAmount, formatInteger, plural } from "@/lib/format";
import type { VariantContent } from "@/tools/variants";
import { calculateMove, type MoveResult } from "./logic";

/** Die Wohnungsgrößen, nach denen konkret gesucht wird. */
const SIZES: { area: number; people: number; label: string; typ: string }[] = [
  {
    area: 30,
    people: 1,
    label: "1-Zimmer-Wohnung (30 m²)",
    typ: "Einzimmerwohnung",
  },
  {
    area: 50,
    people: 1,
    label: "2-Zimmer-Wohnung (50 m²)",
    typ: "Zweizimmerwohnung",
  },
  {
    area: 70,
    people: 2,
    label: "3-Zimmer-Wohnung (70 m²)",
    typ: "Dreizimmerwohnung",
  },
  {
    area: 90,
    people: 3,
    label: "4-Zimmer-Wohnung (90 m²)",
    typ: "Vierzimmerwohnung",
  },
  { area: 120, people: 4, label: "Haus mit 120 m²", typ: "Haus" },
];

/** Die Voreinstellungen, mit denen die Variantenseite den Rechner startet. */
function rechne(area: number, people: number, trips: number): MoveResult {
  return calculateMove({
    area,
    people,
    style: "normal",
    shelfMetres: 6,
    wardrobeMetres: 1.5,
    hasBasement: true,
    trips,
  });
}

function seite(size: (typeof SIZES)[number]): VariantContent {
  const { area, people, label, typ } = size;
  const eine = rechne(area, people, 1);
  const zwei = rechne(area, people, 2);

  const volumen = formatAmount(eine.volume);
  const kartons = formatInteger(eine.totalBoxes);
  const stunden = formatInteger(eine.packingHours);

  // Der 7,5-Tonner und alles darüber setzt einen Führerschein voraus, den die
  // meisten nicht haben – dann ist die Zwei-Fahrten-Variante die echte Antwort.
  const brauchtC1 = eine.van.volume >= 40;
  const zweiHilft = brauchtC1 && zwei.van.volume < 40;

  const fahrzeugSatz = brauchtC1
    ? `Für eine einzige Fahrt bräuchtest du einen ${eine.van.label} – und damit einen Führerschein der Klasse C1, den nur hat, wer ihn vor 1999 gemacht hat. ${
        zweiHilft
          ? `Mit zwei Fahrten reicht ein ${zwei.van.label} mit ${formatInteger(zwei.van.volume)} m³, und der ist mit dem normalen Autoführerschein zu fahren. Das ist für die meisten die praktikable Lösung: Ein Mietfahrzeug kostet pro Tag, nicht pro Fahrt.`
          : `Auch mit zwei Fahrten bleibt es bei einem ${zwei.van.label}. Bei dieser Menge ist eine Umzugsfirma meist die einzige praktikable Lösung – oder jemand im Bekanntenkreis mit der passenden Fahrerlaubnis.`
      }`
    : `Damit reicht ein ${eine.van.label} mit ${formatInteger(eine.van.volume)} m³ Laderaum für eine Fahrt – zu fahren mit dem normalen Autoführerschein der Klasse B, solange das Fahrzeug unter 3,5 Tonnen bleibt.`;

  return {
    slug: `${area}-qm`,
    title: `Wie viele Umzugskartons für ${area} m²?`,
    description: `Für eine ${label} rechnet der Planer mit rund ${kartons} Kartons und ${volumen} m³ Umzugsgut. Mit Fahrzeugklasse, Packmaterial und Packzeit.`,
    heading: `Umzugskartons für ${label}`,
    params: { qm: area, personen: people },
    about: [
      `Für eine ${typ} mit ${area} Quadratmetern und ${people} ${plural(people, "Person", "Personen")} rechnet der Planer mit rund ${kartons} Kartons: ${eine.boxes} Standardkartons, ${eine.bookBoxes} Bücherkartons und ${eine.wardrobeBoxes} Kleiderboxen. Die Aufteilung ist kein Detail – Bücher gehören in kleine Kartons, weil ein Standardkarton voller Bücher 40 Kilo wiegt und beim Tragen ausreißt, und Kleidung auf Bügeln braucht Höhe statt Fläche.`,
      `Das Gesamtvolumen liegt bei etwa ${volumen} Kubikmetern, Keller und Möbel eingerechnet. Nur ${formatAmount(eine.boxVolume)} m³ davon stecken in den Kartons – der große Rest sind Schränke, Betten, Sofa und Tisch. Wer für eine Umzugsfirma ein Angebot einholt, wird nach genau dieser Kubikmeterzahl gefragt, nicht nach der Kartonzahl. ${fahrzeugSatz}`,
      `An Packmaterial gehen rund ${formatInteger(eine.packingPaperSheets)} Blatt Packpapier und ${eine.tapeRolls} ${plural(eine.tapeRolls, "Rolle", "Rollen")} Klebeband mit. Für die Packzeit setzt der Rechner zwölf Minuten je Karton an – Suchen, Einwickeln und Beschriften eingerechnet. Bei ${kartons} Kartons sind das ${stunden} Stunden, also realistisch ${eine.packingHours <= 8 ? "ein gut gefüllter Tag" : eine.packingHours <= 14 ? "zwei Tage oder mehrere Abende" : "ein ganzes Wochenende plus mehrere Abende davor"}. Küche und Keller dauern überproportional lange, Kleiderschränke gehen schnell.`,
      `Diese Zahlen sind Erfahrungswerte aus durchschnittlicher Einrichtung, keine Messung. Wie viel jemand auf ${area} Quadratmetern besitzt, schwankt erheblich: Eine Wohnung, die seit zehn Jahren bewohnt wird, enthält deutlich mehr als eine, in die vor zwei Jahren jemand eingezogen ist. Die Einstellung „Wie viel besitzt du?“ oben verschiebt das Ergebnis in beide Richtungen; die Annahmen stehen offen unter dem Ergebnis.`,
    ],
    faq: [
      {
        question: `Wie viele Umzugskartons brauche ich für ${area} m²?`,
        answer: `Rund ${kartons} Stück: ${eine.boxes} Standardkartons, ${eine.bookBoxes} Bücherkartons für etwa sechs laufende Regalmeter und ${eine.wardrobeBoxes} Kleiderboxen für anderthalb Meter Kleiderstange. Kaufe eher fünf zu viel – leere Kartons lassen sich zurückgeben oder weiterverkaufen, ein zweiter Weg zum Baumarkt am Umzugstag kostet mehr Zeit als die Kartons wert sind.`,
      },
      {
        question: `Wie viel Volumen hat ein Umzug von ${area} m²?`,
        answer: `Etwa ${volumen} Kubikmeter inklusive Möbel und Keller. Die Faustregel dahinter: rund 0,25 m³ je Quadratmeter Wohnfläche bei durchschnittlicher Einrichtung, plus ein Sechstel, wenn Keller, Dachboden oder Garage mitkommen. Diese Zahl brauchst du für jede Anfrage bei einer Umzugsfirma – sie ist die Grundlage jedes Angebots.`,
      },
      {
        question: `Welchen Transporter brauche ich für ${area} m²?`,
        answer: brauchtC1
          ? `Für eine Fahrt einen ${eine.van.label} mit ${formatInteger(eine.van.volume)} m³ – dafür ist ein Führerschein der Klasse C1 nötig. ${zweiHilft ? `Mit zwei Fahrten genügt ein ${zwei.van.label} (${formatInteger(zwei.van.volume)} m³), zu fahren mit Klasse B.` : `Auch bei zwei Fahrten bleibt es bei einem Fahrzeug dieser Größe.`} Stell oben die Zahl der Fahrten ein, dann rechnet der Planer die Klasse entsprechend kleiner.`
          : `Ein ${eine.van.label} mit ${formatInteger(eine.van.volume)} m³ reicht für eine Fahrt bei ${volumen} m³ Umzugsgut. Als Größenordnung: Ein kurzer 3,5-Tonner fasst rund 8 m³, ein langer 12 m³, einer mit Hochdach bis 20 m³. Alles darüber ist ein Lkw und braucht eine eigene Fahrerlaubnis.`,
      },
      {
        question: `Wie lange dauert das Packen bei ${area} m²?`,
        answer: `Etwa ${stunden} Stunden bei ${kartons} Kartons, gerechnet mit zwölf Minuten je Karton. Das klingt viel, ist aber realistisch: Die Zeit geht nicht ins Packen selbst, sondern ins Aussortieren, Einwickeln und Beschriften. Fang vier Wochen vorher mit Keller, Dachboden und allem an, was du bis zum Umzug nicht brauchst – dann bleiben für die letzten Tage nur Küche, Bad und Kleidung.`,
      },
    ],
  };
}

export const variantenTexte: VariantContent[] = SIZES.map(seite);
