import { buildAdsTxt } from "../src/lib/adsTxt";
import { analyticsOrigins } from "../src/lib/analyticsOrigins";
import { retiredPaths } from "../src/lib/retiredPaths";

/**
 * Prüft die tatsächlich ausgelieferte Seite nach jedem Deploy – nicht den
 * Export, sondern das, was https://rechnerkiste.app wirklich beantwortet.
 *
 * Der Export selbst kann fehlerfrei sein und trotzdem live etwas anderes
 * zeigen: ein Apache-Modul, das auf dem Hosting fehlt, ein vergessenes
 * .htaccess-Deployment, ein Dienst, der seinen Sende-Host wechselt. Läuft als
 * eigener Workflow nach jedem IONOS-Deploy (.github/workflows/live-check.yaml);
 * die von IONOS verwalteten Workflow-Dateien bleiben dafür unangetastet.
 *
 * Was geprüft wird, und der Befund, aus dem jede Prüfung stammt:
 *
 * 1. /ads.txt – Status, Content-Type, exakter Inhalt gegen buildAdsTxt().
 * 2. /robots.txt – erreichbar, sperrt nichts pauschal.
 * 3. Startseite – der google-adsense-account-Meta-Tag trägt die richtige ID,
 *    das HTML kommt als UTF-8 und wird bei jedem Aufruf neu angefragt.
 * 4. Eine Stichprobe eingeschmolzener Variantenseiten – 301 auf das richtige
 *    Ziel, nicht 404.
 * 5. JavaScript und CSS kommen komprimiert und dürfen ein Jahr im Cache
 *    bleiben. (Live lief beides monatelang roh und ungecacht: 1.254 KiB je
 *    Rechnerseite statt rund 350.)
 * 6. Die Reichweitenmessung darf senden. (Die eigene CSP hat jeden Messpunkt
 *    blockiert, weil Umami an einen anderen Host sendet, als es lädt.)
 * 7. Die Navigationsdateien des Routers sind da und tragen noindex. (Fehlten
 *    sie, hinterließ jeder Seitenaufruf Dutzende 404 in der Konsole.)
 * 8. Die Sitemap nennt je Seite ein Änderungsdatum.
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

  return [
    bySlugPart("/tools/brueckentage/bayern-2026/"),
    bySlugPart("/tools/immobilienrechner/kaufnebenkosten-bayern/"),
    bySlugPart("/tools/backform/26-auf-20/"),
    bySlugPart("/tools/bruttonetto/gehaltserhoehung-netto/"),
    bySlugPart("/tools/kindergeld/kinderfreibetrag-berechnen/"),
    bySlugPart("/wege/gehalt/10-prozent/"),
  ].filter((entry): entry is { from: string; to: string } => entry != null);
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
  if (res.headers.get("x-robots-tag")?.includes("noindex")) {
    fail(
      "ads.txt: trägt X-Robots-Tag noindex – die Ausnahme in .htaccess greift nicht.",
    );
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

/** Lädt die Startseite einmal; mehrere Prüfungen lesen daraus. */
async function fetchHomepage(): Promise<{
  html: string;
  headers: Headers;
} | null> {
  const res = await fetch(`${BASE}/`, { redirect: "manual" });
  if (res.status !== 200) {
    fail(`/ (Startseite): Status ${res.status} statt 200.`);
    return null;
  }
  return { html: await res.text(), headers: res.headers };
}

function checkHomepage(html: string, headers: Headers): void {
  const match = html.match(
    /<meta\s+name=["']google-adsense-account["']\s+content=["']([^"']+)["']/i,
  );
  if (!match) {
    fail(
      "/ (Startseite): kein google-adsense-account-Meta-Tag im ausgelieferten HTML gefunden.",
    );
  } else if (match[1] !== CLIENT_ID) {
    fail(
      `/ (Startseite): Meta-Tag nennt "${match[1]}", erwartet "${CLIENT_ID}".`,
    );
  }

  const contentType = (headers.get("content-type") ?? "").toLowerCase();
  if (!contentType.includes("charset=utf-8")) {
    fail(
      `/ (Startseite): Content-Type "${contentType}" nennt kein charset=utf-8.`,
    );
  }

  // Gecachtes HTML zeigte nach einem Deploy auf Dateien, die es nicht mehr gibt.
  const cacheControl = headers.get("cache-control") ?? "";
  if (!/must-revalidate|no-cache/.test(cacheControl)) {
    fail(
      `/ (Startseite): Cache-Control "${cacheControl}" – HTML muss bei jedem Aufruf neu angefragt werden.`,
    );
  }
}

/**
 * Kompression und Caching der gehashten Dateien, an je einer JavaScript- und
 * der CSS-Datei der Startseite geprüft.
 */
async function checkStaticAssets(html: string): Promise<void> {
  const script = html.match(/\/_next\/static\/chunks\/[^"']+\.js/)?.[0];
  const style = html.match(/\/_next\/static\/[^"']+\.css/)?.[0];
  if (!script) fail("/ (Startseite): keine JavaScript-Datei im HTML gefunden.");
  if (!style) fail("/ (Startseite): keine CSS-Datei im HTML gefunden.");

  for (const path of [script, style]) {
    if (!path) continue;
    const res = await fetch(`${BASE}${path}`, {
      headers: { "accept-encoding": "br, gzip" },
    });
    await res.arrayBuffer();
    if (res.status !== 200) {
      fail(`${path}: Status ${res.status} statt 200.`);
      continue;
    }
    const encoding = res.headers.get("content-encoding") ?? "";
    if (!/^(br|gzip)$/.test(encoding)) {
      fail(
        `${path}: wird unkomprimiert ausgeliefert (Content-Encoding "${encoding}").`,
      );
    }
    const cacheControl = res.headers.get("cache-control") ?? "";
    if (!cacheControl.includes("immutable")) {
      fail(
        `${path}: Cache-Control "${cacheControl}" – gehashte Dateien sollen ein Jahr im Cache bleiben.`,
      );
    }
  }
}

/**
 * Die CSP muss jeden Host zulassen, an den das Mess-Skript sendet. Geprüft
 * wird gegen das Skript selbst, nicht gegen eine Liste im Repo: Wechselt der
 * Anbieter seinen Sende-Host, fällt es hier auf und nicht erst Monate später
 * an einem leeren Dashboard.
 */
async function checkAnalytics(headers: Headers): Promise<void> {
  const { script } = analyticsOrigins();
  if (!script) return;

  const csp = headers.get("content-security-policy") ?? "";
  if (!csp) {
    fail("/ (Startseite): kein Content-Security-Policy-Header.");
    return;
  }
  const directive = (name: string) =>
    csp.split(";").find((part) => part.trim().startsWith(`${name} `)) ?? "";

  if (!directive("script-src").includes(script)) {
    fail(`CSP: script-src lässt das Mess-Skript von ${script} nicht zu.`);
  }

  const scriptUrl =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ??
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
    `${script}/js/script.js`;
  const res = await fetch(scriptUrl);
  if (res.status !== 200) {
    fail(`Mess-Skript ${scriptUrl}: Status ${res.status} statt 200.`);
    return;
  }
  const source = await res.text();
  const hosts = new Set(
    [...source.matchAll(/https:\/\/[a-z0-9.-]+/gi)].map((match) => match[0]),
  );
  // Sendet das Skript an seinen eigenen Host, nennt es keine Adresse.
  hosts.add(script);

  const connect = directive("connect-src");
  for (const host of hosts) {
    if (!connect.includes(host)) {
      fail(
        `CSP: connect-src lässt ${host} nicht zu – das Mess-Skript sendet dorthin, jeder Messpunkt wird blockiert.`,
      );
    }
  }
}

async function checkRouterPayloads(): Promise<void> {
  for (const path of [
    "/__next._tree.txt",
    "/ueber/__next.ueber.__PAGE__.txt",
  ]) {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
    await res.arrayBuffer();
    if (res.status !== 200) {
      fail(
        `${path}: Status ${res.status} statt 200 – vorgeladene Links hinterlassen 404 in der Konsole.`,
      );
      continue;
    }
    if (!(res.headers.get("x-robots-tag") ?? "").includes("noindex")) {
      fail(`${path}: ohne X-Robots-Tag noindex.`);
    }
  }
}

async function checkSitemap(): Promise<void> {
  const res = await fetch(`${BASE}/sitemap.xml`, { redirect: "manual" });
  if (res.status !== 200) {
    fail(`sitemap.xml: Status ${res.status} statt 200.`);
    return;
  }
  const xml = await res.text();
  const urls = xml.match(/<url>/g)?.length ?? 0;
  const dated = xml.match(/<lastmod>/g)?.length ?? 0;
  if (urls === 0) fail("sitemap.xml: enthält keine Einträge.");
  else if (dated !== urls) {
    fail(`sitemap.xml: nur ${dated} von ${urls} Einträgen tragen ein lastmod.`);
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

  const homepage = await fetchHomepage();
  if (homepage) {
    checkHomepage(homepage.html, homepage.headers);
    await checkStaticAssets(homepage.html);
    await checkAnalytics(homepage.headers);
  }

  await checkRouterPayloads();
  await checkSitemap();

  const redirects = sampleRedirects();
  if (redirects.length === 0) {
    fail(
      "Redirect-Stichprobe: keine der erwarteten Alt-URLs in retiredPaths.ts gefunden.",
    );
  }
  for (const { from, to } of redirects) {
    await checkRedirect(from, to);
  }

  console.log(`check-live: ${BASE}`);
  console.log(
    "  ads.txt, robots.txt, Startseite, Kompression, Caching, CSP, Router-Dateien, Sitemap geprüft.",
  );
  console.log(`  ${redirects.length} Redirect(s) aus retiredPaths.ts geprüft.`);

  if (failures.length > 0) {
    console.error(
      `\ncheck-live: ${failures.length} Prüfung(en) fehlgeschlagen:\n`,
    );
    for (const failure of failures) console.error(`  · ${failure}`);
    process.exit(1);
  }

  console.log("\n✓ Alle Live-Prüfungen bestanden.");
}

main().catch((error) => {
  console.error("check-live: unerwarteter Fehler:", error);
  process.exit(1);
});
