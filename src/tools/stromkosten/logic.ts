/**
 * Stromkosten je Gerät – reine Berechnung.
 *
 * Der Kern ist trivial: Verbrauch mal Preis. Interessant wird es an drei
 * Stellen, an denen die meisten Rechner ungenau sind:
 *
 *   Nutzungsmuster – ein Fernseher läuft Stunden am Tag, eine Waschmaschine
 *   in Durchgängen pro Woche. Beides in „Stunden pro Tag“ zu pressen führt
 *   zu Zahlen, die niemand eingeben kann.
 *
 *   Standby – oft der größere Posten. Ein Gerät mit 2 W Dauerlast kostet im
 *   Jahr mehr als eines, das man dreimal die Woche eine Stunde nutzt.
 *
 *   Der Preis kommt in Cent je Kilowattstunde, weil er auf der Rechnung so
 *   steht. Gerechnet wird intern in Euro.
 */

export type UsagePattern = "taeglich" | "woechentlich" | "durchgaenge";

interface PatternDef {
  label: string;
  hint: string;
}

export const usagePatterns: Record<UsagePattern, PatternDef> = {
  taeglich: {
    label: "Stunden pro Tag",
    hint: "Für alles, was regelmäßig läuft – Fernseher, Rechner, Licht.",
  },
  woechentlich: {
    label: "Stunden pro Woche",
    hint: "Für alles, was nur manchmal läuft – Staubsauger, Bohrmaschine.",
  },
  durchgaenge: {
    label: "Durchgänge pro Woche",
    hint: "Für Wasch- und Spülmaschine: Verbrauch je Durchgang in kWh.",
  },
};

export interface DevicePreset {
  id: string;
  label: string;
  /** Leistung in Watt – bei Durchgängen stattdessen kWh je Durchgang. */
  watts: number;
  pattern: UsagePattern;
  /** Stunden pro Tag/Woche oder Durchgänge pro Woche. */
  usage: number;
  /** Verbrauch je Durchgang in kWh – nur bei `durchgaenge`. */
  kwhPerCycle: number;
  standbyWatts: number;
}

/**
 * Typische Werte als Startpunkt. Sie ersparen das Nachschlagen auf dem
 * Typenschild und machen sichtbar, welche Geräte wirklich ins Gewicht fallen.
 */
export const devicePresets: DevicePreset[] = [
  { id: "kuehlschrank", label: "Kühlschrank", watts: 45, pattern: "taeglich", usage: 24, kwhPerCycle: 0, standbyWatts: 0 },
  { id: "gefriertruhe", label: "Gefriertruhe", watts: 60, pattern: "taeglich", usage: 24, kwhPerCycle: 0, standbyWatts: 0 },
  { id: "waschmaschine", label: "Waschmaschine", watts: 0, pattern: "durchgaenge", usage: 4, kwhPerCycle: 0.9, standbyWatts: 1 },
  { id: "trockner", label: "Wäschetrockner", watts: 0, pattern: "durchgaenge", usage: 3, kwhPerCycle: 2.5, standbyWatts: 1 },
  { id: "spuelmaschine", label: "Spülmaschine", watts: 0, pattern: "durchgaenge", usage: 5, kwhPerCycle: 1, standbyWatts: 1 },
  { id: "backofen", label: "Backofen", watts: 2500, pattern: "woechentlich", usage: 2, kwhPerCycle: 0, standbyWatts: 1 },
  { id: "fernseher", label: "Fernseher (55 Zoll)", watts: 90, pattern: "taeglich", usage: 4, kwhPerCycle: 0, standbyWatts: 0.5 },
  { id: "gaming", label: "Gaming-PC", watts: 400, pattern: "taeglich", usage: 3, kwhPerCycle: 0, standbyWatts: 3 },
  { id: "laptop", label: "Laptop", watts: 50, pattern: "taeglich", usage: 8, kwhPerCycle: 0, standbyWatts: 1 },
  { id: "heizluefter", label: "Heizlüfter", watts: 2000, pattern: "taeglich", usage: 3, kwhPerCycle: 0, standbyWatts: 0 },
  { id: "klimageraet", label: "Mobiles Klimagerät", watts: 1000, pattern: "taeglich", usage: 6, kwhPerCycle: 0, standbyWatts: 1 },
  { id: "aquarium", label: "Aquarium (200 l)", watts: 80, pattern: "taeglich", usage: 24, kwhPerCycle: 0, standbyWatts: 0 },
  { id: "router", label: "WLAN-Router", watts: 10, pattern: "taeglich", usage: 24, kwhPerCycle: 0, standbyWatts: 0 },
  { id: "kaffeevollautomat", label: "Kaffeevollautomat", watts: 1400, pattern: "woechentlich", usage: 1.5, kwhPerCycle: 0, standbyWatts: 2 },
];

/**
 * CO₂ je Kilowattstunde im deutschen Strommix, in Gramm.
 *
 * Der Wert sinkt mit dem Ausbau der Erneuerbaren spürbar von Jahr zu Jahr –
 * deshalb steht er hier als benannte Konstante und wird in der Oberfläche als
 * Näherung ausgewiesen, nicht als Messwert.
 */
export const CO2_G_PER_KWH = 380;

const HOURS_PER_YEAR = 8760;
const WEEKS_PER_YEAR = 52;
const DAYS_PER_YEAR = 365;

export interface PowerInput {
  /** Leistung im Betrieb, in Watt. */
  watts: number;
  pattern: UsagePattern;
  /** Stunden pro Tag, Stunden pro Woche oder Durchgänge pro Woche. */
  usage: number;
  /** Verbrauch je Durchgang in kWh – nur bei `durchgaenge`. */
  kwhPerCycle: number;
  /** Dauerverbrauch außerhalb der Nutzung, in Watt. */
  standbyWatts: number;
  /** Arbeitspreis in Cent je Kilowattstunde. */
  pricePerKwhCents: number;
}

export interface PowerResult {
  /** Stunden aktiver Nutzung im Jahr – bei Durchgängen nicht aussagekräftig. */
  activeHours: number;
  /** Verbrauch im Betrieb, kWh pro Jahr. */
  activeKwh: number;
  /** Verbrauch im Standby, kWh pro Jahr. */
  standbyKwh: number;
  /** Gesamtverbrauch, kWh pro Jahr. */
  totalKwh: number;
  costPerYear: number;
  costPerMonth: number;
  costPerDay: number;
  /** Kosten allein für den Standby, pro Jahr. */
  standbyCostPerYear: number;
  /** Anteil des Standby am Gesamtverbrauch, in Prozent. */
  standbyShare: number;
  /** CO₂ pro Jahr in Kilogramm, als Näherung. */
  co2KgPerYear: number;
  warnings: string[];
}

export function calculatePower(input: PowerInput): PowerResult {
  const watts = Math.max(0, input.watts);
  const usage = Math.max(0, input.usage);
  const standbyWatts = Math.max(0, input.standbyWatts);
  const priceEuro = Math.max(0, input.pricePerKwhCents) / 100;

  let activeHours: number;
  let activeKwh: number;

  if (input.pattern === "durchgaenge") {
    // Bei Durchgängen zählt der Verbrauch je Lauf, nicht die Leistung: Eine
    // Waschmaschine zieht beim Aufheizen 2000 W und danach fast nichts.
    const cycles = usage * WEEKS_PER_YEAR;
    activeKwh = cycles * Math.max(0, input.kwhPerCycle);
    // Als Näherung für die Standby-Rechnung: eine Stunde je Durchgang.
    activeHours = cycles;
  } else {
    activeHours =
      input.pattern === "taeglich"
        ? Math.min(24, usage) * DAYS_PER_YEAR
        : Math.min(168, usage) * WEEKS_PER_YEAR;
    activeKwh = (watts * activeHours) / 1000;
  }

  // Standby läuft in der übrigen Zeit – nicht rund um die Uhr zusätzlich.
  const standbyHours = Math.max(0, HOURS_PER_YEAR - activeHours);
  const standbyKwh = (standbyWatts * standbyHours) / 1000;

  const totalKwh = activeKwh + standbyKwh;
  const costPerYear = totalKwh * priceEuro;

  const warnings: string[] = [];
  if (input.pattern === "taeglich" && usage > 24) {
    warnings.push("Mehr als 24 Stunden am Tag gibt es nicht – gerechnet wird mit 24.");
  }
  if (input.pattern === "woechentlich" && usage > 168) {
    warnings.push("Mehr als 168 Stunden pro Woche gibt es nicht – gerechnet wird mit 168.");
  }
  if (totalKwh > 0 && standbyKwh / totalKwh > 0.3) {
    warnings.push(
      "Über 30 Prozent des Verbrauchs entfallen auf den Standby. Eine abschaltbare Steckdosenleiste amortisiert sich hier schnell.",
    );
  }
  if (watts >= 2000 && input.pattern === "taeglich" && usage >= 3) {
    warnings.push(
      "Ein Gerät dieser Leistung im Dauerbetrieb ist einer der teuersten Posten im Haushalt. Prüfe, ob eine andere Lösung günstiger ist.",
    );
  }

  return {
    activeHours,
    activeKwh,
    standbyKwh,
    totalKwh,
    costPerYear,
    costPerMonth: costPerYear / 12,
    costPerDay: costPerYear / DAYS_PER_YEAR,
    standbyCostPerYear: standbyKwh * priceEuro,
    standbyShare: totalKwh > 0 ? (standbyKwh / totalKwh) * 100 : 0,
    co2KgPerYear: (totalKwh * CO2_G_PER_KWH) / 1000,
    warnings,
  };
}
