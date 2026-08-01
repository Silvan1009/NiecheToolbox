import { abfindung } from "./abfindung/manifest";
import { aktienkennzahlen } from "./aktienkennzahlen/manifest";
import { arbeitstage } from "./arbeitstage/manifest";
import { autokosten } from "./autokosten/manifest";
import { backform } from "./backform/manifest";
import { brueckentage } from "./brueckentage/manifest";
import { bruttonetto } from "./bruttonetto/manifest";
import { elterngeld } from "./elterngeld/manifest";
import { elternzeit } from "./elternzeit/manifest";
import { energiekosten } from "./energiekosten/manifest";
import { erbschaftsteuer } from "./erbschaftsteuer/manifest";
import { immobilienrechner } from "./immobilienrechner/manifest";
import { kindergeld } from "./kindergeld/manifest";
import { kreditrechner } from "./kreditrechner/manifest";
import { kuendigungsfrist } from "./kuendigungsfrist/manifest";
import { lesezeit } from "./lesezeit/manifest";
import { partymengen } from "./partymengen/manifest";
import { rentenabschlag } from "./rentenabschlag/manifest";
import { rentenluecke } from "./rentenluecke/manifest";
import { sparplan } from "./sparplan/manifest";
import { stromkosten } from "./stromkosten/manifest";
import { trinkgeld } from "./trinkgeld/manifest";
import { umzug } from "./umzug/manifest";
import { urlaubsbudget } from "./urlaubsbudget/manifest";
import { versicherungsvergleich } from "./versicherungsvergleich/manifest";
import type { ToolManifest } from "./types";

/**
 * Zentrale Registrierung – Single Source of Truth.
 *
 * Ein neues Tool hinzufügen = Ordner unter src/tools/ anlegen und hier
 * genau eine Zeile ergänzen. Startseite, Routing, Navigation und Sitemap
 * ergeben sich daraus automatisch. Sonst nichts anfassen.
 */
export const tools: ToolManifest[] = [
  brueckentage,
  urlaubsbudget,
  trinkgeld,
  lesezeit,
  elternzeit,
  kindergeld,
  kuendigungsfrist,
  arbeitstage,
  backform,
  umzug,
  partymengen,
  stromkosten,
  energiekosten,
  immobilienrechner,
  aktienkennzahlen,
  sparplan,
  kreditrechner,
  bruttonetto,
  rentenluecke,
  autokosten,
  versicherungsvergleich,
  erbschaftsteuer,
  elterngeld,
  rentenabschlag,
  abfindung,
];

/** Ein Tool per Slug. `draft` ist bewusst nicht auffindbar. */
export const getTool = (slug: string) =>
  tools.find((t) => t.slug === slug && t.status !== "draft");

/** Alles, was öffentlich beworben wird (Galerie, Sitemap). */
export const liveTools = () => tools.filter((t) => t.status === "live");

/** Alles Erreichbare – inklusive beta, ohne draft. */
export const publicTools = () => tools.filter((t) => t.status !== "draft");

/**
 * Interne Verlinkung: thematisch nahe Tools. Erst gleiche Kategorie, dann
 * Keyword-Überschneidung. Bewusst abgeleitet statt im Manifest gepflegt –
 * so muss beim Hinzufügen eines Tools nichts anderes angefasst werden.
 */
export function relatedTools(slug: string, limit = 3): ToolManifest[] {
  const self = publicTools().find((t) => t.slug === slug);
  if (!self) return publicTools().slice(0, limit);

  const selfKeywords = new Set(self.keywords.map((k) => k.toLowerCase()));

  return publicTools()
    .filter((t) => t.slug !== slug)
    .map((t) => {
      const overlap = t.keywords.filter((k) =>
        selfKeywords.has(k.toLowerCase()),
      ).length;
      return { tool: t, score: (t.category === self.category ? 10 : 0) + overlap };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.tool);
}
