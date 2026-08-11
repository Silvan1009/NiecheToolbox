/**
 * Abfindungsrechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Eine Abfindung wird nicht separat besteuert, sondern zum übrigen
 * Jahreseinkommen addiert – ohne Korrektur würde sie wegen der progressiven
 * Einkommensteuer oft in den Höchststeuersatz rutschen, obwohl sie eigentlich
 * eine Entschädigung für mehrere Jahre entgangenes Gehalt ist. Die
 * Fünftelregelung (§ 34 Abs. 1 EStG i. V. m. § 24 Nr. 1 EStG) gleicht das
 * rechnerisch aus: Sie tut so, als käme nur ein Fünftel der Abfindung in
 * diesem Jahr an, besteuert diesen Unterschied und multipliziert ihn mit
 * fünf. Weil der Einkommensteuertarif progressiv, aber konvex ist, kommt dabei
 * nie mehr heraus als bei sofortiger voller Versteuerung – das Finanzamt
 * wendet die Regelung von Amts wegen an, wenn sie günstiger ist.
 *
 * Für die Einkommensteuer selbst wird dieselbe Tariffunktion nach § 32a EStG
 * verwendet wie im Brutto-Netto-Rechner (`einkommensteuer` aus
 * `lib/steuerdaten`) – eine zweite, eigene Nachbildung des Tarifs wäre
 * die zweite Stelle, an der sich ein Fehler in den Koeffizienten einschleichen
 * könnte. Die Berechnung geht vom zu versteuernden Jahreseinkommen aus, nicht
 * vom Bruttogehalt – wer das noch nicht kennt, findet die Herleitung im
 * Brutto-Netto-Rechner.
 *
 * Gerechnet wird in ganzen Euro, wie es der Gesetzestext für den
 * Einkommensteuertarif selbst vorschreibt (Abrundung auf volle Euro).
 */

import { clamp, nn } from "@/lib/finanzmath";
import { formatInteger } from "@/lib/format";
import {
  SOLI_FREIGRENZE,
  SOLI_FREIGRENZE_SPLITTING,
  SOLI_MILDERUNG_SATZ,
  SOLI_SATZ,
  einkommensteuer,
} from "@/lib/steuerdaten";

export interface AbfindungInput {
  /** Zu versteuerndes Jahreseinkommen ohne die Abfindung. */
  zvEOhneAbfindung: number;
  abfindungsbetrag: number;
  zusammenveranlagung: boolean;
  /** 0, 8 oder 9 Prozent. */
  kirchensteuerPercent: number;
}

export interface AbfindungResult {
  steuerOhneAbfindung: number;
  /** Zusätzliche Einkommensteuer durch die Abfindung, mit Fünftelregelung. */
  steuerAufAbfindungFuenftel: number;
  /** Vergleich: zusätzliche Einkommensteuer bei sofortiger voller Versteuerung. */
  steuerAufAbfindungVoll: number;
  ersparnisEinkommensteuer: number;
  soliAufAbfindung: number;
  kirchensteuerAufAbfindung: number;
  gesamtabgabeAufAbfindung: number;
  nettoAbfindung: number;
  effektiverSteuersatz: number;
  warnings: string[];
}

/** § 32a EStG, Grundtarif oder Splittingverfahren (§ 32a Abs. 5 EStG: doppeltes Einkommen halbiert, Steuer verdoppelt). */
function jahresEinkommensteuer(
  zvE: number,
  zusammenveranlagung: boolean,
): number {
  const x = Math.max(0, zvE);
  return zusammenveranlagung ? 2 * einkommensteuer(x / 2) : einkommensteuer(x);
}

/** Wie im Brutto-Netto-Rechner: 5,5 % mit Milderungszone bis 11,9 % des übersteigenden Betrags. */
function solidaritaetszuschlag(
  steuerbetrag: number,
  zusammenveranlagung: boolean,
): number {
  const freigrenze = zusammenveranlagung
    ? SOLI_FREIGRENZE_SPLITTING
    : SOLI_FREIGRENZE;
  if (steuerbetrag <= freigrenze) return 0;

  const voll = (steuerbetrag * SOLI_SATZ) / 100;
  const milderung = ((steuerbetrag - freigrenze) * SOLI_MILDERUNG_SATZ) / 100;
  return Math.min(voll, milderung);
}

export function calculateAbfindung(input: AbfindungInput): AbfindungResult {
  const zvEOhne = nn(input.zvEOhneAbfindung);
  const abfindung = nn(input.abfindungsbetrag);
  const zusammenveranlagung = input.zusammenveranlagung;
  const kirchensteuerPercent = clamp(input.kirchensteuerPercent, 0, 9);

  const steuerOhne = jahresEinkommensteuer(zvEOhne, zusammenveranlagung);

  // Fünftelregelung: Steuer auf ein Fünftel der Abfindung obendrauf, mal fünf.
  const steuerMitFuenftel = jahresEinkommensteuer(
    zvEOhne + abfindung / 5,
    zusammenveranlagung,
  );
  const steuerAufAbfindungFuenftel = Math.max(
    0,
    5 * (steuerMitFuenftel - steuerOhne),
  );

  // Vergleich: was die Abfindung ohne die Regelung kosten würde.
  const steuerMitVoll = jahresEinkommensteuer(
    zvEOhne + abfindung,
    zusammenveranlagung,
  );
  const steuerAufAbfindungVoll = Math.max(0, steuerMitVoll - steuerOhne);

  const ersparnisEinkommensteuer = Math.max(
    0,
    steuerAufAbfindungVoll - steuerAufAbfindungFuenftel,
  );

  const gesamtsteuerMitAbfindung = steuerOhne + steuerAufAbfindungFuenftel;
  const soliOhne = solidaritaetszuschlag(steuerOhne, zusammenveranlagung);
  const soliMit = solidaritaetszuschlag(
    gesamtsteuerMitAbfindung,
    zusammenveranlagung,
  );
  const soliAufAbfindung = Math.max(0, soliMit - soliOhne);

  const kirchensteuerAufAbfindung =
    (steuerAufAbfindungFuenftel * kirchensteuerPercent) / 100;

  const gesamtabgabeAufAbfindung =
    steuerAufAbfindungFuenftel + soliAufAbfindung + kirchensteuerAufAbfindung;
  const nettoAbfindung = abfindung - gesamtabgabeAufAbfindung;
  const effektiverSteuersatz =
    abfindung > 0 ? (gesamtabgabeAufAbfindung / abfindung) * 100 : 0;

  const warnings: string[] = [];

  if (abfindung > 0 && ersparnisEinkommensteuer <= 0) {
    warnings.push(
      "Bei diesem Einkommen bringt die Fünftelregelung keinen Vorteil gegenüber der vollen Versteuerung im selben Jahr – das kommt vor, wenn das reguläre Einkommen bereits im Spitzensteuersatz liegt und die Abfindung daran nichts mehr ändert.",
    );
  } else if (ersparnisEinkommensteuer > 0) {
    warnings.push(
      `Die Fünftelregelung spart hier ${formatInteger(ersparnisEinkommensteuer)} € Einkommensteuer gegenüber einer sofortigen vollen Versteuerung im selben Jahr.`,
    );
  }

  if (zvEOhne > 0 && abfindung > 0) {
    warnings.push(
      "Der Vorteil der Fünftelregelung ist am größten, wenn das reguläre Einkommen im Abfindungsjahr niedrig ist – etwa, weil auf die Kündigung eine Zeit ohne oder mit geringerem Einkommen folgt. Wer die Wahl hat, sollte den Auszahlungstermin danach ausrichten.",
    );
  }

  if (kirchensteuerPercent > 0) {
    warnings.push(
      "Auf Antrag erlassen viele Landeskirchen die Kirchensteuer auf eine Abfindung ganz oder teilweise aus Billigkeitsgründen, weil sie eine einmalige Härte darstellt. Das ist keine Pflichtleistung, sondern muss beim zuständigen Kirchensteueramt separat beantragt werden.",
    );
  }

  return {
    steuerOhneAbfindung: Math.round(steuerOhne),
    steuerAufAbfindungFuenftel: Math.round(steuerAufAbfindungFuenftel),
    steuerAufAbfindungVoll: Math.round(steuerAufAbfindungVoll),
    ersparnisEinkommensteuer: Math.round(ersparnisEinkommensteuer),
    soliAufAbfindung: Math.round(soliAufAbfindung * 100) / 100,
    kirchensteuerAufAbfindung:
      Math.round(kirchensteuerAufAbfindung * 100) / 100,
    gesamtabgabeAufAbfindung: Math.round(gesamtabgabeAufAbfindung * 100) / 100,
    nettoAbfindung: Math.round(nettoAbfindung * 100) / 100,
    effektiverSteuersatz,
    warnings,
  };
}

export function defaultInput(): AbfindungInput {
  return {
    zvEOhneAbfindung: 45_000,
    abfindungsbetrag: 30_000,
    zusammenveranlagung: false,
    kirchensteuerPercent: 0,
  };
}
