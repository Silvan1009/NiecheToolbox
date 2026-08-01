/**
 * Der Katalog: was jede Kennzahl bedeutet, wie sie formatiert wird und ab
 * welchem Wert sie auffällig ist.
 *
 * Bewusst getrennt von der Rechnung. `logic.ts` weiß, wie gerechnet wird, und
 * kennt keine Texte; hier stehen Label, Formel, Erklärung und Faustwerte – und
 * nur hier. Die UI liest diesen Katalog und die SEO-Varianten leiten sich aus
 * denselben Definitionen ab, damit eine Kennzahl an keiner Stelle anders
 * beschrieben wird als an einer anderen.
 *
 * Zu den Faustwerten: Sie sind grob und branchenblind. Ein KGV von 25 ist bei
 * einem Softwareunternehmen normal und bei einem Stahlwerk teuer, eine
 * Eigenkapitalquote von 20 Prozent bei einer Bank unauffällig und in der
 * Industrie dünn. Die Einordnung ersetzt deshalb keinen Branchenvergleich –
 * sie sagt nur, welche Zahl es wert ist, genauer angesehen zu werden.
 */

import { formatDecimal, formatEuro } from "@/lib/format";
import type { AktienResult } from "./logic";

export type KennzahlKey =
  // Je Aktie
  | "gewinnJeAktie"
  | "umsatzJeAktie"
  | "buchwertJeAktie"
  | "cashflowJeAktie"
  | "fcfJeAktie"
  // Bewertung
  | "kgv"
  | "kuv"
  | "kbv"
  | "kcv"
  | "kfcv"
  | "peg"
  | "evEbitda"
  | "evEbit"
  | "evUmsatz"
  | "gewinnrendite"
  // Rentabilität
  | "nettomarge"
  | "ebitMarge"
  | "ebitdaMarge"
  | "roe"
  | "roa"
  | "roce"
  // Bilanz
  | "eigenkapitalquote"
  | "verschuldungsgrad"
  | "nettoschuldenEbitda"
  | "zinsdeckung"
  | "liquiditaetsgrad3"
  // Cashflow und Dividende
  | "fcfRendite"
  | "gewinnqualitaet"
  | "dividendenrendite"
  | "ausschuettungsquote";

export type KennzahlGruppe =
  "jeAktie" | "bewertung" | "rentabilitaet" | "bilanz" | "cashflow";

/** Grobe Einordnung eines Werts – gut, unauffällig, auffällig. */
export type Tendenz = "gut" | "neutral" | "schwach";

/**
 * Zwei Arten von Skalen, weil dasselbe Urteil verschieden heißt: Ein günstiges
 * Vielfaches ist „günstig“, eine hohe Marge ist „stark“. „Gut“ über allem
 * würde bei Bewertungskennzahlen falsch klingen.
 */
export type Skala = "preis" | "qualitaet";

export type Einheit = "faktor" | "prozent" | "euro";

export interface KennzahlDef {
  label: string;
  /** Kurzname, wo Platz fehlt – Tabellenkopf, Chart-Achse. */
  kurz: string;
  /** Die Formel in Worten. */
  formel: string;
  /** Ein bis zwei Sätze: was die Zahl aussagt. */
  erklaerung: string;
  /** Faustwerte als Satz. Fehlt, wo es keine sinnvollen gibt. */
  faustwert?: string;
  gruppe: KennzahlGruppe;
  einheit: Einheit;
  skala: Skala;
  /** Wert aus dem Ergebnis ziehen; `null` heißt „hier nicht bildbar“. */
  select: (result: AktienResult) => number | null;
  /** Einordnung nach Faustwerten. Fehlt bei absoluten Größen wie „je Aktie“. */
  bewerten?: (wert: number) => Tendenz;
}

/* ---------------------------------------------------------------------------
 * Einordnung
 * ------------------------------------------------------------------------- */

/** Kleiner ist besser: Vielfache, Verschuldung, Ausschüttungsquote. */
const niedrigGut =
  (gut: number, grenze: number) =>
  (wert: number): Tendenz =>
    wert <= gut ? "gut" : wert <= grenze ? "neutral" : "schwach";

/** Größer ist besser: Margen, Renditen, Deckungsgrade. */
const hochGut =
  (gut: number, grenze: number) =>
  (wert: number): Tendenz =>
    wert >= gut ? "gut" : wert >= grenze ? "neutral" : "schwach";

const tendenzTexte: Record<Skala, Record<Tendenz, string>> = {
  preis: { gut: "günstig", neutral: "normal", schwach: "teuer" },
  qualitaet: { gut: "stark", neutral: "normal", schwach: "schwach" },
};

/** Das Wort zur Einordnung – abhängig davon, was die Kennzahl misst. */
export const tendenzText = (skala: Skala, tendenz: Tendenz) =>
  tendenzTexte[skala][tendenz];

/* ---------------------------------------------------------------------------
 * Gruppen
 * ------------------------------------------------------------------------- */

export const kennzahlGruppen: {
  key: KennzahlGruppe;
  titel: string;
  hint: string;
}[] = [
  {
    key: "jeAktie",
    titel: "Je Aktie",
    hint: "Die Unternehmenszahlen auf eine Aktie umgerechnet – die Basis aller Vielfachen.",
  },
  {
    key: "bewertung",
    titel: "Bewertung",
    hint: "Was der Kurs im Verhältnis zu Gewinn, Umsatz, Substanz und Cashflow verlangt.",
  },
  {
    key: "rentabilitaet",
    titel: "Rentabilität",
    hint: "Was vom Umsatz übrig bleibt und wie gut das eingesetzte Kapital arbeitet.",
  },
  {
    key: "bilanz",
    titel: "Bilanz und Verschuldung",
    hint: "Wie stabil das Unternehmen steht, wenn ein Jahr schlecht läuft.",
  },
  {
    key: "cashflow",
    titel: "Cashflow und Dividende",
    hint: "Ob der Gewinn als Geld ankommt – und was davon beim Aktionär landet.",
  },
];

/* ---------------------------------------------------------------------------
 * Katalog
 * ------------------------------------------------------------------------- */

export const kennzahlen: Record<KennzahlKey, KennzahlDef> = {
  /* -- Je Aktie ----------------------------------------------------------- */

  gewinnJeAktie: {
    label: "Gewinn je Aktie",
    kurz: "EPS",
    formel: "Jahresüberschuss / Anzahl Aktien",
    erklaerung:
      "Der Anteil am Jahresgewinn, der auf eine einzelne Aktie fällt. Er ist der Nenner des KGV und die Größe, auf die sich fast jede Prognose bezieht.",
    gruppe: "jeAktie",
    einheit: "euro",
    skala: "qualitaet",
    select: (r) => r.gewinnJeAktie,
  },
  umsatzJeAktie: {
    label: "Umsatz je Aktie",
    kurz: "Umsatz/Aktie",
    formel: "Umsatz / Anzahl Aktien",
    erklaerung:
      "Der Umsatz auf eine Aktie umgerechnet. Wichtig bei Unternehmen, die noch keinen Gewinn ausweisen – und der Nenner des Kurs-Umsatz-Verhältnisses.",
    gruppe: "jeAktie",
    einheit: "euro",
    skala: "qualitaet",
    select: (r) => r.umsatzJeAktie,
  },
  buchwertJeAktie: {
    label: "Buchwert je Aktie",
    kurz: "Buchwert/Aktie",
    formel: "Eigenkapital / Anzahl Aktien",
    erklaerung:
      "Das bilanzielle Eigenkapital je Aktie, also was rechnerisch übrig bliebe, wenn alle Vermögenswerte zu Buchwerten verkauft und alle Schulden bezahlt würden.",
    gruppe: "jeAktie",
    einheit: "euro",
    skala: "qualitaet",
    select: (r) => r.buchwertJeAktie,
  },
  cashflowJeAktie: {
    label: "Cashflow je Aktie",
    kurz: "CF/Aktie",
    formel: "Operativer Cashflow / Anzahl Aktien",
    erklaerung:
      "Das im Geschäft erwirtschaftete Geld je Aktie, vor Investitionen. Weniger anfällig für Bewertungsspielräume als der Gewinn, weil Abschreibungen und Rückstellungen nicht hineinspielen.",
    gruppe: "jeAktie",
    einheit: "euro",
    skala: "qualitaet",
    select: (r) => r.cashflowJeAktie,
  },
  fcfJeAktie: {
    label: "Freier Cashflow je Aktie",
    kurz: "FCF/Aktie",
    formel: "(Operativer Cashflow − Investitionen) / Anzahl Aktien",
    erklaerung:
      "Was nach den Investitionen frei verfügbar bleibt – für Dividende, Aktienrückkauf oder Schuldenabbau. Aus dieser Zahl wird die Dividende auf Dauer bezahlt, nicht aus dem Gewinn.",
    gruppe: "jeAktie",
    einheit: "euro",
    skala: "qualitaet",
    select: (r) => r.fcfJeAktie,
  },

  /* -- Bewertung ---------------------------------------------------------- */

  kgv: {
    label: "Kurs-Gewinn-Verhältnis",
    kurz: "KGV",
    formel: "Kurs / Gewinn je Aktie",
    erklaerung:
      "Wie viele Jahresgewinne im Kurs stecken. Ein KGV von 15 heißt: Bei unverändertem Gewinn braucht das Unternehmen fünfzehn Jahre, um den Kaufpreis der Aktie zu verdienen.",
    faustwert:
      "Bis 15 gilt als günstig, 15 bis 25 als normal, darüber wird Wachstum eingepreist. Bei einem Verlust entfällt die Kennzahl.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.kgv,
    bewerten: niedrigGut(15, 25),
  },
  kuv: {
    label: "Kurs-Umsatz-Verhältnis",
    kurz: "KUV",
    formel: "Kurs / Umsatz je Aktie",
    erklaerung:
      "Der Börsenwert im Verhältnis zum Umsatz. Die einzige Bewertungskennzahl, die auch in Verlustjahren funktioniert – dafür sagt sie nichts darüber, ob das Geschäft profitabel ist.",
    faustwert:
      "Unter 1 gilt als günstig, bis 3 als normal. Bei hohen Margen sind höhere Werte üblich, im Handel mit dünnen Margen deutlich niedrigere.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.kuv,
    bewerten: niedrigGut(1, 3),
  },
  kbv: {
    label: "Kurs-Buchwert-Verhältnis",
    kurz: "KBV",
    formel: "Kurs / Buchwert je Aktie",
    erklaerung:
      "Was der Markt für einen Euro bilanzielles Eigenkapital zahlt. Unter 1 wird das Unternehmen unter seinem Buchwert gehandelt – der Markt traut der Bilanz dann nicht oder erwartet weitere Verluste.",
    faustwert:
      "Bis 1,5 gilt als günstig, bis 3 als normal. Substanzarme Geschäftsmodelle liegen strukturell höher, weil Marken und Software nicht in der Bilanz stehen.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.kbv,
    bewerten: niedrigGut(1.5, 3),
  },
  kcv: {
    label: "Kurs-Cashflow-Verhältnis",
    kurz: "KCV",
    formel: "Kurs / Cashflow je Aktie",
    erklaerung:
      "Wie das KGV, nur auf den operativen Cashflow bezogen. Weil der Cashflow weniger Gestaltungsspielraum lässt als der Gewinn, ist das KCV die robustere der beiden Zahlen.",
    faustwert: "Bis 10 gilt als günstig, bis 20 als normal.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.kcv,
    bewerten: niedrigGut(10, 20),
  },
  kfcv: {
    label: "Kurs-Free-Cashflow-Verhältnis",
    kurz: "KFCV",
    formel: "Kurs / freier Cashflow je Aktie",
    erklaerung:
      "Der Kurs im Verhältnis zu dem Geld, das nach Investitionen frei bleibt. Der strengste der Cashflow-Maßstäbe, weil er den Kapitalbedarf des Geschäfts einbezieht.",
    faustwert:
      "Bis 15 gilt als günstig, bis 25 als normal. Kapitalintensive Geschäfte liegen höher, weil viel Cashflow im Anlagevermögen gebunden bleibt.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.kfcv,
    bewerten: niedrigGut(15, 25),
  },
  peg: {
    label: "PEG-Verhältnis",
    kurz: "PEG",
    formel: "KGV / erwartetes Gewinnwachstum in Prozent",
    erklaerung:
      "Setzt die Bewertung ins Verhältnis zum Wachstum. Ein KGV von 30 bei 30 Prozent Wachstum ergibt ein PEG von 1 und ist damit rechnerisch so teuer wie ein KGV von 10 bei 10 Prozent Wachstum.",
    faustwert:
      "Bis 1 gilt als preiswert, bis 2 als vertretbar. Die Kennzahl hängt vollständig an der Wachstumsschätzung – sie ist so gut wie diese Annahme.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.peg,
    bewerten: niedrigGut(1, 2),
  },
  evEbitda: {
    label: "EV / EBITDA",
    kurz: "EV/EBITDA",
    formel: "(Börsenwert + Nettoschulden) / EBITDA",
    erklaerung:
      "Der Preis für das gesamte Unternehmen, Schulden eingerechnet, im Verhältnis zum operativen Ergebnis vor Abschreibungen. Die Kennzahl, mit der Käufer ganze Firmen bewerten – und die im Gegensatz zum KGV nicht von der Finanzierungsstruktur abhängt.",
    faustwert:
      "Bis 8 gilt als günstig, bis 12 als normal. Zwei Unternehmen mit gleichem KGV können hier weit auseinanderliegen, wenn eines hoch verschuldet ist.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.evEbitda,
    bewerten: niedrigGut(8, 12),
  },
  evEbit: {
    label: "EV / EBIT",
    kurz: "EV/EBIT",
    formel: "(Börsenwert + Nettoschulden) / EBIT",
    erklaerung:
      "Wie EV/EBITDA, aber nach Abschreibungen. Für kapitalintensive Unternehmen die fairere Zahl, weil Verschleiß von Maschinen und Netzen ein echter Aufwand ist und nicht nur eine Buchung.",
    faustwert: "Bis 12 gilt als günstig, bis 18 als normal.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.evEbit,
    bewerten: niedrigGut(12, 18),
  },
  evUmsatz: {
    label: "EV / Umsatz",
    kurz: "EV/Umsatz",
    formel: "(Börsenwert + Nettoschulden) / Umsatz",
    erklaerung:
      "Das Umsatzvielfache auf Unternehmensebene. Üblich bei Übernahmen und bei jungen Unternehmen, die noch keinen Gewinn ausweisen.",
    faustwert:
      "Bis 1,5 gilt als günstig, bis 4 als normal – stark branchenabhängig.",
    gruppe: "bewertung",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.evUmsatz,
    bewerten: niedrigGut(1.5, 4),
  },
  gewinnrendite: {
    label: "Gewinnrendite",
    kurz: "Gewinnrendite",
    formel: "Gewinn je Aktie / Kurs",
    erklaerung:
      "Der Kehrwert des KGV, in Prozent. Sie macht die Aktie mit einer Anleihe vergleichbar: 6 Prozent Gewinnrendite entsprechen einem KGV von knapp 17.",
    faustwert:
      "Ab 6 Prozent attraktiv, unter 4 Prozent nur mit deutlichem Wachstum zu rechtfertigen – gemessen an dem, was Anleihen abwerfen.",
    gruppe: "bewertung",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.gewinnrendite,
    bewerten: hochGut(6, 4),
  },

  /* -- Rentabilität ------------------------------------------------------- */

  nettomarge: {
    label: "Nettomarge",
    kurz: "Nettomarge",
    formel: "Jahresüberschuss / Umsatz",
    erklaerung:
      "Was von einem Euro Umsatz nach allen Kosten, Zinsen und Steuern übrig bleibt. Die Zahl, die am direktesten zeigt, wie viel Preissetzungsmacht ein Unternehmen hat.",
    faustwert:
      "Ab 10 Prozent stark, unter 5 Prozent dünn. Im Lebensmittelhandel sind 2 Prozent normal, bei Software 20 Prozent und mehr.",
    gruppe: "rentabilitaet",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.nettomarge,
    bewerten: hochGut(10, 5),
  },
  ebitMarge: {
    label: "EBIT-Marge",
    kurz: "EBIT-Marge",
    formel: "EBIT / Umsatz",
    erklaerung:
      "Die operative Marge – ohne Zinsen und Steuern, also ohne Einfluss der Finanzierung und des Steuerrechts. Damit lassen sich Unternehmen aus verschiedenen Ländern vergleichen.",
    faustwert: "Ab 15 Prozent stark, unter 8 Prozent schwach.",
    gruppe: "rentabilitaet",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.ebitMarge,
    bewerten: hochGut(15, 8),
  },
  ebitdaMarge: {
    label: "EBITDA-Marge",
    kurz: "EBITDA-Marge",
    formel: "EBITDA / Umsatz",
    erklaerung:
      "Die Marge vor Abschreibungen. Nützlich für den Vergleich innerhalb einer Branche, aber leicht zu schön: Abschreibungen auszublenden heißt, den Verschleiß des Anlagevermögens auszublenden.",
    faustwert: "Ab 20 Prozent stark, unter 12 Prozent schwach.",
    gruppe: "rentabilitaet",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.ebitdaMarge,
    bewerten: hochGut(20, 12),
  },
  roe: {
    label: "Eigenkapitalrendite",
    kurz: "ROE",
    formel: "Jahresüberschuss / Eigenkapital",
    erklaerung:
      "Was das Eigenkapital der Aktionäre im Jahr verdient. Hohe Werte sind gut – können aber auch von hoher Verschuldung kommen, weil ein kleines Eigenkapital den Bruch nach oben treibt.",
    faustwert:
      "Ab 15 Prozent stark, unter 10 Prozent schwach. Immer zusammen mit der Eigenkapitalquote lesen.",
    gruppe: "rentabilitaet",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.roe,
    bewerten: hochGut(15, 10),
  },
  roa: {
    label: "Gesamtkapitalrendite",
    kurz: "ROA",
    formel: "Jahresüberschuss / Bilanzsumme",
    erklaerung:
      "Die Rendite auf alles, was in der Bilanz steht – unabhängig davon, ob es mit Eigen- oder Fremdkapital finanziert ist. Sie lässt sich nicht durch Schulden aufpolieren.",
    faustwert: "Ab 8 Prozent stark, unter 4 Prozent schwach.",
    gruppe: "rentabilitaet",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.roa,
    bewerten: hochGut(8, 4),
  },
  roce: {
    label: "Kapitalrendite (ROCE)",
    kurz: "ROCE",
    formel: "EBIT / (Bilanzsumme − kurzfristige Verbindlichkeiten)",
    erklaerung:
      "Wie gut das tatsächlich investierte Kapital arbeitet. Lieferantenkredite und andere unverzinste kurzfristige Posten werden abgezogen, weil sie kein eingesetztes Kapital sind.",
    faustwert:
      "Ab 15 Prozent stark, unter 8 Prozent schwach. Liegt die Kapitalrendite dauerhaft unter den Finanzierungskosten, vernichtet Wachstum Wert.",
    gruppe: "rentabilitaet",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.roce,
    bewerten: hochGut(15, 8),
  },

  /* -- Bilanz ------------------------------------------------------------- */

  eigenkapitalquote: {
    label: "Eigenkapitalquote",
    kurz: "EK-Quote",
    formel: "Eigenkapital / Bilanzsumme",
    erklaerung:
      "Wie viel des Vermögens den Aktionären gehört und nicht den Gläubigern. Sie bestimmt, wie viele schlechte Jahre ein Unternehmen aushält, bevor es die Bank um Zustimmung bitten muss.",
    faustwert:
      "Ab 40 Prozent solide, unter 25 Prozent dünn. Banken und Immobiliengesellschaften arbeiten strukturell mit viel weniger.",
    gruppe: "bilanz",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.eigenkapitalquote,
    bewerten: hochGut(40, 25),
  },
  verschuldungsgrad: {
    label: "Verschuldungsgrad",
    kurz: "Gearing",
    formel: "Nettofinanzschulden / Eigenkapital",
    erklaerung:
      "Die Nettoschulden im Verhältnis zum Eigenkapital. Ein negativer Wert heißt: Es liegt mehr Geld in der Kasse als Schulden in der Bilanz.",
    faustwert: "Bis 50 Prozent unauffällig, über 100 Prozent hoch.",
    gruppe: "bilanz",
    einheit: "prozent",
    skala: "preis",
    select: (r) => r.verschuldungsgrad,
    bewerten: niedrigGut(50, 100),
  },
  nettoschuldenEbitda: {
    label: "Nettoschulden / EBITDA",
    kurz: "Schulden/EBITDA",
    formel: "(Finanzschulden − Liquidität) / EBITDA",
    erklaerung:
      "Wie viele Jahresergebnisse nötig wären, um die Nettoschulden zu tilgen. Die Kennzahl, an die Banken ihre Kreditbedingungen knüpfen – sie steht in fast jedem Kreditvertrag.",
    faustwert:
      "Bis zum 2-Fachen komfortabel, ab dem 3,5-Fachen angespannt. Negative Werte bedeuten Netto-Liquidität.",
    gruppe: "bilanz",
    einheit: "faktor",
    skala: "preis",
    select: (r) => r.nettoschuldenEbitda,
    bewerten: niedrigGut(2, 3.5),
  },
  zinsdeckung: {
    label: "Zinsdeckung",
    kurz: "Zinsdeckung",
    formel: "EBIT / Zinsaufwand",
    erklaerung:
      "Wie oft das operative Ergebnis die Zinsen verdient. Sie zeigt, wie viel Gewinnrückgang das Unternehmen verkraftet, ohne die Zinsen aus der Substanz zahlen zu müssen.",
    faustwert:
      "Ab dem 8-Fachen komfortabel, unter dem 3-Fachen kritisch. Bei sehr niedrigen Altzinsen schmeichelt die Zahl – entscheidend ist, was eine Refinanzierung heute kostet.",
    gruppe: "bilanz",
    einheit: "faktor",
    skala: "qualitaet",
    select: (r) => r.zinsdeckung,
    bewerten: hochGut(8, 3),
  },
  liquiditaetsgrad3: {
    label: "Liquidität 3. Grades",
    kurz: "Liquidität III",
    formel: "Umlaufvermögen / kurzfristige Verbindlichkeiten",
    erklaerung:
      "Ob das kurzfristig verfügbare Vermögen die kurzfristigen Schulden deckt. Unter 100 Prozent finanziert das Unternehmen langfristiges Vermögen mit kurzfristigem Geld.",
    faustwert: "Ab 150 Prozent komfortabel, unter 100 Prozent angespannt.",
    gruppe: "bilanz",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.liquiditaetsgrad3,
    bewerten: hochGut(150, 100),
  },

  /* -- Cashflow und Dividende --------------------------------------------- */

  fcfRendite: {
    label: "Free-Cashflow-Rendite",
    kurz: "FCF-Rendite",
    formel: "Freier Cashflow je Aktie / Kurs",
    erklaerung:
      "Das frei verfügbare Geld im Verhältnis zum Kurs – die Rendite, die ein Käufer des ganzen Unternehmens tatsächlich in die Hand bekäme. Für viele Investoren die härteste Bewertungskennzahl.",
    faustwert:
      "Ab 5 Prozent attraktiv, unter 3 Prozent teuer. Ein negativer Wert bedeutet, dass die Investitionen den operativen Cashflow übersteigen.",
    gruppe: "cashflow",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.fcfRendite,
    bewerten: hochGut(5, 3),
  },
  gewinnqualitaet: {
    label: "Gewinnqualität",
    kurz: "Cash Conversion",
    formel: "Operativer Cashflow / Jahresüberschuss",
    erklaerung:
      "Ob der ausgewiesene Gewinn auch als Geld eingeht. Werte über 100 Prozent sind der Normalfall, weil Abschreibungen den Gewinn mindern, aber kein Geld kosten.",
    faustwert:
      "Ab 100 Prozent unauffällig, unter 80 Prozent genauer hinsehen: Der Gewinn steckt dann in Forderungen oder Vorräten statt auf dem Konto.",
    gruppe: "cashflow",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.gewinnqualitaet,
    bewerten: hochGut(100, 80),
  },
  dividendenrendite: {
    label: "Dividendenrendite",
    kurz: "Div.-Rendite",
    formel: "Dividende je Aktie / Kurs",
    erklaerung:
      "Was die Dividende auf den heutigen Kurs abwirft. Sie steigt auch dann, wenn der Kurs fällt – eine auffällig hohe Rendite ist deshalb oft ein Hinweis auf Zweifel des Marktes, nicht auf ein Schnäppchen.",
    faustwert:
      "Ab 3 Prozent ordentlich, unter 1 Prozent nebensächlich. Über 7 Prozent ist meist eine Kürzung eingepreist – dann die Ausschüttungsquote prüfen.",
    gruppe: "cashflow",
    einheit: "prozent",
    skala: "qualitaet",
    select: (r) => r.dividendenrendite,
    bewerten: hochGut(3, 1),
  },
  ausschuettungsquote: {
    label: "Ausschüttungsquote",
    kurz: "Payout",
    formel: "Dividende je Aktie / Gewinn je Aktie",
    erklaerung:
      "Welcher Teil des Gewinns an die Aktionäre geht. Der Rest bleibt im Unternehmen und finanziert Wachstum oder Schuldenabbau.",
    faustwert:
      "30 bis 60 Prozent gelten als gesund, über 80 Prozent als eng. Über 100 Prozent wird mehr ausgeschüttet als verdient.",
    gruppe: "cashflow",
    einheit: "prozent",
    skala: "preis",
    select: (r) => r.ausschuettungsquote,
    // Sehr niedrige Quoten sind nicht „gut“, sondern schlicht unauffällig:
    // ein Unternehmen, das nichts ausschüttet, investiert entweder klug oder
    // kann nicht ausschütten. Das entscheidet die Ausschüttungsquote nicht.
    bewerten: (wert) =>
      wert > 80 ? "schwach" : wert >= 25 ? "gut" : "neutral",
  },
};

/** Reihenfolge im Katalog – einmal festgelegt, überall gleich. */
export const kennzahlKeys = Object.keys(kennzahlen) as KennzahlKey[];

/** Alle Kennzahlen einer Gruppe, in Katalogreihenfolge. */
export const kennzahlenDerGruppe = (gruppe: KennzahlGruppe) =>
  kennzahlKeys.filter((key) => kennzahlen[key].gruppe === gruppe);

export const isKennzahlKey = (value: unknown): value is KennzahlKey =>
  typeof value === "string" && value in kennzahlen;

/* ---------------------------------------------------------------------------
 * Darstellung
 * ------------------------------------------------------------------------- */

/**
 * Ein Kennzahlenwert als Text – oder ein Gedankenstrich, wenn er sich nicht
 * bilden lässt. Der Gedankenstrich ist Absicht: eine 0 an dieser Stelle wäre
 * eine Aussage, die niemand getroffen hat.
 */
export function formatKennzahl(einheit: Einheit, wert: number | null): string {
  if (wert === null) return "–";
  if (einheit === "euro") return formatEuro(wert);
  if (einheit === "prozent") return `${formatDecimal(wert)} %`;
  return formatDecimal(wert);
}
