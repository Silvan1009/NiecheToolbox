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

import { regions, type RegionCode } from "@/tools/brueckentage/logic";

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

/** Satz eines Landes; unbekannte Kennung fällt auf den alten Bundessatz zurück. */
export const grestFor = (code: string): number =>
  grunderwerbsteuer[code as RegionCode] ?? GREST_BUNDESSATZ;

/** Günstigstes und teuerstes Land – für die Einordnung auf den Landesseiten. */
export const grestSpanne = () => {
  const werte = regions.map((region) => grunderwerbsteuer[region.code]);
  return { min: Math.min(...werte), max: Math.max(...werte) };
};
