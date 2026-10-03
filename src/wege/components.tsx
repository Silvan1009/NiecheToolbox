"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";
import type { ToolParams } from "@/tools/types";

type WegComponent = ComponentType<{
  params?: ToolParams;
  sourceTools?: ReactNode;
}>;

/**
 * Slug → Weg-UI, jeder Weg in seinem eigenen Chunk.
 *
 * Derselbe Grund wie bei tools/components.tsx: Mit statischen Importen lud
 * jede Weg-Seite den Stepper-Code aller Wege samt der Rechenlogik aller darin
 * verketteten Rechner – 547 KiB in einem Chunk. `next/dynamic` in einem
 * Client-Modul teilt das je Weg auf; vorgerendert wird weiterhin.
 *
 * wege/components.test.ts hält die Liste mit registry.ts synchron.
 */
export const wegComponents: Record<string, WegComponent> = {
  autokauf: dynamic(() => import("./autokauf/Component")),
  gehalt: dynamic(() => import("./gehalt/Component")),
  hauskauf: dynamic(() => import("./hauskauf/Component")),
  nachwuchs: dynamic(() => import("./nachwuchs/Component")),
  ruhestand: dynamic(() => import("./ruhestand/Component")),
};

/** Rendert den Weg zu einem Slug – die einzige Stelle, die WegPageShell braucht. */
export function WegRenderer({
  slug,
  params,
  sourceTools,
}: {
  slug: string;
  params?: ToolParams;
  /** Vom Server gerenderte Liste der verketteten Rechner. */
  sourceTools?: ReactNode;
}) {
  const Component = wegComponents[slug];
  return Component ? (
    <Component params={params} sourceTools={sourceTools} />
  ) : null;
}
