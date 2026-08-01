/**
 * Kindergeld und Günstigerprüfung gegen den Kinderfreibetrag.
 *
 * Zwei Fragen, die zusammengehören und fast immer getrennt beantwortet werden:
 *
 *   Was bekomme ich? Kindergeld ist ein fester Monatsbetrag je Kind – die
 *   eigentliche Zahl ist deshalb nicht der Monatsbetrag, sondern wie lange er
 *   noch fließt. Ein Kind, das im nächsten Jahr achtzehn wird, hat einen
 *   Restanspruch von wenigen hundert Euro; ein neugeborenes von über 55.000.
 *
 *   Oder bekomme ich etwas Besseres? Das Finanzamt prüft von Amts wegen, ob
 *   der Kinderfreibetrag mehr bringt als das Kindergeld, und rechnet die
 *   günstigere Variante. Der Umschlagpunkt liegt 2026 mit einem Kind bei rund
 *   86.000 Euro zu versteuerndem Einkommen bei Zusammenveranlagung und bei
 *   rund 43.000 bei Einzelveranlagung – dort werden Freibetrag *und*
 *   Kindergeld je zur Hälfte zugerechnet, weshalb die Schwelle tiefer liegt.
 *
 * Eine Feinheit, an der Standardrechner regelmäßig scheitern: Solidaritäts-
 * zuschlag und Kirchensteuer bemessen sich nach § 3 Abs. 2 SolZG *immer* nach
 * der Steuer mit Kinderfreibetrag – auch dann, wenn die Günstigerprüfung zum
 * Kindergeld führt. Diese Entlastung gibt es also zusätzlich zum Kindergeld
 * und nicht statt dessen.
 *
 * Der Einkommensteuertarif wird nicht neu implementiert, sondern aus
 * bruttonetto/steuerdaten.ts importiert. Eine zweite Fassung von § 32a EStG
 * wäre die zweite Stelle, an der ein Fehler einzeln gefunden werden müsste.
 *
 * Gerechnet wird in ganzen Cent. Der Tarif selbst liefert volle Euro, so will
 * es das Gesetz.
 */

import { addMonths, endOfMonth, fullYearsBetween, isValidIso, todayIso, type Iso } from "@/lib/date";
import { cents, nn } from "@/lib/finanzmath";
import type { RegionCode } from "@/tools/brueckentage/logic";
import {
  BETREUUNGSFREIBETRAG_VOLL,
  GRUNDFREIBETRAG,
  KINDERFREIBETRAG_VOLL,
  SOLI_FREIGRENZE,
  SOLI_FREIGRENZE_SPLITTING,
  SOLI_MILDERUNG_SATZ,
  SOLI_SATZ,
  einkommensteuer,
  kirchensteuersatz,
} from "@/tools/bruttonetto/steuerdaten";
import { ALTERSGRENZE, kindergeldSatz, type KindStatus } from "./saetze";

export type { KindStatus };
export type Veranlagung = "einzeln" | "zusammen";

/** Mehr Kinder erfasst niemand von Hand, und die URL bliebe sonst nicht kurz. */
const MAX_KINDER = 12;

export interface KindInput {
  geburtsdatum: Iso;
  status: KindStatus;
}

export interface KindergeldInput {
  kinder: KindInput[];
  heute: Iso;
  jahr: number;
  /** Zu versteuerndes Einkommen beider Eltern bzw. der Person, in Euro. */
  zvE: number;
  veranlagung: Veranlagung;
  kirchensteuer: boolean;
  region: RegionCode;
}

export interface KindErgebnis {
  geburtsdatum: Iso;
  status: KindStatus;
  alter: number;
  /** Letzter Monat mit Anspruch – Ende des Monats der Altersgrenze. */
  anspruchBis: Iso;
  /** Verbleibende Zahlungsmonate ab dem kommenden Monat. */
  restmonate: number;
  restanspruchC: number;
  anspruchAktuell: boolean;
}

export interface KindergeldResult {
  kinder: KindErgebnis[];
  satz: number;
  satzExtrapoliert: boolean;

  /** Kinder mit aktuellem Anspruch – Grundlage für Zahlung und Freibetrag. */
  anzahlBerechtigt: number;
  monatlichC: number;
  jahrC: number;
  restanspruchGesamtC: number;
  /**
   * Der Kindergeldanteil, der in der Günstigerprüfung gegengerechnet wird:
   * bei Zusammenveranlagung das volle Jahreskindergeld, bei Einzelveranlagung
   * die Hälfte – passend zum ebenfalls halbierten Freibetrag.
   */
  kindergeldVergleichC: number;

  // Günstigerprüfung
  freibetragGesamtC: number;
  steuerOhneC: number;
  steuerMitC: number;
  steuervorteilC: number;
  soliEntlastungC: number;
  kirchensteuerEntlastungC: number;
  guenstiger: "kindergeld" | "freibetrag";
  /** Um so viel ist die günstigere Variante besser als die andere. */
  vorteilC: number;
  /** Was Kinder im Jahr insgesamt bringen – inklusive Soli und Kirchensteuer. */
  gesamtentlastungC: number;

  warnings: string[];
}

/** Monate seit Jahr null – erlaubt Differenzen ohne Datumsarithmetik. */
const monatsIndex = (iso: Iso): number => {
  const [jahr, monat] = iso.split("-").map(Number);
  return jahr * 12 + (monat - 1);
};

/**
 * Letzter Monat mit Kindergeldanspruch.
 *
 * Gezahlt wird bis einschließlich des Monats, in dem das Kind die Altersgrenze
 * erreicht. `addMonths` klemmt dabei den Monatsletzten korrekt: Ein am 29.02.
 * geborenes Kind wird in einem Nicht-Schaltjahr am 28.02. volljährig.
 */
export function anspruchsende(geburtsdatum: Iso, status: KindStatus): Iso {
  return endOfMonth(addMonths(geburtsdatum, 12 * ALTERSGRENZE[status]));
}

/**
 * Solidaritätszuschlag mit Freigrenze und Milderungszone, § 4 SolZG.
 *
 * Bis zur Freigrenze fällt nichts an. Direkt darüber würde der volle Zuschlag
 * einen Sprung erzeugen, deshalb ist er auf 11,9 Prozent des übersteigenden
 * Betrags begrenzt, bis der reguläre Satz günstiger ist.
 */
function solidaritaetszuschlag(steuer: number, veranlagung: Veranlagung): number {
  const freigrenze =
    veranlagung === "zusammen" ? SOLI_FREIGRENZE_SPLITTING : SOLI_FREIGRENZE;
  if (steuer <= freigrenze) return 0;

  const voll = (steuer * SOLI_SATZ) / 100;
  const milderung = ((steuer - freigrenze) * SOLI_MILDERUNG_SATZ) / 100;
  return Math.min(voll, milderung);
}

/**
 * Einkommensteuer nach Veranlagungsart.
 *
 * Der Splittingtarif ist das Doppelte der Steuer auf das halbe Einkommen –
 * § 32a Abs. 5 EStG in einer Zeile.
 */
function tarif(zvE: number, veranlagung: Veranlagung): number {
  const x = Math.max(0, zvE);
  return veranlagung === "zusammen"
    ? 2 * einkommensteuer(x / 2)
    : einkommensteuer(x);
}

export function calculateKindergeld(input: KindergeldInput): KindergeldResult {
  const heute = isValidIso(input.heute) ? input.heute : todayIso();
  const { satz, extrapoliert } = kindergeldSatz(input.jahr);
  const satzC = cents(satz);

  const kinder: KindErgebnis[] = input.kinder
    .slice(0, MAX_KINDER)
    .filter((kind) => isValidIso(kind.geburtsdatum))
    .map((kind) => {
      const anspruchBis = anspruchsende(kind.geburtsdatum, kind.status);
      const restmonate = Math.max(
        0,
        monatsIndex(anspruchBis) - monatsIndex(heute),
      );
      return {
        geburtsdatum: kind.geburtsdatum,
        status: kind.status,
        alter: fullYearsBetween(kind.geburtsdatum, heute),
        anspruchBis,
        restmonate,
        restanspruchC: restmonate * satzC,
        anspruchAktuell: monatsIndex(anspruchBis) >= monatsIndex(heute),
      };
    });

  const anzahlBerechtigt = kinder.filter((k) => k.anspruchAktuell).length;
  const monatlichC = anzahlBerechtigt * satzC;
  const jahrC = monatlichC * 12;

  /*
   * Der Freibetrag gilt je Kind, für das dem Grunde nach Kindergeldanspruch
   * besteht. Bei Einzelveranlagung steht jedem Elternteil die Hälfte zu.
   */
  const freibetragProKind =
    (KINDERFREIBETRAG_VOLL + BETREUUNGSFREIBETRAG_VOLL) /
    (input.veranlagung === "zusammen" ? 1 : 2);
  const freibetragGesamt = anzahlBerechtigt * freibetragProKind;

  const zvE = nn(input.zvE);
  const steuerOhne = tarif(zvE, input.veranlagung);
  const steuerMit = tarif(zvE - freibetragGesamt, input.veranlagung);
  const steuervorteil = steuerOhne - steuerMit;

  /*
   * Soli und Kirchensteuer bemessen sich immer nach der Steuer *mit*
   * Kinderfreibetrag – auch wenn die Günstigerprüfung zum Kindergeld führt.
   * Diese Entlastung kommt deshalb zum Kindergeld hinzu und nicht statt dessen.
   */
  const soliEntlastung =
    solidaritaetszuschlag(steuerOhne, input.veranlagung) -
    solidaritaetszuschlag(steuerMit, input.veranlagung);

  const kistSatz = input.kirchensteuer ? kirchensteuersatz(input.region) : 0;
  const kirchensteuerEntlastung = ((steuerOhne - steuerMit) * kistSatz) / 100;

  /*
   * Die Günstigerprüfung muss beide Seiten auf denselben Kopf beziehen. Wer
   * einzeln veranlagt wird, bekommt den halben Freibetrag – dann darf ihm auch
   * nur das halbe Kindergeld gegengerechnet werden. Ein halber Freibetrag
   * gegen volles Kindergeld wäre ein Vergleich, den das Gesetz nicht anstellt,
   * und der Freibetrag könnte bei Einzelveranlagung nie gewinnen.
   */
  const kindergeldVergleichC =
    input.veranlagung === "zusammen" ? jahrC : Math.round(jahrC / 2);

  const steuervorteilC = cents(steuervorteil);
  const guenstiger =
    steuervorteilC > kindergeldVergleichC ? "freibetrag" : "kindergeld";
  const vorteilC = Math.abs(steuervorteilC - kindergeldVergleichC);

  const soliEntlastungC = cents(soliEntlastung);
  const kirchensteuerEntlastungC = cents(kirchensteuerEntlastung);

  const warnings: string[] = [];

  if (kinder.length === 0) {
    warnings.push(
      "Noch kein Kind erfasst. Trag ein Geburtsdatum ein, dann rechnet der Rechner Anspruch und Restlaufzeit aus.",
    );
  }

  if (extrapoliert) {
    warnings.push(
      `Für ${Math.round(nn(input.jahr)) || input.jahr} ist noch kein Kindergeldsatz beschlossen. Gerechnet wird mit ${satz} Euro, dem zuletzt bekannten Wert.`,
    );
  }

  const abgelaufen = kinder.filter((k) => !k.anspruchAktuell);
  if (abgelaufen.length > 0) {
    warnings.push(
      abgelaufen.length === 1
        ? "Für ein Kind ist der Anspruch bereits abgelaufen. Es zählt weder beim Kindergeld noch beim Freibetrag mit."
        : `Für ${abgelaufen.length} Kinder ist der Anspruch bereits abgelaufen. Sie zählen weder beim Kindergeld noch beim Freibetrag mit.`,
    );
  }

  if (anzahlBerechtigt > 0 && zvE <= GRUNDFREIBETRAG) {
    warnings.push(
      "Unterhalb des Grundfreibetrags fällt keine Einkommensteuer an – der Kinderfreibetrag kann dort nichts bewirken. Es bleibt beim Kindergeld.",
    );
  }

  if (anzahlBerechtigt > 0 && input.veranlagung === "einzeln") {
    warnings.push(
      "Bei Einzelveranlagung wird jedem Elternteil der halbe Kinderfreibetrag zugerechnet – und in der Günstigerprüfung entsprechend auch nur das halbe Kindergeld. Ausgezahlt wird das Kindergeld trotzdem in voller Höhe an einen Elternteil.",
    );
  }

  if (anzahlBerechtigt > 0) {
    warnings.push(
      "Die Günstigerprüfung ist eine Näherung: Sie rechnet allein mit dem zu versteuernden Einkommen und den Kinderfreibeträgen, ohne Entlastungsbetrag für Alleinerziehende, Betreuungskosten oder weitere Abzüge. Das ist keine Steuerberatung.",
    );
  }

  return {
    kinder,
    satz,
    satzExtrapoliert: extrapoliert,
    anzahlBerechtigt,
    monatlichC,
    jahrC,
    restanspruchGesamtC: kinder.reduce((sum, k) => sum + k.restanspruchC, 0),
    kindergeldVergleichC,

    freibetragGesamtC: cents(freibetragGesamt),
    steuerOhneC: cents(steuerOhne),
    steuerMitC: cents(steuerMit),
    steuervorteilC,
    soliEntlastungC,
    kirchensteuerEntlastungC,
    guenstiger,
    vorteilC,
    gesamtentlastungC:
      (guenstiger === "freibetrag" ? steuervorteilC : kindergeldVergleichC) +
      soliEntlastungC +
      kirchensteuerEntlastungC,

    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Kompakte Kodierung für die URL
 * ------------------------------------------------------------------------- */

const STATUS_CODE: Record<KindStatus, string> = {
  regulaer: "r",
  ausbildung: "a",
  arbeitsuchend: "s",
};

const CODE_STATUS: Record<string, KindStatus> = {
  r: "regulaer",
  a: "ausbildung",
  s: "arbeitsuchend",
};

/**
 * Kinderliste als ein URL-Parameter: "2018-03-14r,2021-07-02a".
 *
 * Ein Schlüssel je Kind und Feld würde bei fünf Kindern zehn Parameter
 * ergeben, und `useUrlState` serialisiert flache Schlüssel – eine Liste
 * braucht deshalb ein eigenes Format.
 */
export function encodeKinder(kinder: KindInput[]): string {
  return kinder
    .filter((kind) => isValidIso(kind.geburtsdatum))
    .map((kind) => `${kind.geburtsdatum}${STATUS_CODE[kind.status]}`)
    .join(",");
}

export function decodeKinder(
  raw: unknown,
  fallback: KindInput[],
): KindInput[] {
  if (typeof raw !== "string" || raw.trim() === "") return fallback;

  const kinder = raw
    .split(",")
    .slice(0, MAX_KINDER)
    .map((teil) => {
      const wert = teil.trim();
      const geburtsdatum = wert.slice(0, 10);
      const status = CODE_STATUS[wert.slice(10, 11)];
      if (!isValidIso(geburtsdatum) || status === undefined) return null;
      return { geburtsdatum, status };
    })
    .filter((kind): kind is KindInput => kind !== null);

  // Unbrauchbare Eingaben dürfen die Liste nicht leeren – dann stünde der
  // Rechner nach einem kaputten Link ohne jedes Kind da.
  return kinder.length > 0 ? kinder : fallback;
}

/**
 * Voreinstellung: ein Kind im Grundschulalter, Ehepaar mit mittlerem
 * Einkommen. Das Geburtsjahr wird aus dem laufenden Jahr abgeleitet, damit
 * die Vorgabe nicht mit der Zeit veraltet.
 */
export function defaultInput(): KindergeldInput {
  const heute = todayIso();
  const jahr = Number(heute.slice(0, 4));

  return {
    kinder: [{ geburtsdatum: `${jahr - 8}-05-15`, status: "regulaer" }],
    heute,
    // Bewusst das laufende Jahr und nicht auf STEUERJAHR geklemmt: Sobald ein
    // Jahr ohne beschlossenen Satz beginnt, soll der Rechner das sagen und
    // nicht stillschweigend das Vorjahr rechnen.
    jahr,
    zvE: 60000,
    veranlagung: "zusammen",
    kirchensteuer: false,
    region: "by",
  };
}
