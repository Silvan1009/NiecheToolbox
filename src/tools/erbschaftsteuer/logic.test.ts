import { describe, expect, it } from "vitest";
import { calculateErbschaftsteuer, defaultInput, type ErbschaftInput } from "./logic";

describe("Erbschaftsteuer- und Schenkungsteuer-Rechner", () => {
  it("berechnet die Voreinstellung: Kind erbt 500.000 €", () => {
    // Bereicherung 500.000 - 15.000 Pauschale = 485.000, minus 400.000 Freibetrag
    // = 85.000 steuerpflichtiger Erwerb, Klasse I -> 11 %, kein Härteausgleich.
    const result = calculateErbschaftsteuer(defaultInput());
    expect(result.steuerklasse).toBe(1);
    expect(result.freibetrag).toBe(400_000);
    expect(result.erbfallkostenpauschale).toBe(15_000);
    expect(result.bereicherung).toBe(485_000);
    expect(result.steuerpflichtigerErwerb).toBe(85_000);
    expect(result.steuersatz).toBe(11);
    expect(result.haerteausgleich).toBe(0);
    expect(result.steuer).toBe(9_350);
  });

  it("bleibt innerhalb des Freibetrags steuerfrei", () => {
    const input: ErbschaftInput = {
      ...defaultInput(),
      verwandtschaft: "ehepartner",
      vermoegenswert: 300_000,
    };
    const result = calculateErbschaftsteuer(input);
    expect(result.steuer).toBe(0);
    expect(result.steuerpflichtigerErwerb).toBe(0);
    expect(
      result.warnings.some((w) => w.includes("keine Erbschaft- oder Schenkungsteuer")),
    ).toBe(true);
  });

  it("wendet den Härteausgleich an, wenn eine Wertgrenze nur knapp überschritten wird", () => {
    // Steuerpflichtiger Erwerb 75.100 € bei Klasse I: ohne Härteausgleich 8.261 €,
    // mit Härteausgleich 5.300 € (Steuer an der Grenze 5.250 € + 50 € Kappung).
    const input: ErbschaftInput = {
      modus: "erbschaft",
      verwandtschaft: "kind",
      vermoegenswert: 400_000 + 15_000 + 75_100,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 0,
    };
    const result = calculateErbschaftsteuer(input);
    expect(result.steuerpflichtigerErwerb).toBe(75_100);
    expect(result.steuerVorHaerteausgleich).toBe(8_261);
    expect(result.haerteausgleich).toBe(2_961);
    expect(result.steuer).toBe(5_300);
    expect(result.warnings.some((w) => w.includes("Härteausgleich senkt"))).toBe(true);
  });

  it("lässt den Erwerber nie schlechter dastehen als bei der Wertgrenze selbst", () => {
    // Kernaussage des Härteausgleichs: netto darf mit mehr Erwerb nie weniger übrig bleiben.
    const grenze = calculateErbschaftsteuer({
      modus: "erbschaft",
      verwandtschaft: "kind",
      vermoegenswert: 400_000 + 15_000 + 75_000,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 0,
    });
    const knappDarueber = calculateErbschaftsteuer({
      modus: "erbschaft",
      verwandtschaft: "kind",
      vermoegenswert: 400_000 + 15_000 + 75_100,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 0,
    });
    expect(knappDarueber.nettoErwerb).toBeGreaterThanOrEqual(grenze.nettoErwerb);
  });

  it("wechselt bei Eltern/Großeltern zwischen Steuerklasse I (Erbschaft) und II (Schenkung)", () => {
    // Derselbe Wert von 150.000 €, einmal geerbt und einmal verschenkt.
    const erbschaft = calculateErbschaftsteuer({
      modus: "erbschaft",
      verwandtschaft: "elternGrosseltern",
      vermoegenswert: 150_000,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 0,
    });
    expect(erbschaft.steuerklasse).toBe(1);
    expect(erbschaft.freibetrag).toBe(100_000);
    expect(erbschaft.steuerpflichtigerErwerb).toBe(35_000);
    expect(erbschaft.steuer).toBe(2_450);

    const schenkung = calculateErbschaftsteuer({
      modus: "schenkung",
      verwandtschaft: "elternGrosseltern",
      vermoegenswert: 150_000,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 0,
    });
    expect(schenkung.steuerklasse).toBe(2);
    expect(schenkung.freibetrag).toBe(20_000);
    expect(schenkung.steuerpflichtigerErwerb).toBe(130_000);
    expect(schenkung.steuer).toBe(26_000);

    // Dieselbe Übertragung kostet zu Lebzeiten ein Vielfaches mehr an Steuer.
    expect(schenkung.steuer).toBeGreaterThan(erbschaft.steuer * 5);
  });

  it("zieht bereits genutzten Freibetrag von früheren Schenkungen ab", () => {
    const input: ErbschaftInput = {
      modus: "schenkung",
      verwandtschaft: "kind",
      vermoegenswert: 250_000,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 300_000,
    };
    const result = calculateErbschaftsteuer(input);
    expect(result.freibetragVerbleibend).toBe(100_000);
    expect(result.steuerpflichtigerErwerb).toBe(150_000);
    expect(result.steuer).toBe(16_500);
  });

  it("kappt einen bereits genutzten Freibetrag auf den vollen Freibetrag", () => {
    const result = calculateErbschaftsteuer({
      ...defaultInput(),
      bereitsGenutzterFreibetrag: 999_999,
    });
    expect(result.freibetragVerbleibend).toBe(0);
    expect(
      result.warnings.some((w) => w.includes("vollständig ausgeschöpft")),
    ).toBe(true);
  });

  it("zieht Nachlassverbindlichkeiten nur bei Erbschaft ab, nicht bei Schenkung", () => {
    const erbschaft = calculateErbschaftsteuer({
      ...defaultInput(),
      nachlassverbindlichkeiten: 50_000,
    });
    expect(erbschaft.bereicherung).toBe(485_000 - 50_000);

    const schenkung = calculateErbschaftsteuer({
      ...defaultInput(),
      modus: "schenkung",
      nachlassverbindlichkeiten: 50_000,
    });
    expect(schenkung.erbfallkostenpauschale).toBe(0);
    expect(schenkung.bereicherung).toBe(500_000);
  });

  it("rundet den steuerpflichtigen Erwerb auf volle 100 Euro ab", () => {
    const result = calculateErbschaftsteuer({
      modus: "schenkung",
      verwandtschaft: "sonstige",
      vermoegenswert: 20_000 + 149.99,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 0,
    });
    expect(result.steuerpflichtigerErwerb).toBe(100);
  });

  it("liefert eine vollständige Stufentabelle mit genau einer aktuellen Zeile", () => {
    const result = calculateErbschaftsteuer(defaultInput());
    expect(result.stufen).toHaveLength(7);
    expect(result.stufen.filter((s) => s.aktuell)).toHaveLength(1);
    expect(result.stufen.find((s) => s.aktuell)?.satz).toBe(11);
  });

  it("markiert bei Steuer null keine Stufe als aktuell", () => {
    const result = calculateErbschaftsteuer({
      ...defaultInput(),
      vermoegenswert: 100_000,
    });
    expect(result.stufen.every((s) => !s.aktuell)).toBe(true);
  });

  it("warnt vor der 10-Jahres-Auffrischung nur bei Schenkung ohne bereits genutzten Freibetrag", () => {
    const schenkung = calculateErbschaftsteuer({ ...defaultInput(), modus: "schenkung" });
    expect(schenkung.warnings.some((w) => w.includes("alle zehn Jahre"))).toBe(true);

    const erbschaft = calculateErbschaftsteuer(defaultInput());
    expect(erbschaft.warnings.some((w) => w.includes("alle zehn Jahre"))).toBe(false);
  });

  it("fängt negative und unsinnige Eingaben ab", () => {
    const result = calculateErbschaftsteuer({
      modus: "erbschaft",
      verwandtschaft: "kind",
      vermoegenswert: -50_000,
      nachlassverbindlichkeiten: -1000,
      bereitsGenutzterFreibetrag: -1000,
    });
    expect(result.steuer).toBe(0);
    expect(result.bereicherung).toBe(0);
    expect(result.freibetragVerbleibend).toBe(400_000);
    expect(Number.isFinite(result.steuer)).toBe(true);
  });

  it("berechnet für sehr große Vermögen im Höchststeuersatz korrekt", () => {
    const result = calculateErbschaftsteuer({
      modus: "erbschaft",
      verwandtschaft: "sonstige",
      vermoegenswert: 30_000_000,
      nachlassverbindlichkeiten: 0,
      bereitsGenutzterFreibetrag: 0,
    });
    expect(result.steuerklasse).toBe(3);
    expect(result.steuersatz).toBe(50);
  });
});
