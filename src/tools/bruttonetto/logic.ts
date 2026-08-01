/**
 * Brutto-Netto-Rechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Der Rechenweg folgt § 39b EStG in dieser Reihenfolge:
 *
 *   1. Sozialabgaben auf den Bruttolohn, jeweils bis zur Beitragsbemessungs-
 *      grenze. Renten- und Arbeitslosenversicherung teilen sich eine Grenze,
 *      Kranken- und Pflegeversicherung eine deutlich niedrigere.
 *   2. Vorsorgepauschale – nicht die tatsächlichen Beiträge, sondern ein
 *      eigener pauschaler Abzug mit eigenen Sätzen und einem eigenen Deckel.
 *   3. Zu versteuernder Jahresbetrag: Brutto minus Pauschbeträge minus
 *      Vorsorgepauschale.
 *   4. Lohnsteuer über den Einkommensteuertarif, je nach Steuerklasse als
 *      Grund- oder Splittingtarif.
 *   5. Solidaritätszuschlag mit Freigrenze und Milderungszone, Kirchensteuer –
 *      beide auf eine Lohnsteuer, die um etwaige Kinderfreibeträge gemindert
 *      ist.
 *
 * Zwei Dinge, die häufig falsch gemacht werden und hier bewusst richtig sind:
 *
 *   Kinderfreibeträge mindern nicht die Lohnsteuer. Für sie gibt es Kindergeld;
 *   steuerlich wirken sie im Lohnsteuerabzug nur auf Solidaritätszuschlag und
 *   Kirchensteuer.
 *
 *   Die Vorsorgepauschale rechnet mit dem ermäßigten Krankenkassenbeitragssatz
 *   von 14,0 Prozent, nicht mit dem allgemeinen von 14,6 – sie ist deshalb
 *   kleiner als die tatsächlich gezahlten Beiträge.
 *
 * Achtung: Das Ergebnis ist eine Schätzung, keine Lohnabrechnung. Die
 * Steuerklassen V und VI folgen der Grundformel des Gesetzes ohne die
 * Feinsteuerung der amtlichen Programmablaufpläne; Freibeträge aus den
 * ELStAM, Altersentlastungsbetrag, Midijob-Übergangsbereich, Mehrfach-
 * beschäftigung und geldwerte Vorteile bleiben außen vor.
 */

import type { RegionCode } from "@/tools/brueckentage/logic";
import { clamp, nn } from "@/lib/finanzmath";
import {
  ARBEITNEHMER_PAUSCHBETRAG,
  BBG_KRANKEN,
  BBG_RENTE,
  BEITRAGSSATZ,
  BETREUUNGSFREIBETRAG_VOLL,
  ENTLASTUNGSBETRAG_ALLEINERZIEHENDE,
  ENTLASTUNGSBETRAG_JE_WEITEREM_KIND,
  KINDERFREIBETRAG_VOLL,
  PFLEGE_ABSCHLAG_JE_KIND,
  PFLEGE_ABSCHLAG_MAX_KINDER,
  PFLEGE_KINDERLOS_ZUSCHLAG,
  PFLEGE_SACHSEN_MEHR_ARBEITNEHMER,
  SOLI_FREIGRENZE,
  SOLI_FREIGRENZE_SPLITTING,
  SOLI_MILDERUNG_SATZ,
  SOLI_SATZ,
  SONDERAUSGABEN_PAUSCHBETRAG,
  VERSICHERUNGSPFLICHTGRENZE,
  einkommensteuer,
  kirchensteuersatz,
  type Steuerklasse,
} from "./steuerdaten";

const MONATE_PRO_JAHR = 12;

/** Deckel für die Teilbeträge b bis e der Vorsorgepauschale, § 39b EStG. */
const VORSORGEPAUSCHALE_DECKEL = 1900;

/** Mindestsatz der Lohnsteuer in den Steuerklassen V und VI. */
const MINDESTSATZ_STKL_V_VI = 14;

export type Zeitraum = "monat" | "jahr";

export interface BruttoNettoInput {
  /** Bruttolohn – im gewählten Zeitraum. */
  brutto: number;
  zeitraum: Zeitraum;
  steuerklasse: Steuerklasse;
  region: RegionCode;
  kirchensteuerpflichtig: boolean;
  /** Zahl der Kinderfreibeträge (0, 0,5, 1, 1,5 …). */
  kinderfreibetraege: number;
  /** Kinder unter 25 – mindern den Pflegebeitrag ab dem zweiten Kind. */
  kinderZahl: number;
  /** Ab 23 ohne Kinder: Zuschlag zur Pflegeversicherung. */
  kinderlos: boolean;
  /** Gesetzlich oder privat krankenversichert. */
  gesetzlichVersichert: boolean;
  /** Zusatzbeitrag der Krankenkasse. */
  zusatzbeitragPercent: number;
  /** Monatsbeitrag zur privaten Kranken- und Pflegeversicherung. */
  privatBeitragMonat: number;
  rentenversicherungspflichtig: boolean;
}

export interface Abzug {
  label: string;
  jahr: number;
  monat: number;
}

export interface BruttoNettoResult {
  bruttoMonat: number;
  bruttoJahr: number;
  nettoMonat: number;
  nettoJahr: number;

  /** Einzelposten für die Aufstellung. */
  steuern: Abzug[];
  sozialabgaben: Abzug[];

  lohnsteuerJahr: number;
  soliJahr: number;
  kirchensteuerJahr: number;
  steuernGesamtJahr: number;

  rentenversicherungJahr: number;
  arbeitslosenversicherungJahr: number;
  krankenversicherungJahr: number;
  pflegeversicherungJahr: number;
  sozialabgabenGesamtJahr: number;

  abzuegeGesamtJahr: number;

  /** Zu versteuernder Jahresbetrag nach § 39b. */
  zuVersteuerndesEinkommen: number;
  vorsorgepauschale: number;

  /** Anteil aller Abzüge am Brutto. */
  abgabenquoteProzent: number;
  /** Durchschnittlicher Steuersatz, nur Steuern ohne Sozialabgaben. */
  steuersatzDurchschnittProzent: number;
  /** Was von 100 Euro mehr Brutto netto übrig bleibt. */
  netto100Euro: number;
  grenzbelastungProzent: number;

  /** Was der Arbeitgeber zusätzlich zahlt. */
  arbeitgeberAnteilJahr: number;
  arbeitgeberkostenJahr: number;
  arbeitgeberkostenMonat: number;

  warnings: string[];
}

/* ---------------------------------------------------------------------------
 * Sozialversicherung
 * ------------------------------------------------------------------------- */

interface SvBeitraege {
  renteAN: number;
  renteAG: number;
  alvAN: number;
  alvAG: number;
  kvAN: number;
  kvAG: number;
  pvAN: number;
  pvAG: number;
}

/** Beitragspflichtiges Entgelt: Bruttolohn, gedeckelt auf die Bemessungsgrenze. */
const bis = (bruttoJahr: number, grenze: number) => Math.min(bruttoJahr, grenze);

function sozialversicherung(
  bruttoJahr: number,
  input: BruttoNettoInput,
): SvBeitraege {
  const zusatz = clamp(input.zusatzbeitragPercent, 0, 10);

  const rentenBasis = bis(bruttoJahr, BBG_RENTE);
  const krankenBasis = bis(bruttoJahr, BBG_KRANKEN);

  const renteAN = input.rentenversicherungspflichtig
    ? (rentenBasis * BEITRAGSSATZ.rente) / 100 / 2
    : 0;
  const alvAN = input.rentenversicherungspflichtig
    ? (rentenBasis * BEITRAGSSATZ.arbeitslosen) / 100 / 2
    : 0;

  if (!input.gesetzlichVersichert) {
    // Privat Versicherte zahlen ihren Beitrag selbst; der Arbeitgeber gibt
    // die Hälfte dazu, höchstens aber so viel, wie er für einen gesetzlich
    // Versicherten zahlen müsste.
    const privatJahr = nn(input.privatBeitragMonat) * MONATE_PRO_JAHR;
    const maxZuschuss =
      (krankenBasis * (BEITRAGSSATZ.krankenAllgemein + zusatz)) / 100 / 2 +
      (krankenBasis * BEITRAGSSATZ.pflege) / 100 / 2;
    const zuschuss = Math.min(privatJahr / 2, maxZuschuss);

    return {
      renteAN,
      renteAG: renteAN,
      alvAN,
      alvAG: alvAN,
      kvAN: privatJahr - zuschuss,
      kvAG: zuschuss,
      pvAN: 0,
      pvAG: 0,
    };
  }

  // Der Zusatzbeitrag wird seit 2019 paritätisch getragen.
  const kvSatzAN = BEITRAGSSATZ.krankenAllgemein / 2 + zusatz / 2;
  const kvAN = (krankenBasis * kvSatzAN) / 100;
  const kvAG = kvAN;

  /* -- Pflegeversicherung ------------------------------------------------- */

  let pvSatzAN = BEITRAGSSATZ.pflege / 2;
  let pvSatzAG = BEITRAGSSATZ.pflege / 2;

  // Sachsen: der Arbeitnehmer trägt 0,5 Punkte mehr, der Arbeitgeber weniger.
  if (input.region === "sn") {
    pvSatzAN += PFLEGE_SACHSEN_MEHR_ARBEITNEHMER;
    pvSatzAG -= PFLEGE_SACHSEN_MEHR_ARBEITNEHMER;
  }

  const kinder = Math.round(clamp(input.kinderZahl, 0, 20));

  if (input.kinderlos && kinder === 0) {
    // Zuschlag für Kinderlose ab 23 – trägt der Arbeitnehmer allein.
    pvSatzAN += PFLEGE_KINDERLOS_ZUSCHLAG;
  } else if (kinder >= 2) {
    // Abschlag je Kind ab dem zweiten, höchstens bis zum fünften.
    const beruecksichtigt = Math.min(kinder, PFLEGE_ABSCHLAG_MAX_KINDER) - 1;
    pvSatzAN -= beruecksichtigt * PFLEGE_ABSCHLAG_JE_KIND;
  }

  return {
    renteAN,
    renteAG: renteAN,
    alvAN,
    alvAG: alvAN,
    kvAN,
    kvAG,
    pvAN: (krankenBasis * Math.max(0, pvSatzAN)) / 100,
    pvAG: (krankenBasis * Math.max(0, pvSatzAG)) / 100,
  };
}

/* ---------------------------------------------------------------------------
 * Vorsorgepauschale, § 39b Abs. 2 Satz 5 Nr. 3 EStG (Fassung ab 2026)
 * ------------------------------------------------------------------------- */

/**
 * Die Vorsorgepauschale ist nicht die Summe der tatsächlichen Beiträge.
 *
 * Sie hat eigene Sätze: Die Krankenversicherung wird mit dem ermäßigten
 * Beitragssatz von 14,0 Prozent angesetzt statt mit dem allgemeinen von 14,6.
 * Der Abzug fällt deshalb etwas kleiner aus als die tatsächlich gezahlten
 * Beiträge – die Differenz holt man sich gegebenenfalls über die
 * Steuererklärung zurück.
 *
 * Zur Rolle der 1.900 Euro, weil sie leicht falsch gelesen wird: Sie sind
 * weder ein Deckel auf die gesamte Vorsorgepauschale noch auf die Teilbeträge
 * für Kranken- und Pflegeversicherung. Das Gesetz berücksichtigt ab 2026 den
 * neuen Teilbetrag für die Arbeitslosenversicherung, "soweit dieser Teilbetrag
 * zusammen mit den Teilbeträgen Kranken- und Pflegeversicherung den Betrag von
 * 1.900 Euro nicht übersteigt" – die Einschränkung gilt also dem neuen
 * Teilbetrag, nicht den bestehenden. Praktisch heißt das: Wer normal verdient,
 * liegt mit Kranken- und Pflegeanteil allein schon über 1.900 Euro und bekommt
 * den Arbeitslosen-Teilbetrag gar nicht; wirksam wird er nur bei niedrigen
 * Löhnen. Ein Deckel auf alles würde die Lohnsteuer dagegen um mehrere
 * Hundert Euro im Jahr zu hoch ausweisen.
 *
 * Die frühere Mindestvorsorgepauschale ist zum 01.01.2026 entfallen.
 */
function vorsorgepauschale(
  bruttoJahr: number,
  input: BruttoNettoInput,
): number {
  const zusatz = clamp(input.zusatzbeitragPercent, 0, 10);
  const rentenBasis = bis(bruttoJahr, BBG_RENTE);
  const krankenBasis = bis(bruttoJahr, BBG_KRANKEN);

  // a) Rentenversicherung: Arbeitnehmeranteil, ohne Begrenzung.
  const teilRente = input.rentenversicherungspflichtig
    ? (rentenBasis * BEITRAGSSATZ.rente) / 100 / 2
    : 0;

  let teilKrankenPflege = 0;

  if (input.gesetzlichVersichert) {
    // b) Krankenversicherung – ermäßigter Satz plus Zusatzbeitrag.
    teilKrankenPflege +=
      (krankenBasis * (BEITRAGSSATZ.krankenErmaessigt / 2 + zusatz / 2)) / 100;

    // c) Pflegeversicherung – mit denselben Zu- und Abschlägen wie der Beitrag.
    let pvSatz = BEITRAGSSATZ.pflege / 2;
    if (input.region === "sn") pvSatz += PFLEGE_SACHSEN_MEHR_ARBEITNEHMER;
    const kinder = Math.round(clamp(input.kinderZahl, 0, 20));
    if (input.kinderlos && kinder === 0) pvSatz += PFLEGE_KINDERLOS_ZUSCHLAG;
    else if (kinder >= 2) {
      pvSatz -=
        (Math.min(kinder, PFLEGE_ABSCHLAG_MAX_KINDER) - 1) *
        PFLEGE_ABSCHLAG_JE_KIND;
    }
    teilKrankenPflege += (krankenBasis * Math.max(0, pvSatz)) / 100;
  } else {
    // d) Private Basisabsicherung – der tatsächliche Beitrag.
    teilKrankenPflege += nn(input.privatBeitragMonat) * MONATE_PRO_JAHR;
  }

  // e) Arbeitslosenversicherung – neu ab 2026, nur Steuerklassen I bis V und
  // nur bis zum gemeinsamen Betrag von 1.900 Euro.
  let teilArbeitslosen = 0;
  if (input.steuerklasse !== 6 && input.rentenversicherungspflichtig) {
    const voll = (rentenBasis * BEITRAGSSATZ.arbeitslosen) / 100 / 2;
    const luft = VORSORGEPAUSCHALE_DECKEL - teilKrankenPflege;
    teilArbeitslosen = Math.max(0, Math.min(voll, luft));
  }

  return teilRente + teilKrankenPflege + teilArbeitslosen;
}

/* ---------------------------------------------------------------------------
 * Lohnsteuer
 * ------------------------------------------------------------------------- */

/**
 * Jahreslohnsteuer aus dem zu versteuernden Jahresbetrag.
 *
 * Klassen I, II und IV rechnen mit dem Grundtarif, Klasse III mit dem
 * Splittingtarif. Die Klassen V und VI folgen § 39b Abs. 2 Satz 7: das
 * Zweifache des Unterschieds zwischen dem Steuerbetrag für das 1,25-Fache und
 * dem für das 0,75-Fache des zu versteuernden Betrags, mindestens aber 14
 * Prozent. Die amtlichen Programmablaufpläne kennen dazu noch mehrere
 * Stützstellen, die den Verlauf in bestimmten Bereichen glätten – die fehlen
 * hier, weshalb V und VI Näherungen sind.
 */
function lohnsteuer(zvE: number, steuerklasse: Steuerklasse): number {
  const x = Math.max(0, zvE);

  if (steuerklasse === 3) {
    // Splittingtarif: Steuer für das halbe Einkommen, verdoppelt.
    return 2 * einkommensteuer(x / 2);
  }

  if (steuerklasse === 5 || steuerklasse === 6) {
    const differenz =
      2 * (einkommensteuer(1.25 * x) - einkommensteuer(0.75 * x));
    // Der Mindestsatz ist kein Sicherheitsnetz, sondern der eigentliche Kern
    // dieser Klassen: Der Grundfreibetrag liegt beim Partner in Klasse III
    // beziehungsweise im ersten Dienstverhältnis, hier wird deshalb ab dem
    // ersten Euro Steuer fällig.
    const mindest = (x * MINDESTSATZ_STKL_V_VI) / 100;
    return Math.max(differenz, mindest);
  }

  return einkommensteuer(x);
}

/**
 * Solidaritätszuschlag mit Freigrenze und Milderungszone.
 *
 * Bis zur Freigrenze fällt gar nichts an. Direkt darüber würde der volle
 * Zuschlag einen Sprung erzeugen, deshalb ist er in der Milderungszone auf
 * 11,9 Prozent des übersteigenden Betrags begrenzt, bis der reguläre Satz
 * von 5,5 Prozent günstiger ist.
 */
function solidaritaetszuschlag(
  lohnsteuerBetrag: number,
  steuerklasse: Steuerklasse,
): number {
  const freigrenze =
    steuerklasse === 3 ? SOLI_FREIGRENZE_SPLITTING : SOLI_FREIGRENZE;

  if (lohnsteuerBetrag <= freigrenze) return 0;

  const voll = (lohnsteuerBetrag * SOLI_SATZ) / 100;
  const milderung = ((lohnsteuerBetrag - freigrenze) * SOLI_MILDERUNG_SATZ) / 100;
  return Math.min(voll, milderung);
}

/* ---------------------------------------------------------------------------
 * Kern
 * ------------------------------------------------------------------------- */

interface Kern {
  sv: SvBeitraege;
  svAN: number;
  svAG: number;
  vorsorgepauschale: number;
  zvE: number;
  lohnsteuer: number;
  soli: number;
  kirchensteuer: number;
  steuernGesamt: number;
  nettoJahr: number;
}

/**
 * Der ganze Rechenweg für einen gegebenen Jahresbruttolohn.
 *
 * Eigene Funktion, weil sie zweimal gebraucht wird: einmal für das Ergebnis
 * und einmal mit hundert Euro mehr Brutto, um die Grenzbelastung zu bestimmen.
 * Was von hundert Euro mehr übrig bleibt, lässt sich aus dem
 * Durchschnittssatz nämlich nicht ableiten – also wird schlicht ein zweites
 * Mal gerechnet.
 */
function kern(bruttoJahr: number, input: BruttoNettoInput): Kern {
  const sv = sozialversicherung(bruttoJahr, input);
  const svAN = sv.renteAN + sv.alvAN + sv.kvAN + sv.pvAN;
  const svAG = sv.renteAG + sv.alvAG + sv.kvAG + sv.pvAG;

  const vp = vorsorgepauschale(bruttoJahr, input);

  // In Steuerklasse VI gibt es weder Arbeitnehmer- noch Sonderausgaben-
  // Pauschbetrag: beide sind im ersten Dienstverhältnis schon verbraucht.
  const pauschbetraege =
    input.steuerklasse === 6
      ? 0
      : ARBEITNEHMER_PAUSCHBETRAG + SONDERAUSGABEN_PAUSCHBETRAG;

  const kinderZahlGanz = Math.round(clamp(input.kinderZahl, 0, 20));
  const entlastung =
    input.steuerklasse === 2
      ? ENTLASTUNGSBETRAG_ALLEINERZIEHENDE +
        Math.max(0, kinderZahlGanz - 1) * ENTLASTUNGSBETRAG_JE_WEITEREM_KIND
      : 0;

  const zvE = Math.max(0, bruttoJahr - pauschbetraege - vp - entlastung);
  const lst = lohnsteuer(zvE, input.steuerklasse);

  // Kinderfreibeträge mindern nicht die Lohnsteuer, sondern nur die
  // Bemessungsgrundlage für Soli und Kirchensteuer – für die Lohnsteuer
  // selbst gibt es stattdessen Kindergeld.
  const freibetraege = clamp(input.kinderfreibetraege, 0, 20);
  const kinderfreibetragBetrag =
    ((KINDERFREIBETRAG_VOLL + BETREUUNGSFREIBETRAG_VOLL) * freibetraege) / 2;
  const bemessungZuschlaege = lohnsteuer(
    Math.max(0, zvE - kinderfreibetragBetrag),
    input.steuerklasse,
  );

  const soli = solidaritaetszuschlag(bemessungZuschlaege, input.steuerklasse);
  const kirchensteuer = input.kirchensteuerpflichtig
    ? (bemessungZuschlaege * kirchensteuersatz(input.region)) / 100
    : 0;

  const steuernGesamt = lst + soli + kirchensteuer;

  return {
    sv,
    svAN,
    svAG,
    vorsorgepauschale: vp,
    zvE,
    lohnsteuer: lst,
    soli,
    kirchensteuer,
    steuernGesamt,
    nettoJahr: bruttoJahr - steuernGesamt - svAN,
  };
}

/* ---------------------------------------------------------------------------
 * Hauptrechnung
 * ------------------------------------------------------------------------- */

export function calculateBruttoNetto(
  input: BruttoNettoInput,
): BruttoNettoResult {
  const bruttoJahr =
    input.zeitraum === "monat"
      ? nn(input.brutto) * MONATE_PRO_JAHR
      : nn(input.brutto);
  const bruttoMonat = bruttoJahr / MONATE_PRO_JAHR;

  const k = kern(bruttoJahr, input);
  const { sv, svAN, svAG } = k;
  const vp = k.vorsorgepauschale;
  const zvE = k.zvE;
  const lohnsteuerJahr = k.lohnsteuer;
  const soliJahr = k.soli;
  const kirchensteuerJahr = k.kirchensteuer;
  const steuernGesamt = k.steuernGesamt;
  const nettoJahr = k.nettoJahr;
  const abzuege = steuernGesamt + svAN;

  const netto100Euro = kern(bruttoJahr + 100, input).nettoJahr - nettoJahr;

  /* -- Hinweise ----------------------------------------------------------- */

  const warnings: string[] = [];

  warnings.push(
    "Das Ergebnis ist eine Schätzung nach den Rechengrößen für 2026 und ersetzt keine Lohnabrechnung. Freibeträge aus den ELStAM, geldwerte Vorteile, betriebliche Altersvorsorge und Einmalzahlungen sind nicht enthalten.",
  );

  if (input.steuerklasse === 5 || input.steuerklasse === 6) {
    warnings.push(
      `Die Steuerklassen V und VI folgen hier der Grundformel des § 39b EStG. Die amtlichen Programmablaufpläne glätten den Verlauf zusätzlich an mehreren Stützstellen – in diesem Bereich kann die tatsächliche Lohnsteuer deshalb um einige Euro im Monat abweichen.`,
    );
  }

  if (input.steuerklasse === 3) {
    warnings.push(
      "Steuerklasse III lohnt sich nur zusammen mit Steuerklasse V beim Partner. Die Kombination senkt nicht die Jahressteuer, sondern verschiebt sie nur – am Jahresende gleicht die Steuererklärung das aus, und bei III/V ist die Abgabe verpflichtend.",
    );
  }

  if (bruttoJahr > BBG_KRANKEN) {
    warnings.push(
      `Über der Beitragsbemessungsgrenze von ${euro(BBG_KRANKEN)} steigen Kranken- und Pflegebeiträge nicht weiter. Jeder Euro darüber wird deshalb geringer belastet – das ist der Grund, warum die Abgabenquote mit steigendem Einkommen wieder sinkt.`,
    );
  }

  if (bruttoJahr > VERSICHERUNGSPFLICHTGRENZE && input.gesetzlichVersichert) {
    warnings.push(
      `Mit ${euro(bruttoJahr)} liegst du über der Versicherungspflichtgrenze von ${euro(VERSICHERUNGSPFLICHTGRENZE)} und könntest in die private Krankenversicherung wechseln. Das ist eine Entscheidung für Jahrzehnte, nicht für den nächsten Gehaltszettel – der Rückweg in die gesetzliche Kasse ist als Angestellter faktisch versperrt.`,
    );
  }

  if (!input.gesetzlichVersichert && nn(input.privatBeitragMonat) === 0) {
    warnings.push(
      "Für die private Krankenversicherung ist kein Beitrag eingetragen. Trag ihn ein, sonst fehlt er im Netto und in der Vorsorgepauschale.",
    );
  }

  if (bruttoJahr > 0 && bruttoMonat < 2000) {
    warnings.push(
      "Bei Löhnen bis 2.000 Euro im Monat greift der Übergangsbereich für Midijobs, in dem die Sozialabgaben des Arbeitnehmers gemindert sind. Dieser Rechner bildet ihn nicht ab – dein tatsächliches Netto liegt in diesem Bereich höher.",
    );
  }

  /* -- Ergebnis ----------------------------------------------------------- */

  const jm = (jahr: number): Abzug => ({
    label: "",
    jahr,
    monat: jahr / MONATE_PRO_JAHR,
  });

  const kvLabel = input.gesetzlichVersichert
    ? "Krankenversicherung"
    : "Private Krankenversicherung";

  return {
    bruttoMonat,
    bruttoJahr,
    nettoMonat: nettoJahr / MONATE_PRO_JAHR,
    nettoJahr,

    steuern: [
      { ...jm(lohnsteuerJahr), label: "Lohnsteuer" },
      { ...jm(soliJahr), label: "Solidaritätszuschlag" },
      { ...jm(kirchensteuerJahr), label: "Kirchensteuer" },
    ],
    sozialabgaben: [
      { ...jm(sv.renteAN), label: "Rentenversicherung" },
      { ...jm(sv.alvAN), label: "Arbeitslosenversicherung" },
      { ...jm(sv.kvAN), label: kvLabel },
      { ...jm(sv.pvAN), label: "Pflegeversicherung" },
    ],

    lohnsteuerJahr,
    soliJahr,
    kirchensteuerJahr,
    steuernGesamtJahr: steuernGesamt,

    rentenversicherungJahr: sv.renteAN,
    arbeitslosenversicherungJahr: sv.alvAN,
    krankenversicherungJahr: sv.kvAN,
    pflegeversicherungJahr: sv.pvAN,
    sozialabgabenGesamtJahr: svAN,

    abzuegeGesamtJahr: abzuege,

    zuVersteuerndesEinkommen: zvE,
    vorsorgepauschale: vp,

    abgabenquoteProzent: bruttoJahr > 0 ? (abzuege / bruttoJahr) * 100 : 0,
    steuersatzDurchschnittProzent:
      bruttoJahr > 0 ? (steuernGesamt / bruttoJahr) * 100 : 0,
    netto100Euro,
    grenzbelastungProzent: 100 - netto100Euro,

    arbeitgeberAnteilJahr: svAG,
    arbeitgeberkostenJahr: bruttoJahr + svAG,
    arbeitgeberkostenMonat: (bruttoJahr + svAG) / MONATE_PRO_JAHR,

    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Voreinstellung
 * ------------------------------------------------------------------------- */

export function defaultInput(): BruttoNettoInput {
  return {
    brutto: 4000,
    zeitraum: "monat",
    steuerklasse: 1,
    region: "nw",
    kirchensteuerpflichtig: false,
    kinderfreibetraege: 0,
    kinderZahl: 0,
    kinderlos: true,
    gesetzlichVersichert: true,
    zusatzbeitragPercent: 2.9,
    privatBeitragMonat: 0,
    rentenversicherungspflichtig: true,
  };
}

const euro = (n: number) =>
  n.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
