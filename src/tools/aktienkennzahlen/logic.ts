/**
 * Aktien-Kennzahlen – reine Berechnung, keine React-/DOM-Abhängigkeiten.
 *
 * Eingegeben werden die Zahlen, die in jedem Geschäftsbericht stehen: Kurs,
 * Aktienanzahl, Umsatz, Ergebnis, Bilanz, Cashflow, Dividende. Daraus fällt
 * alles heraus, was üblicherweise einzeln nachgerechnet wird – Bewertung,
 * Rentabilität, Verschuldung, Cashflow – und zusätzlich drei Dinge, die die
 * meisten Rechner auslassen:
 *
 *   Der Unternehmenswert (Enterprise Value) statt nur der Börsenwert. Zwei
 *   Firmen mit gleichem KGV sind nicht gleich teuer, wenn eine davon mit
 *   Schulden gekauft wird und die andere Netto-Liquidität mitbringt.
 *
 *   Die Gewinnqualität: operativer Cashflow im Verhältnis zum ausgewiesenen
 *   Gewinn. Ein Gewinn, der nicht als Geld ankommt, ist eine Buchungsfrage.
 *
 *   Der faire Wert über drei unabhängige Verfahren – KGV-Modell, Graham-Zahl
 *   und Dividendendiskontierung – samt Spannweite. Ein einzelner fairer Wert
 *   suggeriert eine Genauigkeit, die keines dieser Verfahren hat.
 *
 * Firmenzahlen werden durchgehend in Millionen Euro erwartet, Angaben je
 * Aktie in Euro. Beides passt zusammen, weil auch die Aktienanzahl in
 * Millionen angegeben wird: 430 Mio. € Gewinn / 120 Mio. Aktien = 3,58 € je
 * Aktie. Gerundet wird nirgends – das ist Sache der Formatierung.
 *
 * Kennzahlen, die sich nicht sinnvoll bilden lassen, sind `null` und nicht 0.
 * Ein KGV von 0 wäre eine Aussage („extrem günstig“), das Fehlen eines KGV
 * bei einem Verlustjahr ist keine. Diese Unterscheidung zieht sich durch die
 * ganze Datei.
 *
 * Keine Anlageberatung: Sondereffekte, Minderheitenanteile, Leasing- und
 * Pensionsverpflichtungen, Aktienrückkäufe, Währungseffekte und Steuern auf
 * Kursgewinne bleiben außen vor.
 */

import { clamp, nn } from "@/lib/finanzmath";

/** Multiplikator der Graham-Zahl: KGV 15 × KBV 1,5. */
export const GRAHAM_FAKTOR = 22.5;

/**
 * Mindestabstand zwischen Renditeanspruch und Wachstum für das
 * Dividendenmodell, in Prozentpunkten.
 *
 * Im Gordon-Wachstumsmodell steht die Differenz im Nenner. Liegt sie bei
 * einem halben Prozentpunkt, verdoppelt schon eine Änderung um 0,25 Punkte
 * den fairen Wert – das Ergebnis wäre eine Zufallszahl mit zwei Dezimalen.
 * Unterhalb dieses Abstands wird das Verfahren deshalb nicht ausgewiesen.
 */
export const DDM_MIN_ABSTAND = 2;

/** Länger als ein Anlegerleben wird nicht projiziert. */
const MAX_HORIZONT = 30;

/* ---------------------------------------------------------------------------
 * Hilfsfunktionen
 * ------------------------------------------------------------------------- */

/** Endliche Zahl, Vorzeichen erlaubt – Verluste sind kein Eingabefehler. */
const zahl = (n: number) => (Number.isFinite(n) ? n : 0);

/**
 * Quotient, der nur bei echt positivem Nenner ein Ergebnis liefert.
 *
 * Genau das ist bei Kennzahlen die Regel: Ein KGV braucht einen Gewinn, eine
 * Umsatzrendite einen Umsatz, ein KBV einen positiven Buchwert. Der Zähler
 * darf dagegen negativ sein – eine negative Marge ist eine Aussage.
 */
const quote = (zaehler: number, nenner: number): number | null =>
  nenner > 0 && Number.isFinite(zaehler / nenner) ? zaehler / nenner : null;

/** Wie `quote`, aber in Prozent. */
const prozent = (zaehler: number, nenner: number): number | null => {
  const wert = quote(zaehler, nenner);
  return wert === null ? null : wert * 100;
};

/** Ein Vielfaches des Kurses – nur sinnvoll, wenn beide Seiten positiv sind. */
const vielfaches = (kurs: number, jeAktie: number | null): number | null =>
  kurs > 0 && jeAktie !== null && jeAktie > 0 ? kurs / jeAktie : null;

/* ---------------------------------------------------------------------------
 * Ein- und Ausgabe
 * ------------------------------------------------------------------------- */

export interface AktienInput {
  /** Aktueller Kurs in Euro. */
  kurs: number;
  /** Anzahl der Aktien in Millionen Stück. */
  aktienMio: number;

  /** Umsatz des Geschäftsjahres in Mio. Euro. */
  umsatzMio: number;
  /** Ergebnis vor Zinsen, Steuern und Abschreibungen in Mio. Euro. */
  ebitdaMio: number;
  /** Operatives Ergebnis (EBIT) in Mio. Euro. */
  ebitMio: number;
  /** Jahresüberschuss nach Steuern in Mio. Euro. */
  gewinnMio: number;

  /** Eigenkapital in Mio. Euro – darf negativ sein. */
  eigenkapitalMio: number;
  /** Bilanzsumme in Mio. Euro. */
  bilanzsummeMio: number;
  /** Zinstragende Finanzschulden in Mio. Euro. */
  finanzschuldenMio: number;
  /** Liquide Mittel und kurzfristige Wertpapiere in Mio. Euro. */
  liquiditaetMio: number;
  /** Umlaufvermögen in Mio. Euro – für die Liquidität dritten Grades. */
  umlaufvermoegenMio: number;
  /** Kurzfristige Verbindlichkeiten in Mio. Euro. */
  kurzfristigeVerbindlichkeitenMio: number;
  /** Zinsaufwand des Jahres in Mio. Euro – für die Zinsdeckung. */
  zinsaufwandMio: number;

  /** Operativer Cashflow in Mio. Euro. */
  operativerCashflowMio: number;
  /** Investitionen ins Anlagevermögen (CapEx) in Mio. Euro, positiv angegeben. */
  investitionenMio: number;

  /** Dividende je Aktie in Euro. */
  dividendeJeAktie: number;

  /** Erwartetes Gewinnwachstum pro Jahr in Prozent – darf negativ sein. */
  gewinnwachstumPercent: number;
  /** KGV, das dem Unternehmen zugetraut wird – Anker für Bewertung und Ziel. */
  faireKgv: number;
  /** Eigene Renditeerwartung pro Jahr in Prozent (Diskontsatz). */
  renditeanspruchPercent: number;
  /** Anlagehorizont in Jahren. */
  horizontJahre: number;
}

/** Eine Zeile der Projektion. Alle Beträge je Aktie in Euro. */
export interface Projektionszeile {
  jahr: number;
  gewinnJeAktie: number;
  dividende: number;
  dividendeKumuliert: number;
  /** Kurs, wenn am Ende des Jahres das faire KGV gilt. */
  kurs: number;
  /** Kurs plus alle bis dahin vereinnahmten Dividenden. */
  gesamtwert: number;
}

export interface AktienResult {
  /* Größenordnung – alles in Mio. Euro. */
  marktkapitalisierungMio: number;
  /** Finanzschulden minus Liquidität; negativ heißt Netto-Liquidität. */
  nettofinanzschuldenMio: number;
  /** Börsenwert plus Nettoschulden – der Preis für das ganze Unternehmen. */
  enterpriseValueMio: number;
  /** Operativer Cashflow minus Investitionen. */
  freeCashflowMio: number;

  /* Je Aktie, in Euro. */
  gewinnJeAktie: number | null;
  umsatzJeAktie: number | null;
  buchwertJeAktie: number | null;
  cashflowJeAktie: number | null;
  fcfJeAktie: number | null;

  /* Bewertung. */
  kgv: number | null;
  kuv: number | null;
  kbv: number | null;
  kcv: number | null;
  kfcv: number | null;
  peg: number | null;
  evEbitda: number | null;
  evEbit: number | null;
  evUmsatz: number | null;
  /** Gewinn je Aktie zum Kurs, in Prozent – der Kehrwert des KGV. */
  gewinnrendite: number | null;
  fcfRendite: number | null;
  dividendenrendite: number | null;
  ausschuettungsquote: number | null;

  /* Rentabilität, in Prozent. */
  ebitdaMarge: number | null;
  ebitMarge: number | null;
  nettomarge: number | null;
  roe: number | null;
  roa: number | null;
  roce: number | null;
  /** Operativer Cashflow zum Gewinn – über 100 % heißt: der Gewinn ist gedeckt. */
  gewinnqualitaet: number | null;

  /* Bilanz. */
  eigenkapitalquote: number | null;
  /** Nettoschulden zum Eigenkapital, in Prozent (Gearing). */
  verschuldungsgrad: number | null;
  /** Nettoschulden in Jahres-EBITDA. */
  nettoschuldenEbitda: number | null;
  /** EBIT zum Zinsaufwand – wie oft die Zinsen verdient werden. */
  zinsdeckung: number | null;
  /** Umlaufvermögen zu kurzfristigen Verbindlichkeiten, in Prozent. */
  liquiditaetsgrad3: number | null;

  /* Fairer Wert je Aktie, in Euro. */
  fairerWertKgv: number | null;
  fairerWertGraham: number | null;
  fairerWertDividende: number | null;
  /** Mittel der Verfahren, die sich rechnen ließen. */
  fairerWertSchnitt: number | null;
  fairerWertMin: number | null;
  fairerWertMax: number | null;
  /** Abstand des Mittels zum Kurs in Prozent; positiv = Kurs darunter. */
  abweichungProzent: number | null;

  /* Erwartung über den Anlagehorizont. */
  horizontJahre: number;
  gewinnJeAktieEnde: number | null;
  kursErwartetEnde: number | null;
  dividendenSumme: number;
  gesamtwertEnde: number | null;
  /** Rendite pro Jahr aus Kursziel und Dividenden, in Prozent. */
  erwarteteRenditeProJahr: number | null;

  jahre: Projektionszeile[];
  warnings: string[];
}

/* ---------------------------------------------------------------------------
 * Hauptrechnung
 * ------------------------------------------------------------------------- */

export function calculateAktie(input: AktienInput): AktienResult {
  // Preise, Mengen und Bestände können nicht negativ sein. Ergebnisgrößen und
  // Eigenkapital dagegen schon – ein Verlustjahr und eine überschuldete
  // Bilanz sind Szenarien, keine Eingabefehler.
  const kurs = nn(input.kurs);
  const aktien = nn(input.aktienMio);

  const umsatz = nn(input.umsatzMio);
  const ebitda = zahl(input.ebitdaMio);
  const ebit = zahl(input.ebitMio);
  const gewinn = zahl(input.gewinnMio);

  const eigenkapital = zahl(input.eigenkapitalMio);
  const bilanzsumme = nn(input.bilanzsummeMio);
  const finanzschulden = nn(input.finanzschuldenMio);
  const liquiditaet = nn(input.liquiditaetMio);
  const umlaufvermoegen = nn(input.umlaufvermoegenMio);
  const kurzfristig = nn(input.kurzfristigeVerbindlichkeitenMio);
  const zinsaufwand = nn(input.zinsaufwandMio);

  const operativerCashflow = zahl(input.operativerCashflowMio);
  const investitionen = nn(input.investitionenMio);
  const dividende = nn(input.dividendeJeAktie);

  const wachstum = clamp(input.gewinnwachstumPercent, -50, 50);
  const faireKgv = clamp(input.faireKgv, 0, 100);
  const renditeanspruch = clamp(input.renditeanspruchPercent, 0, 30);
  const horizont = Math.round(clamp(input.horizontJahre, 1, MAX_HORIZONT));

  /* -- Größenordnung ------------------------------------------------------- */

  const marktkapitalisierung = kurs * aktien;
  const nettofinanzschulden = finanzschulden - liquiditaet;
  const enterpriseValue = marktkapitalisierung + nettofinanzschulden;
  const freeCashflow = operativerCashflow - investitionen;

  /* -- Je Aktie ------------------------------------------------------------ */

  // Beides in Millionen, also kürzt sich die Einheit weg: Mio. € / Mio. Stück.
  const eps = quote(gewinn, aktien);
  const umsatzJeAktie = quote(umsatz, aktien);
  const buchwertJeAktie = quote(eigenkapital, aktien);
  const cashflowJeAktie = quote(operativerCashflow, aktien);
  const fcfJeAktie = quote(freeCashflow, aktien);

  /* -- Bewertung ----------------------------------------------------------- */

  const kgv = vielfaches(kurs, eps);
  const kuv = vielfaches(kurs, umsatzJeAktie);
  const kbv = vielfaches(kurs, buchwertJeAktie);
  const kcv = vielfaches(kurs, cashflowJeAktie);
  const kfcv = vielfaches(kurs, fcfJeAktie);

  // Ein PEG braucht Wachstum. Bei Stagnation oder Rückgang gibt es keinen
  // Nenner, der die Zahl noch interpretierbar machen würde.
  const peg = kgv !== null && wachstum > 0 ? kgv / wachstum : null;

  // Beim Enterprise Value muss auch der Zähler positiv sein: Ein Unternehmen
  // mit mehr Liquidität als Börsenwert und Schulden ergibt ein negatives
  // EV/EBITDA, und das ist keine Kennzahl, sondern eine Kuriosität.
  const evPositiv = enterpriseValue > 0 ? enterpriseValue : null;
  const evEbitda = evPositiv === null ? null : quote(evPositiv, ebitda);
  const evEbit = evPositiv === null ? null : quote(evPositiv, ebit);
  const evUmsatz = evPositiv === null ? null : quote(evPositiv, umsatz);

  // Die Gewinnrendite darf negativ sein – sie ist der ehrlichere Blick auf
  // ein Verlustjahr, weil sie im Gegensatz zum KGV nicht einfach entfällt.
  const gewinnrendite = eps === null ? null : prozent(eps, kurs);
  const fcfRendite = fcfJeAktie === null ? null : prozent(fcfJeAktie, kurs);
  const dividendenrendite = prozent(dividende, kurs);
  const ausschuettungsquote =
    eps !== null && eps > 0 ? prozent(dividende, eps) : null;

  /* -- Rentabilität -------------------------------------------------------- */

  const ebitdaMarge = prozent(ebitda, umsatz);
  const ebitMarge = prozent(ebit, umsatz);
  const nettomarge = prozent(gewinn, umsatz);

  const roe = eigenkapital > 0 ? prozent(gewinn, eigenkapital) : null;
  const roa = prozent(gewinn, bilanzsumme);

  // Eingesetztes Kapital = Bilanzsumme ohne die kurzfristigen, unverzinsten
  // Verbindlichkeiten. Lieferantenkredite sind kein investiertes Kapital.
  const capitalEmployed = bilanzsumme - kurzfristig;
  const roce = capitalEmployed > 0 ? prozent(ebit, capitalEmployed) : null;

  const gewinnqualitaet =
    gewinn > 0 ? prozent(operativerCashflow, gewinn) : null;

  /* -- Bilanz -------------------------------------------------------------- */

  const eigenkapitalquote =
    eigenkapital > 0 ? prozent(eigenkapital, bilanzsumme) : null;
  const verschuldungsgrad =
    eigenkapital > 0 ? prozent(nettofinanzschulden, eigenkapital) : null;
  const nettoschuldenEbitda = quote(nettofinanzschulden, ebitda);
  const zinsdeckung = quote(ebit, zinsaufwand);
  const liquiditaetsgrad3 = prozent(umlaufvermoegen, kurzfristig);

  /* -- Fairer Wert --------------------------------------------------------- */

  const fairerWertKgv =
    eps !== null && eps > 0 && faireKgv > 0 ? faireKgv * eps : null;

  // Graham-Zahl: die Wurzel aus dem 22,5-Fachen von Gewinn und Buchwert je
  // Aktie. Sie ist absichtlich streng und liegt bei substanzarmen Geschäften
  // deutlich unter dem Kurs – ein Softwarehaus ohne Anlagevermögen wird sie
  // nie erreichen.
  const fairerWertGraham =
    eps !== null && eps > 0 && buchwertJeAktie !== null && buchwertJeAktie > 0
      ? Math.sqrt(GRAHAM_FAKTOR * eps * buchwertJeAktie)
      : null;

  // Gordon-Wachstumsmodell: der Barwert einer ewig mit g wachsenden Dividende.
  // Nur brauchbar, wenn der Renditeanspruch das Wachstum deutlich übersteigt.
  const abstand = renditeanspruch - wachstum;
  const fairerWertDividende =
    dividende > 0 && abstand >= DDM_MIN_ABSTAND
      ? (dividende * (1 + wachstum / 100)) / (abstand / 100)
      : null;

  const verfahren = [
    fairerWertKgv,
    fairerWertGraham,
    fairerWertDividende,
  ].filter((wert): wert is number => wert !== null);
  const fairerWertSchnitt =
    verfahren.length > 0
      ? verfahren.reduce((summe, wert) => summe + wert, 0) / verfahren.length
      : null;
  const fairerWertMin = verfahren.length > 0 ? Math.min(...verfahren) : null;
  const fairerWertMax = verfahren.length > 0 ? Math.max(...verfahren) : null;
  const abweichungProzent =
    fairerWertSchnitt !== null && kurs > 0
      ? ((fairerWertSchnitt - kurs) / kurs) * 100
      : null;

  /* -- Projektion ---------------------------------------------------------- */

  // Gewinn und Dividende wachsen mit derselben Rate – die Ausschüttungsquote
  // bleibt also konstant. Der Kurs am Jahresende ergibt sich aus dem fairen
  // KGV auf den dann erreichten Gewinn; die Dividenden werden addiert, aber
  // nicht wieder angelegt. Das ist die konservative Variante und leicht
  // nachzurechnen.
  const jahre: Projektionszeile[] = [];
  let dividendeKumuliert = 0;

  if (eps !== null) {
    for (let j = 1; j <= horizont; j++) {
      const faktor = (1 + wachstum / 100) ** j;
      const epsJahr = eps * faktor;
      const dividendeJahr = dividende * faktor;
      dividendeKumuliert += dividendeJahr;
      const kursJahr = Math.max(0, faireKgv * epsJahr);

      jahre.push({
        jahr: j,
        gewinnJeAktie: epsJahr,
        dividende: dividendeJahr,
        dividendeKumuliert,
        kurs: kursJahr,
        gesamtwert: kursJahr + dividendeKumuliert,
      });
    }
  }

  const letztes = jahre.at(-1) ?? null;
  const gesamtwertEnde = letztes?.gesamtwert ?? null;
  const erwarteteRenditeProJahr =
    kurs > 0 && gesamtwertEnde !== null && gesamtwertEnde > 0
      ? ((gesamtwertEnde / kurs) ** (1 / horizont) - 1) * 100
      : null;

  /* -- Hinweise ------------------------------------------------------------ */

  const warnings: string[] = [];

  if (kurs === 0 || aktien === 0) {
    warnings.push(
      "Ohne Kurs und Aktienanzahl lässt sich keine Bewertungskennzahl bilden. Die Anzahl der Aktien steht im Geschäftsbericht meist als „Anzahl der ausgegebenen Aktien“ oder im Anhang zum Ergebnis je Aktie.",
    );
  }
  if (aktien > 0 && gewinn <= 0) {
    warnings.push(
      "Das Unternehmen weist keinen Gewinn aus. KGV, PEG und Ausschüttungsquote entfallen damit – aussagekräftig bleiben Umsatz-, Buchwert- und Cashflow-Vielfache sowie die Verschuldung.",
    );
  }
  if (eigenkapital <= 0 && bilanzsumme > 0) {
    warnings.push(
      "Das Eigenkapital ist null oder negativ. KBV, Eigenkapitalrendite und Verschuldungsgrad lassen sich dann nicht bilden. Bei börsennotierten Unternehmen kommt das nach Aktienrückkäufen oder langen Verlustserien vor und ist immer ein Grund, genauer hinzusehen.",
    );
  }
  if (nettoschuldenEbitda !== null && nettoschuldenEbitda > 3.5) {
    warnings.push(
      `Die Nettoschulden entsprechen dem ${formatKurz(nettoschuldenEbitda)}-Fachen des EBITDA. Ab etwa dem 3,5-Fachen gilt eine Bilanz als angespannt: Banken verlangen Aufschläge, und in einem schwachen Jahr wird die Refinanzierung zum bestimmenden Thema.`,
    );
  }
  if (zinsdeckung !== null && zinsdeckung < 3 && ebit > 0) {
    warnings.push(
      `Das operative Ergebnis deckt die Zinsen nur ${formatKurz(zinsdeckung)}-fach. Unter dem Dreifachen bleibt kaum Luft: Ein Gewinnrückgang von einem Drittel würde die Zinslast schon nicht mehr verdient.`,
    );
  }
  if (ausschuettungsquote !== null && ausschuettungsquote > 100) {
    warnings.push(
      `Die Dividende übersteigt den Gewinn (Ausschüttungsquote ${formatKurz(ausschuettungsquote)} Prozent). Das lässt sich eine Zeit lang aus der Kasse oder über Schulden finanzieren, aber nicht dauerhaft – Kürzungen der Dividende folgen typischerweise auf mehrere solche Jahre.`,
    );
  } else if (ausschuettungsquote !== null && ausschuettungsquote > 80) {
    warnings.push(
      `Mit einer Ausschüttungsquote von ${formatKurz(ausschuettungsquote)} Prozent bleibt wenig Gewinn im Unternehmen. Für Wachstum aus eigener Kraft fehlt dieses Geld, und für eine Dividendenerhöhung ist kaum Spielraum.`,
    );
  }
  if (gewinnqualitaet !== null && gewinnqualitaet < 80) {
    warnings.push(
      `Der operative Cashflow erreicht nur ${formatKurz(gewinnqualitaet)} Prozent des Gewinns. Wenn ein Gewinn dauerhaft nicht als Geld ankommt, steckt er meist in Forderungen oder Vorräten – ein Muster, das Bilanzprobleme oft ankündigt.`,
    );
  }
  if (freeCashflow < 0 && operativerCashflow > 0) {
    warnings.push(
      "Die Investitionen übersteigen den operativen Cashflow, der freie Cashflow ist also negativ. Bei einem Ausbauprogramm ist das gewollt und vorübergehend, bei einem reifen Geschäft ein Warnsignal: Dividende und Schuldenabbau müssen dann aus der Kasse oder von der Bank kommen.",
    );
  }
  if (peg !== null && peg > 2) {
    warnings.push(
      `Das PEG-Verhältnis liegt bei ${formatKurz(peg)}. Als Faustregel gilt: bis 1 preiswert, bis 2 vertretbar. Darüber zahlt der Kurs Wachstum, das erst noch geliefert werden muss.`,
    );
  }
  // Nur bei positiver, aber schwacher Rendite. Ein Verlustjahr ist schon oben
  // erklärt – „nur minus 5 Prozent Rendite“ wäre kein Satz.
  if (kbv !== null && kbv > 3 && roe !== null && roe > 0 && roe < 10) {
    warnings.push(
      `Der Kurs liegt beim ${formatKurz(kbv)}-Fachen des Buchwerts, während das Eigenkapital nur ${formatKurz(roe)} Prozent Rendite bringt. Ein solcher Aufschlag lässt sich nur mit Werten rechtfertigen, die nicht in der Bilanz stehen – Marken, Patente, Netzwerkeffekte.`,
    );
  }
  if (wachstum > 15) {
    warnings.push(
      `Mit ${formatKurz(wachstum)} Prozent Gewinnwachstum pro Jahr rechnet die Projektion sehr optimistisch. Über zehn Jahre halten das nur wenige Unternehmen durch; jede Kennzahl, die darauf aufbaut – PEG, Kursziel, erwartete Rendite – steht und fällt mit dieser Annahme.`,
    );
  }
  if (dividende > 0 && abstand < DDM_MIN_ABSTAND) {
    warnings.push(
      `Der Renditeanspruch liegt weniger als ${DDM_MIN_ABSTAND} Prozentpunkte über dem Wachstum. Im Dividendenmodell steht diese Differenz im Nenner – der faire Wert würde ins Unendliche laufen und wird deshalb nicht ausgewiesen.`,
    );
  }
  if (eigenkapitalquote !== null && eigenkapitalquote < 25) {
    warnings.push(
      `Die Eigenkapitalquote beträgt ${formatKurz(eigenkapitalquote)} Prozent. Bei Banken und Immobiliengesellschaften ist das normal, im produzierenden Gewerbe oder im Handel gilt es als dünn.`,
    );
  }
  if (
    liquiditaetsgrad3 !== null &&
    liquiditaetsgrad3 < 100 &&
    kurzfristig > 0
  ) {
    warnings.push(
      `Das Umlaufvermögen deckt die kurzfristigen Verbindlichkeiten nur zu ${formatKurz(liquiditaetsgrad3)} Prozent. Das Unternehmen finanziert langfristiges Vermögen mit kurzfristigem Geld und ist auf die Verlängerung dieser Kredite angewiesen.`,
    );
  }

  return {
    marktkapitalisierungMio: marktkapitalisierung,
    nettofinanzschuldenMio: nettofinanzschulden,
    enterpriseValueMio: enterpriseValue,
    freeCashflowMio: freeCashflow,

    gewinnJeAktie: eps,
    umsatzJeAktie,
    buchwertJeAktie,
    cashflowJeAktie,
    fcfJeAktie,

    kgv,
    kuv,
    kbv,
    kcv,
    kfcv,
    peg,
    evEbitda,
    evEbit,
    evUmsatz,
    gewinnrendite,
    fcfRendite,
    dividendenrendite,
    ausschuettungsquote,

    ebitdaMarge,
    ebitMarge,
    nettomarge,
    roe,
    roa,
    roce,
    gewinnqualitaet,

    eigenkapitalquote,
    verschuldungsgrad,
    nettoschuldenEbitda,
    zinsdeckung,
    liquiditaetsgrad3,

    fairerWertKgv,
    fairerWertGraham,
    fairerWertDividende,
    fairerWertSchnitt,
    fairerWertMin,
    fairerWertMax,
    abweichungProzent,

    horizontJahre: horizont,
    gewinnJeAktieEnde: letztes?.gewinnJeAktie ?? null,
    kursErwartetEnde: letztes?.kurs ?? null,
    dividendenSumme: dividendeKumuliert,
    gesamtwertEnde,
    erwarteteRenditeProJahr,

    jahre,
    warnings,
  };
}

/** Nur für Hinweistexte: eine Dezimale mit Komma, ohne Formatierungsbibliothek. */
function formatKurz(n: number): string {
  return (Math.round(n * 10) / 10).toString().replace(".", ",");
}

/* ---------------------------------------------------------------------------
 * Voreinstellungen
 * ------------------------------------------------------------------------- */

/**
 * Startwerte eines gedachten mittelgroßen Industrieunternehmens.
 *
 * Bewusst kein echtes Unternehmen: Zahlen aus einem konkreten Bericht wären
 * am Tag der Veröffentlichung veraltet, und der Rechner soll zum Eintragen
 * eigener Zahlen einladen. Die Werte sind so gewählt, dass jede Kennzahl im
 * plausiblen Bereich landet – rund 19 KGV, 3 Prozent Nettoschulden-Quote,
 * eine gedeckte Dividende – und man an einer Stelle drehen kann, um zu sehen,
 * wie die anderen reagieren.
 */
export function defaultInput(): AktienInput {
  return {
    kurs: 68,
    aktienMio: 120,

    umsatzMio: 4800,
    ebitdaMio: 900,
    ebitMio: 640,
    gewinnMio: 430,

    eigenkapitalMio: 2600,
    bilanzsummeMio: 6100,
    finanzschuldenMio: 1500,
    liquiditaetMio: 480,
    umlaufvermoegenMio: 2300,
    kurzfristigeVerbindlichkeitenMio: 1400,
    zinsaufwandMio: 60,

    operativerCashflowMio: 720,
    investitionenMio: 300,

    dividendeJeAktie: 1.4,

    gewinnwachstumPercent: 7,
    faireKgv: 18,
    renditeanspruchPercent: 10,
    horizontJahre: 10,
  };
}
