/**
 * Party- und Grillmengen – reine Schätzung.
 *
 * Auch hier gilt: Erfahrungswerte, keine Messung. Die Mengen je Person stehen
 * offen als Konstanten und werden in der Oberfläche genannt.
 *
 * Zwei Regeln tragen das Ganze:
 *
 *   Kinder essen und trinken etwa halb so viel wie Erwachsene.
 *   Getränke wachsen mit der Dauer, Essen nicht. Wer sechs Stunden bleibt,
 *   isst nicht doppelt so viel wie in drei – trinkt aber doppelt so viel.
 */

export type Occasion = "grillen" | "buffet" | "kuchen" | "apero";

interface OccasionDef {
  label: string;
  hint: string;
  /** Welche Position im Ergebnis die Hauptrolle spielt. */
  primaryKey: string;
}

export const occasions: Record<Occasion, OccasionDef> = {
  grillen: {
    label: "Grillen",
    hint: "Fleisch, Beilagen, Brot und Kohle.",
    primaryKey: "fleisch",
  },
  buffet: {
    label: "Buffet",
    hint: "Warme und kalte Speisen, Salate, Brot.",
    primaryKey: "hauptgericht",
  },
  kuchen: {
    label: "Kaffee und Kuchen",
    hint: "Kuchenstücke, Sahne, Kaffee.",
    primaryKey: "kuchen",
  },
  apero: {
    label: "Apéro und Fingerfood",
    hint: "Häppchen, Snacks, Sekt.",
    primaryKey: "haeppchen",
  },
};

/* --- Mengen je Erwachsener ----------------------------------------------- */

/** Grillen: Fleisch in Gramm. Der Klassiker der Fehlschätzung. */
const MEAT_G = 350;
/** Vegetarische Hauptkomponente in Gramm – Halloumi, Gemüsespieße, Bratlinge. */
const VEGGIE_G = 250;
/** Buffet: warme Hauptkomponente in Gramm. */
const MAIN_G = 300;
/** Salate und Beilagen in Gramm. */
const SIDES_G = 200;
/** Brot oder Brötchen in Stück. */
const BREAD_PIECES = 1.5;
/** Kuchenstücke. */
const CAKE_SLICES = 2;
/** Häppchen beim Apéro. */
const CANAPES = 8;
/** Snacks (Chips, Nüsse, Oliven) in Gramm. */
const SNACKS_G = 60;
/** Kaffee in Millilitern. */
const COFFEE_ML = 400;

/* --- Getränke, je Person und Stunde -------------------------------------- */

/** Wasser und Softdrinks in Millilitern je Stunde. */
const SOFT_ML_PER_HOUR = 250;
/** Bier in Millilitern je Stunde, für Personen die Alkohol trinken. */
const BEER_ML_PER_HOUR = 300;
/** Wein in Millilitern je Stunde, für Personen die Alkohol trinken. */
const WINE_ML_PER_HOUR = 150;
/** Sekt zum Empfang, einmalig in Millilitern. */
const SPARKLING_ML = 150;

/* --- Verbrauchsmaterial --------------------------------------------------- */

/** Grillkohle in Gramm je Person. */
const CHARCOAL_G = 700;
/** Eis zum Kühlen in Gramm je Person. */
const ICE_G = 400;

export interface PartyInput {
  adults: number;
  children: number;
  /** Dauer in Stunden – steuert nur die Getränke. */
  hours: number;
  occasion: Occasion;
  /** Anteil der Erwachsenen, die vegetarisch essen, in Prozent. */
  vegetarianPercent: number;
  /** Alkohol wird angeboten. */
  alcohol: boolean;
  /** Kräftige Esser: schlägt aufs Essen, nicht auf die Getränke. */
  heartyEaters: boolean;
}

export interface PartyItem {
  key: string;
  label: string;
  /** Menge in der Einheit von `unit`. */
  amount: number;
  unit: "kg" | "g" | "l" | "Stück";
  /** Kurzer Hinweis, wie die Zahl zustande kommt. */
  note?: string;
}

export interface PartyResult {
  /** Erwachsene plus Kinder. */
  guests: number;
  /** Erwachsenen-Äquivalente: Kinder zählen halb. */
  eaterUnits: number;
  /** Die Position, die als Payoff-Zahl taugt. */
  primary: PartyItem;
  food: PartyItem[];
  drinks: PartyItem[];
  supplies: PartyItem[];
  warnings: string[];
}

/** Auf eine Stelle runden – Mengen wie "1,4 kg" liest man besser als "1,37 kg". */
const round1 = (value: number) => Math.round(value * 10) / 10;
const roundUp = (value: number) => Math.ceil(value - 1e-9);

export function calculateParty(input: PartyInput): PartyResult {
  const adults = Math.max(0, Math.trunc(input.adults));
  const children = Math.max(0, Math.trunc(input.children));
  const guests = adults + children;
  const hours = Math.max(1, input.hours);

  // Kinder essen und trinken etwa halb so viel.
  const eaterUnits = adults + children * 0.5;
  const appetite = input.heartyEaters ? 1.25 : 1;
  const eaters = eaterUnits * appetite;

  const vegShare = Math.min(100, Math.max(0, input.vegetarianPercent)) / 100;
  const meatEaters = eaters * (1 - vegShare);
  const vegEaters = eaters * vegShare;

  // Nur Erwachsene trinken Alkohol – Kinder fallen hier heraus.
  const drinkers = input.alcohol ? adults : 0;

  const food: PartyItem[] = [];
  const drinks: PartyItem[] = [];
  const supplies: PartyItem[] = [];

  /* --- Essen --- */
  if (input.occasion === "grillen") {
    food.push({
      key: "fleisch",
      label: "Fleisch und Würstchen",
      amount: round1((meatEaters * MEAT_G) / 1000),
      unit: "kg",
      note: `${MEAT_G} g je Person`,
    });
    if (vegEaters > 0) {
      food.push({
        key: "vegetarisch",
        label: "Vegetarisches zum Grillen",
        amount: round1((vegEaters * VEGGIE_G) / 1000),
        unit: "kg",
        note: `${VEGGIE_G} g je vegetarischer Person`,
      });
    }
    food.push(sidesItem(eaters), breadItem(eaters));
    supplies.push({
      key: "kohle",
      label: "Grillkohle",
      amount: round1((eaterUnits * CHARCOAL_G) / 1000),
      unit: "kg",
      note: "reichlich gerechnet, Nachlegen ist lästig",
    });
  }

  if (input.occasion === "buffet") {
    food.push({
      key: "hauptgericht",
      label: "Warmes Hauptgericht",
      amount: round1((meatEaters * MAIN_G) / 1000),
      unit: "kg",
      note: `${MAIN_G} g je Person`,
    });
    if (vegEaters > 0) {
      food.push({
        key: "vegetarisch",
        label: "Vegetarische Hauptkomponente",
        amount: round1((vegEaters * MAIN_G) / 1000),
        unit: "kg",
        note: `${MAIN_G} g je vegetarischer Person`,
      });
    }
    food.push(sidesItem(eaters), breadItem(eaters));
  }

  if (input.occasion === "kuchen") {
    food.push({
      key: "kuchen",
      label: "Kuchenstücke",
      amount: roundUp(eaters * CAKE_SLICES),
      unit: "Stück",
      note: `${CAKE_SLICES} Stück je Person – zwei Sorten kommen besser an als eine`,
    });
    food.push({
      key: "sahne",
      label: "Sahne",
      amount: round1((eaters * 50) / 1000),
      unit: "l",
      note: "50 ml je Person",
    });
    drinks.push({
      key: "kaffee",
      label: "Kaffee (fertig aufgebrüht)",
      amount: round1((eaters * COFFEE_ML) / 1000),
      unit: "l",
      note: `${COFFEE_ML} ml je Person`,
    });
  }

  if (input.occasion === "apero") {
    food.push({
      key: "haeppchen",
      label: "Häppchen",
      amount: roundUp(eaters * CANAPES),
      unit: "Stück",
      note: `${CANAPES} Stück je Person`,
    });
    food.push({
      key: "snacks",
      label: "Chips, Nüsse, Oliven",
      amount: Math.round(eaters * SNACKS_G),
      unit: "g",
      note: `${SNACKS_G} g je Person`,
    });
    if (input.alcohol && adults > 0) {
      drinks.push({
        key: "sekt",
        label: "Sekt zum Empfang",
        amount: round1((adults * SPARKLING_ML) / 1000),
        unit: "l",
        note: "ein Glas je Erwachsener",
      });
    }
  }

  /* --- Getränke --- */
  drinks.push({
    key: "softdrinks",
    label: "Wasser und Softdrinks",
    amount: round1((eaterUnits * SOFT_ML_PER_HOUR * hours) / 1000),
    unit: "l",
    note: `${SOFT_ML_PER_HOUR} ml je Person und Stunde`,
  });

  if (drinkers > 0) {
    drinks.push({
      key: "bier",
      label: "Bier",
      amount: round1((drinkers * BEER_ML_PER_HOUR * hours) / 1000),
      unit: "l",
      note: `${BEER_ML_PER_HOUR} ml je Erwachsenen und Stunde`,
    });
    drinks.push({
      key: "wein",
      label: "Wein",
      amount: round1((drinkers * WINE_ML_PER_HOUR * hours) / 1000),
      unit: "l",
      note: `${WINE_ML_PER_HOUR} ml je Erwachsenen und Stunde`,
    });
  }

  /* --- Rest --- */
  supplies.push(
    {
      key: "eis",
      label: "Eis zum Kühlen",
      amount: round1((guests * ICE_G) / 1000),
      unit: "kg",
      note: "hält Getränke und Salate kalt",
    },
    {
      key: "teller",
      label: "Teller",
      amount: roundUp(guests * 1.5),
      unit: "Stück",
      note: "eineinhalb je Gast – einer geht immer verloren",
    },
    {
      key: "glaeser",
      label: "Gläser",
      amount: roundUp(guests * 1.5),
      unit: "Stück",
    },
    {
      key: "servietten",
      label: "Servietten",
      amount: roundUp(guests * 3),
      unit: "Stück",
    },
  );

  const warnings: string[] = [];
  if (guests === 0) {
    warnings.push("Trage ein, wie viele Gäste kommen.");
  }
  if (input.occasion === "grillen" && guests > 25) {
    warnings.push(
      "Ab etwa 25 Gästen wird ein Grill zum Nadelöhr. Plane einen zweiten ein oder gare Fleisch im Ofen vor.",
    );
  }
  if (hours >= 6) {
    warnings.push(
      "Bei so langer Dauer lohnt sich ein zweiter Essensdurchgang am Abend – Brot, Käse und Reste reichen dafür meist.",
    );
  }
  if (input.alcohol && adults > 0) {
    warnings.push(
      "Halte alkoholfreie Alternativen bereit: Erfahrungsgemäß trinkt gut ein Viertel der Erwachsenen keinen Alkohol.",
    );
  }

  const all = [...food, ...drinks, ...supplies];
  const primaryKey = occasions[input.occasion].primaryKey;
  const primary = all.find((item) => item.key === primaryKey) ?? all[0];

  return {
    guests,
    eaterUnits,
    primary,
    food,
    drinks,
    supplies,
    warnings,
  };
}

function sidesItem(eaters: number): PartyItem {
  return {
    key: "beilagen",
    label: "Salate und Beilagen",
    amount: round1((eaters * SIDES_G) / 1000),
    unit: "kg",
    note: `${SIDES_G} g je Person`,
  };
}

function breadItem(eaters: number): PartyItem {
  return {
    key: "brot",
    label: "Brot oder Brötchen",
    amount: roundUp(eaters * BREAD_PIECES),
    unit: "Stück",
    note: `${BREAD_PIECES} Stück je Person`.replace(".", ","),
  };
}
