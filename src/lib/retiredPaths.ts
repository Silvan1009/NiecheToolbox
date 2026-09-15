import { regions } from "@/lib/regionen";
import { toolPath, variantPath, wegPath, wegVariantPath } from "@/lib/seo";

/**
 * Variantenseiten, die im Zuge der AdSense-Konsolidierung in ihre Elternseite
 * eingeschmolzen wurden – siehe docs/adsense/etappe-0-ausgangslage.md für die
 * Zahlen, die zu dieser Entscheidung geführt haben.
 *
 * Jede alte URL antwortet ab jetzt mit einem dauerhaften Redirect (301) statt
 * mit 404: Der Inhalt lebt weiter, nur zusammengefasst auf der Zielseite.
 * `scripts/generate-htaccess.ts` liest diese Liste und erzeugt daraus
 * `RedirectMatch`-Direktiven für Apache.
 *
 * Diese Liste ist absichtlich eine feste, von Hand gepflegte Aufzählung und
 * kein Ableiten aus den heutigen Varianten-Definitionen: Ein Tool, das später
 * neue Varianten bekommt, soll nicht versehentlich neue Redirects erzeugen,
 * und ein hier gelöschter Eintrag hätte für immer verschwundene Redirects zur
 * Folge. Jahreszahlen (2026–2028) sind deshalb hartkodiert und NICHT an
 * `VARIANT_YEARS` der jeweiligen `varianten.ts` gekoppelt – diese Seiten
 * existierten mit genau diesen Jahren, ihre Weiterleitung bleibt das dauerhaft
 * korrekte Ziel, auch wenn ein Tool später andere Jahre erzeugt.
 */

export interface RetiredPath {
  /** Alte URL ohne Domain, mit führendem und abschließendem Schrägstrich. */
  from: string;
  /** Neue URL, auf die weitergeleitet wird. */
  to: string;
}

/** Regionale Landing-Pages "<tool>/<bundesland>-<jahr>/" für mehrere Jahre. */
function regionalYearFamily(
  toolSlug: string,
  years: number[],
  to: string,
): RetiredPath[] {
  return years.flatMap((year) =>
    regions.map((region) => ({
      from: variantPath(toolSlug, `${region.slug}-${year}`),
      to,
    })),
  );
}

/** Regionale Landing-Pages ohne Jahr, ein Eintrag je Bundesland. */
function regionalFamily(
  toolSlug: string,
  variantSlug: (regionSlug: string) => string,
  to: string,
): RetiredPath[] {
  return regions.map((region) => ({
    from: variantPath(toolSlug, variantSlug(region.slug)),
    to,
  }));
}

const brueckentageTo = toolPath("brueckentage");
const arbeitstageTo = toolPath("arbeitstage");
const immobilienrechnerTo = toolPath("immobilienrechner");
const backformTo = toolPath("backform");
const stromkostenTo = toolPath("stromkosten");
const umzugTo = toolPath("umzug");
const partymengenTo = toolPath("partymengen");
const wegeGehaltTo = wegPath("gehalt");
const sparplanTo = toolPath("sparplan");
const kreditrechnerTo = toolPath("kreditrechner");
const bruttonettoTo = toolPath("bruttonetto");
const energiekostenTo = toolPath("energiekosten");
const kindergeldTo = toolPath("kindergeld");
const urlaubsbudgetTo = toolPath("urlaubsbudget");

export const retiredPaths: RetiredPath[] = [
  // brueckentage: 16 Länder × 3 Jahre – Fakten stehen jetzt in einer Tabelle
  // auf der Tool-Seite (Etappe 2).
  ...regionalYearFamily("brueckentage", [2026, 2027, 2028], brueckentageTo),

  // arbeitstage: 16 Länder × 2 Jahre.
  ...regionalYearFamily("arbeitstage", [2026, 2027], arbeitstageTo),

  // immobilienrechner: 16 Länder, kein Jahr im Slug.
  ...regionalFamily(
    "immobilienrechner",
    (region) => `kaufnebenkosten-${region}`,
    immobilienrechnerTo,
  ),

  // backform: 10 Formpaare, jetzt eine Umrechnungstabelle auf der Tool-Seite.
  ...[
    "26-auf-20",
    "26-auf-18",
    "26-auf-24",
    "26-auf-28",
    "24-auf-20",
    "24-auf-26",
    "22-auf-26",
    "20-auf-26",
    "18-auf-26",
    "28-auf-26",
  ].map((slug) => ({ from: variantPath("backform", slug), to: backformTo })),

  // stromkosten: 6 Geräte, jetzt eine Gerätetabelle auf der Tool-Seite.
  ...[
    "trockner-stromkosten",
    "kuehlschrank-stromkosten",
    "heizluefter-stromkosten",
    "gaming-stromkosten",
    "klimageraet-stromkosten",
    "waschmaschine-stromkosten",
  ].map((slug) => ({
    from: variantPath("stromkosten", slug),
    to: stromkostenTo,
  })),

  // umzug: 5 Wohnflächen, jetzt eine Tabelle nach Quadratmetern.
  ...["30-qm", "50-qm", "70-qm", "90-qm", "120-qm"].map((slug) => ({
    from: variantPath("umzug", slug),
    to: umzugTo,
  })),

  // partymengen: 5 Personenzahlen, jetzt eine Mengentabelle.
  ...[
    "grillen-fuer-10-personen",
    "grillen-fuer-15-personen",
    "grillen-fuer-20-personen",
    "grillen-fuer-30-personen",
    "grillen-fuer-50-personen",
  ].map((slug) => ({
    from: variantPath("partymengen", slug),
    to: partymengenTo,
  })),

  // wege/gehalt: 4 Prozentstufen, jetzt eine Tabelle auf der Weg-Seite.
  ...["3-prozent", "5-prozent", "10-prozent", "15-prozent"].map((slug) => ({
    from: wegVariantPath("gehalt", slug),
    to: wegeGehaltTo,
  })),

  // sparplan: 4 von 9 Varianten gehen in eine Sparraten-Tabelle auf, 5 bleiben
  // eigenständig (zinseszinsrechner, sparrate-berechnen,
  // vorabpauschale-berechnen, abgeltungssteuer-berechnen,
  // entnahmeplan-rechner).
  ...[
    "etf-sparplan-rechner",
    "100-euro-sparplan",
    "500-euro-monatlich-sparen",
    "sparplan-1-million",
  ].map((slug) => ({ from: variantPath("sparplan", slug), to: sparplanTo })),

  // kreditrechner: 5 von 9 Varianten gehen in eine Kreditbetrags-Tabelle auf,
  // 4 bleiben eigenständig (effektiver-jahreszins-berechnen,
  // sondertilgung-rechner, restschuld-berechnen, umschuldung-rechner).
  ...[
    "annuitaetendarlehen-berechnen",
    "autokredit-rechner",
    "10000-euro-kredit",
    "20000-euro-kredit",
    "50000-euro-kredit",
  ].map((slug) => ({
    from: variantPath("kreditrechner", slug),
    to: kreditrechnerTo,
  })),

  // bruttonetto: 5 von 9 Varianten gehen in einen Steuerklassen-Vergleich auf,
  // 3 bleiben eigenständig (sozialabgaben-berechnen, kirchensteuer-berechnen,
  // arbeitgeberkosten-berechnen). gehaltserhoehung-netto zieht zu
  // /wege/gehalt/, das dieselbe Frage mit echten Prozentstufen beantwortet.
  ...["steuerklasse-1", "steuerklasse-3", "steuerklasse-4", "steuerklasse-5", "lohnsteuer-berechnen"].map(
    (slug) => ({ from: variantPath("bruttonetto", slug), to: bruttonettoTo }),
  ),
  { from: variantPath("bruttonetto", "gehaltserhoehung-netto"), to: wegeGehaltTo },

  // energiekosten: 4 von 6 Varianten gehen in eine Verbrauchstabelle auf, 2
  // bleiben eigenständig (abschlag-berechnen, nachzahlung-stromrechnung).
  ...[
    "gaskosten-berechnen",
    "stromkosten-haushalt-berechnen",
    "stromverbrauch-4-personen-haushalt",
    "gasverbrauch-einfamilienhaus",
  ].map((slug) => ({
    from: variantPath("energiekosten", slug),
    to: energiekostenTo,
  })),

  // kindergeld: 2 von 5 Varianten gehen in die Tool-Seite auf, 2 bleiben
  // eigenständig (guenstigerpruefung-kinderfreibetrag, kindergeld-studium).
  // kinderfreibetrag-berechnen zieht zur inhaltlich gleichen Schwesterseite
  // guenstigerpruefung-kinderfreibetrag statt zur Tool-Seite.
  ...["kindergeld-2026", "kindergeld-3-kinder"].map((slug) => ({
    from: variantPath("kindergeld", slug),
    to: kindergeldTo,
  })),
  {
    from: variantPath("kindergeld", "kinderfreibetrag-berechnen"),
    to: variantPath("kindergeld", "guenstigerpruefung-kinderfreibetrag"),
  },

  // urlaubsbudget: 3 von 4 Varianten gehen in eine Tabelle nach Dauer und
  // Personenzahl auf, 1 bleibt eigenständig (urlaubskasse-sparen).
  ...["budget-2-wochen-urlaub", "familienurlaub-kosten", "tagesbudget-urlaub"].map(
    (slug) => ({
      from: variantPath("urlaubsbudget", slug),
      to: urlaubsbudgetTo,
    }),
  ),
];
