import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { LAST_MODIFIED_FILE, lastModifiedKey } from "../src/lib/lastModified";
import { publicTools } from "../src/tools/registry";
import { publicWege } from "../src/wege/registry";

/**
 * Schreibt je Seite den Tag der letzten Änderung nach
 * `.generated/last-modified.json` – gelesen von lib/lastModified.ts für
 * Sitemap, strukturierte Daten und die sichtbare Zeile „Zuletzt aktualisiert“.
 *
 * Quelle ist der letzte Commit, der den Ordner des Rechners (Rechenlogik,
 * Texte, Varianten) oder die Datei der Seite berührt hat.
 *
 * Braucht die vollständige Historie. In einem flachen Klon (`fetch-depth: 1`,
 * die Voreinstellung von actions/checkout) kennt Git nur den letzten Commit
 * und nennt für jeden Pfad dessen Datum – alle Seiten hätten dann wieder
 * dasselbe, falsche Datum. Im CI bricht das Skript deshalb ab; der Build-
 * Workflow checkt mit `fetch-depth: 0` aus. Lokal schreibt es eine leere
 * Datei: lieber kein Datum als ein falsches.
 */

const ROOT = process.cwd();

/** Einzelseiten und die Dateien, deren Änderung als Änderung der Seite zählt. */
const STATIC_PAGES: Record<string, string[]> = {
  start: ["src/app/page.tsx"],
  rechner: ["src/app/rechner/page.tsx", "src/tools/groups.ts"],
  wege: ["src/app/wege/page.tsx"],
  ueber: ["src/app/ueber/page.tsx"],
  impressum: ["src/app/rechtliches/impressum/page.tsx"],
  datenschutz: ["src/app/rechtliches/datenschutz/page.tsx"],
};

function git(args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function isShallow(): boolean {
  try {
    return git(["rev-parse", "--is-shallow-repository"]) === "true";
  } catch {
    // Kein Git-Repository (z. B. ein entpacktes Archiv) – wie ein flacher Klon
    // behandeln: Es gibt keine Historie, aus der ein Datum käme.
    return true;
  }
}

/** Tag des letzten Commits, der einen der Pfade berührt hat (`2026-10-02`). */
function lastCommitDate(paths: string[]): string | undefined {
  const out = git(["log", "-1", "--format=%cs", "--", ...paths]);
  return out === "" ? undefined : out;
}

function write(entries: Record<string, string>) {
  const file = join(ROOT, LAST_MODIFIED_FILE);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(entries, null, 2)}\n`);
}

if (isShallow()) {
  const message =
    "generate-last-modified: Die Git-Historie ist unvollständig (flacher Klon). " +
    "Ohne sie gibt es kein verlässliches Änderungsdatum je Seite.";
  if (process.env.CI) {
    console.error(
      `${message}\nIm Workflow actions/checkout mit "fetch-depth: 0" aufrufen.`,
    );
    process.exit(1);
  }
  console.warn(`${message} Es werden keine Daten geschrieben.`);
  write({});
  process.exit(0);
}

const entries: Record<string, string> = {};
const set = (key: string, paths: string[]) => {
  const date = lastCommitDate(paths);
  if (date) entries[key] = date;
};

for (const tool of publicTools()) {
  set(lastModifiedKey.tool(tool.slug), [`src/tools/${tool.slug}`]);
}
for (const weg of publicWege()) {
  set(lastModifiedKey.weg(weg.slug), [`src/wege/${weg.slug}`]);
}
for (const [name, paths] of Object.entries(STATIC_PAGES)) {
  set(lastModifiedKey.page(name), paths);
}

write(entries);
console.log(
  `${LAST_MODIFIED_FILE} geschrieben (${Object.keys(entries).length} Seiten).`,
);
