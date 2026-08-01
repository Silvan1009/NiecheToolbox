import Link from "next/link";
import { ads, analytics, site } from "@/config/site";
import { publicTools } from "@/tools/registry";
import { ConsentSettingsButton } from "./consent/ConsentSettingsButton";

export function SiteFooter() {
  const tools = publicTools();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line/80 bg-surface">
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-base font-semibold">{site.name}</p>
            <p className="mt-2 max-w-xs text-sm text-muted">{site.tagline}</p>
          </div>

          {tools.length > 0 && (
            <nav aria-labelledby="footer-tools">
              <h2
                id="footer-tools"
                className="text-xs font-semibold tracking-wide text-muted uppercase"
              >
                Rechner
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/rechner/"
                    className="font-medium text-ink transition-colors duration-(--dur-fast) hover:text-accent"
                  >
                    Rechner nach Thema
                  </Link>
                </li>
                {tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-muted transition-colors duration-(--dur-fast) hover:text-ink"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <nav aria-labelledby="footer-legal">
            <h2
              id="footer-legal"
              className="text-xs font-semibold tracking-wide text-muted uppercase"
            >
              Über &amp; Rechtliches
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link
                  href="/ueber/"
                  className="transition-colors duration-(--dur-fast) hover:text-ink"
                >
                  Über uns &amp; Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/rechtliches/impressum/"
                  className="transition-colors duration-(--dur-fast) hover:text-ink"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/rechtliches/datenschutz/"
                  className="transition-colors duration-(--dur-fast) hover:text-ink"
                >
                  Datenschutz
                </Link>
              </li>
              {/* Ohne konfigurierte Werbung gibt es nichts zu widerrufen –
                  dann entfällt der Listenpunkt ganz statt leer zu bleiben. */}
              {ads.enabled && ads.clientId && (
                <li>
                  <ConsentSettingsButton />
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-xs text-muted">
          <p>
            © {year} {site.name}. Alle Berechnungen laufen direkt in deinem
            Browser – wir speichern keine Eingaben.
            {analytics.provider !== "none" &&
              " Die Reichweitenmessung ist cookiefrei und anonym."}
          </p>
          <p className="mt-2">
            Ergebnisse sind unverbindliche Orientierung und keine Rechts-,
            Steuer- oder Finanzberatung.
          </p>
        </div>
      </div>
    </footer>
  );
}
