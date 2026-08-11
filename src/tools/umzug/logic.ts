/**
 * Umzugs-Rechner – reine Schätzung.
 *
 * Wichtig zur Einordnung: Das hier sind Erfahrungswerte, keine Messwerte. Wie
 * viele Kartons ein Haushalt braucht, hängt vor allem daran, wie viel jemand
 * besitzt – und das lässt sich aus Quadratmetern nur annähern. Die Annahmen
 * stehen deshalb offen als Konstanten hier und werden in der Oberfläche
 * genannt, damit man sie einschätzen kann.
 *
 * Gerundet wird durchgehend nach oben: Ein Karton zu viel ist ein Ärgernis,
 * ein Karton zu wenig ein zweiter Weg zum Baumarkt.
 */

export type HouseholdStyle = "wenig" | "normal" | "viel";

interface StyleDef {
  label: string;
  hint: string;
  /** Standardkartons je Quadratmeter Wohnfläche. */
  boxesPerSqm: number;
  /** Gesamtvolumen des Umzugsguts je Quadratmeter, in m³ – inklusive Möbel. */
  volumePerSqm: number;
}

/**
 * Die Kartons je Quadratmeter orientieren sich an den Werten, mit denen
 * Umzugsunternehmen kalkulieren: eine 80-m²-Wohnung landet bei 40 bis 60
 * Standardkartons, eine Einzimmerwohnung bei 15 bis 25. Das Gesamtvolumen
 * liegt bei einem vollständigen Haushalt bei etwa 0,2 bis 0,3 m³ je m².
 */
export const householdStyles: Record<HouseholdStyle, StyleDef> = {
  wenig: {
    label: "Eher wenig",
    hint: "Nüchtern eingerichtet, wenig Deko, regelmäßig aussortiert.",
    boxesPerSqm: 0.4,
    volumePerSqm: 0.18,
  },
  normal: {
    label: "Normal",
    hint: "Durchschnittlich möblierter Haushalt.",
    boxesPerSqm: 0.6,
    volumePerSqm: 0.25,
  },
  viel: {
    label: "Eher viel",
    hint: "Volle Schränke, Sammlungen, Keller und Dachboden mit dabei.",
    boxesPerSqm: 0.85,
    volumePerSqm: 0.33,
  },
};

/* --- Fassungsvermögen der üblichen Kartons, in m³ ------------------------ */

/** Standard-Umzugskarton, etwa 65 × 35 × 37 cm. */
const BOX_VOLUME = 0.084;
/** Bücherkarton, etwa 55 × 35 × 30 cm – kleiner, weil Bücher schwer sind. */
const BOOK_BOX_VOLUME = 0.058;
/** Kleiderbox mit Stange, etwa 50 × 60 × 135 cm. */
const WARDROBE_BOX_VOLUME = 0.405;

/** Laufende Regalmeter Bücher, die in einen Bücherkarton passen. */
const SHELF_METRES_PER_BOOK_BOX = 1;
/** Laufende Meter Kleiderstange je Kleiderbox. */
const RAIL_METRES_PER_WARDROBE_BOX = 0.6;

/** Packpapier: Bogen je Karton, für Geschirr und Zerbrechliches. */
const PAPER_SHEETS_PER_BOX = 12;
/** Reichweite einer Rolle Klebeband in Kartons. */
const BOXES_PER_TAPE_ROLL = 15;
/** Packzeit je Karton in Minuten, inklusive Suchen und Beschriften. */
const MINUTES_PER_BOX = 12;

/* --- Fahrzeugklassen ----------------------------------------------------- */

export interface VanClass {
  label: string;
  /** Nutzbares Laderaumvolumen in m³. */
  volume: number;
  hint: string;
}

/** Aufsteigend sortiert – die Auswahl nimmt die erste passende Klasse. */
export const vanClasses: readonly VanClass[] = [
  {
    label: "Kombi oder Hochdachkombi",
    volume: 3,
    hint: "Führerschein Klasse B",
  },
  {
    label: "Transporter, kurz (bis 3,5 t)",
    volume: 8,
    hint: "Führerschein Klasse B",
  },
  {
    label: "Transporter, lang (bis 3,5 t)",
    volume: 12,
    hint: "Führerschein Klasse B",
  },
  {
    label: "Transporter mit Hochdach (bis 3,5 t)",
    volume: 20,
    hint: "Führerschein Klasse B",
  },
  { label: "Lkw 7,5 t", volume: 40, hint: "Führerschein Klasse C1 nötig" },
  { label: "Umzugs-Lkw 12 t", volume: 60, hint: "Am besten mit Umzugsfirma" },
] as const;

export interface MoveInput {
  /** Wohnfläche in Quadratmetern. */
  area: number;
  /** Anzahl Personen im Haushalt. */
  people: number;
  style: HouseholdStyle;
  /** Laufende Regalmeter Bücher, Ordner, Spiele. */
  shelfMetres: number;
  /** Laufende Meter Kleiderstange, die hängend transportiert werden soll. */
  wardrobeMetres: number;
  /** Keller, Dachboden oder Garage kommen mit. */
  hasBasement: boolean;
  /** Wie oft gefahren werden kann. */
  trips: number;
}

export interface MoveResult {
  /** Standardkartons. */
  boxes: number;
  bookBoxes: number;
  wardrobeBoxes: number;
  /** Alle Kartons zusammen – die Zahl, die man beim Bestellen braucht. */
  totalBoxes: number;
  /** Gesamtvolumen des Umzugsguts in m³. */
  volume: number;
  /** Volumen, das nur in den Kartons steckt. */
  boxVolume: number;
  /** Passende Fahrzeugklasse für die gewünschte Zahl an Fahrten. */
  van: VanClass;
  /** Volumen, das je Fahrt bewegt werden muss. */
  volumePerTrip: number;
  /** Kein Fahrzeug reicht für so wenige Fahrten. */
  needsMoreTrips: boolean;
  packingPaperSheets: number;
  tapeRolls: number;
  /** Geschätzte Packzeit in Stunden. */
  packingHours: number;
  warnings: string[];
}

/**
 * Aufrunden mit Toleranz, damit 1,8 / 0,6 nicht wegen Fließkomma auf 4 statt 3
 * springt. Der Nullfall wird abgefangen: `Math.ceil(-1e-9)` ergibt -0, und das
 * erscheint in der Ausgabe als "-0 Bücherkartons".
 */
const ceil = (value: number) => (value <= 0 ? 0 : Math.ceil(value - 1e-9));

export function calculateMove(input: MoveInput): MoveResult {
  const area = Math.max(0, input.area);
  const people = Math.max(1, Math.trunc(input.people));
  const style = householdStyles[input.style];
  const trips = Math.max(1, Math.trunc(input.trips));

  // Keller und Dachboden schlagen erfahrungsgemäß mit rund einem Sechstel
  // extra zu Buche.
  const basementFactor = input.hasBasement ? 1.15 : 1;

  // Über die Fläche allein läge ein Single in 80 m² gleichauf mit einer
  // Familie zu vier – deshalb ein kleiner Zuschlag je weiterer Person.
  const peopleFactor = 1 + (people - 1) * 0.06;

  const bookBoxes = ceil(
    Math.max(0, input.shelfMetres) / SHELF_METRES_PER_BOOK_BOX,
  );
  const wardrobeBoxes = ceil(
    Math.max(0, input.wardrobeMetres) / RAIL_METRES_PER_WARDROBE_BOX,
  );

  const boxes = ceil(area * style.boxesPerSqm * basementFactor * peopleFactor);
  const totalBoxes = boxes + bookBoxes + wardrobeBoxes;

  const boxVolume =
    boxes * BOX_VOLUME +
    bookBoxes * BOOK_BOX_VOLUME +
    wardrobeBoxes * WARDROBE_BOX_VOLUME;

  // Das Gesamtvolumen enthält die Möbel und damit auch die Kartons. Es darf
  // nie unter dem Volumen der Kartons liegen, sonst wäre die Fahrzeugklasse
  // zu klein geschätzt.
  const volume = Math.max(
    boxVolume,
    area * style.volumePerSqm * basementFactor * peopleFactor,
  );

  const volumePerTrip = volume / trips;
  const van =
    vanClasses.find((candidate) => candidate.volume >= volumePerTrip) ??
    vanClasses[vanClasses.length - 1];
  const needsMoreTrips = van.volume < volumePerTrip;

  const warnings: string[] = [];
  if (area <= 0) {
    warnings.push(
      "Trage die Wohnfläche ein, damit der Rechner etwas schätzen kann.",
    );
  }
  if (needsMoreTrips) {
    warnings.push(
      `Selbst das größte Fahrzeug in der Liste fasst ${van.volume} m³. Für ${volume.toFixed(0)} m³ brauchst du mehr Fahrten oder eine Umzugsfirma.`,
    );
  }
  if (van.volume >= 40) {
    warnings.push(
      "Ab 7,5 Tonnen brauchst du einen Führerschein der Klasse C1 – wer ihn nach 1999 gemacht hat, hat ihn meist nicht.",
    );
  }
  if (wardrobeBoxes > 0) {
    warnings.push(
      "Kleiderboxen sind hoch: Prüfe vorher, ob sie durchs Treppenhaus und in den Laderaum passen.",
    );
  }

  return {
    boxes,
    bookBoxes,
    wardrobeBoxes,
    totalBoxes,
    volume,
    boxVolume,
    van,
    volumePerTrip,
    needsMoreTrips,
    packingPaperSheets: ceil(totalBoxes * PAPER_SHEETS_PER_BOX),
    tapeRolls: ceil(totalBoxes / BOXES_PER_TAPE_ROLL),
    packingHours: Math.round((totalBoxes * MINUTES_PER_BOX) / 60),
    warnings,
  };
}
