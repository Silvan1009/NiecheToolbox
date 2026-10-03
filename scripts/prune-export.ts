import { existsSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Bringt den Export nach `next build` in die Form, die ein reiner
 * Datei-Server (Apache auf IONOS) ausliefern kann.
 *
 * ------------------------------------------------------------------------
 * 1. Die Zweitfassung der 404-Seite unter `404/`
 * ------------------------------------------------------------------------
 *
 * Next legt die Fehlerseite zweimal ab: als `404.html` und – wegen
 * `trailingSlash: true` – zusätzlich als `404/index.html`. Beide Dateien sind
 * byte-identisch. Gebraucht wird nur die erste: `.htaccess` verweist mit
 * `ErrorDocument 404 /404.html` genau dorthin (siehe lib/htaccess.ts).
 *
 * Die zweite ist nicht nur überflüssig, sondern schädlich. Über `/404/` liefert
 * Apache sie als ganz normale Seite aus – mit Status 200 und dem Inhalt „Seite
 * nicht gefunden“. Google nennt das eine Soft-404 und wertet sie ab. Verlinkt
 * ist die Adresse nirgends und in der Sitemap steht sie auch nicht; sie fällt
 * hier deshalb ersatzlos weg.
 *
 * `_not-found/` bleibt bewusst liegen: das ist die interne Route, aus der der
 * Client-Router seine Fehlerseite rendert, nicht bloß eine Kopie.
 *
 * ------------------------------------------------------------------------
 * 2. Segmentdateien flach ablegen
 * ------------------------------------------------------------------------
 *
 * Für jede Route schreibt Next die Bausteine der Client-Navigation: neben
 * `index.txt` die Dateien `__next._tree.txt`, `__next._head.txt` und je
 * Routensegment eine weitere. Bei verschachtelten Segmenten legt der Export
 * sie als Verzeichnisse ab –
 *
 *   ueber/__next.ueber/__PAGE__.txt
 *   tools/bmi/__next.tools/$d$slug/__PAGE__.txt
 *
 * – der Router im Browser fragt sie aber mit Punkten an:
 *
 *   /ueber/__next.ueber.__PAGE__.txt
 *   /tools/bmi/__next.tools.$d$slug.__PAGE__.txt
 *
 * Ein Next-Server übersetzt das. Apache nicht: Die Anfrage läuft ins Leere,
 * und jeder vorgeladene Link hinterlässt einen 404 in der Konsole. Deshalb
 * werden die Dateien hier unter dem Namen abgelegt, unter dem sie angefragt
 * werden.
 *
 * ------------------------------------------------------------------------
 * Was hier NICHT mehr entfernt wird: die RSC-Payloads
 * ------------------------------------------------------------------------
 *
 * Bis zur Konsolidierung löschte dieses Skript jede `index.txt` und alle
 * `__next.*`-Segmentdateien, um unter der 47,7-MiB-Grenze von IONOS Deploy Now
 * zu bleiben – bei 218 Seiten machten sie 23 MiB aus. Die Annahme dahinter,
 * der Router fordere die Segmentdateien nie an, stimmte nicht: Jeder `<Link>`
 * im Sichtfeld holt sie beim Vorladen. Fehlten sie, antwortete der Server mit
 * 404 – rund 70 Konsolenfehler je Seitenaufruf, jeder mit der vollen
 * 404-Seite als Antwort, und Lighthouse wertete „Browser errors were logged
 * to the console“ als nicht bestanden. Seitenwechsel liefen außerdem als
 * voller Neuaufbau statt als Übergang.
 *
 * Mit 67 Seiten wiegen dieselben Dateien noch gut 10 MiB; der Export bleibt
 * mit Abstand unter der Grenze (scripts/content-audit.ts prüft sie bei jedem
 * Build). Sie bleiben deshalb liegen. Als Suchtreffer tauchen sie nicht auf:
 * lib/htaccess.ts gibt allen `.txt`-Payloads `X-Robots-Tag: noindex` mit.
 */

const OUT_DIR = join(process.cwd(), "out");
const DUPLICATE_404 = join(OUT_DIR, "404");
const SEGMENT_PREFIX = "__next.";

function bytesOf(path: string): number {
  const stat = statSync(path);
  if (stat.isFile()) return stat.size;
  if (!stat.isDirectory()) return 0;
  return readdirSync(path).reduce(
    (sum, entry) => sum + bytesOf(join(path, entry)),
    0,
  );
}

if (existsSync(DUPLICATE_404)) {
  const kib = (bytesOf(DUPLICATE_404) / 1024).toFixed(0);
  rmSync(DUPLICATE_404, { recursive: true, force: true });
  console.log(`Doppelte 404-Seite unter out/404/ entfernt (${kib} KiB).`);
}

let flattened = 0;

/** Verschiebt alles unter `sourceDir` nach `targetDir`, Pfadteile mit Punkt verbunden. */
function moveFlat(sourceDir: string, targetDir: string, prefix: string) {
  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const full = join(sourceDir, entry.name);
    const flatName = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) {
      moveFlat(full, targetDir, flatName);
    } else {
      renameSync(full, join(targetDir, flatName));
      flattened += 1;
    }
  }
}

function flattenSegments(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith(SEGMENT_PREFIX)) {
      moveFlat(full, dir, entry.name);
      rmSync(full, { recursive: true, force: true });
    } else {
      flattenSegments(full);
    }
  }
}

flattenSegments(OUT_DIR);
console.log(
  `${flattened} Segmentdateien flach abgelegt (z. B. __next.ueber.__PAGE__.txt).`,
);
