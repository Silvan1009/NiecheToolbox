/**
 * Grunderwerbsteuersätze der Länder.
 *
 * Bewusst eine eigene Datei: Der Satz ist seit der Föderalismusreform 2006
 * Landesrecht (Art. 105 Abs. 2a GG), jedes Land ändert ihn unabhängig. Die
 * Tabelle hat damit eine eigene Aktualisierungs-Kadenz, die nichts mit der
 * Rechenlogik zu tun hat – die jährliche Prüfung soll ein Ein-Datei-Job sein.
 *
 * Die Bundesländer selbst kommen aus dem Brückentage-Tool. Eine zweite Liste
 * derselben sechzehn Länder wäre eine Fehlerquelle ohne Gegenwert.
 */

import { regions, type RegionCode } from "@/lib/regionen";
import type { FaqEntry } from "@/tools/types";

/**
 * Stand der Tabelle. Bei Abweichung im Rechner sichtbar machen, nicht still
 * korrigieren – wer eine Kalkulation teilt, muss wissen, worauf sie beruht.
 */
export const GREST_STAND = "2026-01-01";

/** Der bundesweit einheitliche Satz vor der Föderalismusreform. */
export const GREST_BUNDESSATZ = 3.5;

/**
 * Satz in Prozent des Kaufpreises (§ 11 GrEStG i. V. m. dem jeweiligen
 * Landesgesetz). Bayern ist als einziges Land beim alten Bundessatz geblieben.
 */
export const grunderwerbsteuer: Record<RegionCode, number> = {
  bw: 5.0,
  by: 3.5,
  be: 6.0,
  bb: 6.5,
  hb: 5.0,
  hh: 5.5,
  he: 6.0,
  mv: 6.0,
  ni: 5.0,
  nw: 6.5,
  rp: 5.0,
  sl: 6.5,
  sn: 5.5,
  st: 5.0,
  sh: 6.5,
  th: 5.0,
};

/**
 * Die jüngste Änderung je Land, als Halbsatz für die Landesseiten.
 *
 * Ohne diese Einordnung wären die sechzehn Bundesland-Seiten inhaltlich
 * identisch bis auf eine Zahl – und damit genau die dünnen Seiten, vor denen
 * die README warnt.
 *
 * Die Formulierungen sind bewusst Anschlüsse ohne eigenen Satzanfang und ohne
 * Wiederholung des Satzes selbst: Sie stehen im Text direkt hinter der bereits
 * genannten Prozentzahl.
 */
export const grestHistorie: Record<RegionCode, string> = {
  bw: "2011 von 3,5 Prozent auf diesen Wert angehoben",
  by: "als einziges Land unverändert beim alten Bundessatz und damit der günstigste Satz in Deutschland",
  be: "in drei Schritten von 3,5 Prozent angehoben, zuletzt 2014",
  bb: "seit 2015 unverändert und zusammen mit vier weiteren Ländern der bundesweite Höchstsatz",
  hb: "seit 2014 unverändert",
  hh: "2023 von 4,5 Prozent angehoben",
  he: "seit 2014 unverändert",
  mv: "2019 von 5,0 Prozent angehoben",
  ni: "seit 2014 unverändert",
  nw: "seit 2015 unverändert und zusammen mit vier weiteren Ländern der bundesweite Höchstsatz",
  rp: "seit 2012 unverändert",
  sl: "2015 angehoben und seither zusammen mit vier weiteren Ländern der bundesweite Höchstsatz",
  sn: "2023 von 3,5 Prozent angehoben – die bislang letzte Erhöhung eines Landes",
  st: "seit 2012 unverändert",
  sh: "seit 2014 unverändert und zusammen mit vier weiteren Ländern der bundesweite Höchstsatz",
  th: "2024 von 6,5 Prozent gesenkt – die bislang einzige Senkung eines Landes",
};

/**
 * Ein Absatz Marktkontext je Land – Stadtstaat oder Flächenland, Nachbarländer,
 * Preisgefälle innerhalb des Landes.
 *
 * `grestHistorie` allein reicht nicht: Mehrere Länder teilen sowohl Satz als
 * auch Historie wortgleich (z. B. Bremen/Niedersachsen bei 5,0 % / "seit 2014
 * unverändert"), sodass sich die betroffenen Landesseiten nur noch im
 * Ländernamen unterschieden – exakt die 94-Prozent-Überlappung, die
 * `content-audit.ts` zuerst gemeldet hat. Dieser Absatz gibt jedem Land einen
 * Fakt, der sich nicht aus Satz oder Historie ableiten lässt.
 */
export const grestKontext: Record<RegionCode, string> = {
  bw: "Baden-Württemberg hat mit Stuttgart und der Rhein-Neckar-Region zwei eigenständige Ballungsräume, daneben aber auch ländliche Kreise mit deutlich niedrigeren Preisen als im Landesschnitt. Wer außerhalb der beiden Ballungsräume kauft, sollte die Beispielrechnung eher nach unten korrigieren.",
  by: "Bayern hat mit 3,5 Prozent zwar den günstigsten Steuersatz, dafür aber mit München den teuersten Immobilienmarkt Deutschlands – die niedrige Grunderwerbsteuer gleicht das hohe Preisniveau der Landeshauptstadt kaum aus. Abseits von München und dem Umland liegen die Preise dagegen oft deutlich unter dem Bundesschnitt.",
  be: "Berlin ist als einziger der drei Stadtstaaten zugleich das bevölkerungsreichste Land im Osten Deutschlands – ein rein städtischer Markt ohne ländliches Umland, in dem die Nachfrage seit über einem Jahrzehnt spürbar stärker wächst als das Angebot.",
  bb: "Brandenburg umschließt Berlin vollständig – im direkten Speckgürtel wie Potsdam oder Teltow-Fläming ziehen die Preise seit Jahren mit der Hauptstadt mit, während sie in den grenznahen Kreisen zu Polen deutlich niedriger liegen. Ein Landesdurchschnitt ist hier wenig aussagekräftig.",
  hb: "Bremen ist mit den Städten Bremen und Bremerhaven einer von drei Stadtstaaten – anders als in einem Flächenland gibt es kein ländliches Umland mit spürbar niedrigeren Preisen, in das Käufer ausweichen könnten.",
  hh: "Hamburg hat die Grunderwerbsteuer zuletzt 2023 angehoben und damit später als die meisten anderen Länder – als Stadtstaat mit Hafenwirtschaft bleibt der Markt dabei ähnlich kompakt wie in Berlin und Bremen, nur auf höherem Preisniveau.",
  he: "In Hessen treibt vor allem die Finanzmetropole Frankfurt samt Rhein-Main-Gebiet das Preisniveau, während nordhessische Kreise um Kassel deutlich günstiger sind. Die Beispielrechnung mit 300.000 oder 500.000 Euro trifft je nach Lage im Land sehr unterschiedlich gut.",
  mv: "Mecklenburg-Vorpommern hat mit der Ostseeküste einen touristisch geprägten Markt, in dem Zweitwohnsitze und Ferienimmobilien die Preise in Küstennähe deutlich über das Niveau im ländlichen Binnenland treiben.",
  ni: "Niedersachsen ist nach Bayern das zweitgrößte Flächenland – entsprechend groß ist die Preisspanne zwischen der Region Hannover und dünn besiedelten Kreisen wie dem Emsland. Ein Landesdurchschnitt sagt hier wenig über den Einzelfall aus.",
  nw: "Nordrhein-Westfalen ist das bevölkerungsreichste Bundesland mit sehr unterschiedlichen Teilmärkten: Zwischen der Rheinschiene um Köln und Düsseldorf und Teilen des Ruhrgebiets liegen beim Quadratmeterpreis oft mehrere Tausend Euro Unterschied.",
  rp: "Rheinland-Pfalz grenzt als eines von wenigen Ländern an vier andere Bundesländer – wer in Grenznähe zum Saarland oder zu Nordrhein-Westfalen kauft, zahlt dort mit 6,5 statt 5,0 Prozent spürbar mehr Grunderwerbsteuer als hier.",
  sl: "Das Saarland ist das kleinste Flächenland und wirtschaftlich stark vom Strukturwandel weg von Kohle und Stahl geprägt – das hält die Kaufpreise im Bundesvergleich vergleichsweise niedrig, trotz des mit 6,5 Prozent hohen Steuersatzes.",
  sn: "Sachsen hat die Grunderwerbsteuer 2023 in einem einzigen Schritt von 3,5 auf 5,5 Prozent angehoben, den bislang größten Sprung eines einzelnen Landes. Der Markt selbst ist zweigeteilt: wachsende Städte wie Dresden und Leipzig gegen ein eher schrumpfendes ländliches Umland.",
  st: "Sachsen-Anhalt zählt zu den Ländern mit dem stärksten Bevölkerungsrückgang der letzten Jahrzehnte – das hält die Kaufpreise niedrig und macht es vielerorts zu einem Käufermarkt mit spürbarem Verhandlungsspielraum.",
  sh: "Schleswig-Holstein hat mit der Nord- und Ostseeküste – etwa Sylt oder Fehmarn – einige der teuersten Lagen Deutschlands, während das Binnenland deutlich günstiger bleibt. Die Beispielrechnung mit 300.000 Euro liegt für Küstenlagen oft weit unter der Realität.",
  th: "Thüringen hat 2024 als bislang einziges Land die Grunderwerbsteuer gesenkt, von 6,5 auf 5,0 Prozent. Geografisch liegt es zentral in Deutschland, mit Erfurt, Jena und Weimar als den preislich auffälligsten Städten in einem sonst eher günstigen Umfeld.",
};

/**
 * Eine vierte, eigene FAQ je Land – zusätzlich zu den drei rein aus Satz und
 * Zahlen erzeugten Fragen in `buildVariants()`. Greift denselben Fakt wie
 * `grestKontext` auf, aber aus einer anderen Frage heraus, damit die beiden
 * sich ergänzen statt zu wiederholen. Der Grund ist derselbe: Bei gleichem
 * Satz sind die drei generierten Fragen für zwei Länder fast wortgleich,
 * diese vierte bleibt es nicht.
 */
export const grestFaq: Record<RegionCode, FaqEntry> = {
  bw: {
    question: "Warum unterscheiden sich die Preise innerhalb Baden-Württembergs so stark?",
    answer:
      "Weil Stuttgart und die Rhein-Neckar-Region als Wirtschaftszentren die Nachfrage und damit die Preise treiben, während ländliche Kreise abseits davon deutlich günstiger bleiben. Die Grunderwerbsteuer ist im ganzen Land gleich, das Preisniveau der Immobilie selbst aber nicht – das solltest du bei den Kaufpreis-Annahmen im Rechner berücksichtigen.",
  },
  by: {
    question: "Warum ist München trotz niedrigem Steuersatz so teuer?",
    answer:
      "Die Grunderwerbsteuer ist mit 3,5 Prozent die günstigste in Deutschland, das gleicht das Preisniveau in München aber kaum aus – die Landeshauptstadt gehört seit Jahren zu den teuersten Immobilienmärkten Europas. Außerhalb von München und dem direkten Umland liegen die Preise dagegen oft spürbar unter dem Bundesschnitt.",
  },
  be: {
    question: "Wie hat sich der Berliner Immobilienmarkt entwickelt?",
    answer:
      "Berlin hat als reiner Stadtmarkt seit über einem Jahrzehnt ein Nachfragewachstum erlebt, das dem Angebot vorauslief – anders als in einem Flächenland gibt es kein günstigeres Umland, in das Käufer ausweichen könnten. Das schlägt sich seither dauerhaft in den Kaufpreisen nieder.",
  },
  bb: {
    question: "Warum sind die Preise in Brandenburg so unterschiedlich?",
    answer:
      "Weil Brandenburg Berlin vollständig umschließt: Im direkten Speckgürtel wie Potsdam oder Teltow-Fläming ziehen die Preise seit Jahren mit der Hauptstadt mit, während sie in den grenznahen Kreisen zu Polen deutlich niedriger liegen. Ein Landesdurchschnitt sagt hier wenig über den Einzelfall aus.",
  },
  hb: {
    question: "Was unterscheidet den Bremer Markt von anderen Stadtstaaten?",
    answer:
      "Bremen ist der kleinste der drei Stadtstaaten und besteht nur aus den Städten Bremen und Bremerhaven – anders als in einem Flächenland gibt es kein ländliches Umland mit spürbar niedrigeren Preisen, in das sich ausweichen ließe.",
  },
  hh: {
    question: "Warum wurde die Grunderwerbsteuer in Hamburg erst 2023 angehoben?",
    answer:
      "Hamburg hat den Satz später angehoben als die meisten anderen Länder – bis dahin lag er bei 4,5 Prozent. Als Stadtstaat mit Hafenwirtschaft bleibt der Markt ähnlich kompakt wie in Berlin und Bremen, nur auf einem höheren Preisniveau.",
  },
  he: {
    question: "Warum ist Frankfurt für den hessischen Markt so entscheidend?",
    answer:
      "Als eine der größten Finanzmetropolen Europas treibt Frankfurt samt Rhein-Main-Gebiet das Preisniveau im ganzen Land – nordhessische Kreise um Kassel liegen dagegen deutlich darunter. Die Beispielrechnung mit 300.000 oder 500.000 Euro trifft je nach Lage im Land sehr unterschiedlich gut.",
  },
  mv: {
    question: "Warum sind Immobilien an der Ostseeküste so gefragt?",
    answer:
      "Weil Zweitwohnsitze und Ferienimmobilien die Nachfrage in Küstennähe zusätzlich zur normalen Wohnnutzung treiben – das treibt die Preise dort deutlich über das Niveau im ländlichen Binnenland des Landes.",
  },
  ni: {
    question: "Warum sagt der Landesdurchschnitt in Niedersachsen wenig aus?",
    answer:
      "Weil Niedersachsen nach Bayern das zweitgrößte Flächenland ist und von der Nordseeküste bis in den Harz reicht. Die Preisspanne zwischen der Region Hannover und dünn besiedelten Kreisen wie dem Emsland ist entsprechend groß – ein Landesdurchschnitt trifft für den Einzelfall selten zu.",
  },
  nw: {
    question: "Warum unterscheiden sich die Teilmärkte in NRW so stark?",
    answer:
      "Nordrhein-Westfalen ist das bevölkerungsreichste Bundesland mit sehr unterschiedlichen Regionen: Zwischen der Rheinschiene um Köln und Düsseldorf und Teilen des Ruhrgebiets liegen beim Quadratmeterpreis oft mehrere Tausend Euro Unterschied.",
  },
  rp: {
    question: "Lohnt sich ein Blick über die Landesgrenze bei Rheinland-Pfalz?",
    answer:
      "Ja, denn Rheinland-Pfalz grenzt als eines von wenigen Ländern an vier andere Bundesländer. Wer in Grenznähe zum Saarland oder zu Nordrhein-Westfalen kauft, zahlt dort mit 6,5 statt 5,0 Prozent spürbar mehr Grunderwerbsteuer – bei 300.000 Euro Kaufpreis ein Unterschied von 4.500 Euro.",
  },
  sl: {
    question: "Warum bleiben die Preise im Saarland trotz hoher Steuer moderat?",
    answer:
      "Das Saarland ist wirtschaftlich stark vom Strukturwandel weg von Kohle und Stahl geprägt, das hält die Kaufpreise im Bundesvergleich vergleichsweise niedrig – trotz des mit 6,5 Prozent hohen Steuersatzes. Als kleinstes Flächenland ist zudem die Fahrzeit nach Frankreich und Luxemburg besonders kurz.",
  },
  sn: {
    question: "Warum stieg die Grunderwerbsteuer in Sachsen 2023 so stark?",
    answer:
      "Sachsen hat den Satz 2023 in einem einzigen Schritt von 3,5 auf 5,5 Prozent angehoben – der bislang größte Sprung eines einzelnen Landes. Der Markt selbst ist zweigeteilt: wachsende Städte wie Dresden und Leipzig gegen ein eher schrumpfendes ländliches Umland.",
  },
  st: {
    question: "Warum ist der Immobilienmarkt in Sachsen-Anhalt ein Käufermarkt?",
    answer:
      "Sachsen-Anhalt zählt zu den Ländern mit dem stärksten Bevölkerungsrückgang der letzten Jahrzehnte – das hält die Kaufpreise niedrig und lässt vielerorts spürbaren Verhandlungsspielraum beim Kaufpreis, anders als in gefragten Großstadtlagen.",
  },
  sh: {
    question: "Warum sind Küstenlagen in Schleswig-Holstein teurer als die Beispielrechnung?",
    answer:
      "Mit Nord- und Ostseeküste zugleich gehört Schleswig-Holstein zu den gefragtesten Reisezielen Deutschlands – das treibt die Preise in beliebten Küstenorten wie Sylt oder Fehmarn weit über das Landesniveau. Die Beispielrechnung mit 300.000 Euro liegt für solche Lagen oft deutlich unter der Realität.",
  },
  th: {
    question: "Warum senkte Thüringen als einziges Land die Grunderwerbsteuer?",
    answer:
      "Thüringen hat den Satz 2024 von 6,5 auf 5,0 Prozent gesenkt – die bislang einzige Senkung eines Bundeslandes. Die zentrale Lage macht das Land von fast jedem anderen Bundesland aus in wenigen Stunden erreichbar, was es auch für Pendler interessant macht.",
  },
};

/** Satz eines Landes; unbekannte Kennung fällt auf den alten Bundessatz zurück. */
export const grestFor = (code: string): number =>
  grunderwerbsteuer[code as RegionCode] ?? GREST_BUNDESSATZ;

/** Günstigstes und teuerstes Land – für die Einordnung auf den Landesseiten. */
export const grestSpanne = () => {
  const werte = regions.map((region) => grunderwerbsteuer[region.code]);
  return { min: Math.min(...werte), max: Math.max(...werte) };
};
