/**
 * Kredit- und Tilgungsrechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Ein Kreditrechner, der nur die Monatsrate ausgibt, beantwortet die
 * unwichtigste der vier Fragen. Die anderen drei entscheiden über den Preis:
 *
 *   Was kostet der Kredit wirklich? Der Sollzins steht im Angebot, bezahlt
 *   wird der effektive Jahreszins – und der enthält Bearbeitungsgebühren,
 *   ein Disagio und eine mitfinanzierte Restschuldversicherung. Genau die
 *   Posten also, mit denen ein optisch günstiges Angebot teuer wird.
 *
 *   Was bleibt am Ende der Zinsbindung offen? Bei einer Baufinanzierung ist
 *   nicht die heutige Rate das Risiko, sondern die Restschuld, die zu einem
 *   dann unbekannten Zins neu finanziert werden muss.
 *
 *   Was bringt Sondertilgung? Bei langen Laufzeiten verkürzt sie die Laufzeit
 *   überproportional, weil jeder vorzeitig getilgte Euro alle künftigen Zinsen
 *   auf diesen Euro spart.
 *
 *   Und die Umkehrung: Welche Laufzeit ergibt sich aus einer Rate, die man
 *   sich tatsächlich leisten kann?
 *
 * Gerechnet wird monatlich in ganzen Cent, über einen echten Tilgungsplan und
 * nicht über eine Jahresnäherung – sonst liegt die Restschuld am Ende der
 * Zinsbindung um vierstellige Beträge daneben.
 *
 * Keine Rechts- oder Finanzberatung: Kreditwürdigkeit, Zinsaufschläge nach
 * Bonität und die steuerliche Behandlung von Zinsen bleiben außen vor.
 */

import {
  MONATE_PRO_JAHR,
  annuitaetsRate,
  anteil,
  cents,
  clamp,
  effektivzins,
  laufzeitAusRate,
  nn,
  tilgungsplan,
  toEuro,
} from "@/lib/finanzmath";
import { formatEuroRounded, formatRate } from "@/lib/format";

/** Kein Ratenkredit läuft länger als ein Berufsleben. */
const MAX_JAHRE = 40;

export type KreditModus = "rate-aus-laufzeit" | "laufzeit-aus-rate";

export interface KreditInput {
  /** Laufzeit vorgeben und die Rate errechnen – oder umgekehrt. */
  modus: KreditModus;
  kreditbetrag: number;
  sollzinsPercent: number;
  /** Im Modus "rate-aus-laufzeit". */
  laufzeitJahre: number;
  /** Im Modus "laufzeit-aus-rate". */
  wunschrateMonat: number;
  /** Jährliche Sondertilgung, verrechnet am Jahresende. */
  sondertilgungJahr: number;
  /** Bearbeitungsgebühr oder Disagio – mindert die Auszahlung. */
  bearbeitungsgebuehrPercent: number;
  /** Einmalprämie einer Restschuldversicherung, mitfinanziert. */
  restschuldversicherung: number;
  /** Zinsbindung in Jahren; 0 heißt: Zins gilt für die ganze Laufzeit. */
  zinsbindungJahre: number;
}

export interface KreditJahr {
  jahr: number;
  zins: number;
  tilgung: number;
  rate: number;
  sondertilgung: number;
  restschuld: number;
}

export interface KreditResult {
  /** Die tatsächlich gerechnete Monatsrate. */
  monatsrate: number;
  laufzeitMonate: number;
  laufzeitJahre: number;

  /** Schuld inklusive mitfinanzierter Restschuldversicherung. */
  darlehen: number;
  /** Was auf dem Konto ankommt: Kreditbetrag minus Gebühren. */
  auszahlung: number;

  gesamtzinsen: number;
  gebuehren: number;
  /** Summe aller Zahlungen über die Laufzeit. */
  gesamtaufwand: number;
  /** Was der Kredit über die Auszahlung hinaus kostet. */
  kreditkosten: number;

  /** Nach der Preisangabenverordnung, inklusive aller Nebenkosten. */
  effektiverJahreszins: number | null;
  /** Anteil der Zinsen an der Summe aller Zahlungen. */
  zinsanteilProzent: number | null;

  /** Offener Betrag am Ende der Zinsbindung; null ohne Zinsbindung. */
  restschuldNachZinsbindung: number | null;
  zinsbindungJahre: number;

  /** Ersparnis durch die eingetragene Sondertilgung. */
  sondertilgungZinsersparnis: number;
  sondertilgungVerkuerzungMonate: number;

  /** Rate deckt die Zinsen nicht – der Kredit wächst. */
  tilgtNicht: boolean;

  jahre: KreditJahr[];
  warnings: string[];
}

/* ---------------------------------------------------------------------------
 * Hauptrechnung
 * ------------------------------------------------------------------------- */

export function calculateKredit(input: KreditInput): KreditResult {
  const kreditbetragC = cents(nn(input.kreditbetrag));
  const rsvC = cents(nn(input.restschuldversicherung));
  const sollzins = clamp(input.sollzinsPercent, 0, 30);
  const gebuehrPercent = clamp(input.bearbeitungsgebuehrPercent, 0, 20);
  const sondertilgungC = cents(nn(input.sondertilgungJahr));
  const laufzeitJahre = Math.round(clamp(input.laufzeitJahre, 1, MAX_JAHRE));
  const zinsbindung = Math.round(clamp(input.zinsbindungJahre, 0, MAX_JAHRE));

  // Die Restschuldversicherung wird üblicherweise mitfinanziert: Sie erhöht
  // die Schuld, aber nicht den Betrag, der auf dem Konto ankommt. Genau
  // dadurch treibt sie den effektiven Zins so stark.
  const darlehenC = kreditbetragC + rsvC;
  const gebuehrC = anteil(kreditbetragC, gebuehrPercent);
  const auszahlungC = kreditbetragC - gebuehrC;

  /* -- Rate und Laufzeit -------------------------------------------------- */

  let monatsrateC: number;
  let tilgtNicht = false;

  if (input.modus === "laufzeit-aus-rate") {
    monatsrateC = cents(nn(input.wunschrateMonat));
    const monate = laufzeitAusRate(darlehenC, sollzins, monatsrateC);
    if (monate === null) {
      tilgtNicht = true;
    } else if (monate > MAX_JAHRE * MONATE_PRO_JAHR) {
      // Rechnerisch tilgt die Rate, aber jenseits jeder Vertragslaufzeit.
      tilgtNicht = true;
    }
  } else {
    monatsrateC = annuitaetsRate(
      darlehenC,
      sollzins,
      laufzeitJahre * MONATE_PRO_JAHR,
    );
  }

  const plan = tilgungsplan({
    darlehenC,
    zinsPa: sollzins,
    monatsrateC,
    sondertilgungC,
    maxJahre: MAX_JAHRE,
  });

  const laufzeitMonate = plan.volltilgungMonate ?? MAX_JAHRE * MONATE_PRO_JAHR;

  /* -- Effektivzins ------------------------------------------------------- */

  // Barwertgleichung der Preisangabenverordnung: Auszahlung heute gegen alle
  // künftigen Raten. Gebühren und Versicherung stecken automatisch drin,
  // weil sie Auszahlung und Rate verschieben.
  const effektiverJahreszins = tilgtNicht
    ? null
    : effektivzins([auszahlungC, ...plan.monatsFlowsC]);

  /* -- Restschuld zum Ende der Zinsbindung -------------------------------- */

  let restschuldNachZinsbindung: number | null = null;
  if (zinsbindung > 0) {
    const zeile = plan.jahre[zinsbindung - 1];
    // Ist der Kredit vor Ablauf der Bindung getilgt, ist die Restschuld null.
    restschuldNachZinsbindung = zeile ? toEuro(zeile.restschuldC) : 0;
  }

  /* -- Wirkung der Sondertilgung ------------------------------------------ */

  let sondertilgungZinsersparnis = 0;
  let sondertilgungVerkuerzungMonate = 0;

  if (sondertilgungC > 0 && !tilgtNicht) {
    const ohne = tilgungsplan({
      darlehenC,
      zinsPa: sollzins,
      monatsrateC,
      maxJahre: MAX_JAHRE,
    });
    sondertilgungZinsersparnis = toEuro(ohne.gesamtzinsenC - plan.gesamtzinsenC);
    sondertilgungVerkuerzungMonate =
      (ohne.volltilgungMonate ?? MAX_JAHRE * MONATE_PRO_JAHR) - laufzeitMonate;
  }

  /* -- Summen ------------------------------------------------------------- */

  const gesamtzinsenC = plan.gesamtzinsenC;
  const ratenSummeC = plan.jahre.reduce(
    (summe, jahr) => summe + jahr.rateC + jahr.sondertilgungC,
    0,
  );
  const gesamtaufwandC = ratenSummeC + gebuehrC;
  const kreditkostenC = gesamtaufwandC - auszahlungC;

  const zinsanteil =
    gesamtaufwandC > 0 ? (gesamtzinsenC / gesamtaufwandC) * 100 : null;

  /* -- Hinweise ----------------------------------------------------------- */

  const warnings: string[] = [];

  if (tilgtNicht) {
    warnings.push(
      `Die Rate von ${formatEuroRounded(toEuro(monatsrateC))} deckt die Zinsen nicht oder tilgt so langsam, dass der Kredit über ${MAX_JAHRE} Jahre liefe. Allein an Zinsen fallen im ersten Monat ${formatEuroRounded(toEuro(Math.round((darlehenC * sollzins) / 100 / MONATE_PRO_JAHR)))} an – darunter wird die Schuld nie kleiner.`,
    );
  }

  if (rsvC > 0) {
    warnings.push(
      `Die Restschuldversicherung von ${formatEuroRounded(toEuro(rsvC))} wird mitfinanziert: Sie erhöht die Schuld, aber nicht die Auszahlung, und wird selbst mitverzinst. Genau deshalb steigt der effektive Jahreszins durch sie stärker, als die Prämie vermuten lässt.`,
    );
  }

  if (gebuehrC > 0) {
    warnings.push(
      `Die Bearbeitungsgebühr von ${formatEuroRounded(toEuro(gebuehrC))} mindert die Auszahlung, verzinst und getilgt wird aber der volle Betrag. Bei Verbraucherkrediten hat der Bundesgerichtshof laufzeitunabhängige Bearbeitungsgebühren für unwirksam erklärt – ein solcher Posten im Angebot ist einen Rückfrage wert.`,
    );
  }

  if (
    effektiverJahreszins !== null &&
    effektiverJahreszins - sollzins >= 0.5
  ) {
    warnings.push(
      `Der effektive Jahreszins liegt mit ${formatRate(effektiverJahreszins)} Prozent deutlich über dem Sollzins von ${formatRate(sollzins)} Prozent. Vergleiche Angebote immer über den Effektivzins – nur er enthält die Nebenkosten.`,
    );
  }

  if (restschuldNachZinsbindung !== null && restschuldNachZinsbindung > 0) {
    warnings.push(
      `Am Ende der Zinsbindung nach ${zinsbindung} Jahren sind noch ${formatEuroRounded(restschuldNachZinsbindung)} offen. Dieser Betrag muss zu einem heute unbekannten Zins anschlussfinanziert werden – das ist das eigentliche Risiko, nicht die heutige Rate.`,
    );
  }

  if (sondertilgungVerkuerzungMonate > 0) {
    warnings.push(
      `Die Sondertilgung von ${formatEuroRounded(toEuro(sondertilgungC))} im Jahr spart ${formatEuroRounded(sondertilgungZinsersparnis)} Zinsen und verkürzt die Laufzeit um ${monateText(sondertilgungVerkuerzungMonate)}. Ein Recht auf Sondertilgung ist im Vertrag oft kostenlos vereinbar – aber nur, wenn man danach fragt.`,
    );
  }

  if (!tilgtNicht && laufzeitMonate > 10 * MONATE_PRO_JAHR && sondertilgungC === 0) {
    warnings.push(
      "Bei dieser Laufzeit lohnt ein Blick auf das Sondertilgungsrecht: Jeder vorzeitig getilgte Euro spart sämtliche künftigen Zinsen auf diesen Euro, und die Wirkung ist am Anfang der Laufzeit am größten.",
    );
  }

  return {
    monatsrate: toEuro(monatsrateC),
    laufzeitMonate,
    laufzeitJahre: Math.round((laufzeitMonate / MONATE_PRO_JAHR) * 10) / 10,

    darlehen: toEuro(darlehenC),
    auszahlung: toEuro(auszahlungC),

    gesamtzinsen: toEuro(gesamtzinsenC),
    gebuehren: toEuro(gebuehrC),
    gesamtaufwand: toEuro(gesamtaufwandC),
    kreditkosten: toEuro(kreditkostenC),

    effektiverJahreszins,
    zinsanteilProzent: zinsanteil,

    restschuldNachZinsbindung,
    zinsbindungJahre: zinsbindung,

    sondertilgungZinsersparnis,
    sondertilgungVerkuerzungMonate,

    tilgtNicht,

    jahre: plan.jahre.map((jahr) => ({
      jahr: jahr.jahr,
      zins: toEuro(jahr.zinsC),
      tilgung: toEuro(jahr.tilgungC),
      rate: toEuro(jahr.rateC),
      sondertilgung: toEuro(jahr.sondertilgungC),
      restschuld: toEuro(jahr.restschuldC),
    })),
    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Voreinstellung
 * ------------------------------------------------------------------------- */

export function defaultInput(): KreditInput {
  return {
    modus: "rate-aus-laufzeit",
    kreditbetrag: 20000,
    sollzinsPercent: 6.5,
    laufzeitJahre: 6,
    wunschrateMonat: 300,
    sondertilgungJahr: 0,
    bearbeitungsgebuehrPercent: 0,
    restschuldversicherung: 0,
    zinsbindungJahre: 0,
  };
}

/* ---------------------------------------------------------------------------
 * Textbausteine für die Hinweise
 * ------------------------------------------------------------------------- */

/** "2 Jahre und 3 Monate" – für die Wirkung der Sondertilgung. */
export function monateText(monate: number): string {
  const jahre = Math.floor(monate / MONATE_PRO_JAHR);
  const rest = monate % MONATE_PRO_JAHR;

  const jahrTeil = jahre === 1 ? "ein Jahr" : `${jahre} Jahre`;
  const monatTeil = rest === 1 ? "einen Monat" : `${rest} Monate`;

  if (jahre === 0) return monatTeil;
  if (rest === 0) return jahrTeil;
  return `${jahrTeil} und ${monatTeil}`;
}
