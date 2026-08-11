/**
 * Rentenlücken-Rechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Gerechnet wird durchgehend in heutiger Kaufkraft, nicht in künftigen Euro.
 * Der Grund: Die gesetzliche Rente, die in der jährlichen Renteninformation
 * der Deutschen Rentenversicherung steht, ist bereits eine Schätzung in
 * heutiger Kaufkraft – sie unterstellt eine Rentenanpassung nahe der
 * Lohnentwicklung, die über Jahrzehnte grob mit der Inflation mitläuft. Wer
 * diesen Wert unverändert einträgt und daneben eine nominale Rendite auf sein
 * Depot rechnet, vergleicht zwei verschiedene Wertmaßstäbe und bekommt eine
 * Lücke, die zu klein oder zu groß ausfällt. Deshalb wird jede eingegebene
 * Rendite über die Fisher-Gleichung in eine reale Rendite übersetzt, bevor sie
 * in die Simulation geht – und das Ergebnis ist an jeder Stelle ein Betrag von
 * heute, direkt vergleichbar mit dem heutigen Einkommen.
 *
 * Die Ansparphase wird monatsgenau simuliert (wie beim Sparplan-Rechner):
 * erst einzahlen, dann verzinsen. Die nötige zusätzliche Sparrate wird per
 * Bisektion über dieselbe Simulation gesucht – das hält beide Zahlen
 * zueinander konsistent, eine geschlossene Formel könnte um Rundungscent
 * abweichen.
 *
 * Keine Steuer- oder Anlageberatung: Weder die künftige Rentenanpassung noch
 * eine Rendite lassen sich vorhersagen, nur durchspielen.
 */

import {
  MONATE_PRO_JAHR,
  cents,
  clamp,
  jahreRentenbezug,
  monatszinsEffektiv,
  nn,
  toEuro,
} from "@/lib/finanzmath";
import { formatAmount } from "@/lib/format";

const MAX_JAHRE = 70;

export type EinkommenModus = "prozent" | "fest";

export interface RentenlueckeInput {
  aktuellesAlter: number;
  renteneintrittsalter: number;
  lebenserwartung: number;

  /** "prozent": Wunscheinkommen als Anteil vom heutigen Netto. "fest": fester Betrag. */
  einkommenModus: EinkommenModus;
  nettoEinkommen: number;
  versorgungsniveauPercent: number;
  gewuenschtesEinkommenFest: number;

  /** Aus der jährlichen Renteninformation der Deutschen Rentenversicherung. */
  gesetzlicheRente: number;
  /** Betriebsrente, Riester, Rürup – alles, was schon als Rente feststeht. */
  weitereRenten: number;

  vorhandenesVermoegen: number;
  monatlicheSparrate: number;

  /** Erwartete nominale Rendite in der Ansparphase, vor Abzug der Inflation. */
  renditeAnsparphasePercent: number;
  /** Erwartete nominale Rendite in der Rentenphase – meist niedriger, weil sicherer angelegt. */
  renditeRentenphasePercent: number;
  inflationPercent: number;
}

export interface RentenAufbauJahr {
  jahr: number;
  alter: number;
  einzahlungJahr: number;
  eingezahltGesamt: number;
  /** Kapitalstand am Jahresende, in heutiger Kaufkraft. */
  kapitalEnde: number;
}

export interface RentenlueckeResult {
  jahreBisRente: number;
  jahreRentenbezug: number;

  gewuenschtesEinkommen: number;
  erwarteteRente: number;
  /** Monatliche Lücke zwischen Wunscheinkommen und erwarteter Rente, in heutiger Kaufkraft. */
  monatlicheLuecke: number;

  /** Kapital, das bei Renteneintritt nötig ist, um die Lücke bis zur Lebenserwartung zu schließen. */
  kapitalbedarf: number;
  /** Kapital, das nötig wäre, um die Lücke für immer zu schließen, ohne das Kapital anzugreifen. */
  kapitalbedarfEwig: number | null;

  /** Kapital, das mit vorhandenem Vermögen und aktueller Sparrate bis zur Rente entsteht. */
  projiziertesKapital: number;
  eingezahltGesamt: number;
  /** Differenz zwischen Kapitalbedarf und projiziertem Kapital. */
  kapitalLuecke: number;

  /** Zusätzlich nötige monatliche Sparrate, um die Kapitallücke zu schließen. */
  zusaetzlicheSparrateNoetig: number;
  /** Insgesamt nötige Sparrate (aktuelle plus zusätzliche). */
  sparrateGesamtNoetig: number;
  /** Ist die Lücke mit der aktuellen Sparrate bereits geschlossen? */
  zielErreichbar: boolean;

  realeRenditeAnsparphase: number;
  realeRenditeRentenphase: number;

  jahre: RentenAufbauJahr[];
  warnings: string[];
}

/* ---------------------------------------------------------------------------
 * Fisher-Gleichung
 * ------------------------------------------------------------------------- */

/** Reale Rendite nach Kaufkraft, aus nominaler Rendite und Inflation. */
function realeRendite(
  nominalPercent: number,
  inflationPercent: number,
): number {
  return ((1 + nominalPercent / 100) / (1 + inflationPercent / 100) - 1) * 100;
}

/* ---------------------------------------------------------------------------
 * Ansparphase
 * ------------------------------------------------------------------------- */

interface Aufbau {
  jahre: RentenAufbauJahr[];
  kapitalEndeC: number;
  eingezahltC: number;
}

/**
 * Monat für Monat durch die Ansparphase: erst einzahlen, dann verzinsen –
 * dieselbe Reihenfolge wie beim Sparplan-Rechner, damit eine Rate zu Monatsbeginn
 * noch im selben Monat mitverzinst wird.
 */
function simuliereAufbau(
  vorhandenesC: number,
  sparrateC: number,
  realeRenditePercent: number,
  monate: number,
  startAlter: number,
): Aufbau {
  const monatsfaktor = 1 + monatszinsEffektiv(realeRenditePercent);
  const jahreGesamt = Math.ceil(monate / MONATE_PRO_JAHR);

  let kapitalC = vorhandenesC;
  let eingezahltC = vorhandenesC;
  const jahre: RentenAufbauJahr[] = [];

  let monatIndex = 0;
  for (let j = 1; j <= jahreGesamt; j++) {
    let einzahlungJahrC = 0;

    for (let m = 0; m < MONATE_PRO_JAHR && monatIndex < monate; m++) {
      if (sparrateC > 0) {
        kapitalC += sparrateC;
        eingezahltC += sparrateC;
        einzahlungJahrC += sparrateC;
      }
      kapitalC = Math.round(kapitalC * monatsfaktor);
      monatIndex++;
    }

    jahre.push({
      jahr: j,
      alter: startAlter + j,
      einzahlungJahr: toEuro(einzahlungJahrC),
      eingezahltGesamt: toEuro(eingezahltC),
      kapitalEnde: toEuro(kapitalC),
    });
  }

  return { jahre, kapitalEndeC: kapitalC, eingezahltC };
}

/**
 * Nötige monatliche Sparrate für ein Zielkapital – per Bisektion statt per
 * Formel, damit sie exakt zur monatsgenauen Simulation passt.
 */
function sparrateFuerZiel(
  vorhandenesC: number,
  realeRenditePercent: number,
  monate: number,
  zielC: number,
): number {
  if (monate <= 0) return 0;

  const ohneRate = simuliereAufbau(
    vorhandenesC,
    0,
    realeRenditePercent,
    monate,
    0,
  );
  if (ohneRate.kapitalEndeC >= zielC) return 0;

  let lo = 0;
  let hi = Math.max(cents(10), zielC);

  for (let i = 0; i < 40; i++) {
    const probe = simuliereAufbau(
      vorhandenesC,
      hi,
      realeRenditePercent,
      monate,
      0,
    );
    if (probe.kapitalEndeC >= zielC) break;
    hi *= 2;
  }

  for (let i = 0; i < 60; i++) {
    const mid = Math.round((lo + hi) / 2);
    const probe = simuliereAufbau(
      vorhandenesC,
      mid,
      realeRenditePercent,
      monate,
      0,
    );
    if (probe.kapitalEndeC < zielC) lo = mid;
    else hi = mid;
  }

  return hi;
}

/* ---------------------------------------------------------------------------
 * Rentenphase
 * ------------------------------------------------------------------------- */

/**
 * Barwert einer nachschüssigen Rente: das Kapital, das nötig ist, um
 * `monatsRateC` für `monate` Monate auszuzahlen, bei effektivem Monatszins.
 *
 * Bei einer Rendite unter der Inflation (reale Rendite negativ) wächst dieser
 * Betrag deutlich – wer real Kaufkraft verliert, braucht mehr Startkapital,
 * um denselben realen Betrag über Jahre auszuzahlen. Das ist keine Randnotiz,
 * sondern der Grund, warum die Rentenphase meist konservativer angelegt wird.
 */
function barwertRente(
  monatsRateC: number,
  realeRenditePercent: number,
  monate: number,
): number {
  if (monatsRateC <= 0 || monate <= 0) return 0;
  const i = monatszinsEffektiv(realeRenditePercent);
  if (i === 0) return monatsRateC * monate;
  return Math.round((monatsRateC * (1 - (1 + i) ** -monate)) / i);
}

/** Kapital, das die Rate für immer trägt, ohne selbst aufgebraucht zu werden. */
function barwertEwigeRente(
  monatsRateC: number,
  realeRenditePercent: number,
): number | null {
  if (monatsRateC <= 0) return 0;
  const i = monatszinsEffektiv(realeRenditePercent);
  if (i <= 0) return null;
  return Math.round(monatsRateC / i);
}

/* ---------------------------------------------------------------------------
 * Hauptrechnung
 * ------------------------------------------------------------------------- */

export function calculateRentenluecke(
  input: RentenlueckeInput,
): RentenlueckeResult {
  const aktuellesAlter = Math.round(clamp(input.aktuellesAlter, 16, 80));
  const renteneintrittsalter = Math.round(
    clamp(input.renteneintrittsalter, 16, 80),
  );

  const jahreBisRente = Math.min(
    MAX_JAHRE,
    Math.max(0, renteneintrittsalter - aktuellesAlter),
  );
  const jahreRentenbezugWert = jahreRentenbezug(
    renteneintrittsalter,
    input.lebenserwartung,
    1,
  );

  const versorgungsniveauPercent = clamp(
    input.versorgungsniveauPercent,
    0,
    150,
  );
  const nettoEinkommen = nn(input.nettoEinkommen);
  const gewuenschtesEinkommenFest = nn(input.gewuenschtesEinkommenFest);

  const gewuenschtesEinkommen =
    input.einkommenModus === "fest"
      ? gewuenschtesEinkommenFest
      : (nettoEinkommen * versorgungsniveauPercent) / 100;

  const gesetzlicheRente = nn(input.gesetzlicheRente);
  const weitereRenten = nn(input.weitereRenten);
  const erwarteteRente = gesetzlicheRente + weitereRenten;

  const monatlicheLueckeC = Math.max(
    0,
    cents(gewuenschtesEinkommen) - cents(erwarteteRente),
  );

  const renditeAnsparphase = clamp(input.renditeAnsparphasePercent, -5, 15);
  const renditeRentenphase = clamp(input.renditeRentenphasePercent, -5, 15);
  const inflation = clamp(input.inflationPercent, -2, 10);

  const realeRenditeAnsparphase = realeRendite(renditeAnsparphase, inflation);
  const realeRenditeRentenphase = realeRendite(renditeRentenphase, inflation);

  /* -- Kapitalbedarf zu Rentenbeginn --------------------------------------- */

  const kapitalbedarfC = barwertRente(
    monatlicheLueckeC,
    realeRenditeRentenphase,
    jahreRentenbezugWert * MONATE_PRO_JAHR,
  );
  const kapitalbedarfEwigC = barwertEwigeRente(
    monatlicheLueckeC,
    realeRenditeRentenphase,
  );

  /* -- Projiziertes Kapital aus vorhandenem Vermögen und Sparrate --------- */

  const vorhandenesC = cents(nn(input.vorhandenesVermoegen));
  const sparrateC = cents(nn(input.monatlicheSparrate));
  const monateBisRente = jahreBisRente * MONATE_PRO_JAHR;

  const aufbau = simuliereAufbau(
    vorhandenesC,
    sparrateC,
    realeRenditeAnsparphase,
    monateBisRente,
    aktuellesAlter,
  );

  const kapitalLueckeC = Math.max(0, kapitalbedarfC - aufbau.kapitalEndeC);

  /* -- Zusätzlich nötige Sparrate ------------------------------------------ */

  let zusaetzlicheSparrateC = 0;
  if (kapitalLueckeC > 0) {
    const gesamtC = sparrateFuerZiel(
      vorhandenesC,
      realeRenditeAnsparphase,
      monateBisRente,
      kapitalbedarfC,
    );
    zusaetzlicheSparrateC = Math.max(0, gesamtC - sparrateC);
  }

  /* -- Hinweise ------------------------------------------------------------ */

  const warnings: string[] = [];

  if (renteneintrittsalter <= aktuellesAlter) {
    warnings.push(
      "Das Renteneintrittsalter liegt nicht mehr in der Zukunft. Der Kapitalaufbau ist damit abgeschlossen – eine höhere Sparrate kann die Kapitallücke nicht mehr schließen, nur noch vorhandenes Vermögen oder eine spätere Verrentung.",
    );
  }

  if (realeRenditeAnsparphase <= 0 && renteneintrittsalter > aktuellesAlter) {
    warnings.push(
      `Die reale Rendite in der Ansparphase liegt bei ${formatAmount(realeRenditeAnsparphase)} Prozent – nach Abzug der Inflation bleibt also kein Kaufkraftgewinn. Das vergrößert die nötige Sparrate deutlich gegenüber einer Rechnung mit positiver Realrendite.`,
    );
  }

  if (monatlicheLueckeC === 0 && erwarteteRente > 0) {
    warnings.push(
      "Die erwartete Rente deckt das Wunscheinkommen bereits – rechnerisch bräuchte es kein zusätzliches Kapital für den Ruhestand. Ein Puffer für Unvorhergesehenes bleibt trotzdem sinnvoll.",
    );
  }

  if (kapitalLueckeC === 0 && monatlicheLueckeC > 0) {
    warnings.push(
      "Mit vorhandenem Vermögen und aktueller Sparrate ist die Kapitallücke rechnerisch bereits geschlossen. Das gilt nur, solange Rendite und Inflation wie angenommen eintreffen.",
    );
  }

  const einkommenBasis =
    input.einkommenModus === "prozent" ? nettoEinkommen : gewuenschtesEinkommen;
  if (
    einkommenBasis > 0 &&
    toEuro(zusaetzlicheSparrateC) > einkommenBasis * 0.5
  ) {
    warnings.push(
      "Die zusätzlich nötige Sparrate liegt bei über der Hälfte des eingegebenen Einkommens. Das ist auf diesem Weg kaum zu stemmen – ein späterer Renteneintritt oder ein niedrigeres Versorgungsniveau verkleinern die Lücke spürbar.",
    );
  }

  return {
    jahreBisRente,
    jahreRentenbezug: jahreRentenbezugWert,

    gewuenschtesEinkommen,
    erwarteteRente,
    monatlicheLuecke: toEuro(monatlicheLueckeC),

    kapitalbedarf: toEuro(kapitalbedarfC),
    kapitalbedarfEwig:
      kapitalbedarfEwigC === null ? null : toEuro(kapitalbedarfEwigC),

    projiziertesKapital: toEuro(aufbau.kapitalEndeC),
    eingezahltGesamt: toEuro(aufbau.eingezahltC),
    kapitalLuecke: toEuro(kapitalLueckeC),

    zusaetzlicheSparrateNoetig: toEuro(zusaetzlicheSparrateC),
    sparrateGesamtNoetig: toEuro(sparrateC + zusaetzlicheSparrateC),
    zielErreichbar: kapitalLueckeC === 0,

    realeRenditeAnsparphase,
    realeRenditeRentenphase,

    jahre: aufbau.jahre,
    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Voreinstellung
 * ------------------------------------------------------------------------- */

export function defaultInput(): RentenlueckeInput {
  return {
    aktuellesAlter: 35,
    renteneintrittsalter: 67,
    lebenserwartung: 85,

    einkommenModus: "prozent",
    nettoEinkommen: 3000,
    versorgungsniveauPercent: 80,
    gewuenschtesEinkommenFest: 2400,

    gesetzlicheRente: 1400,
    weitereRenten: 0,

    vorhandenesVermoegen: 15000,
    monatlicheSparrate: 150,

    renditeAnsparphasePercent: 6,
    renditeRentenphasePercent: 3,
    inflationPercent: 2,
  };
}
