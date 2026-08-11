import { hauskauf } from "./hauskauf/manifest";
import type { WegManifest } from "./types";

/**
 * Zentrale Registrierung der Wege – Gegenstück zu tools/registry.ts.
 *
 * Ein neuer Weg = Ordner unter src/wege/ anlegen und hier eine Zeile
 * ergänzen. Route, Sitemap und Suche greifen darauf zu.
 */
export const wege: WegManifest[] = [hauskauf];

/** Ein Weg per Slug. `draft` ist bewusst nicht auffindbar. */
export const getWeg = (slug: string) =>
  wege.find((w) => w.slug === slug && w.status !== "draft");

/** Alles Erreichbare – inklusive beta, ohne draft. */
export const publicWege = () => wege.filter((w) => w.status !== "draft");
