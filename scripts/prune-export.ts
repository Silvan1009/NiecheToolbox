import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Räumt nach `next build` auf, was der Export erzeugt, aber niemand abruft.
 *
 * ------------------------------------------------------------------------
 * 1. Client-Segment-Cache-Dateien (`__next.*`)
 * ------------------------------------------------------------------------
 *
 * Bei `output: "export"` schreibt Next für jede Route zusätzlich zur
 * `index.txt` einen kompletten Satz Segment-Prefetch-Dateien
 * (`__next._full.txt`, `__next._head.txt`, `__next._index.txt`,
 * `__next._tree.txt` sowie ein `__next.<slug>/…`-Verzeichnis pro
 * verschachteltem Layout) – Teil des in Next 16 überarbeiteten Routers für
 * "instant navigations" mit Cache Components. Diese App setzt
 * `cacheComponents` nicht, und im Netzwerk-Log eines echten Client-Navigation
 * (Browser-Test) fordert der Router beim Seitenwechsel ausschließlich die
 * normale `index.txt` an – die `__next.*`-Dateien werden nie geladen. Next
 * selbst bietet dafür kein next.config-Flag zum Abschalten (siehe
 * node_modules/next/dist/export/routes/app-page.js – der Export schreibt sie
 * unconditional). Bei ~200 vorgerenderten Seiten macht der tote Ballast rund
 * 14 MiB des 47,7-MiB-Exportlimits von IONOS Deploy Now aus.
 *
 * ------------------------------------------------------------------------
 * 2. Die Zweitfassung der 404-Seite unter `404/`
 * ------------------------------------------------------------------------
 *
 * Next legt die Fehlerseite zweimal ab: als `404.html` und – wegen
 * `trailingSlash: true` – zusätzlich als `404/index.html`. Beide Dateien sind
 * byte-identisch. Gebraucht wird nur die erste: `.htaccess` verweist mit
 * `ErrorDocument 404 /404.html` genau dorthin (siehe generate-htaccess.ts).
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
 * 3. Die RSC-Payload jeder Route (`index.txt`)
 * ------------------------------------------------------------------------
 *
 * Anders als die `__next.*`-Dateien wird `index.txt` tatsächlich gebraucht:
 * Der Router holt genau diese Datei bei jeder Client-Navigation zwischen
 * Tool-Seiten (per <Link>, per Prefetch oder beim Klick). Sie macht trotzdem
 * mit ~9,4 MiB über ein Viertel des Exports aus – bei ~200 Seiten und einer
 * App, in der Besucher fast immer über eine Suchmaschine auf genau einer
 * Rechner-Seite landen und selten zu einer zweiten weiterklicken.
 *
 * Fehlt `index.txt`, bricht die Navigation nicht: im Browser-Test (echter
 * Klick auf einen internen Link nach Entfernen der Datei) beantwortet der
 * Server die `_rsc`-Anfrage mit 404, und der Client-Router fängt das ab und
 * lädt die Zielroute stattdessen als normale volle Seite nach – ganz ohne
 * Konsolenfehler, nur ohne die unterbrechungsfreie SPA-Transition. Die
 * volle Nachladung geht dabei an der Pfad-Variante ohne Trailing Slash
 * (`/rechner` statt `/rechner/`) – auf IONOS erledigt genau dafür
 * `trailingSlash: true` (next.config.ts) die Arbeit: Apache findet
 * `/rechner` als echtes Verzeichnis, schickt per `mod_dir` einen 301 auf
 * `/rechner/`, und dort liefert `DirectoryIndex` die `index.html` aus.
 */

const OUT_DIR = join(process.cwd(), "out");
const SEGMENT_PREFIX = "__next.";
const RSC_PAYLOAD_NAME = "index.txt";
const DUPLICATE_404 = join(OUT_DIR, "404");

let removedSegmentCount = 0;
let removedSegmentBytes = 0;
let removedPayloadCount = 0;
let removedPayloadBytes = 0;

function bytesOf(path: string): number {
  const stat = statSync(path);
  if (stat.isFile()) return stat.size;
  if (!stat.isDirectory()) return 0;
  return readdirSync(path).reduce(
    (sum, entry) => sum + bytesOf(join(path, entry)),
    0,
  );
}

function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.name.startsWith(SEGMENT_PREFIX)) {
      removedSegmentBytes += bytesOf(fullPath);
      removedSegmentCount += 1;
      rmSync(fullPath, { recursive: true, force: true });
      continue;
    }
    if (entry.isFile() && entry.name === RSC_PAYLOAD_NAME) {
      removedPayloadBytes += bytesOf(fullPath);
      removedPayloadCount += 1;
      rmSync(fullPath, { force: true });
      continue;
    }
    if (entry.isDirectory()) walk(fullPath);
  }
}

walk(OUT_DIR);

const segmentMib = (removedSegmentBytes / 1024 / 1024).toFixed(2);
console.log(
  `${removedSegmentCount} ungenutzte Segment-Prefetch-Einträge entfernt (${segmentMib} MiB).`,
);

const payloadMib = (removedPayloadBytes / 1024 / 1024).toFixed(2);
console.log(
  `${removedPayloadCount} RSC-Payload-Dateien (index.txt) entfernt (${payloadMib} MiB). ` +
    "Client-Navigation zwischen Tool-Seiten lädt dadurch als volle Seite statt als SPA-Transition.",
);

if (existsSync(DUPLICATE_404)) {
  const kib = (bytesOf(DUPLICATE_404) / 1024).toFixed(0);
  rmSync(DUPLICATE_404, { recursive: true, force: true });
  console.log(`Doppelte 404-Seite unter out/404/ entfernt (${kib} KiB).`);
}
