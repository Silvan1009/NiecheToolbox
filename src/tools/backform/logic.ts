/**
 * Backform-Umrechner – reine Berechnung.
 *
 * Zwei Teile: die Geometrie der Formen und das Umrechnen einer Zutatenliste.
 *
 * Gerechnet wird über das **Teigvolumen**, nicht über die Grundfläche allein.
 * Bei zwei flachen Formen kürzt sich die angenommene Teighöhe heraus, das
 * Ergebnis ist dann exakte Geometrie. Erst beim Wechsel der Bauart – Springform
 * zu Kastenform, Kuchen zu Muffins – trägt die Höhenannahme, und genau dort
 * wäre ein reiner Flächenvergleich falsch.
 */

/* ---------------------------------------------------------------------------
 * Formen
 * ------------------------------------------------------------------------- */

export type ShapeKind =
  | "rund"
  | "quadratisch"
  | "rechteckig"
  | "kastenform"
  | "blech"
  | "muffins";

interface ShapeDef {
  label: string;
  /** Angenommene Teighöhe in cm – die Modellannahme dieses Rechners. */
  depth: number;
  /** Welche Maße die Form braucht. */
  fields: ("a" | "b" | "count")[];
}

/**
 * Die angenommenen Teighöhen. Sie sind die einzige Modellannahme dieses
 * Rechners und stehen deshalb offen in der Oberfläche und in den FAQ.
 *
 * Beim Umrechnen zwischen zwei Formen derselben Bauart kürzen sie sich
 * heraus – dort ist das Ergebnis exakte Geometrie und von diesen Zahlen
 * unabhängig.
 */
export const shapes: Record<ShapeKind, ShapeDef> = {
  rund: { label: "Springform (rund)", depth: 3.5, fields: ["a"] },
  quadratisch: { label: "Quadratisch", depth: 3.5, fields: ["a"] },
  rechteckig: { label: "Rechteckig", depth: 3.5, fields: ["a", "b"] },
  kastenform: { label: "Kastenform", depth: 6.5, fields: ["a", "b"] },
  blech: { label: "Backblech", depth: 1.8, fields: ["a", "b"] },
  muffins: { label: "Muffins", depth: 0, fields: ["count"] },
};

/** Teigmenge einer gut gefüllten Muffinmulde in Millilitern. */
export const MUFFIN_ML = 75;

export interface FormSpec {
  kind: ShapeKind;
  /** Durchmesser bei rund, Seitenlänge bei quadratisch, Länge sonst (cm). */
  a: number;
  /** Zweite Kante in cm – bei rund und quadratisch ohne Bedeutung. */
  b: number;
  /** Anzahl der Mulden bei Muffins. */
  count: number;
}

/** Grundfläche in cm². Bei Muffins nicht definiert – dort zählt die Anzahl. */
export function baseArea(spec: FormSpec): number {
  const a = Math.max(0, spec.a);
  const b = Math.max(0, spec.b);
  switch (spec.kind) {
    case "rund":
      return Math.PI * (a / 2) ** 2;
    case "quadratisch":
      return a * a;
    case "rechteckig":
    case "kastenform":
    case "blech":
      return a * b;
    case "muffins":
      return 0;
  }
}

/** Teigvolumen in Millilitern (1 cm³ = 1 ml). */
export function batterVolume(spec: FormSpec): number {
  if (spec.kind === "muffins") {
    return Math.max(0, Math.trunc(spec.count)) * MUFFIN_ML;
  }
  return baseArea(spec) * shapes[spec.kind].depth;
}

/** "Ø 26 cm", "24 × 24 cm", "12 Muffins" */
export function formLabel(spec: FormSpec): string {
  const num = (value: number) =>
    Number.isInteger(value) ? String(value) : String(value).replace(".", ",");

  switch (spec.kind) {
    case "rund":
      return `Ø ${num(spec.a)} cm`;
    case "quadratisch":
      return `${num(spec.a)} × ${num(spec.a)} cm`;
    case "rechteckig":
    case "kastenform":
    case "blech":
      return `${num(spec.a)} × ${num(spec.b)} cm`;
    case "muffins":
      return `${Math.trunc(spec.count)} Muffins`;
  }
}

/* ---------------------------------------------------------------------------
 * Zutatenliste: Zerlegen
 * ------------------------------------------------------------------------- */

/** Unicode-Bruchzeichen, wie sie in kopierten Rezepten stehen. */
const VULGAR: Record<string, number> = {
  "½": 0.5,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "¼": 0.25,
  "¾": 0.75,
  "⅕": 0.2,
  "⅛": 0.125,
};

/**
 * Einheiten und ihr Rundungsverhalten.
 *
 * `stufe` – auf welches Vielfache gerundet wird:
 *   0    = frei (Gramm, Milliliter: auf ganze Zahlen bzw. eine Dezimale)
 *   0.25 = Löffelmaße, als Brüche lesbar
 *   1    = Stückzahlen, halbe Eier gibt es nicht
 */
const UNITS: Record<string, { stufe: number; plural?: string }> = {
  g: { stufe: 0 },
  gramm: { stufe: 0 },
  kg: { stufe: 0 },
  ml: { stufe: 0 },
  l: { stufe: 0 },
  cl: { stufe: 0 },
  el: { stufe: 0.25 },
  tl: { stufe: 0.25 },
  msp: { stufe: 0.25 },
  tasse: { stufe: 0.25, plural: "Tassen" },
  tassen: { stufe: 0.25 },
  becher: { stufe: 0.25 },
  cm: { stufe: 0 },
  prise: { stufe: 1, plural: "Prisen" },
  prisen: { stufe: 1 },
  pck: { stufe: 1 },
  pkg: { stufe: 1 },
  packung: { stufe: 1, plural: "Packungen" },
  päckchen: { stufe: 1 },
  stück: { stufe: 1 },
  stk: { stufe: 1 },
  dose: { stufe: 1, plural: "Dosen" },
  dosen: { stufe: 1 },
  blatt: { stufe: 1, plural: "Blätter" },
  zehe: { stufe: 1, plural: "Zehen" },
  zehen: { stufe: 1 },
  scheibe: { stufe: 1, plural: "Scheiben" },
  scheiben: { stufe: 1 },
  bund: { stufe: 1 },
  würfel: { stufe: 1 },
  handvoll: { stufe: 1 },
  schuss: { stufe: 1 },
  spritzer: { stufe: 1 },
};

export interface ParsedIngredient {
  raw: string;
  /** Erkannte Menge, oder null wenn die Zeile ohne Zahl beginnt. */
  quantity: number | null;
  /** Einheit, wie sie dastand. */
  unit: string | null;
  name: string;
}

/** Menge am Zeilenanfang lesen. Gibt die Länge des erkannten Teils mit zurück. */
function readQuantity(line: string): { value: number; length: number } | null {
  const patterns: [RegExp, (m: RegExpMatchArray) => number][] = [
    // "1 1/2"
    [/^(\d+)\s+(\d+)\s*\/\s*(\d+)/, (m) => Number(m[1]) + Number(m[2]) / Number(m[3])],
    // "1½"
    [/^(\d+)\s*([½⅓⅔¼¾⅕⅛])/, (m) => Number(m[1]) + VULGAR[m[2]]],
    // "1/2"
    [/^(\d+)\s*\/\s*(\d+)/, (m) => Number(m[1]) / Number(m[2])],
    // "1,5" oder "1.5" oder "250"
    [/^(\d+(?:[.,]\d+)?)/, (m) => Number(m[1].replace(",", "."))],
    // "½"
    [/^([½⅓⅔¼¾⅕⅛])/, (m) => VULGAR[m[1]]],
  ];

  for (const [pattern, compute] of patterns) {
    const match = line.match(pattern);
    if (match) {
      const value = compute(match);
      if (Number.isFinite(value)) return { value, length: match[0].length };
    }
  }
  return null;
}

/** Eine Zeile in Menge, Einheit und Name zerlegen. */
export function parseIngredientLine(raw: string): ParsedIngredient {
  const trimmed = raw.trim();
  const quantity = readQuantity(trimmed);

  if (!quantity) {
    // Zeilen ohne Menge ("Butter für die Form") bleiben unangetastet.
    return { raw, quantity: null, unit: null, name: trimmed };
  }

  const rest = trimmed.slice(quantity.length).trim();
  const [firstWord = "", ...others] = rest.split(/\s+/);
  const normalized = firstWord.toLowerCase().replace(/\.$/, "");

  if (normalized in UNITS) {
    return {
      raw,
      quantity: quantity.value,
      unit: firstWord,
      name: others.join(" "),
    };
  }

  return { raw, quantity: quantity.value, unit: null, name: rest };
}

export function parseIngredients(text: string): ParsedIngredient[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(parseIngredientLine);
}

/* ---------------------------------------------------------------------------
 * Zutatenliste: Skalieren
 * ------------------------------------------------------------------------- */

/** Halbe Eier lassen sich verquirlt abmessen – Viertel nicht. */
const EGG_PATTERN = /(^|\s)(ei|eier|eigelb|eiweiß|eiweiss)(\s|$)/i;

function stufeFor(item: ParsedIngredient): number {
  if (item.unit) {
    const key = item.unit.toLowerCase().replace(/\.$/, "");
    return UNITS[key]?.stufe ?? 1;
  }
  // Ohne Einheit: Eier auf halbe, alles andere auf ganze Stücke.
  return EGG_PATTERN.test(item.name) ? 0.5 : 1;
}

function roundToStufe(value: number, stufe: number): number {
  if (stufe <= 0) {
    // Freie Mengen: unter 10 eine Dezimale, darüber ganze Zahlen.
    return value < 10 ? Math.round(value * 10) / 10 : Math.round(value);
  }
  const rounded = Math.round(value / stufe) * stufe;
  // Aus "1 Ei" darf beim Verkleinern nicht "0 Eier" werden.
  return rounded === 0 && value > 0 ? stufe : rounded;
}

/**
 * 2,5 → "2½", 0,75 → "¾", 363 → "363".
 *
 * Bruchzeichen nur, wo man sie auch abmisst: Löffel und Stückzahlen. Gramm
 * wiegt man auf einer Waage – dort steht "7,5 g" und nicht "7½ g".
 */
export function formatQuantity(value: number, allowFractions = true): string {
  if (Math.abs(value - Math.round(value)) < 1e-9) {
    return String(Math.round(value));
  }

  if (allowFractions) {
    const whole = Math.floor(value + 1e-9);
    const fraction = value - whole;
    const glyph = Object.entries(VULGAR).find(
      ([, amount]) => Math.abs(fraction - amount) < 0.02,
    )?.[0];
    if (glyph) return whole > 0 ? `${whole}${glyph}` : glyph;
  }

  return String(Math.round(value * 10) / 10).replace(".", ",");
}

/** Einheit passend zur Menge beugen – "3 Prisen" statt "3 Prise". */
function unitText(unit: string, value: number): string {
  if (value <= 1) return unit;
  const key = unit.toLowerCase().replace(/\.$/, "");
  const plural = UNITS[key]?.plural;
  if (!plural) return unit;
  // Großschreibung des Originals übernehmen.
  return unit[0] === unit[0].toUpperCase() ? plural : plural.toLowerCase();
}

export interface ScaledIngredient extends ParsedIngredient {
  scaled: number | null;
  /** Fertige Zeile, z. B. "375 g Mehl". */
  text: string;
  /** Die Rundung fällt ins Gewicht – ein Kompromiss, den man sehen sollte. */
  rounded: boolean;
}

/**
 * Ab welcher relativen Abweichung eine Rundung erwähnenswert ist.
 *
 * 147,93 g auf 148 g zu runden interessiert niemanden. Aus 0,59 Päckchen
 * Backpulver ein ganzes zu machen schon. Ein relativer Schwellwert trennt
 * beides – ein absoluter würde jede Gramm-Zeile markieren und die
 * Kennzeichnung damit wertlos machen.
 */
const NOTABLE_ROUNDING = 0.02;

export function scaleIngredients(
  text: string,
  factor: number,
): ScaledIngredient[] {
  return parseIngredients(text).map((item) => {
    if (item.quantity === null) {
      return { ...item, scaled: null, text: item.name, rounded: false };
    }

    const exact = item.quantity * factor;
    const stufe = stufeFor(item);
    const scaled = roundToStufe(exact, stufe);
    // Nur gestufte Einheiten (Löffel, Eier) dürfen als Bruch erscheinen.
    const parts = [formatQuantity(scaled, stufe > 0)];
    if (item.unit) parts.push(unitText(item.unit, scaled));
    if (item.name) parts.push(item.name);

    return {
      ...item,
      scaled,
      text: parts.join(" "),
      rounded:
        exact > 0 && Math.abs(exact - scaled) / exact > NOTABLE_ROUNDING,
    };
  });
}

/* ---------------------------------------------------------------------------
 * Umrechnung
 * ------------------------------------------------------------------------- */

export interface ConversionInput {
  source: FormSpec;
  target: FormSpec;
  /** Zutatenliste als Text, eine Zutat pro Zeile. Darf leer sein. */
  ingredients: string;
}

export interface ConversionResult {
  source: FormSpec;
  target: FormSpec;
  sourceVolume: number;
  targetVolume: number;
  /** Womit alle Mengen multipliziert werden. */
  factor: number;
  /** Abweichung in Prozent, negativ bei weniger Teig. */
  percentDelta: number;
  ingredients: ScaledIngredient[];
  /** Hinweis zur Backzeit, wenn sich die Teighöhe deutlich ändert. */
  timeHint: string | null;
  warnings: string[];
}

export function convertForm(input: ConversionInput): ConversionResult {
  const sourceVolume = batterVolume(input.source);
  const targetVolume = batterVolume(input.target);

  // Ohne Ausgangsvolumen gibt es kein Verhältnis – dann bleibt alles bei 1.
  const factor =
    sourceVolume > 0 && targetVolume > 0 ? targetVolume / sourceVolume : 1;

  const warnings: string[] = [];
  if (sourceVolume <= 0 || targetVolume <= 0) {
    warnings.push("Trage bei beiden Formen ein Maß größer als null ein.");
  }
  if (factor > 2.5) {
    warnings.push(
      "Mehr als die zweieinhalbfache Menge: Rührteig geht dabei oft ungleichmäßig auf. Zwei Formen nacheinander sind sicherer.",
    );
  }
  if (factor < 0.4 && factor > 0) {
    warnings.push(
      "Weniger als die halbe Menge: Bei einem Ei oder einem Päckchen Backpulver lässt sich kaum sinnvoll teilen. Prüfe die gerundeten Zeilen.",
    );
  }

  return {
    source: input.source,
    target: input.target,
    sourceVolume,
    targetVolume,
    factor,
    percentDelta: (factor - 1) * 100,
    ingredients: input.ingredients.trim()
      ? scaleIngredients(input.ingredients, factor)
      : [],
    timeHint: bakingTimeHint(input.source, input.target),
    warnings,
  };
}

/**
 * Backzeit-Hinweis. Wird die Menge über das Volumen skaliert, bleibt die
 * Teighöhe innerhalb derselben Bauart gleich – dann ändert sich an der Backzeit
 * kaum etwas. Beim Wechsel der Bauart schon.
 */
function bakingTimeHint(source: FormSpec, target: FormSpec): string | null {
  if (target.kind === "muffins") {
    return "Muffins sind deutlich schneller fertig als ein ganzer Kuchen: rechne mit 20 bis 25 Minuten statt 50 bis 60.";
  }
  if (source.kind === "muffins") {
    return "Ein ganzer Kuchen braucht viel länger als Muffins. Plane 50 bis 60 Minuten ein und prüfe mit einem Holzstäbchen.";
  }

  const from = shapes[source.kind].depth;
  const to = shapes[target.kind].depth;
  if (to >= from * 1.5) {
    return "Der Teig steht in der neuen Form höher. Er braucht länger und sollte etwas niedriger gebacken werden, damit die Mitte durchgart.";
  }
  if (to <= from * 0.7) {
    return "Der Teig wird flacher und ist früher fertig. Prüfe ihn zehn Minuten vor der angegebenen Zeit.";
  }
  return null;
}
