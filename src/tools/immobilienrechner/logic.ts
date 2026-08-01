/**
 * Immobilien-Rechner – reine Berechnung, keine React-/DOM-Abhängigkeiten.
 *
 * Der Rechner beantwortet zwei verschiedene Fragen mit demselben Kern:
 *
 *   Kapitalanlage – trägt sich die Wohnung? Dann zählen Mietrendite,
 *   Cashflow nach Steuern und was am Ende eines Verkaufs übrig bleibt.
 *
 *   Eigennutzung – ist Kaufen besser als Mieten? Dann gibt es keine
 *   Mieteinnahme, sondern eine ersparte Miete, keine Abschreibung und keinen
 *   steuerpflichtigen Verkaufsgewinn.
 *
 * Vier Dinge machen den Unterschied zu einem Rechner, der nur die Monatsrate
 * ausspuckt:
 *
 *   Die Kaufnebenkosten sind der Posten, an dem Finanzierungen scheitern. Sie
 *   liegen je nach Bundesland zwischen 8 und 12 Prozent des Kaufpreises und
 *   sind zum Notartermin in bar fällig – eine Bank finanziert sie ungern mit.
 *
 *   Die Restschuld zum Ende der Zinsbindung ist das eigentliche Risiko, nicht
 *   die heutige Rate. Sie wird hier über einen echten monatlichen Tilgungsplan
 *   ermittelt, nicht über eine Jahresnäherung.
 *
 *   Die Steuer entscheidet bei vermieteten Objekten über Plus oder Minus. Die
 *   Abschreibung gilt nur für den Gebäudeanteil – Grund und Boden nutzt sich
 *   nicht ab und wird nicht abgeschrieben.
 *
 *   Ein Verkauf innerhalb von zehn Jahren ist bei Vermietung steuerpflichtig,
 *   und zwar auf den Gewinn zuzüglich der in Anspruch genommenen Abschreibung.
 *
 * Gerechnet wird durchgehend in ganzen Cent. Über bis zu 600 Monatsschritte
 * würden Kommazahlen in Euro spürbar driften; Banken runden den Zins ohnehin
 * monatlich auf den Cent. Prozentsätze und Renditen bleiben Kommazahlen.
 *
 * Keine Steuer- oder Anlageberatung: Solidaritätszuschlag, Kirchensteuer,
 * Progressionseffekte und Verlustverrechnungsgrenzen bleiben außen vor.
 */

import {
  anteil,
  cents,
  clamp,
  internerZinsfuss,
  nn,
  toEuro,
  MONATE_PRO_JAHR,
} from "@/lib/finanzmath";
import type { RegionCode } from "@/lib/regionen";
import { grestFor } from "./grunderwerbsteuer";

// Der interne Zinsfuß lebt seit dem Sparplan- und Kreditrechner in
// lib/finanzmath.ts. Hier bleibt er exportiert, damit die öffentliche Fläche
// dieses Moduls unverändert ist.
export { internerZinsfuss };

export type Modus = "kapitalanlage" | "eigennutzung";

/** Abschreibungsvarianten nach § 7 Abs. 4 und Abs. 5a EStG. */
export type AfaArt = "linear-2" | "linear-2-5" | "linear-3" | "degressiv-5";

interface AfaDef {
  label: string;
  hint: string;
  /** Satz in Prozent – bei degressiver AfA vom Restbuchwert. */
  satz: number;
  degressiv: boolean;
}

export const afaArten: Record<AfaArt, AfaDef> = {
  "linear-2": {
    label: "2 % linear",
    hint: "Wohngebäude, fertiggestellt ab 1925. Der Normalfall.",
    satz: 2,
    degressiv: false,
  },
  "linear-2-5": {
    label: "2,5 % linear",
    hint: "Wohngebäude, fertiggestellt vor 1925.",
    satz: 2.5,
    degressiv: false,
  },
  "linear-3": {
    label: "3 % linear",
    hint: "Wohngebäude, fertiggestellt ab 2023.",
    satz: 3,
    degressiv: false,
  },
  "degressiv-5": {
    label: "5 % degressiv",
    hint: "Neubau mit Baubeginn ab Oktober 2023 – 5 % vom Restwert, also fallend.",
    satz: 5,
    degressiv: true,
  },
};

/** Spekulationsfrist für private Veräußerungsgeschäfte, § 23 EStG. */
export const SPEKULATIONSFRIST_JAHRE = 10;

/**
 * Anschaffungsnahe Herstellungskosten: Übersteigen Instandsetzungen in den
 * ersten drei Jahren diesen Anteil des Gebäudewerts, sind sie nicht sofort
 * abziehbar, sondern nur über die Abschreibung (§ 6 Abs. 1 Nr. 1a EStG).
 */
export const ANSCHAFFUNGSNAH_GRENZE_PROZENT = 15;

/** Der Tilgungsplan wird nie länger als ein Berufsleben gerechnet. */
const MAX_JAHRE = 50;

/* ---------------------------------------------------------------------------
 * Ein- und Ausgabe
 * ------------------------------------------------------------------------- */

export interface ImmobilienInput {
  modus: Modus;

  /** Kaufpreis in Euro. */
  kaufpreis: number;
  /** Wohnfläche in m² – nur für Kennzahlen je m² und die Instandhaltung. */
  wohnflaeche: number;
  /** Modernisierung direkt nach dem Kauf, in Euro. */
  modernisierung: number;

  /** Bundesland – belegt den Grunderwerbsteuersatz vor. */
  region: RegionCode;
  /** Grunderwerbsteuer in Prozent des Kaufpreises. */
  grestPercent: number;
  /** Notar und Grundbuch in Prozent des Kaufpreises. */
  notarPercent: number;
  /** Maklerprovision (Käuferanteil) in Prozent des Kaufpreises. */
  maklerPercent: number;

  /** Eingesetztes Eigenkapital in Euro. */
  eigenkapital: number;
  /** Sollzins pro Jahr in Prozent. */
  sollzinsPercent: number;
  /** Anfängliche Tilgung pro Jahr in Prozent. */
  tilgungPercent: number;
  /** Dauer der Zinsbindung in Jahren. */
  zinsbindungJahre: number;

  /** Kaltmiete pro Monat in Euro (Kapitalanlage). */
  kaltmieteMonat: number;
  /** Mietsteigerung pro Jahr in Prozent – gilt auch für die Bewirtschaftung. */
  mietsteigerungPercent: number;
  /** Nicht umlagefähiges Hausgeld pro Monat in Euro. */
  hausgeldMonat: number;
  /** Instandhaltungsrücklage in Euro je m² und Jahr. */
  instandhaltungProQmJahr: number;
  /** Verwaltungskosten pro Monat in Euro. */
  verwaltungMonat: number;
  /** Mietausfallwagnis in Prozent der Jahresmiete. */
  mietausfallPercent: number;

  /** Gebäudeanteil am Kaufpreis in Prozent – nur er ist abschreibbar. */
  gebaeudeanteilPercent: number;
  afaArt: AfaArt;
  /** Persönlicher Grenzsteuersatz in Prozent. */
  grenzsteuersatzPercent: number;

  /** Miete, die bei Eigennutzung entfällt, pro Monat in Euro. */
  ersparteMieteMonat: number;
  /** Rendite, die das Eigenkapital sonst brächte, pro Jahr in Prozent. */
  alternativrenditePercent: number;

  /** Betrachtungszeitraum in Jahren. */
  horizontJahre: number;
  /** Wertentwicklung pro Jahr in Prozent – darf negativ sein. */
  wertsteigerungPercent: number;
  /** Kosten des Verkaufs in Prozent des Verkaufspreises. */
  verkaufskostenPercent: number;
}

/** Eine Zeile des Jahresverlaufs. Alle Beträge in Euro. */
export interface Jahreszeile {
  jahr: number;
  zins: number;
  tilgung: number;
  rate: number;
  /** Restschuld am Jahresende. */
  restschuld: number;
  /** Immobilienwert am Jahresende. */
  immobilienwert: number;
  /** Mieteinnahme nach Ausfallwagnis – bei Eigennutzung die ersparte Miete. */
  miete: number;
  bewirtschaftung: number;
  afa: number;
  /** Positiv = Steuerlast, negativ = Erstattung. */
  steuer: number;
  /** Cashflow nach Steuern. Bei Eigennutzung die Belastung gegenüber Mieten. */
  cashflow: number;
  /** Immobilienwert abzüglich Restschuld. */
  vermoegen: number;
}

export interface ImmobilienResult {
  modus: Modus;

  // Kaufnebenkosten
  grunderwerbsteuer: number;
  notarUndGrundbuch: number;
  maklerprovision: number;
  nebenkosten: number;
  /** Nebenkosten in Prozent des Kaufpreises. */
  nebenkostenQuote: number;
  modernisierung: number;
  gesamtinvestition: number;
  preisProQm: number;

  // Finanzierung
  eigenkapitalEingesetzt: number;
  darlehen: number;
  /** Darlehen in Prozent des Kaufpreises. */
  beleihungsauslauf: number;
  monatsrate: number;
  jahresannuitaet: number;
  zinsErstesJahr: number;
  tilgungErstesJahr: number;
  restschuldZinsbindung: number;
  zinsenBisZinsbindung: number;
  /** Jahre bis zur vollständigen Tilgung; null, wenn die Rate nie tilgt. */
  volltilgungJahre: number | null;
  gesamtzinsen: number;

  // Rendite
  bruttomietrendite: number;
  nettomietrendite: number;
  kaufpreisfaktor: number;
  /** Ertrag nach Zinsen und Steuern je Euro Eigenkapital, Jahr 1. */
  eigenkapitalrendite: number;
  mieteProQm: number;

  // Erstes Jahr
  mieteJahr: number;
  bewirtschaftungJahr: number;
  cashflowVorSteuerMonat: number;
  cashflowVorSteuerJahr: number;
  afaJahr: number;
  steuerlichesErgebnis: number;
  steuerwirkungJahr: number;
  cashflowNachSteuerMonat: number;
  cashflowNachSteuerJahr: number;

  // Eigennutzung
  belastungMonat: number;
  ersparteMieteMonat: number;
  /** Positiv = Kaufen kostet mehr im Monat als Mieten. */
  mehrbelastungMonat: number;
  vermoegenKaufen: number;
  vermoegenMieten: number;
  /** Positiv = Kaufen steht am Ende besser da. */
  vorteilKaufen: number;

  // Betrachtungszeitraum
  horizontJahre: number;
  immobilienwertEnde: number;
  restschuldEnde: number;
  verkaufskosten: number;
  spekulationssteuer: number;
  nettoVerkaufserloes: number;
  kumulierterCashflow: number;
  vermoegenszuwachs: number;
  /** Interner Zinsfuß über den Betrachtungszeitraum; null ohne Vorzeichenwechsel. */
  gesamtrenditeProJahr: number | null;

  jahre: Jahreszeile[];
  warnings: string[];
}

/* ---------------------------------------------------------------------------
 * Hauptrechnung
 * ------------------------------------------------------------------------- */

export function calculateImmobilie(input: ImmobilienInput): ImmobilienResult {
  const istAnlage = input.modus === "kapitalanlage";

  // Eingaben klemmen. Wertentwicklung und Mietsteigerung dürfen negativ sein –
  // fallende Preise sind kein Eingabefehler, sondern ein Szenario.
  const kaufpreisC = cents(nn(input.kaufpreis));
  const wohnflaeche = nn(input.wohnflaeche);
  const modernisierungC = cents(nn(input.modernisierung));

  const grestPercent = clamp(input.grestPercent, 0, 20);
  const notarPercent = clamp(input.notarPercent, 0, 10);
  const maklerPercent = clamp(input.maklerPercent, 0, 10);

  const sollzins = clamp(input.sollzinsPercent, 0, 25);
  const tilgung = clamp(input.tilgungPercent, 0, 25);
  const zinsbindung = Math.round(clamp(input.zinsbindungJahre, 1, 40));

  const mietsteigerung = clamp(input.mietsteigerungPercent, -10, 20);
  const mietausfall = clamp(input.mietausfallPercent, 0, 100);
  const gebaeudeanteil = clamp(input.gebaeudeanteilPercent, 0, 100);
  const grenzsteuersatz = clamp(input.grenzsteuersatzPercent, 0, 100);
  const alternativrendite = clamp(input.alternativrenditePercent, 0, 25);

  const horizont = Math.round(clamp(input.horizontJahre, 1, MAX_JAHRE));
  const wertsteigerung = clamp(input.wertsteigerungPercent, -20, 20);
  const verkaufskostenPercent = clamp(input.verkaufskostenPercent, 0, 20);

  /* -- Kaufnebenkosten ---------------------------------------------------- */

  const grestC = anteil(kaufpreisC, grestPercent);
  const notarC = anteil(kaufpreisC, notarPercent);
  const maklerC = anteil(kaufpreisC, maklerPercent);
  const nebenkostenC = grestC + notarC + maklerC;
  const gesamtinvestitionC = kaufpreisC + nebenkostenC + modernisierungC;

  /* -- Finanzierung ------------------------------------------------------- */

  // Mehr Eigenkapital als Investition ergibt kein negatives Darlehen.
  const eigenkapitalC = Math.min(cents(nn(input.eigenkapital)), gesamtinvestitionC);
  const darlehenC = gesamtinvestitionC - eigenkapitalC;

  const jahresannuitaetC = anteil(darlehenC, sollzins + tilgung);
  const monatsrateC = Math.round(jahresannuitaetC / MONATE_PRO_JAHR);
  const zinsProMonat = sollzins / 100 / MONATE_PRO_JAHR;

  /* -- Betriebskosten und Abschreibung ------------------------------------ */

  const basisMieteJahrC =
    cents(nn(istAnlage ? input.kaltmieteMonat : input.ersparteMieteMonat)) *
    MONATE_PRO_JAHR;

  const basisBewirtschaftungJahrC =
    cents(nn(input.hausgeldMonat)) * MONATE_PRO_JAHR +
    cents(nn(input.verwaltungMonat)) * MONATE_PRO_JAHR +
    cents(nn(input.instandhaltungProQmJahr) * wohnflaeche);

  // Grund und Boden nutzt sich nicht ab. Die Nebenkosten gehören anteilig zu
  // den Anschaffungskosten des Gebäudes, die Modernisierung in voller Höhe.
  const afaBasisC = istAnlage
    ? anteil(kaufpreisC + nebenkostenC, gebaeudeanteil) + modernisierungC
    : 0;

  const afa = afaArten[input.afaArt] ?? afaArten["linear-2"];

  /* -- Jahresverlauf ------------------------------------------------------ */

  const planJahre = Math.min(MAX_JAHRE, Math.max(zinsbindung, horizont, 1));

  const jahre: Jahreszeile[] = [];
  const restschuldVerlaufC: number[] = [];
  const zinsKumVerlaufC: number[] = [];

  let restC = darlehenC;
  let monate = 0;
  let volltilgungMonate: number | null = darlehenC === 0 ? 0 : null;
  let gesamtzinsenC = 0;
  let restbuchwertC = afaBasisC;
  let kumAfaC = 0;
  // Depot des Mieters im Vergleich Kaufen/Mieten: startet mit demselben
  // Eigenkapital, das der Käufer in die Immobilie steckt.
  let depotC = eigenkapitalC;
  let wertC = kaufpreisC + modernisierungC;
  let mieteJahrC = basisMieteJahrC;
  let bewirtschaftungJahrC = basisBewirtschaftungJahrC;

  for (let j = 1; j <= planJahre; j++) {
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
      if (restC === 0) volltilgungMonate = monate;
    }

    gesamtzinsenC += zinsJahrC;

    let afaJahrC = 0;
    if (istAnlage && restbuchwertC > 0) {
      afaJahrC = afa.degressiv
        ? anteil(restbuchwertC, afa.satz)
        : anteil(afaBasisC, afa.satz);
      if (afaJahrC > restbuchwertC) afaJahrC = restbuchwertC;
      restbuchwertC -= afaJahrC;
      kumAfaC += afaJahrC;
    }

    // Das Ausfallwagnis mindert die Mieteinnahme. Bei Eigennutzung gibt es
    // keinen Mietausfall – die ersparte Miete fällt in voller Höhe an.
    const mieteEffektivC = istAnlage
      ? mieteJahrC - anteil(mieteJahrC, mietausfall)
      : mieteJahrC;

    const steuerErgebnisC = istAnlage
      ? mieteEffektivC - bewirtschaftungJahrC - zinsJahrC - afaJahrC
      : 0;
    const steuerC = istAnlage ? anteil(steuerErgebnisC, grenzsteuersatz) : 0;

    const cashflowVorSteuerC = mieteEffektivC - bewirtschaftungJahrC - rateJahrC;
    const cashflowC = cashflowVorSteuerC - steuerC;

    if (!istAnlage) {
      // Der Mieter legt das Eigenkapital an und investiert die Differenz zur
      // Belastung des Käufers – das ist der faire Vergleich.
      depotC = Math.round(depotC * (1 + alternativrendite / 100)) - cashflowVorSteuerC;
    }

    // Der Wert am Jahresende, also nach der Wertentwicklung dieses Jahres.
    wertC = Math.round(wertC * (1 + wertsteigerung / 100));

    jahre.push({
      jahr: j,
      zins: toEuro(zinsJahrC),
      tilgung: toEuro(tilgungJahrC),
      rate: toEuro(rateJahrC),
      restschuld: toEuro(restC),
      immobilienwert: toEuro(wertC),
      miete: toEuro(mieteEffektivC),
      bewirtschaftung: toEuro(bewirtschaftungJahrC),
      afa: toEuro(afaJahrC),
      steuer: toEuro(steuerC),
      cashflow: toEuro(cashflowC),
      vermoegen: toEuro(wertC - restC),
    });
    restschuldVerlaufC.push(restC);
    zinsKumVerlaufC.push(gesamtzinsenC);

    // Miete und Bewirtschaftung wachsen erst ab dem zweiten Jahr.
    mieteJahrC = Math.round(mieteJahrC * (1 + mietsteigerung / 100));
    bewirtschaftungJahrC = Math.round(
      bewirtschaftungJahrC * (1 + mietsteigerung / 100),
    );
  }

  // Läuft das Darlehen über den Betrachtungszeitraum hinaus, wird still
  // weitergerechnet, um Volltilgungsdauer und Gesamtzinsen zu bestimmen.
  let tailRestC = restC;
  while (tailRestC > 0 && monate < MAX_JAHRE * MONATE_PRO_JAHR) {
    monate += 1;
    const zC = Math.round(tailRestC * zinsProMonat);
    let tC = monatsrateC - zC;
    if (tC <= 0) break; // tilgt nie – hier bringt Weiterrechnen nichts
    if (tC > tailRestC) tC = tailRestC;
    tailRestC -= tC;
    gesamtzinsenC += zC;
    if (tailRestC === 0) volltilgungMonate = monate;
  }

  /* -- Kennzahlen --------------------------------------------------------- */

  const erstes = jahre[0];
  const zinsbindungIndex = Math.min(zinsbindung, jahre.length) - 1;
  const horizontIndex = Math.min(horizont, jahre.length) - 1;

  const restschuldZinsbindungC = restschuldVerlaufC[zinsbindungIndex];
  const zinsenBisZinsbindungC = zinsKumVerlaufC[zinsbindungIndex];
  const restschuldEndeC = restschuldVerlaufC[horizontIndex];
  const wertEndeC = cents(jahre[horizontIndex].immobilienwert);

  const mieteJahr1C = cents(erstes.miete);
  const bewirtschaftung1C = cents(erstes.bewirtschaftung);
  const zins1C = cents(erstes.zins);
  const steuer1C = cents(erstes.steuer);
  const cashflowVorSteuer1C = cents(erstes.cashflow + erstes.steuer);

  const bruttomietrendite =
    kaufpreisC > 0 ? (basisMieteJahrC / kaufpreisC) * 100 : 0;
  const nettomietrendite =
    gesamtinvestitionC > 0
      ? ((mieteJahr1C - bewirtschaftung1C) / gesamtinvestitionC) * 100
      : 0;
  const kaufpreisfaktor =
    basisMieteJahrC > 0 ? kaufpreisC / basisMieteJahrC : 0;

  // Ertrag nach Zinsen und Steuern, bezogen auf das eingesetzte Eigenkapital.
  // Die Tilgung zählt bewusst nicht als Ertrag: sie ist eine Umschichtung von
  // eigenem Geld, kein Gewinn.
  const ekErtragC = mieteJahr1C - bewirtschaftung1C - zins1C - steuer1C;
  const eigenkapitalrendite =
    eigenkapitalC > 0 ? (ekErtragC / eigenkapitalC) * 100 : 0;

  /* -- Verkauf am Ende des Betrachtungszeitraums -------------------------- */

  const verkaufskostenC = anteil(wertEndeC, verkaufskostenPercent);

  // Innerhalb der Spekulationsfrist ist der Gewinn zu versteuern – und zwar
  // erhöht um die bereits geltend gemachte Abschreibung. Eigengenutzte
  // Immobilien sind davon ausgenommen (§ 23 Abs. 1 Nr. 1 Satz 3 EStG).
  const buchwertC = gesamtinvestitionC - kumAfaC;
  const veraeusserungsgewinnC = wertEndeC - verkaufskostenC - buchwertC;
  const spekulationssteuerC =
    istAnlage &&
    horizont < SPEKULATIONSFRIST_JAHRE &&
    veraeusserungsgewinnC > 0
      ? anteil(veraeusserungsgewinnC, grenzsteuersatz)
      : 0;

  const nettoVerkaufserloesC =
    wertEndeC - verkaufskostenC - restschuldEndeC - spekulationssteuerC;

  const bisHorizont = jahre.slice(0, horizont);
  const kumCashflowC = bisHorizont.reduce((sum, z) => sum + cents(z.cashflow), 0);
  const vermoegenszuwachsC =
    kumCashflowC + nettoVerkaufserloesC - eigenkapitalC;

  const flows = [
    -toEuro(eigenkapitalC),
    ...bisHorizont.map((z) => z.cashflow),
  ];
  flows[flows.length - 1] += toEuro(nettoVerkaufserloesC);
  const irr = internerZinsfuss(flows);

  /* -- Kaufen oder mieten ------------------------------------------------- */

  const vermoegenKaufenC = wertEndeC - verkaufskostenC - restschuldEndeC;
  const belastungMonatC = Math.round(
    (cents(erstes.rate) + bewirtschaftung1C) / MONATE_PRO_JAHR,
  );
  const ersparteMieteMonatC = Math.round(mieteJahr1C / MONATE_PRO_JAHR);

  /* -- Hinweise ----------------------------------------------------------- */

  const warnings: string[] = [];

  if (kaufpreisC > 0 && eigenkapitalC < nebenkostenC) {
    warnings.push(
      "Das Eigenkapital deckt nicht einmal die Kaufnebenkosten. Banken finanzieren diese Posten praktisch nie mit – ohne zusätzliches Guthaben kommt die Finanzierung so nicht zustande.",
    );
  }
  if (kaufpreisC > 0 && darlehenC > kaufpreisC) {
    warnings.push(
      "Das Darlehen übersteigt den Kaufpreis. Über 100 Prozent Beleihungsauslauf verlangen Banken deutliche Zinsaufschläge, wenn sie überhaupt finanzieren.",
    );
  }
  if (tilgung === 0 && darlehenC > 0) {
    warnings.push(
      "Ohne Tilgung deckt die Rate nur die Zinsen – die Restschuld sinkt nie. Zwei Prozent anfängliche Tilgung sind das übliche Minimum.",
    );
  }
  if (darlehenC > 0 && restschuldZinsbindungC > darlehenC * 0.7) {
    warnings.push(
      "Zum Ende der Zinsbindung stehen noch über 70 Prozent der Darlehenssumme offen. Diese Restschuld muss zu dann unbekannten Zinsen weiterfinanziert werden – das ist das eigentliche Risiko, nicht die heutige Rate.",
    );
  }
  if (istAnlage && cashflowVorSteuer1C < 0) {
    warnings.push(
      `Der Cashflow ist negativ: Du legst im ersten Jahr ${formatHinweisBetrag(-cashflowVorSteuer1C)} aus eigener Tasche dazu. Das kann aufgehen, muss aber dauerhaft tragbar sein.`,
    );
  }
  if (istAnlage && nn(input.instandhaltungProQmJahr) === 0) {
    warnings.push(
      "Ohne Instandhaltungsrücklage ist die Rendite zu optimistisch. Als Faustwert gelten 10 bis 15 Euro je Quadratmeter und Jahr, bei älteren Gebäuden mehr.",
    );
  }
  if (istAnlage && kaufpreisfaktor > 30) {
    warnings.push(
      `Der Kaufpreis entspricht dem ${Math.round(kaufpreisfaktor)}-Fachen der Jahresmiete. Ab etwa dem 30-Fachen trägt sich ein Objekt fast nur noch über die Wertsteigerung.`,
    );
  }
  if (istAnlage && horizont < SPEKULATIONSFRIST_JAHRE && wertEndeC > 0) {
    warnings.push(
      `Ein Verkauf nach ${horizont} Jahren liegt innerhalb der zehnjährigen Spekulationsfrist. Der Gewinn ist dann steuerpflichtig – zuzüglich der bereits genutzten Abschreibung.`,
    );
  }
  if (
    istAnlage &&
    afaBasisC > 0 &&
    modernisierungC > anteil(afaBasisC - modernisierungC, ANSCHAFFUNGSNAH_GRENZE_PROZENT)
  ) {
    warnings.push(
      "Die Modernisierung übersteigt 15 Prozent des Gebäudewerts. In den ersten drei Jahren nach dem Kauf gilt sie dann als anschaffungsnaher Herstellungsaufwand und ist nicht sofort abziehbar, sondern nur über die Abschreibung – hier ist sie entsprechend eingerechnet.",
    );
  }
  if (istAnlage && eigenkapitalC === 0) {
    warnings.push(
      "Ohne Eigenkapital lässt sich keine Eigenkapitalrendite ausweisen – sie wäre rechnerisch unendlich.",
    );
  }

  return {
    modus: input.modus,

    grunderwerbsteuer: toEuro(grestC),
    notarUndGrundbuch: toEuro(notarC),
    maklerprovision: toEuro(maklerC),
    nebenkosten: toEuro(nebenkostenC),
    nebenkostenQuote: kaufpreisC > 0 ? (nebenkostenC / kaufpreisC) * 100 : 0,
    modernisierung: toEuro(modernisierungC),
    gesamtinvestition: toEuro(gesamtinvestitionC),
    preisProQm: wohnflaeche > 0 ? toEuro(kaufpreisC) / wohnflaeche : 0,

    eigenkapitalEingesetzt: toEuro(eigenkapitalC),
    darlehen: toEuro(darlehenC),
    beleihungsauslauf: kaufpreisC > 0 ? (darlehenC / kaufpreisC) * 100 : 0,
    monatsrate: toEuro(monatsrateC),
    jahresannuitaet: toEuro(jahresannuitaetC),
    zinsErstesJahr: erstes.zins,
    tilgungErstesJahr: erstes.tilgung,
    restschuldZinsbindung: toEuro(restschuldZinsbindungC),
    zinsenBisZinsbindung: toEuro(zinsenBisZinsbindungC),
    volltilgungJahre:
      volltilgungMonate === null ? null : volltilgungMonate / MONATE_PRO_JAHR,
    gesamtzinsen: toEuro(gesamtzinsenC),

    bruttomietrendite,
    nettomietrendite,
    kaufpreisfaktor,
    eigenkapitalrendite,
    mieteProQm:
      wohnflaeche > 0
        ? toEuro(basisMieteJahrC / MONATE_PRO_JAHR) / wohnflaeche
        : 0,

    mieteJahr: erstes.miete,
    bewirtschaftungJahr: erstes.bewirtschaftung,
    cashflowVorSteuerMonat: toEuro(Math.round(cashflowVorSteuer1C / MONATE_PRO_JAHR)),
    cashflowVorSteuerJahr: toEuro(cashflowVorSteuer1C),
    afaJahr: erstes.afa,
    steuerlichesErgebnis: toEuro(
      istAnlage ? mieteJahr1C - bewirtschaftung1C - zins1C - cents(erstes.afa) : 0,
    ),
    steuerwirkungJahr: erstes.steuer,
    cashflowNachSteuerMonat: toEuro(
      Math.round(cents(erstes.cashflow) / MONATE_PRO_JAHR),
    ),
    cashflowNachSteuerJahr: erstes.cashflow,

    belastungMonat: toEuro(belastungMonatC),
    ersparteMieteMonat: toEuro(ersparteMieteMonatC),
    mehrbelastungMonat: toEuro(belastungMonatC - ersparteMieteMonatC),
    vermoegenKaufen: toEuro(vermoegenKaufenC),
    vermoegenMieten: toEuro(depotC),
    vorteilKaufen: toEuro(vermoegenKaufenC - depotC),

    horizontJahre: horizont,
    immobilienwertEnde: toEuro(wertEndeC),
    restschuldEnde: toEuro(restschuldEndeC),
    verkaufskosten: toEuro(verkaufskostenC),
    spekulationssteuer: toEuro(spekulationssteuerC),
    nettoVerkaufserloes: toEuro(nettoVerkaufserloesC),
    kumulierterCashflow: toEuro(kumCashflowC),
    vermoegenszuwachs: toEuro(vermoegenszuwachsC),
    gesamtrenditeProJahr: irr === null ? null : irr * 100,

    jahre,
    warnings,
  };
}

/** Nur für Warnungstexte: grober Eurobetrag ohne Formatierungsbibliothek. */
function formatHinweisBetrag(c: number): string {
  return `rund ${Math.round(toEuro(c))} Euro`;
}

/* ---------------------------------------------------------------------------
 * Voreinstellungen
 * ------------------------------------------------------------------------- */

/**
 * Startwerte für eine typische Eigentumswohnung als Kapitalanlage.
 *
 * Bewusst konservativ: 2 Prozent Wertsteigerung entsprechen ungefähr dem
 * Inflationsziel, 12 Euro je Quadratmeter Instandhaltung liegen im mittleren
 * Bereich der Faustwerte. Wer optimistischere Annahmen will, kann sie
 * eintragen – der Rechner soll nicht schönrechnen.
 */
export function defaultInput(region: RegionCode = "by"): ImmobilienInput {
  return {
    modus: "kapitalanlage",
    kaufpreis: 350000,
    wohnflaeche: 75,
    modernisierung: 0,
    region,
    grestPercent: grestFor(region),
    notarPercent: 2,
    maklerPercent: 3.57,
    eigenkapital: 80000,
    sollzinsPercent: 3.6,
    tilgungPercent: 2,
    zinsbindungJahre: 10,
    kaltmieteMonat: 1050,
    mietsteigerungPercent: 1.5,
    hausgeldMonat: 60,
    instandhaltungProQmJahr: 12,
    verwaltungMonat: 30,
    mietausfallPercent: 2,
    gebaeudeanteilPercent: 75,
    afaArt: "linear-2",
    grenzsteuersatzPercent: 42,
    ersparteMieteMonat: 1050,
    alternativrenditePercent: 5,
    horizontJahre: 15,
    wertsteigerungPercent: 2,
    verkaufskostenPercent: 3,
  };
}
