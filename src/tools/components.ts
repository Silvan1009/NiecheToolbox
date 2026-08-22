import type { ComponentType } from "react";
import abfindung from "./abfindung/Component";
import aktienkennzahlen from "./aktienkennzahlen/Component";
import arbeitstage from "./arbeitstage/Component";
import autokosten from "./autokosten/Component";
import backform from "./backform/Component";
import bmi from "./bmi/Component";
import brueckentage from "./brueckentage/Component";
import bruttonetto from "./bruttonetto/Component";
import elterngeld from "./elterngeld/Component";
import elternzeit from "./elternzeit/Component";
import energiekosten from "./energiekosten/Component";
import erbschaftsteuer from "./erbschaftsteuer/Component";
import geburtstermin from "./geburtstermin/Component";
import immobilienrechner from "./immobilienrechner/Component";
import kalorienbedarf from "./kalorienbedarf/Component";
import kindergeld from "./kindergeld/Component";
import kreditrechner from "./kreditrechner/Component";
import kuendigungsfrist from "./kuendigungsfrist/Component";
import lesezeit from "./lesezeit/Component";
import partymengen from "./partymengen/Component";
import prozentrechner from "./prozentrechner/Component";
import rentenabschlag from "./rentenabschlag/Component";
import rentenluecke from "./rentenluecke/Component";
import sparplan from "./sparplan/Component";
import stromkosten from "./stromkosten/Component";
import trinkgeld from "./trinkgeld/Component";
import umzug from "./umzug/Component";
import urlaubsbudget from "./urlaubsbudget/Component";
import versicherungsvergleich from "./versicherungsvergleich/Component";
import type { ToolParams } from "./types";

/**
 * Slug → Rechner-UI. Bewusst getrennt vom Manifest.
 *
 * Jede Component ist ein `'use client'`-Modul. Stünde sie wie früher im
 * Manifest, zöge jeder Import von registry.ts alle 28 Components in den
 * Client-Graph der importierenden Route – und weil SiteFooter.tsx im
 * Root-Layout die Tool-Liste aus der Registry holt, galt das für *jede* Seite.
 * Gemessen am Export: ein 405-KB-Chunk mit sämtlicher Rechnerlogik lag als
 * `<script async>` auf /ueber und /rechtliches/impressum, wo überhaupt kein
 * Rechner steht. Genau davor warnt schon der Kommentar in lib/searchIndex.ts.
 *
 * Diese Datei importiert deshalb nur, wer wirklich einen Rechner rendert:
 * ToolPageShell.tsx, und damit ausschließlich die beiden Tool-Routen.
 * registry.ts bleibt reine Daten und ist für Navigation, Sitemap und Footer
 * gefahrlos zu importieren.
 *
 * Kein `next/dynamic`: Beim Import einer Client-Component aus einer
 * Server-Component unterstützt Next kein automatisches Code-Splitting
 * (node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md). Ein
 * `dynamic()` hier brächte also keinen weiteren Chunk, nur eine
 * Suspense-Grenze.
 *
 * tools/components.test.ts hält die Liste mit registry.ts synchron.
 */
export const toolComponents: Record<
  string,
  ComponentType<{ params?: ToolParams }>
> = {
  abfindung,
  aktienkennzahlen,
  arbeitstage,
  autokosten,
  backform,
  bmi,
  brueckentage,
  bruttonetto,
  elterngeld,
  elternzeit,
  energiekosten,
  erbschaftsteuer,
  geburtstermin,
  immobilienrechner,
  kalorienbedarf,
  kindergeld,
  kreditrechner,
  kuendigungsfrist,
  lesezeit,
  partymengen,
  prozentrechner,
  rentenabschlag,
  rentenluecke,
  sparplan,
  stromkosten,
  trinkgeld,
  umzug,
  urlaubsbudget,
  versicherungsvergleich,
};
