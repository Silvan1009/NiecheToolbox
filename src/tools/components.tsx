"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ToolParams } from "./types";

type ToolComponent = ComponentType<{ params?: ToolParams }>;

/**
 * Slug → Rechner-UI, jeder Rechner in seinem eigenen Chunk.
 *
 * Vorher standen hier 29 statische Importe. Weil ToolPageShell diese Datei
 * einbindet und die Route `/tools/[slug]` *eine* Route für alle Rechner ist,
 * landete der Code sämtlicher Rechner im Client-Bundle jeder Rechnerseite:
 * 424 KiB JavaScript, von denen der BMI-Rechner einen Bruchteil braucht.
 * Lighthouse wies davon über 600 KiB als ungenutzt aus.
 *
 * `next/dynamic` teilt nur dann in eigene Chunks, wenn der Import *in einem
 * Client-Modul* steht – aus einer Server-Component heraus unterstützt Next
 * kein automatisches Code-Splitting
 * (node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md). Deshalb
 * trägt diese Datei `"use client"` und nicht ToolPageShell.
 *
 * Vorgerendert wird weiterhin: `ssr` bleibt an, das HTML des Rechners steht
 * im Export, und Next lädt den passenden Chunk vor der Hydration vor. Es
 * verschiebt sich nichts und es blitzt kein Ladezustand auf.
 *
 * Getrennt vom Manifest bleibt die Liste aus dem alten Grund: registry.ts ist
 * reine Daten und für Navigation, Sitemap und Footer gefahrlos zu importieren.
 *
 * tools/components.test.ts hält die Liste mit registry.ts synchron.
 */
export const toolComponents: Record<string, ToolComponent> = {
  abfindung: dynamic(() => import("./abfindung/Component")),
  aktienkennzahlen: dynamic(() => import("./aktienkennzahlen/Component")),
  arbeitstage: dynamic(() => import("./arbeitstage/Component")),
  autokosten: dynamic(() => import("./autokosten/Component")),
  backform: dynamic(() => import("./backform/Component")),
  bmi: dynamic(() => import("./bmi/Component")),
  brueckentage: dynamic(() => import("./brueckentage/Component")),
  bruttonetto: dynamic(() => import("./bruttonetto/Component")),
  elterngeld: dynamic(() => import("./elterngeld/Component")),
  elternzeit: dynamic(() => import("./elternzeit/Component")),
  energiekosten: dynamic(() => import("./energiekosten/Component")),
  erbschaftsteuer: dynamic(() => import("./erbschaftsteuer/Component")),
  geburtstermin: dynamic(() => import("./geburtstermin/Component")),
  immobilienrechner: dynamic(() => import("./immobilienrechner/Component")),
  kalorienbedarf: dynamic(() => import("./kalorienbedarf/Component")),
  kindergeld: dynamic(() => import("./kindergeld/Component")),
  kreditrechner: dynamic(() => import("./kreditrechner/Component")),
  kuendigungsfrist: dynamic(() => import("./kuendigungsfrist/Component")),
  lesezeit: dynamic(() => import("./lesezeit/Component")),
  partymengen: dynamic(() => import("./partymengen/Component")),
  prozentrechner: dynamic(() => import("./prozentrechner/Component")),
  rentenabschlag: dynamic(() => import("./rentenabschlag/Component")),
  rentenluecke: dynamic(() => import("./rentenluecke/Component")),
  sparplan: dynamic(() => import("./sparplan/Component")),
  stromkosten: dynamic(() => import("./stromkosten/Component")),
  trinkgeld: dynamic(() => import("./trinkgeld/Component")),
  umzug: dynamic(() => import("./umzug/Component")),
  urlaubsbudget: dynamic(() => import("./urlaubsbudget/Component")),
  versicherungsvergleich: dynamic(
    () => import("./versicherungsvergleich/Component"),
  ),
};

/** Rendert den Rechner zu einem Slug – die einzige Stelle, die ToolPageShell braucht. */
export function ToolRenderer({
  slug,
  params,
}: {
  slug: string;
  params?: ToolParams;
}) {
  const Component = toolComponents[slug];
  return Component ? <Component params={params} /> : null;
}
