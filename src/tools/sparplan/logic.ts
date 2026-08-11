/**
 * Sparplan- und Zinseszins-Rechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Der Unterschied zu einem Zinseszinsrechner mit drei Feldern liegt in den
 * vier Dingen, die am Ende über das Ergebnis entscheiden und in den meisten
 * Rechnern fehlen:
 *
 *   Kosten. Ein Prozent laufende Gebühr klingt nach nichts und kostet über
 *   dreißig Jahre rund ein Viertel des Endkapitals – weil die Gebühr nicht auf
 *   die Einzahlung wirkt, sondern jedes Jahr auf den gesamten Bestand.
 *
 *   Steuern. Seit 2018 wird auch ein thesaurierender Fonds jährlich besteuert,
 *   über die Vorabpauschale. Sie ist klein, aber sie wird vom Konto abgebucht
 *   und fehlt damit im Zinseszins.
 *
 *   Inflation. Hunderttausend Euro in dreißig Jahren sind nicht
 *   hunderttausend Euro. Der Rechner weist den Betrag deshalb zusätzlich in
 *   heutiger Kaufkraft aus.
 *
 *   Die Entnahme. Ein Sparplan endet nicht mit dem Endkapital, sondern mit
 *   der Frage, wie lange davon etwas übrig bleibt.
 *
 * Gerechnet wird monatlich in ganzen Cent. Die eingegebene Rendite ist die
 * effektive Jahresrendite: Aus 10.000 Euro zu 7 Prozent werden nach einem Jahr
 * 10.700 Euro. Der Monatszins ist deshalb die zwölfte Wurzel und nicht ein
 * Zwölftel – letzteres würde effektiv mit 7,229 Prozent verzinsen und das
 * Endkapital über dreißig Jahre um gut vier Prozent zu hoch ausweisen.
 *
 * Beim Kreditrechner ist die Division durch zwölf dagegen richtig, weil der
 * deutsche Sollzins ein nominaler Jahreszins ist. Die beiden Rechner sprechen
 * hier bewusst nicht dieselbe Sprache – die Konventionen sind verschieden.
 *
 * Keine Steuer- oder Anlageberatung: Es wird eine gleichbleibende Rendite
 * unterstellt, und die gibt es an der Börse nicht.
 */

import {
  MONATE_PRO_JAHR,
  anteil,
  annuitaetsRate,
  cents,
  clamp,
  effektivzins,
  monatszinsEffektiv,
  nn,
  nominalAusEffektiv,
  toEuro,
  verdopplungsdauer,
} from "@/lib/finanzmath";
import { formatEuroRounded, formatRate } from "@/lib/format";
import {
  BASISERTRAG_FAKTOR,
  BASISZINS_PROZENT,
  SPARERPAUSCHBETRAG,
  abgeltungsteuer,
  anlagearten,
  type Anlageart,
} from "./steuern";

/** Der Sparplan wird nie länger als ein Berufsleben gerechnet. */
const MAX_JAHRE = 60;

export type SparplanModus = "endkapital" | "sparrate";

export interface SparplanInput {
  /** "endkapital": Was wird daraus? "sparrate": Was muss ich sparen? */
  modus: SparplanModus;
  startkapital: number;
  sparrateMonat: number;
  /** Nur im Modus "sparrate": der angestrebte Betrag nach Steuern. */
  zielkapital: number;
  /** Jährliche Erhöhung der Sparrate in Prozent. */
  dynamikPercent: number;
  renditePercent: number;
  laufzeitJahre: number;
  /** Laufende Fondskosten pro Jahr (TER). */
  kostenPercent: number;
  /** Ausgabeaufschlag je Einzahlung. */
  ausgabeaufschlagPercent: number;
  inflationPercent: number;
  anlageart: Anlageart;
  steuernBeruecksichtigen: boolean;
  /** 0, 8 oder 9 Prozent. */
  kirchensteuerPercent: number;
  /** Für die Entnahmephase nach dem Sparen. */
  entnahmeJahre: number;
}

export interface SparplanJahr {
  jahr: number;
  sparrateMonat: number;
  einzahlungJahr: number;
  eingezahltGesamt: number;
  /** Depotwert am Jahresende, nach laufenden Kosten und Vorabpauschale. */
  wertEnde: number;
  ertragGesamt: number;
  vorabpauschale: number;
  steuerJahr: number;
  /** Depotwert in heutiger Kaufkraft. */
  wertRealEnde: number;
}

export interface SparplanResult {
  /** Im Zielmodus die errechnete Rate, sonst die eingegebene. */
  sparrateMonat: number;
  laufzeitJahre: number;

  eingezahlt: number;
  endkapital: number;
  endkapitalNachSteuer: number;
  /** Nach Steuern und in heutiger Kaufkraft. */
  endkapitalReal: number;
  ertrag: number;

  kostenGesamt: number;
  ausgabeaufschlagGesamt: number;
  steuernGesamt: number;
  /** Während der Laufzeit gezahlte Vorabpauschale-Steuern. */
  steuerLaufend: number;
  /** Steuer auf den Gewinn beim Verkauf am Ende. */
  steuerVerkauf: number;

  /**
   * Rendite nach Kosten *und* Steuern, aus der Zahlungsreihe – die
   * Schlusszahlung ist das Endkapital nach Verkaufssteuer.
   */
  renditeNachKostenUndSteuernProJahr: number | null;
  verdopplungJahre: number | null;
  /** Anteil des Endkapitals, der aus Erträgen stammt. */
  zinsanteilProzent: number | null;

  /** Monatliche Entnahme, die das Kapital in `entnahmeJahre` aufbraucht. */
  entnahmeMonat: number;
  entnahmeJahre: number;
  /** Monatliche Entnahme, die das Kapital nie angreift. */
  entnahmeEwigMonat: number;

  /** Im Zielmodus: Ist das Ziel überhaupt erreichbar? */
  zielErreichbar: boolean;

  jahre: SparplanJahr[];
  warnings: string[];
}

/* ---------------------------------------------------------------------------
 * Simulation
 * ------------------------------------------------------------------------- */

interface Verlauf {
  jahre: SparplanJahr[];
  wertEndeC: number;
  eingezahltC: number;
  aufschlagC: number;
  laufendeKostenC: number;
  steuerLaufendC: number;
  /** Summe der bereits versteuerten Vorabpauschalen. */
  versteuertC: number;
  /** Monatliche Zahlungsreihe für den internen Zinsfuß. */
  flows: number[];
}

interface SimParams {
  startkapitalC: number;
  sparrateC: number;
  dynamik: number;
  rendite: number;
  kosten: number;
  aufschlag: number;
  inflation: number;
  jahre: number;
  teilfreistellung: number;
  steuern: boolean;
  kirchensteuer: number;
}

/**
 * Monat für Monat durch den Sparplan.
 *
 * Der Ablauf je Monat ist bewusst diese Reihenfolge: erst einzahlen (abzüglich
 * Ausgabeaufschlag), dann verzinsen, dann die laufenden Kosten abziehen. Wer
 * die Rate erst am Monatsende einzahlt, bekommt ein spürbar anderes Ergebnis –
 * bei dreißig Jahren Laufzeit rund eine Monatsrendite Unterschied.
 */
function simuliere(p: SimParams): Verlauf {
  // Zwölfte Wurzel statt Zwölftel: die eingegebene Rendite ist die effektive
  // Jahresrendite. Die laufenden Kosten werden genauso behandelt, sodass ein
  // Jahr brutto den Faktor (1 + r) und die Gebühr den Faktor (1 − k) ergibt.
  const monatsfaktorBrutto = 1 + monatszinsEffektiv(p.rendite);
  const monatsfaktorKosten = (1 - p.kosten / 100) ** (1 / MONATE_PRO_JAHR);

  const jahre: SparplanJahr[] = [];

  /**
   * Zahlungsreihe für den internen Zinsfuß, ein Feld je Monatsgrenze.
   *
   * Die Zeitpunkte müssen zur Simulation passen: Startkapital und erste Rate
   * liegen beide auf t = 0, weil beide vor der ersten Verzinsung eingezahlt
   * werden. Landet die erste Rate stattdessen auf t = 1, ist jede Einzahlung
   * einen Monat zu spät bewertet und die ausgewiesene Rendite fällt zu hoch
   * aus – bei sechs Prozent Eingabe kamen so 6,03 Prozent heraus.
   */
  const flows: number[] = new Array(p.jahre * MONATE_PRO_JAHR + 1).fill(0);
  let t = 0;

  let wertC = 0;
  let eingezahltC = 0;
  let aufschlagGesamtC = 0;
  let laufendeKostenC = 0;
  let steuerLaufendC = 0;
  let versteuertC = 0;
  let rateC = p.sparrateC;

  // Das Startkapital wird wie eine Einzahlung behandelt – auch darauf fällt
  // ein Ausgabeaufschlag an.
  if (p.startkapitalC > 0) {
    const aufC = anteil(p.startkapitalC, p.aufschlag);
    wertC = p.startkapitalC - aufC;
    eingezahltC = p.startkapitalC;
    aufschlagGesamtC = aufC;
    flows[0] -= p.startkapitalC;
  }

  for (let j = 1; j <= p.jahre; j++) {
    const wertJahresanfangC = wertC;
    let einzahlungJahrC = 0;

    for (let m = 0; m < MONATE_PRO_JAHR; m++) {
      if (rateC > 0) {
        const aufC = anteil(rateC, p.aufschlag);
        wertC += rateC - aufC;
        eingezahltC += rateC;
        aufschlagGesamtC += aufC;
        einzahlungJahrC += rateC;
      }
      // Die Rate liegt auf dem Zeitpunkt, an dem sie eingezahlt wird – der
      // Monat wird erst danach verzinst.
      flows[t] -= rateC;
      t += 1;

      // Erst der Ertrag auf den Bestand, dann die Gebühr auf den gewachsenen
      // Bestand – so wird die Gebühr wie im Fonds täglich aus dem Vermögen
      // entnommen und nicht aus der Einzahlung.
      const nachErtragC = Math.round(wertC * monatsfaktorBrutto);
      const nachKostenC = Math.round(nachErtragC * monatsfaktorKosten);
      laufendeKostenC += nachErtragC - nachKostenC;
      wertC = nachKostenC;
    }

    /* -- Vorabpauschale ---------------------------------------------------- */

    let vorabC = 0;
    let steuerJahrC = 0;

    if (p.steuern) {
      // § 18 InvStG: Fondswert am Jahresanfang × Basiszins × 0,7, gedeckelt
      // auf den tatsächlichen Wertzuwachs des Jahres. Wer Verlust macht,
      // zahlt keine Vorabpauschale.
      const basisertragC = Math.round(
        (wertJahresanfangC * BASISZINS_PROZENT * BASISERTRAG_FAKTOR) / 100,
      );
      const wertzuwachsC = wertC - wertJahresanfangC - einzahlungJahrC;
      vorabC = Math.max(0, Math.min(basisertragC, wertzuwachsC));

      const steuerpflichtigC = vorabC - anteil(vorabC, p.teilfreistellung);
      const nachFreibetragC = Math.max(
        0,
        steuerpflichtigC - cents(SPARERPAUSCHBETRAG),
      );
      steuerJahrC = abgeltungsteuer(nachFreibetragC, p.kirchensteuer).gesamt;

      // Die Steuer wird vom Verrechnungskonto eingezogen. Für den Sparplan
      // ist das ein echter Abfluss – hier vereinfacht aus dem Depot.
      wertC -= steuerJahrC;
      steuerLaufendC += steuerJahrC;
      versteuertC += vorabC;
    }

    const ertragGesamtC = wertC - eingezahltC;
    const realFaktor = (1 + p.inflation / 100) ** j;

    jahre.push({
      jahr: j,
      sparrateMonat: toEuro(rateC),
      einzahlungJahr: toEuro(einzahlungJahrC),
      eingezahltGesamt: toEuro(eingezahltC),
      wertEnde: toEuro(wertC),
      ertragGesamt: toEuro(ertragGesamtC),
      vorabpauschale: toEuro(vorabC),
      steuerJahr: toEuro(steuerJahrC),
      wertRealEnde: toEuro(Math.round(wertC / realFaktor)),
    });

    // Dynamik wirkt ab dem Folgejahr.
    if (p.dynamik > 0) rateC = Math.round(rateC * (1 + p.dynamik / 100));
  }

  return {
    jahre,
    wertEndeC: wertC,
    eingezahltC,
    aufschlagC: aufschlagGesamtC,
    laufendeKostenC,
    steuerLaufendC,
    versteuertC,
    flows,
  };
}

/** Steuer auf den Veräußerungsgewinn am Ende, in Cent. */
function verkaufssteuer(verlauf: Verlauf, p: SimParams): number {
  if (!p.steuern) return 0;

  // Bereits über die Vorabpauschale versteuerte Beträge werden angerechnet,
  // sonst würde derselbe Ertrag zweimal besteuert (§ 19 Abs. 1 InvStG).
  const gewinnC = verlauf.wertEndeC - verlauf.eingezahltC;
  const nachAnrechnungC = Math.max(0, gewinnC - verlauf.versteuertC);
  const steuerpflichtigC =
    nachAnrechnungC - anteil(nachAnrechnungC, p.teilfreistellung);
  const nachFreibetragC = Math.max(
    0,
    steuerpflichtigC - cents(SPARERPAUSCHBETRAG),
  );
  return abgeltungsteuer(nachFreibetragC, p.kirchensteuer).gesamt;
}

/** Endkapital nach Steuern – die Größe, auf die der Zielmodus rechnet. */
function endkapitalNachSteuerC(p: SimParams): number {
  const verlauf = simuliere(p);
  return verlauf.wertEndeC - verkaufssteuer(verlauf, p);
}

/**
 * Nötige Sparrate für ein Ziel – per Bisektion statt per Formel.
 *
 * Auflösen ginge nur ohne Steuern: Sparerpauschbetrag und Teilfreistellung
 * machen den Zusammenhang zwischen Rate und Endkapital abschnittsweise
 * linear, aber nicht linear. Monoton steigend ist er aber immer, und damit
 * findet die Bisektion die Rate zuverlässig.
 */
function sparrateFuerZiel(p: SimParams, zielC: number): number {
  const ohneRate = endkapitalNachSteuerC({ ...p, sparrateC: 0 });
  if (ohneRate >= zielC) return 0;

  let lo = 0;
  let hi = Math.max(cents(100), zielC);

  // Obergrenze suchen, die das Ziel sicher überschreitet.
  for (let i = 0; i < 40; i++) {
    if (endkapitalNachSteuerC({ ...p, sparrateC: hi }) >= zielC) break;
    hi *= 2;
  }

  for (let i = 0; i < 60; i++) {
    const mid = Math.round((lo + hi) / 2);
    if (endkapitalNachSteuerC({ ...p, sparrateC: mid }) < zielC) lo = mid;
    else hi = mid;
  }
  return hi;
}

/* ---------------------------------------------------------------------------
 * Hauptrechnung
 * ------------------------------------------------------------------------- */

export function calculateSparplan(input: SparplanInput): SparplanResult {
  const jahre = Math.round(clamp(input.laufzeitJahre, 1, MAX_JAHRE));
  const rendite = clamp(input.renditePercent, -20, 30);
  const kosten = clamp(input.kostenPercent, 0, 5);
  const aufschlag = clamp(input.ausgabeaufschlagPercent, 0, 10);
  const inflation = clamp(input.inflationPercent, -5, 20);
  const dynamik = clamp(input.dynamikPercent, 0, 20);
  const kirchensteuer = clamp(input.kirchensteuerPercent, 0, 9);
  const entnahmeJahre = Math.round(clamp(input.entnahmeJahre, 1, MAX_JAHRE));

  const art = anlagearten[input.anlageart] ?? anlagearten.aktienfonds;

  const basis: SimParams = {
    startkapitalC: cents(nn(input.startkapital)),
    sparrateC: cents(nn(input.sparrateMonat)),
    dynamik,
    rendite,
    kosten,
    aufschlag,
    inflation,
    jahre,
    teilfreistellung: art.teilfreistellungPercent,
    steuern: input.steuernBeruecksichtigen,
    kirchensteuer,
  };

  /* -- Zielmodus: erst die Rate finden ------------------------------------ */

  const zielC = cents(nn(input.zielkapital));
  const istZielmodus = input.modus === "sparrate";

  const params: SimParams = istZielmodus
    ? { ...basis, sparrateC: sparrateFuerZiel(basis, zielC) }
    : basis;

  const verlauf = simuliere(params);
  const steuerVerkaufC = verkaufssteuer(verlauf, params);
  const endNachSteuerC = verlauf.wertEndeC - steuerVerkaufC;

  const realFaktor = (1 + inflation / 100) ** jahre;
  const endRealC = Math.round(endNachSteuerC / realFaktor);

  /* -- Rendite aus der Zahlungsreihe -------------------------------------- */

  const flows = [...verlauf.flows];
  flows[flows.length - 1] += endNachSteuerC;
  const renditeNachKosten = effektivzins(flows);

  const ertragC = verlauf.wertEndeC - verlauf.eingezahltC;
  const zinsanteil =
    verlauf.wertEndeC > 0 ? (ertragC / verlauf.wertEndeC) * 100 : null;

  /* -- Entnahmephase ------------------------------------------------------ */

  // Entnehmen ist Tilgen mit umgekehrtem Vorzeichen: die Rate, die ein
  // Darlehen in n Monaten abträgt, ist genau die Entnahme, die ein Kapital in
  // n Monaten aufbraucht. `annuitaetsRate` rechnet allerdings mit der
  // Kreditkonvention und teilt intern durch zwölf – die Rendite muss deshalb
  // erst in den entsprechenden nominalen Satz übersetzt werden.
  const entnahmeC = annuitaetsRate(
    endNachSteuerC,
    nominalAusEffektiv(rendite),
    entnahmeJahre * MONATE_PRO_JAHR,
  );
  const entnahmeEwigC =
    rendite > 0 ? Math.round(endNachSteuerC * monatszinsEffektiv(rendite)) : 0;

  /* -- Hinweise ----------------------------------------------------------- */

  const warnings: string[] = [];

  if (rendite <= inflation) {
    warnings.push(
      `Die Rendite von ${formatRate(rendite)} Prozent liegt nicht über der Inflation von ${formatRate(inflation)} Prozent. Real verlierst du damit Kaufkraft, auch wenn der Betrag auf dem Papier wächst.`,
    );
  }

  if (kosten >= 1) {
    const ohneKosten = simuliere({ ...params, kosten: 0 });
    const differenzC = ohneKosten.wertEndeC - verlauf.wertEndeC;
    warnings.push(
      `${formatRate(kosten)} Prozent laufende Kosten klingen nach wenig, kosten über ${jahre} Jahre aber ${formatEuroRounded(toEuro(differenzC))}. Die Gebühr wirkt nicht auf die Einzahlung, sondern jedes Jahr auf den gesamten Bestand.`,
    );
  }

  if (aufschlag > 0) {
    warnings.push(
      `Der Ausgabeaufschlag von ${formatRate(aufschlag)} Prozent kostet über die Laufzeit ${formatEuroRounded(toEuro(verlauf.aufschlagC))}. Bei ETF-Sparplänen vieler Broker fällt er nicht an.`,
    );
  }

  if (dynamik > 0) {
    const letzte = verlauf.jahre[verlauf.jahre.length - 1];
    if (letzte) {
      warnings.push(
        `Mit ${formatRate(dynamik)} Prozent Dynamik steigt die Rate bis zum letzten Jahr auf ${formatEuroRounded(letzte.sparrateMonat)} im Monat. Prüf, ob das dauerhaft zu deinem Einkommen passt.`,
      );
    }
  }

  if (params.steuern && verlauf.steuerLaufendC > 0) {
    warnings.push(
      `Über die Laufzeit fallen ${formatEuroRounded(toEuro(verlauf.steuerLaufendC))} Vorabpauschale an. Sie wird jedes Jahr im Januar vom Verrechnungskonto eingezogen – dafür sollte dort Geld liegen, sonst verkauft die Bank Anteile.`,
    );
  }

  if (!params.steuern) {
    warnings.push(
      "Die Steuern sind ausgeschaltet. Das Ergebnis ist damit ein Bruttowert – bei einem Aktien-ETF gehen beim Verkauf rund 18 Prozent des Gewinns an das Finanzamt.",
    );
  }

  const zielErreichbar = !istZielmodus || params.sparrateC > 0 || zielC === 0;
  if (istZielmodus && zielC > 0 && params.sparrateC === 0) {
    warnings.push(
      "Das Startkapital erreicht das Ziel schon von allein – eine monatliche Sparrate ist rechnerisch nicht nötig.",
    );
  }

  return {
    sparrateMonat: toEuro(params.sparrateC),
    laufzeitJahre: jahre,

    eingezahlt: toEuro(verlauf.eingezahltC),
    endkapital: toEuro(verlauf.wertEndeC),
    endkapitalNachSteuer: toEuro(endNachSteuerC),
    endkapitalReal: toEuro(endRealC),
    ertrag: toEuro(ertragC),

    kostenGesamt: toEuro(verlauf.laufendeKostenC + verlauf.aufschlagC),
    ausgabeaufschlagGesamt: toEuro(verlauf.aufschlagC),
    steuernGesamt: toEuro(verlauf.steuerLaufendC + steuerVerkaufC),
    steuerLaufend: toEuro(verlauf.steuerLaufendC),
    steuerVerkauf: toEuro(steuerVerkaufC),

    renditeNachKostenUndSteuernProJahr: renditeNachKosten,
    verdopplungJahre: verdopplungsdauer(rendite - kosten),
    zinsanteilProzent: zinsanteil,

    entnahmeMonat: toEuro(entnahmeC),
    entnahmeJahre,
    entnahmeEwigMonat: toEuro(entnahmeEwigC),

    zielErreichbar,

    jahre: verlauf.jahre,
    warnings,
  };
}

/* ---------------------------------------------------------------------------
 * Voreinstellung
 * ------------------------------------------------------------------------- */

export function defaultInput(): SparplanInput {
  return {
    modus: "endkapital",
    startkapital: 5000,
    sparrateMonat: 250,
    zielkapital: 100000,
    dynamikPercent: 0,
    renditePercent: 7,
    laufzeitJahre: 20,
    kostenPercent: 0.2,
    ausgabeaufschlagPercent: 0,
    inflationPercent: 2,
    anlageart: "aktienfonds",
    steuernBeruecksichtigen: true,
    kirchensteuerPercent: 0,
    entnahmeJahre: 25,
  };
}
