import { describe, expect, it } from "vitest";
import {
  MUFFIN_ML,
  baseArea,
  batterVolume,
  convertForm,
  formLabel,
  formatQuantity,
  parseIngredientLine,
  parseIngredients,
  scaleIngredients,
  shapes,
  type FormSpec,
  type ShapeKind,
} from "./logic";

const form = (kind: ShapeKind, a = 26, b = 11, count = 12): FormSpec => ({
  kind,
  a,
  b,
  count,
});

const factorBetween = (source: FormSpec, target: FormSpec) =>
  convertForm({ source, target, ingredients: "" }).factor;

describe("Geometrie", () => {
  it("rechnet die Grundfläche je Bauart", () => {
    expect(baseArea(form("rund", 26))).toBeCloseTo(530.929, 3);
    expect(baseArea(form("quadratisch", 24))).toBe(576);
    expect(baseArea(form("rechteckig", 30, 20))).toBe(600);
  });

  it("skaliert zwischen runden Formen exakt mit dem Quadrat des Durchmessers", () => {
    // Diese Fälle sind von der angenommenen Teighöhe unabhängig: sie kürzt sich.
    expect(factorBetween(form("rund", 20), form("rund", 26))).toBeCloseTo(
      (26 / 20) ** 2,
      10,
    );
    expect(factorBetween(form("rund", 26), form("rund", 20))).toBeCloseTo(
      (20 / 26) ** 2,
      10,
    );
    expect(factorBetween(form("rund", 24), form("rund", 24))).toBeCloseTo(1, 10);
  });

  it("skaliert zwischen flachen Formen über die Fläche", () => {
    expect(
      factorBetween(form("quadratisch", 20), form("rechteckig", 30, 20)),
    ).toBeCloseTo(1.5, 10);
    expect(factorBetween(form("rund", 26), form("quadratisch", 24))).toBeCloseTo(
      576 / 530.9291585,
      6,
    );
  });

  it("berücksichtigt die größere Tiefe der Kastenform", () => {
    const springform = form("rund", 26);
    const kasten = form("kastenform", 30, 11);

    // Nur über die Fläche gerechnet käme man auf 1200/530,9 = 2,26 – viel zu
    // viel. Über das Volumen liegt der Faktor nahe bei eins, so wie ein
    // 26er-Rezept in eine 30er Kastenform passt.
    const areaOnly = baseArea(kasten) / baseArea(springform);
    expect(areaOnly).toBeGreaterThan(0.6);
    expect(factorBetween(springform, kasten)).toBeCloseTo(
      (330 * shapes.kastenform.depth) / (530.9291585 * shapes.rund.depth),
      6,
    );
    expect(factorBetween(springform, kasten)).toBeLessThan(1.3);
  });

  it("rechnet Muffins über die Anzahl der Mulden", () => {
    expect(batterVolume(form("muffins", 0, 0, 12))).toBe(12 * MUFFIN_ML);
    expect(batterVolume(form("muffins", 0, 0, 6))).toBe(6 * MUFFIN_ML);
    // Doppelte Anzahl, doppelter Teig.
    expect(
      factorBetween(form("muffins", 0, 0, 6), form("muffins", 0, 0, 12)),
    ).toBeCloseTo(2, 10);
  });

  it("bleibt bei Faktor 1, wenn ein Maß fehlt", () => {
    const result = convertForm({
      source: form("rund", 0),
      target: form("rund", 26),
      ingredients: "250 g Mehl",
    });
    expect(result.factor).toBe(1);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("beschriftet die Formen lesbar", () => {
    expect(formLabel(form("rund", 26))).toBe("Ø 26 cm");
    expect(formLabel(form("quadratisch", 24))).toBe("24 × 24 cm");
    expect(formLabel(form("kastenform", 30, 11))).toBe("30 × 11 cm");
    expect(formLabel(form("muffins", 0, 0, 12))).toBe("12 Muffins");
    expect(formLabel(form("rund", 22.5))).toBe("Ø 22,5 cm");
  });
});

describe("Zutatenzeilen zerlegen", () => {
  it("trennt Menge, Einheit und Name", () => {
    expect(parseIngredientLine("250 g Mehl")).toMatchObject({
      quantity: 250,
      unit: "g",
      name: "Mehl",
    });
    expect(parseIngredientLine("1 Pck. Backpulver")).toMatchObject({
      quantity: 1,
      unit: "Pck.",
      name: "Backpulver",
    });
    expect(parseIngredientLine("200 ml Milch")).toMatchObject({
      quantity: 200,
      unit: "ml",
      name: "Milch",
    });
  });

  it("versteht Kommazahlen und Brüche", () => {
    expect(parseIngredientLine("1,5 kg Äpfel").quantity).toBe(1.5);
    expect(parseIngredientLine("1.5 kg Äpfel").quantity).toBe(1.5);
    expect(parseIngredientLine("1/2 TL Salz").quantity).toBe(0.5);
    expect(parseIngredientLine("½ TL Zimt").quantity).toBe(0.5);
    expect(parseIngredientLine("1 1/2 EL Öl").quantity).toBe(1.5);
    expect(parseIngredientLine("1½ EL Öl").quantity).toBe(1.5);
    expect(parseIngredientLine("¾ Tasse Zucker").quantity).toBeCloseTo(0.75, 10);
  });

  it("erkennt Zutaten ohne Einheit", () => {
    expect(parseIngredientLine("3 Eier")).toMatchObject({
      quantity: 3,
      unit: null,
      name: "Eier",
    });
    expect(parseIngredientLine("2 Bananen")).toMatchObject({
      quantity: 2,
      unit: null,
      name: "Bananen",
    });
  });

  it("lässt Zeilen ohne Menge unangetastet", () => {
    const line = parseIngredientLine("Butter für die Form");
    expect(line.quantity).toBeNull();
    expect(line.name).toBe("Butter für die Form");
  });

  it("überspringt Leerzeilen", () => {
    const items = parseIngredients("250 g Mehl\n\n  \n3 Eier\n");
    expect(items).toHaveLength(2);
  });
});

describe("Mengen skalieren", () => {
  const scale = (text: string, factor: number) =>
    scaleIngredients(text, factor).map((item) => item.text);

  it("rechnet Gramm und Milliliter hoch", () => {
    expect(scale("250 g Mehl", 1.5)).toEqual(["375 g Mehl"]);
    expect(scale("200 ml Milch", 0.5)).toEqual(["100 ml Milch"]);
    expect(scale("250 g Mehl", 1.69)).toEqual(["423 g Mehl"]);
  });

  it("hält kleine Mengen mit einer Dezimale genau", () => {
    expect(scale("5 g Hefe", 1.5)).toEqual(["7,5 g Hefe"]);
    expect(scale("1,5 kg Äpfel", 2)).toEqual(["3 kg Äpfel"]);
  });

  it("rundet Löffelmaße auf Viertel und schreibt sie als Bruch", () => {
    expect(scale("1 TL Salz", 0.5)).toEqual(["½ TL Salz"]);
    expect(scale("½ TL Zimt", 1.5)).toEqual(["¾ TL Zimt"]);
    expect(scale("2 EL Zucker", 1.25)).toEqual(["2½ EL Zucker"]);
    expect(scale("1 TL Backpulver", 1.69)).toEqual(["1¾ TL Backpulver"]);
  });

  it("rundet Stückzahlen auf ganze Stücke", () => {
    expect(scale("1 Pck. Backpulver", 1.5)).toEqual(["2 Pck. Backpulver"]);
    expect(scale("2 Bananen", 1.69)).toEqual(["3 Bananen"]);
  });

  it("erlaubt halbe Eier – die lassen sich verquirlt abmessen", () => {
    expect(scale("3 Eier", 1.5)).toEqual(["4½ Eier"]);
    expect(scale("4 Eier", 0.5)).toEqual(["2 Eier"]);
    expect(scale("2 Eier", 1.69)).toEqual(["3½ Eier"]);
  });

  it("lässt aus einem Stück nie null werden", () => {
    expect(scale("1 Pck. Vanillezucker", 0.3)).toEqual([
      "1 Pck. Vanillezucker",
    ]);
    expect(scale("1 Ei", 0.2)).toEqual(["½ Ei"]);
  });

  it("beugt Einheiten, die eine Pluralform haben", () => {
    expect(scale("1 Prise Salz", 3)).toEqual(["3 Prisen Salz"]);
    expect(scale("1 Zehe Knoblauch", 2)).toEqual(["2 Zehen Knoblauch"]);
    // Ohne Pluralform bleibt die Einheit stehen.
    expect(scale("1 Pck. Hefe", 2)).toEqual(["2 Pck. Hefe"]);
    expect(scale("2 Prisen Salz", 0.5)).toEqual(["1 Prisen Salz"]);
  });

  it("markiert nur Rundungen, die ins Gewicht fallen", () => {
    // Gramm-Zeilen sind praktisch nie ein Kompromiss – 422,5 auf 423 zu runden
    // muss niemand wissen. Sonst wäre am Ende jede Zeile markiert.
    const gramm = scaleIngredients("250 g Mehl", 1.69);
    expect(gramm[0].text).toBe("423 g Mehl");
    expect(gramm[0].rounded).toBe(false);

    // Ein ganzes Päckchen statt 0,59 dagegen schon.
    const packet = scaleIngredients("1 Pck. Backpulver", 0.591716);
    expect(packet[0].text).toBe("1 Pck. Backpulver");
    expect(packet[0].rounded).toBe(true);

    const exact = scaleIngredients("100 g Zucker", 2);
    expect(exact[0].rounded).toBe(false);
  });

  it("markiert bei einer typischen Liste nur die echten Kompromisse", () => {
    const recipe = [
      "250 g Mehl",
      "1 Pck. Backpulver",
      "200 g Zucker",
      "4 Eier",
      "125 g Butter",
    ].join("\n");
    const flagged = scaleIngredients(recipe, 0.591716)
      .filter((item) => item.rounded)
      .map((item) => item.name);
    expect(flagged).toEqual(["Backpulver", "Eier"]);
  });

  it("übernimmt Zeilen ohne Menge unverändert", () => {
    expect(scale("Butter für die Form", 2)).toEqual(["Butter für die Form"]);
  });

  it("rechnet eine ganze Liste um", () => {
    const recipe = [
      "250 g Mehl",
      "1 Pck. Backpulver",
      "200 g Zucker",
      "4 Eier",
      "125 g Butter",
      "1 Prise Salz",
      "Butter für die Form",
    ].join("\n");

    expect(scale(recipe, 0.591716)).toEqual([
      "148 g Mehl",
      "1 Pck. Backpulver",
      "118 g Zucker",
      "2½ Eier",
      "74 g Butter",
      "1 Prise Salz",
      "Butter für die Form",
    ]);
  });
});

describe("Mengen formatieren", () => {
  it("schreibt ganze Zahlen ohne Nachkomma", () => {
    expect(formatQuantity(250)).toBe("250");
    expect(formatQuantity(3)).toBe("3");
  });

  it("nutzt Bruchzeichen, wo sie passen", () => {
    expect(formatQuantity(0.5)).toBe("½");
    expect(formatQuantity(0.25)).toBe("¼");
    expect(formatQuantity(2.75)).toBe("2¾");
    expect(formatQuantity(1.5)).toBe("1½");
  });

  it("fällt sonst auf eine Dezimale zurück", () => {
    expect(formatQuantity(7.4)).toBe("7,4");
  });

  it("verzichtet auf Bruchzeichen, wo man wiegt statt löffelt", () => {
    // Gewichte kommen auf die Waage: "7,5 g", nie "7½ g".
    expect(formatQuantity(7.5, false)).toBe("7,5");
    expect(formatQuantity(7.5, true)).toBe("7½");
    expect(scaleIngredients("5 g Hefe", 1.5)[0].text).toBe("7,5 g Hefe");
    expect(scaleIngredients("1 TL Hefe", 1.5)[0].text).toBe("1½ TL Hefe");
  });
});

describe("Backzeit und Warnungen", () => {
  it("warnt beim Sprung auf Muffins", () => {
    const result = convertForm({
      source: form("rund", 26),
      target: form("muffins", 0, 0, 12),
      ingredients: "",
    });
    expect(result.timeHint).toContain("Muffins");
  });

  it("weist auf die tiefere Kastenform hin", () => {
    const result = convertForm({
      source: form("blech", 40, 30),
      target: form("kastenform", 30, 11),
      ingredients: "",
    });
    expect(result.timeHint).toContain("höher");
  });

  it("schweigt, wenn die Bauart gleich bleibt", () => {
    const result = convertForm({
      source: form("rund", 20),
      target: form("rund", 26),
      ingredients: "",
    });
    expect(result.timeHint).toBeNull();
  });

  it("warnt bei sehr großen und sehr kleinen Sprüngen", () => {
    const big = convertForm({
      source: form("rund", 16),
      target: form("rund", 30),
      ingredients: "",
    });
    expect(big.factor).toBeGreaterThan(2.5);
    expect(big.warnings.join(" ")).toContain("zweieinhalbfache");

    const small = convertForm({
      source: form("rund", 30),
      target: form("rund", 16),
      ingredients: "",
    });
    expect(small.warnings.join(" ")).toContain("halbe Menge");
  });
});

describe("Invarianten", () => {
  it("ist in beide Richtungen konsistent", () => {
    const sizes = [16, 18, 20, 22, 24, 26, 28, 30];
    for (const from of sizes) {
      for (const to of sizes) {
        const there = factorBetween(form("rund", from), form("rund", to));
        const back = factorBetween(form("rund", to), form("rund", from));
        expect(there * back).toBeCloseTo(1, 10);
      }
    }
  });

  it("skaliert monoton mit der Zielgröße", () => {
    let previous = 0;
    for (const diameter of [16, 18, 20, 22, 24, 26, 28, 30]) {
      const factor = factorBetween(form("rund", 20), form("rund", diameter));
      expect(factor).toBeGreaterThan(previous);
      previous = factor;
    }
  });

  it("verliert beim Skalieren keine Zeile", () => {
    const recipe = "250 g Mehl\n3 Eier\nButter für die Form\n1 TL Salz";
    for (const factor of [0.4, 0.591716, 1, 1.5, 1.69, 2.5]) {
      expect(scaleIngredients(recipe, factor)).toHaveLength(4);
    }
  });

  it("hält die Reihenfolge und die Namen bei", () => {
    const recipe = "250 g Mehl\n200 g Zucker\n4 Eier";
    const scaled = scaleIngredients(recipe, 1.3);
    expect(scaled.map((item) => item.name)).toEqual(["Mehl", "Zucker", "Eier"]);
  });
});
