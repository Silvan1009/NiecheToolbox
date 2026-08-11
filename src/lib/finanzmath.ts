/**
 * Finanzmathematik, die mehr als ein Rechner braucht.
 *
 * Der Immobilienrechner hatte diese Bausteine zuerst, aber eingebaut in seine
 * eigene Rechnung: Annuität, Tilgungsplan, interner Zinsfuß. Sparplan- und
 * Kreditrechner brauchen dasselbe, und eine Kopie wäre die dritte Stelle, an
 * der ein Rundungsfehler einzeln gefunden werden müsste. Also einmal hier,
 * einmal getestet.
 *
 * Gerechnet wird in ganzen Cent. Über 600 Monatsschritte driften Kommazahlen
 * in Euro spürbar, und Banken runden den Zins ohnehin monatlich auf den Cent.
 * Prozentsätze und Renditen bleiben Kommazahlen.
 */

export const MONATE_PRO_JAHR = 12;

/* ---------------------------------------------------------------------------
 * Cent-Arithmetik
 * ------------------------------------------------------------------------- */

export const cents = (euro: number) => Math.round(euro * 100);

export const anteil = (c: number, prozent: number) =>
  Math.round((c * prozent) / 100);

/**
 * Cent zurück in Euro – und dabei die negative Null einfangen.
 *
 * `Math.round(-0.4)` ist `-0`, und `Intl.NumberFormat` schreibt das als
 * "-0,00 €". Ein Vorzeichen vor einer Null, die keine ist, sieht nach einem
 * Rechenfehler aus. Hier ist die einzige Stelle, an der Cent zu Euro werden –
 * also die richtige Stelle, das einmal geradezuziehen.
 */
export const toEuro = (c: number) => (c === 0 ? 0 : c / 100);

/** Nicht-negative Zahl; NaN und Infinity werden zu 0. */
export const nn = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Wert in ein Intervall zwingen; NaN und Infinity fallen auf `min`. */
export const clamp = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;

/* ---------------------------------------------------------------------------
 * Interner Zinsfuß
 * ------------------------------------------------------------------------- */

const npv = (rate: number, flows: number[]) =>
  flows.reduce((sum, flow, t) => sum + flow / (1 + rate) ** t, 0);

/**
 * Kandidaten für die Intervallsuche, von null nach außen.
 *
 * Ein fester Startwert dicht bei −1 ist nicht brauchbar: bei monatlichen
 * Reihen über viele Jahre wird (1+r)^t dort so klein, dass es auf null
 * unterläuft und der Barwert Infinity wird. Die Suche scheitert dann an der
 * Gleitkommazahl, nicht an der Mathematik – ein Sparplan über zehn Jahre hätte
 * so gar keine Rendite bekommen. Deshalb wird von null aus nach außen getastet
 * und jeder Kandidat auf Endlichkeit geprüft.
 */
const IRR_KANDIDATEN = [
  0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, -0.01, -0.02, -0.05, -0.1,
  -0.25, -0.5, -0.75, -0.9, -0.99,
];

/**
 * Interner Zinsfuß per Bisektion.
 *
 * Bewusst keine Newton-Iteration: die divergiert bei Zahlungsreihen mit
 * mehreren Vorzeichenwechseln, wie sie durch negative Cashflows und einen
 * großen Erlös am Ende entstehen. Die Bisektion konvergiert immer – sofern es
 * überhaupt eine Nullstelle im Intervall gibt.
 *
 * Die Periode der Rückgabe ist die Periode der Zahlungsreihe: monatliche
 * Flows ergeben einen Monatszins.
 */
export function internerZinsfuss(flows: number[]): number | null {
  const f0 = npv(0, flows);
  if (!Number.isFinite(f0)) return null;
  if (f0 === 0) return 0;

  let lo = 0;
  let hi = 0;
  let fLo = f0;
  let gefunden = false;

  for (const kandidat of IRR_KANDIDATEN) {
    const fK = npv(kandidat, flows);
    if (!Number.isFinite(fK)) continue;
    if (fK === 0) return kandidat;
    if (fK * f0 < 0) {
      // Das Vorzeichen kippt zwischen null und diesem Kandidaten.
      [lo, hi] = kandidat > 0 ? [0, kandidat] : [kandidat, 0];
      fLo = kandidat > 0 ? f0 : fK;
      gefunden = true;
      break;
    }
  }

  if (!gefunden) return null;

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid, flows);
    if (fMid === 0) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

/**
 * Effektiver Jahreszins aus einer monatlichen Zahlungsreihe.
 *
 * Das ist genau der interne Zinsfuß der Reihe, auf ein Jahr hochgerechnet –
 * und damit die Definition, nach der die Preisangabenverordnung den
 * effektiven Jahreszins bestimmt: der Satz, bei dem der Barwert aller
 * Zahlungen dem ausgezahlten Betrag entspricht. Gebühren und ein Disagio
 * stecken deshalb automatisch drin, sobald sie in der Reihe stehen.
 *
 * Erwartet wird `flows[0]` als Auszahlung (positiv) und danach die Raten
 * (negativ). Rückgabe in Prozent pro Jahr.
 */
export function effektivzins(flows: number[]): number | null {
  const monatszins = internerZinsfuss(flows);
  if (monatszins === null) return null;
  const jahreszins = (1 + monatszins) ** MONATE_PRO_JAHR - 1;
  return Number.isFinite(jahreszins) ? jahreszins * 100 : null;
}

/* ---------------------------------------------------------------------------
 * Annuität
 * ------------------------------------------------------------------------- */

/**
 * Monatsrate eines Annuitätendarlehens, in Cent.
 *
 * A = K · i / (1 − (1+i)^−n). Bei Zins 0 bleibt davon die schlichte Teilung
 * übrig – der Fall muss getrennt behandelt werden, weil die Formel dort durch
 * null teilt.
 *
 * Aufgerundet, nicht kaufmännisch gerundet: eine auf den nächsten Cent
 * abgerundete Rate tilgt das Darlehen in der genannten Laufzeit knapp *nicht*.
 * Bei 10.000 Euro über 60 Monate fehlen am Ende zwölf Cent, für die es einen
 * einundsechzigsten Monat bräuchte – ein Rechner, der "60 Monate" sagt und
 * dann eine Tabelle mit 61 Zeilen zeigt, sieht kaputt aus. Aufgerundet fällt
 * stattdessen die letzte Rate ein paar Cent kleiner aus, so wie im echten
 * Tilgungsplan einer Bank auch.
 */
export function annuitaetsRate(
  darlehenC: number,
  zinsPa: number,
  monate: number,
): number {
  if (darlehenC <= 0 || monate <= 0) return 0;
  const i = zinsPa / 100 / MONATE_PRO_JAHR;
  if (i <= 0) return Math.ceil(darlehenC / monate);
  return Math.ceil((darlehenC * i) / (1 - (1 + i) ** -monate));
}

/**
 * Laufzeit in Monaten aus einer gewünschten Rate.
 *
 * `null`, wenn die Rate die Monatszinsen nicht deckt: dann wächst die
 * Restschuld, und es gibt keine Laufzeit. Das ist keine Randnotiz, sondern der
 * Fehler, den ein Kreditrechner benennen muss.
 */
export function laufzeitAusRate(
  darlehenC: number,
  zinsPa: number,
  rateC: number,
): number | null {
  if (darlehenC <= 0) return 0;
  if (rateC <= 0) return null;

  const i = zinsPa / 100 / MONATE_PRO_JAHR;
  if (i <= 0) return Math.ceil(darlehenC / rateC);

  const monatszinsC = darlehenC * i;
  if (rateC <= monatszinsC) return null;

  const monate = -Math.log(1 - (darlehenC * i) / rateC) / Math.log(1 + i);
  return Number.isFinite(monate) ? Math.ceil(monate) : null;
}

/* ---------------------------------------------------------------------------
 * Tilgungsplan
 * ------------------------------------------------------------------------- */

export interface TilgungsJahr {
  jahr: number;
  zinsC: number;
  tilgungC: number;
  /** Summe aus Zins und Tilgung, ohne Sondertilgung. */
  rateC: number;
  sondertilgungC: number;
  restschuldC: number;
}

export interface Tilgungsplan {
  jahre: TilgungsJahr[];
  gesamtzinsenC: number;
  gesamtSondertilgungC: number;
  /** Monate bis zur vollständigen Tilgung; `null`, wenn die Rate den Zins nicht deckt. */
  volltilgungMonate: number | null;
  /** Restschuld am Ende des Plans – über `bisJahr` steuerbar. */
  restschuldC: number;
  /**
   * Alle Zahlungen in Monatsschritten, negativ (Abfluss beim Kreditnehmer).
   * Sondertilgungen liegen im Monat, in dem sie fällig werden. Direkt
   * verwendbar für `effektivzins`.
   */
  monatsFlowsC: number[];
}

/**
 * Monatsgenauer Tilgungsplan, aggregiert auf Jahre.
 *
 * Monatsgenau und nicht per Jahresnäherung, weil die Restschuld zum Ende der
 * Zinsbindung sonst um vierstellige Beträge danebenliegt – und das ist die
 * Zahl, an der eine Anschlussfinanzierung hängt.
 *
 * Die Sondertilgung wird am Ende jedes vollen Jahres verrechnet, so wie es
 * die meisten Verträge vorsehen.
 */
export function tilgungsplan({
  darlehenC,
  zinsPa,
  monatsrateC,
  sondertilgungC = 0,
  maxJahre = 50,
}: {
  darlehenC: number;
  zinsPa: number;
  monatsrateC: number;
  sondertilgungC?: number;
  maxJahre?: number;
}): Tilgungsplan {
  const zinsProMonat = zinsPa / 100 / MONATE_PRO_JAHR;

  const jahre: TilgungsJahr[] = [];
  const monatsFlowsC: number[] = [];

  let restC = darlehenC;
  let monate = 0;
  let gesamtzinsenC = 0;
  let gesamtSondertilgungC = 0;
  let volltilgungMonate: number | null = darlehenC <= 0 ? 0 : null;

  for (let j = 1; j <= maxJahre && restC > 0; j++) {
    let zinsJahrC = 0;
    let tilgungJahrC = 0;
    let rateJahrC = 0;

    for (let m = 0; m < MONATE_PRO_JAHR && restC > 0; m++) {
      monate += 1;
      const zC = Math.round(restC * zinsProMonat);
      // Deckt die Rate den Zins nicht, wird nicht getilgt – die Restschuld
      // bleibt stehen. Das ist der Fall "Tilgung 0 Prozent".
      let tC = Math.max(0, monatsrateC - zC);
      if (tC > restC) tC = restC;
      restC -= tC;

      zinsJahrC += zC;
      tilgungJahrC += tC;
      rateJahrC += zC + tC;
      monatsFlowsC.push(-(zC + tC));

      if (restC === 0) volltilgungMonate = monate;
    }

    // Sondertilgung am Jahresende, solange noch etwas offen ist.
    let sonderJahrC = 0;
    if (sondertilgungC > 0 && restC > 0) {
      sonderJahrC = Math.min(sondertilgungC, restC);
      restC -= sonderJahrC;
      gesamtSondertilgungC += sonderJahrC;
      if (monatsFlowsC.length > 0) {
        monatsFlowsC[monatsFlowsC.length - 1] -= sonderJahrC;
      }
      if (restC === 0) volltilgungMonate = monate;
    }

    gesamtzinsenC += zinsJahrC;

    jahre.push({
      jahr: j,
      zinsC: zinsJahrC,
      tilgungC: tilgungJahrC,
      rateC: rateJahrC,
      sondertilgungC: sonderJahrC,
      restschuldC: restC,
    });
  }

  return {
    jahre,
    gesamtzinsenC,
    gesamtSondertilgungC,
    volltilgungMonate,
    restschuldC: restC,
    monatsFlowsC,
  };
}

/* ---------------------------------------------------------------------------
 * Verzinsung
 * ------------------------------------------------------------------------- */

/**
 * Endwert einer einmaligen Anlage nach `jahre` Jahren.
 *
 * Bewusst in Euro und nicht in Cent: hier wird nicht Monat für Monat
 * abgerechnet, sondern eine geschlossene Formel ausgewertet. Ein Rundungsschritt
 * auf den Cent gehört an die Stelle, an der das Ergebnis entsteht.
 */
export const endwert = (kapital: number, renditePa: number, jahre: number) =>
  kapital * (1 + renditePa / 100) ** jahre;

/**
 * Monatszins aus einem effektiven Jahreszins.
 *
 * Der Unterschied zur naheliegenden Division durch zwölf ist keine
 * Feinheit, sondern entscheidet über mehrere Prozent Endkapital: Wer
 * 7 Prozent durch zwölf teilt, verzinst effektiv mit 7,229 Prozent, weil
 * sich die Monatszinsen untereinander verzinsen. Über dreißig Jahre sind das
 * gut vier Prozent zu viel.
 *
 * Bei einer Geldanlage ist die genannte Rendite die effektive: Aus 10.000
 * Euro zu 7 Prozent werden nach einem Jahr 10.700 Euro, nicht 10.723. Deshalb
 * muss der Monatszins die zwölfte Wurzel sein.
 *
 * Beim Kredit gilt das Gegenteil: Der deutsche Sollzins ist ein nominaler
 * Jahreszins mit monatlicher Verrechnung, dort ist die Division durch zwölf
 * richtig – und genau daher stammt der Abstand zum effektiven Jahreszins,
 * den die Preisangabenverordnung ausweist.
 */
export const monatszinsEffektiv = (jahreszinsPa: number) =>
  (1 + jahreszinsPa / 100) ** (1 / MONATE_PRO_JAHR) - 1;

/**
 * Nominaler Jahreszins, dessen Zwölftel dem effektiven Monatszins entspricht.
 *
 * Brücke zu den Funktionen, die intern durch zwölf teilen – etwa
 * `annuitaetsRate`, die für Kredite gebaut ist und dort richtig rechnet. Wer
 * sie für einen Entnahmeplan benutzt, schickt die Rendite vorher hier durch.
 */
export const nominalAusEffektiv = (effektivPa: number) =>
  monatszinsEffektiv(effektivPa) * MONATE_PRO_JAHR * 100;

/**
 * Wie lange dauert die Verdopplung? Antwort in Jahren, `null` ohne Rendite.
 *
 * Die bekannte 72er-Faustregel ist eine Näherung dieser Formel; hier wird
 * gerechnet statt geschätzt, weil der Rechner die Zahl ohnehin exakt hat.
 */
export function verdopplungsdauer(renditePa: number): number | null {
  if (renditePa <= 0) return null;
  const jahre = Math.log(2) / Math.log(1 + renditePa / 100);
  return Number.isFinite(jahre) ? jahre : null;
}

/**
 * Jahre in Rente: Lebenserwartung minus Renteneintrittsalter.
 *
 * Die Lebenserwartung wird auf mindestens ein Jahr nach dem Renteneintritt
 * geklemmt – sonst wäre die Bezugsdauer negativ oder null, obwohl es um eine
 * laufende Rente geht.
 */
export function jahreRentenbezug(
  alterBeiRente: number,
  lebenserwartungRoh: number,
  min = 0,
): number {
  const lebenserwartung = Math.round(
    clamp(lebenserwartungRoh, alterBeiRente + 1, 110),
  );
  return Math.max(min, lebenserwartung - alterBeiRente);
}
