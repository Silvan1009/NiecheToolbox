/**
 * Auto-Unterhaltskosten-Rechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Die meisten Leute überschlagen ihr Auto aus Tanken plus Versicherung plus
 * Steuer – und liegen damit oft um mehr als die Hälfte daneben. Der größte
 * Einzelposten ist fast immer der Wertverlust, gerade weil dafür nie eine
 * Rechnung ins Haus flattert: Das Auto wird einfach über die Zeit weniger
 * wert, unbemerkt neben den Kontobewegungen. Dieser Rechner rechnet ihn
 * deshalb explizit mit, linear über die geplante Haltedauer, und stellt ihn
 * gleichberechtigt neben Kraftstoff, Steuer, Versicherung, Wartung und
 * Verschleiß.
 *
 * Finanzierungskosten – Kreditrate oder Leasingrate – fließen bewusst nicht
 * ein: Das ist eine Frage der Bezahlung, nicht des Unterhalts, und dafür gibt
 * es den Kreditrechner. Hier geht es um das, was ein Auto laufend kostet,
 * unabhängig davon, ob es bar bezahlt wurde oder nicht.
 *
 * Gerechnet wird in ganzen Cent, damit sich über viele addierte Posten kein
 * Rundungsfehler einschleicht.
 */

import { cents, clamp, nn, toEuro } from "@/lib/finanzmath";

export type Antrieb = "benzin" | "diesel" | "elektro";

export const antriebLabels: Record<Antrieb, string> = {
  benzin: "Benzin",
  diesel: "Diesel",
  elektro: "Elektro",
};

export interface AutokostenInput {
  antrieb: Antrieb;
  /** Liter oder Kilowattstunden je 100 Kilometer. */
  verbrauch: number;
  /** Preis je Liter oder Kilowattstunde, in Euro. */
  kraftstoffpreis: number;
  kmProJahr: number;

  kaufpreis: number;
  /** Erwarteter Wert nach Ablauf der Haltedauer. */
  restwert: number;
  haltedauerJahre: number;

  kfzSteuerJahr: number;
  versicherungJahr: number;
  /** Werkstatt laut Wartungsplan, Ölwechsel, TÜV/HU, kleinere Reparaturen. */
  wartungJahr: number;
  /** Reifensatz, Bremsen, Batterie und andere Verschleißteile. */
  verschleissJahr: number;
  /** Stellplatz, ADAC, Maut, Autowäsche – alles sonst Regelmäßige. */
  sonstigesJahr: number;
}

export interface KostenPosten {
  label: string;
  jahr: number;
  monat: number;
  anteilProzent: number;
}

export interface AutokostenResult {
  kraftstoffLabel: string;
  kraftstoffJahr: number;
  kraftstoffLiterOderKwh: number;
  wertverlustJahr: number;

  gesamtkostenJahr: number;
  gesamtkostenMonat: number;
  /** Cent pro Kilometer – direkt vergleichbar mit anderen Mobilitätsformen. */
  kostenProKmCent: number;

  posten: KostenPosten[];
  warnings: string[];
}

export function calculateAutokosten(input: AutokostenInput): AutokostenResult {
  const verbrauch = clamp(input.verbrauch, 0, 60);
  const kraftstoffpreisC = cents(clamp(input.kraftstoffpreis, 0, 5));
  const kmProJahr = Math.round(clamp(input.kmProJahr, 0, 200000));

  const kaufpreisC = cents(nn(input.kaufpreis));
  const restwertC = Math.min(kaufpreisC, cents(nn(input.restwert)));
  const haltedauerJahre = Math.round(clamp(input.haltedauerJahre, 1, 30));

  const kfzSteuerJahrC = cents(nn(input.kfzSteuerJahr));
  const versicherungJahrC = cents(nn(input.versicherungJahr));
  const wartungJahrC = cents(nn(input.wartungJahr));
  const verschleissJahrC = cents(nn(input.verschleissJahr));
  const sonstigesJahrC = cents(nn(input.sonstigesJahr));

  const literOderKwh = (verbrauch / 100) * kmProJahr;
  const kraftstoffJahrC = Math.round(literOderKwh * kraftstoffpreisC);
  const kraftstoffLabel = input.antrieb === "elektro" ? "Stromkosten" : "Kraftstoff";

  const wertverlustJahrC = Math.round((kaufpreisC - restwertC) / haltedauerJahre);

  const gesamtC =
    wertverlustJahrC +
    kraftstoffJahrC +
    kfzSteuerJahrC +
    versicherungJahrC +
    wartungJahrC +
    verschleissJahrC +
    sonstigesJahrC;

  const gesamtMonatC = Math.round(gesamtC / 12);
  const kostenProKmCent = kmProJahr > 0 ? gesamtC / kmProJahr : 0;

  const posten: KostenPosten[] = [
    { label: "Wertverlust", jahrC: wertverlustJahrC },
    { label: kraftstoffLabel, jahrC: kraftstoffJahrC },
    { label: "Versicherung", jahrC: versicherungJahrC },
    { label: "Kfz-Steuer", jahrC: kfzSteuerJahrC },
    { label: "Wartung & Inspektion", jahrC: wartungJahrC },
    { label: "Verschleiß & Reifen", jahrC: verschleissJahrC },
    { label: "Sonstiges", jahrC: sonstigesJahrC },
  ].map(({ label, jahrC }) => ({
    label,
    jahr: toEuro(jahrC),
    monat: toEuro(Math.round(jahrC / 12)),
    anteilProzent: gesamtC > 0 ? (jahrC / gesamtC) * 100 : 0,
  }));

  /* -- Hinweise ------------------------------------------------------------ */

  const warnings: string[] = [];

  const wertverlustAnteil = posten[0]?.anteilProzent ?? 0;
  if (wertverlustAnteil > 30) {
    warnings.push(
      `Der Wertverlust macht ${fmt(wertverlustAnteil)} Prozent der Gesamtkosten aus – mit Abstand der größte Posten, obwohl dafür nie eine Rechnung kommt. Ein älteres oder länger gehaltenes Auto senkt genau diesen Anteil am stärksten.`,
    );
  }

  if (kmProJahr > 0 && kmProJahr < 5000) {
    warnings.push(
      "Bei wenig Fahrleistung dominieren die Fixkosten den Kilometerpreis: Steuer, Versicherung und Wertverlust fallen unabhängig davon an, wie viel gefahren wird. Der Preis pro Kilometer sinkt deshalb spürbar, sobald das Auto mehr genutzt wird.",
    );
  }

  if (kmProJahr === 0) {
    warnings.push(
      "Ohne Fahrleistung lässt sich kein Preis pro Kilometer ausweisen – alle anderen Kosten gelten trotzdem.",
    );
  }

  if (restwertC >= kaufpreisC && kaufpreisC > 0) {
    warnings.push(
      "Der Restwert liegt auf Höhe des Kaufpreises – der Rechner setzt den Wertverlust dann auf null. Für Oldtimer oder gefragte Sammlerfahrzeuge kann der Wert sogar steigen, das bildet dieser Rechner nicht ab.",
    );
  }

  return {
    kraftstoffLabel,
    kraftstoffJahr: toEuro(kraftstoffJahrC),
    kraftstoffLiterOderKwh: literOderKwh,
    wertverlustJahr: toEuro(wertverlustJahrC),

    gesamtkostenJahr: toEuro(gesamtC),
    gesamtkostenMonat: toEuro(gesamtMonatC),
    kostenProKmCent,

    posten,
    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Voreinstellung
 * ------------------------------------------------------------------------- */

export function defaultInput(): AutokostenInput {
  return {
    antrieb: "benzin",
    verbrauch: 6.5,
    kraftstoffpreis: 1.75,
    kmProJahr: 12000,

    kaufpreis: 22000,
    restwert: 9000,
    haltedauerJahre: 6,

    kfzSteuerJahr: 80,
    versicherungJahr: 700,
    wartungJahr: 450,
    verschleissJahr: 300,
    sonstigesJahr: 0,
  };
}

/* Formatierung nur für die Hinweistexte – die UI formatiert selbst. */
const fmt = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 });
