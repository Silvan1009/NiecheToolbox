import { ads } from "@/config/site";
import { buildAdsTxt } from "@/lib/adsTxt";

/**
 * /ads.txt – wer die Werbeplätze dieser Domain verkaufen darf.
 *
 * Liegt bewusst auf der Wurzel und nicht unter /api/: robots.ts sperrt /api/,
 * und Einkäufer erwarten die Datei ohnehin genau hier.
 *
 * `force-static` ist Pflicht – Route-Handler rendern sonst bei jedem Abruf neu,
 * und diese Datei wird von Crawlern regelmäßig geholt.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const body = buildAdsTxt(ads.clientId);

  // Ohne Publisher-ID lieber gar keine Datei als eine leere: Letztere lesen
  // manche Prüfer als „autorisiert niemanden".
  if (!body) return new Response(null, { status: 404 });

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
