import type { ComponentType } from "react";
import type { ToolParams } from "@/tools/types";
import autokauf from "./autokauf/Component";
import gehalt from "./gehalt/Component";
import hauskauf from "./hauskauf/Component";
import nachwuchs from "./nachwuchs/Component";
import ruhestand from "./ruhestand/Component";

/**
 * Slug → Weg-UI. Bewusst getrennt von der Registry.
 *
 * Derselbe Grund wie bei tools/components.ts: Jede Component ist ein
 * `'use client'`-Modul. Stünde sie im Manifest, zöge jeder Import von
 * registry.ts (z. B. aus der Sitemap oder der Startseite) den kompletten
 * Stepper-Client-Code mit sich. Diese Datei importiert deshalb nur, wer
 * wirklich einen Weg rendert: WegPageShell.tsx, und damit ausschließlich die
 * Wege-Route.
 *
 * wege/components.test.ts hält die Liste mit registry.ts synchron.
 */
export const wegComponents: Record<
  string,
  ComponentType<{ params?: ToolParams }>
> = {
  hauskauf,
  gehalt,
  ruhestand,
  autokauf,
  nachwuchs,
};
