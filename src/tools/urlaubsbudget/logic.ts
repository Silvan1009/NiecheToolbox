/**
 * Urlaubsbudget – was die Reise kostet und was bis zur Abreise zurückgelegt
 * werden muss.
 *
 * Der Rechenkern ist eine Addition. Interessant sind die drei Stellen, an
 * denen die naheliegende Addition falsch liegt:
 *
 *   Tage und Nächte sind nicht dasselbe. Eine Woche Urlaub heißt sieben
 *   Übernachtungen, aber acht Tage, an denen gegessen wird. Wer Verpflegung
 *   mit den Nächten multipliziert, rechnet einen ganzen Tag zu wenig.
 *
 *   Kinder zählen nicht wie Erwachsene – jedenfalls nicht überall. Beim Essen
 *   und bei Eintritten kosten sie weniger, beim Flug fast dasselbe. Ein
 *   einziger Kopf-Faktor über alle Posten wäre an einer der beiden Stellen
 *   grob daneben.
 *
 *   Das Zimmer kostet pro Nacht, nicht pro Person und Nacht. So steht es in
 *   jedem Angebot, und so wird es hier gerechnet.
 *
 * Gerechnet wird in ganzen Cent, wie überall in diesem Projekt.
 */

import { anteil, cents, clamp, nn } from "@/lib/finanzmath";
import { fromIso, isValidIso, type Iso } from "@/lib/date";

/** Mehr als drei Jahre Vorlauf plant niemand für einen Urlaub. */
const MAX_MONATE = 36;

export interface UrlaubInput {
  erwachsene: number;
  kinder: number;
  /** Anteil, mit dem ein Kind bei Verpflegung und Aktivitäten zählt. */
  kindFaktorPercent: number;
  naechte: number;

  /** Pauschal für die ganze Reise: Sprit, Maut, Fähre. */
  anreiseGesamt: number;
  /** Je Kopf: Flug, Bahn. Kinder zählen hier voll. */
  anreiseProPerson: number;
  /** Je Nacht, nicht je Person. */
  unterkunftProNacht: number;
  verpflegungProPersonTag: number;
  aktivitaetenProPersonTag: number;
  transportVorOrtGesamt: number;
  versicherungGesamt: number;

  /** Aufschlag auf alle Posten, in Prozent. */
  pufferPercent: number;

  /** Schon zurückgelegt. */
  ruecklageVorhanden: number;
  monateBisAbreise: number;
}

export interface Posten {
  label: string;
  betragC: number;
}

export interface UrlaubResult {
  /** Übernachtungen plus Anreisetag. */
  tage: number;
  personen: number;
  /** Kinder anteilig – Grundlage für Verpflegung und Aktivitäten. */
  personenGewichtet: number;

  posten: Posten[];
  zwischensummeC: number;
  pufferC: number;
  gesamtC: number;

  proPersonC: number;
  proTagC: number;
  /** Nur was vor Ort ausgegeben wird – das Budget für die Geldbörse. */
  tagesbudgetVorOrtC: number;

  offenC: number;
  /** `null`, wenn kein Vorlauf bleibt. */
  sparrateC: number | null;

  warnings: string[];
}

export function calculateUrlaub(input: UrlaubInput): UrlaubResult {
  const erwachsene = clamp(Math.round(nn(input.erwachsene)), 0, 20);
  const kinder = clamp(Math.round(nn(input.kinder)), 0, 20);
  const naechte = clamp(Math.round(nn(input.naechte)), 0, 365);
  const kindFaktor = clamp(nn(input.kindFaktorPercent), 0, 100);

  const personen = erwachsene + kinder;
  // Der Anreisetag wird mitgegessen: sieben Nächte sind acht Tage.
  const tage = naechte + 1;
  const personenGewichtet = erwachsene + (kinder * kindFaktor) / 100;

  const anreiseC =
    cents(nn(input.anreiseGesamt)) +
    cents(nn(input.anreiseProPerson)) * personen;
  const unterkunftC = cents(nn(input.unterkunftProNacht)) * naechte;
  const verpflegungC = Math.round(
    cents(nn(input.verpflegungProPersonTag)) * personenGewichtet * tage,
  );
  const aktivitaetenC = Math.round(
    cents(nn(input.aktivitaetenProPersonTag)) * personenGewichtet * tage,
  );
  const transportC = cents(nn(input.transportVorOrtGesamt));
  const versicherungC = cents(nn(input.versicherungGesamt));

  // Nur Posten mit Betrag – eine Aufstellung voller Nullzeilen liest niemand.
  const alle: Posten[] = [
    { label: "Anreise", betragC: anreiseC },
    { label: "Unterkunft", betragC: unterkunftC },
    { label: "Verpflegung", betragC: verpflegungC },
    { label: "Aktivitäten", betragC: aktivitaetenC },
    { label: "Transport vor Ort", betragC: transportC },
    { label: "Reiseversicherung", betragC: versicherungC },
  ];
  const posten = alle.filter((p) => p.betragC > 0);

  const zwischensummeC = alle.reduce((sum, p) => sum + p.betragC, 0);
  const pufferC = anteil(
    zwischensummeC,
    clamp(nn(input.pufferPercent), 0, 100),
  );
  const gesamtC = zwischensummeC + pufferC;

  const vorOrtC = verpflegungC + aktivitaetenC + transportC;

  const offenC = Math.max(0, gesamtC - cents(nn(input.ruecklageVorhanden)));
  const monate = clamp(Math.round(nn(input.monateBisAbreise)), 0, MAX_MONATE);

  /*
   * Bewusst schlichte Division und keine Verzinsung über `endwert` oder
   * `annuitaetsRate`: Eine Urlaubskasse liegt sechs bis zwölf Monate auf einem
   * Tagesgeldkonto. Bei 3.000 Euro und zwei Prozent wären das gut 30 Euro –
   * weniger als die Streuung der Wechselkurse am Reisetag. Eine Zinsrechnung
   * würde hier Genauigkeit vortäuschen, die es nicht gibt.
   *
   * Aufgerundet, nicht kaufmännisch: eine abgerundete Rate erreicht das
   * Budget am Ende knapp nicht.
   */
  const sparrateC = monate > 0 ? Math.ceil(offenC / monate) : null;

  const warnings: string[] = [];

  if (personen === 0) {
    warnings.push(
      "Ohne Reisende bleibt nur die Pauschale stehen. Trag mindestens eine Person ein.",
    );
  }

  if (clamp(nn(input.pufferPercent), 0, 100) < 5 && zwischensummeC > 0) {
    warnings.push(
      "Unter fünf Prozent Puffer platzt ein Reisebudget an der ersten Panne – ein verpasster Anschluss, ein Arztbesuch, ein teureres Zimmer als gebucht.",
    );
  }

  if (personen > 0 && tage > 0) {
    const proKopfProTagC = vorOrtC / personen / tage;
    if (vorOrtC > 0 && proKopfProTagC < 2000) {
      warnings.push(
        "Unter 20 Euro pro Person und Tag ist außerhalb eines All-inclusive-Hotels schwer zu halten. Prüfe, ob Verpflegung und Aktivitäten realistisch angesetzt sind.",
      );
    }
  }

  if (monate === 0 && offenC > 0) {
    warnings.push(
      "Ohne Vorlauf gibt es keine Sparrate – der offene Betrag muss zum Abreisetag vorhanden sein.",
    );
  }

  if (kinder > 0 && kindFaktor >= 100) {
    warnings.push(
      "Kinder zählen hier voll. Bei Verpflegung und Eintritten ist das meist zu hoch gegriffen; 50 bis 70 Prozent kommen der Wirklichkeit näher.",
    );
  }

  if (naechte === 0 && zwischensummeC > 0) {
    warnings.push(
      "Ohne Übernachtung wird nur der Anreisetag gerechnet. Für einen Tagesausflug stimmt das, für eine Reise fehlt die Zahl der Nächte.",
    );
  }

  return {
    tage,
    personen,
    personenGewichtet,
    posten,
    zwischensummeC,
    pufferC,
    gesamtC,
    proPersonC: personen > 0 ? Math.round(gesamtC / personen) : 0,
    proTagC: Math.round(gesamtC / tage),
    tagesbudgetVorOrtC: Math.round(vorOrtC / tage),
    offenC,
    sparrateC,
    warnings,
  };
}

/**
 * Volle Monate zwischen heute und der Abreise.
 *
 * Bewusst abgerundet: Wer in 5,8 Monaten fährt, hat fünf Gehaltseingänge Zeit,
 * nicht sechs. Eine aufgerundete Zahl würde die Sparrate zu niedrig ansetzen.
 * Ein Datum in der Vergangenheit ergibt 0, nicht negativ.
 */
export function monateBis(heute: Iso, abreise: Iso): number {
  if (!isValidIso(heute) || !isValidIso(abreise)) return 0;
  const tage = (fromIso(abreise) - fromIso(heute)) / 86_400_000;
  if (!Number.isFinite(tage) || tage <= 0) return 0;
  return clamp(Math.floor(tage / 30.44), 0, MAX_MONATE);
}

/**
 * Voreinstellung: zwei Erwachsene, eine Woche Mittelmeer mit dem Flugzeug –
 * die häufigste Urlaubsform in Deutschland.
 */
export function defaultInput(): UrlaubInput {
  return {
    erwachsene: 2,
    kinder: 0,
    kindFaktorPercent: 60,
    naechte: 7,
    anreiseGesamt: 0,
    anreiseProPerson: 220,
    unterkunftProNacht: 95,
    verpflegungProPersonTag: 35,
    aktivitaetenProPersonTag: 15,
    transportVorOrtGesamt: 120,
    versicherungGesamt: 40,
    pufferPercent: 10,
    ruecklageVorhanden: 0,
    monateBisAbreise: 6,
  };
}
