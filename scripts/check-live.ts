import { buildAdsTxt } from "../src/lib/adsTxt";
import { retiredPaths } from "../src/lib/retiredPaths";

/**
 * Prüft die tatsächlich ausgelieferte Seite nach jedem Deploy – nicht den
 * Export, sondern das, was https://rechnerkiste.app wirklich beantwortet.
 *
 * Entstanden aus der AdSense-Konsolidierung (siehe
 * docs/adsense/etappe-0-ausgangslage.md): Der Export selbst kann fehlerfrei
 * sein und trotzdem live etwas anderes zeigen – ein falsch konfigurierter
 * Apache, ein vergessenes .htaccess-Deployment, ein CDN, das eine alte
 * Fassung noch vorhält. Läuft als eigener Workflow nach jedem IONOS-Deploy,
 * unabhängig vom Build-Job dieses Repos (siehe .github/workflows/
 * live-check.yaml) – die von IONOS verwalteten Workflow-Dateien bleiben
 * dafür unangetastet.
 *
 * Vier Prüfungen:
 * 1. /ads.txt – Status, Content-Type, exakter Inhalt gegen buildAdsTxt().
 * 2. /robots.txt – erreichbar, sperrt nichts pauschal.
 * 3. / – der google-adsense-account-Meta-Tag steht mit der richtigen ID im HTML.
 * 4. Eine Stichprobe eingeschmolzener Variantenseiten – 301 auf das
 *    richtige Ziel, nicht 404. Alle 151 zu prüfen wäre gründlicher, aber für
 *    einen Nach-Deploy-Check unnötig langsam; die Stichprobe deckt bewusst
 *    unterschiedliche Redirect-Arten ab (Bundesland+Jahr, Bundesland ohne
 *    Jahr, Wertvariante, Redirect auf eine Schwesterseite, Redirect in ein
 *    anderes Tool).
 */

const BASE = (process.env.SITE_URL ?? "https://rechnerkiste.app").replace(
  /\/+$/,
  "",
);
const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

const failures: string[] = [];
const fail = (message: string) => failures.push(message);

/** Repräsentative Stichprobe über alle Redirect-Arten aus retiredPaths.ts. */
function sampleRedirects(): { from: string; to: string }[] {
  const bySlugPart = (needle: string) =>
    retiredPaths.find(({ from }) => from.includes(needle));

  const picks = [
    bySlugPart("/tools/brueckentage/bayern-2026/"),
    bySlugPart("/tools/immobilienrechner/kaufnebenkosten-bayern/"),
    bySlugPart("/tools/backform/26-auf-20/"),
    bySlugPart("/tools/bruttonetto/gehaltserhoehung-netto/"),
    bySlugPart("/tools/kindergeld/kinderfreibetrag-berechnen/"),
    bySlugPart("/wege/gehalt/10-prozent/"),
  ].filter((entry): entry is { from: string; to: string } => entry != null);

  return picks;
}

async function checkAdsTxt(): Promise<void> {
  const expected = buildAdsTxt(CLIENT_ID);
  if (!expected) {
    fail(
      `ads.txt: NEXT_PUBLIC_ADSENSE_CLIENT ("${CLIENT_ID}") ergibt keinen gültigen Eintrag – Prüfung übersprungen, das ist selbst schon ein Fehler.`,
    );
    return;
  }

  const res = await fetch(`${BASE}/ads.txt`, { redirect: "manual" });
  if (res.status !== 200) {
    fail(`ads.txt: Status ${res.status} statt 200.`);
    return;
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.startsWith("text/plain")) {
    fail(`ads.txt: Content-Type "${contentType}" statt "text/plain".`);
  }
  const body = await res.text();
  if (body !== expected) {
    fail(
      `ads.txt: Inhalt weicht ab.\n  erwartet: ${JSON.stringify(expected)}\n  erhalten: ${JSON.stringify(body)}`,
    );
  }
}

async function checkRobotsTxt(): Promise<void> {
  const res = await fetch(`${BASE}/robots.txt`, { redirect: "manual" });
  if (res.status !== 200) {
    fail(`robots.txt: Status ${res.status} statt 200.`);
    return;
  }
  const body = await res.text();
  if (/^\s*disallow:\s*\/\s*$/im.test(body)) {
    fail("robots.txt: sperrt die gesamte Seite (Disallow: /).");
  }
}

async function checkHomepageMetaTag(): Promise<void> {
  const res = await fetch(`${BASE}/`, { redirect: "manual" });
  if (res.status !== 200) {
    fail(`/ (Startseite): Status ${res.status} statt 200.`);
    return;
  }
  const html = await res.text();
  const match = html.match(
    /<meta\s+name=["']google-adsense-account["']\s+content=["']([^"']+)["']/i,
  );
  if (!match) {
    fail(
      "/ (Startseite): kein google-adsense-account-Meta-Tag im ausgelieferten HTML gefunden.",
    );
    return;
  }
  if (match[1] !== CLIENT_ID) {
    fail(
      `/ (Startseite): Meta-Tag nennt "${match[1]}", erwartet "${CLIENT_ID}".`,
    );
  }
}

async function checkRedirect(from: string, to: string): Promise<void> {
  const res = await fetch(`${BASE}${from}`, { redirect: "manual" });
  if (res.status !== 301) {
    fail(`${from}: Status ${res.status} statt 301 (Ziel sollte ${to} sein).`);
    return;
  }
  const location = res.headers.get("location") ?? "";
  let locationPath: string;
  try {
    locationPath = new URL(location, BASE).pathname;
  } catch {
    locationPath = location;
  }
  // Trailing Slash normalisieren, falls der Server ihn anders behandelt.
  const normalize = (path: string) => (path.endsWith("/") ? path : `${path}/`);
  if (normalize(locationPath) !== normalize(to)) {
    fail(`${from}: leitet auf "${location}" statt auf "${to}".`);
  }
}

async function main() {
  await checkAdsTxt();
  await checkRobotsTxt();
  await checkHomepageMetaTag();

  const redirects = sampleRedirects();
  if (redirects.length === 0) {
    fail("Redirect-Stichprobe: keine der erwarteten Alt-URLs in retiredPaths.ts gefunden.");
  }
  for (const { from, to } of redirects) {
    await checkRedirect(from, to);
  }

  console.log(`check-live: ${BASE}`);
  console.log(`  ads.txt, robots.txt, Meta-Tag geprüft.`);
  console.log(`  ${redirects.length} Redirect(s) aus retiredPaths.ts geprüft.`);

  if (failures.length > 0) {
    console.error(`\ncheck-live: ${failures.length} Prüfung(en) fehlgeschlagen:\n`);
    for (const failure of failures) console.error(`  · ${failure}`);
    process.exit(1);
  }

  console.log("\n✓ Alle Live-Prüfungen bestanden.");
}

main().catch((error) => {
  console.error("check-live: unerwarteter Fehler:", error);
  process.exit(1);
});
