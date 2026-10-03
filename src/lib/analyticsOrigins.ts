/**
 * Welche Hosts die Reichweitenmessung braucht – getrennt nach „lädt das
 * Skript“ und „empfängt die Messpunkte“.
 *
 * Die Trennung ist der ganze Zweck dieser Datei. Umami Cloud liefert das
 * Skript von cloud.umami.is aus, das Skript selbst schickt jeden Seitenaufruf
 * aber an gateway.umami.is. Stand nur der erste Host in der CSP, lud das
 * Skript fehlerfrei und jeder Messpunkt wurde anschließend von `connect-src`
 * blockiert: keine Fehlermeldung für Besucher, keine Zahl im Dashboard.
 *
 * Ohne Abhängigkeit zu `next` oder zum `@/`-Alias, weil die Build-Skripte
 * (generate-htaccess.ts, check-live.ts) diese Datei direkt laden.
 */

export interface AnalyticsOrigins {
  /** Origin, von dem das Skript geladen wird – gehört in `script-src`. */
  script: string | null;
  /** Origins, an die gesendet wird – gehören in `connect-src`. */
  connect: string[];
}

/**
 * Sende-Hosts, die vom Skript-Host abweichen. Selbst gehostete Instanzen
 * senden an ihren eigenen Origin und brauchen hier keinen Eintrag.
 */
const SEND_HOSTS_BY_SCRIPT_HOST: Record<string, string[]> = {
  "cloud.umami.is": ["https://gateway.umami.is"],
};

type Env = Record<string, string | undefined>;

export function analyticsOrigins(env: Env = process.env): AnalyticsOrigins {
  const provider = env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none";
  if (provider === "none") return { script: null, connect: [] };

  const url =
    provider === "umami"
      ? env.NEXT_PUBLIC_UMAMI_SCRIPT_URL
      : (env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ??
        "https://plausible.io/js/script.js");
  if (!url) return { script: null, connect: [] };

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { script: null, connect: [] };
  }

  return {
    script: parsed.origin,
    connect: SEND_HOSTS_BY_SCRIPT_HOST[parsed.hostname] ?? [],
  };
}
