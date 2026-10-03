import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { BugReportButton } from "@/components/BugReportButton";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageStand, sourcesSection } from "@/components/PageStand";
import { Prose } from "@/components/Prose";
import { WegSourceTools } from "@/components/WegSourceTools";
import { site } from "@/config/site";
import { lastModified, lastModifiedKey } from "@/lib/lastModified";
import {
  applicationNode,
  breadcrumbNode,
  faqNode,
  jsonLdGraph,
  ogImagePath,
  siteNodes,
  webPageNode,
  wegPath,
  wegSeo,
} from "@/lib/seo";
import { WegRenderer } from "@/wege/components";
import type { WegManifest } from "@/wege/types";
import type { ToolVariant } from "@/tools/types";

/**
 * Generischer Rahmen für jede Weg- und Variantenseite – Gegenstück zu
 * ToolPageShell.tsx, mit denselben Bausteinen (Brotkrumen, AdSlot, Erklärtext,
 * FAQ, JSON-LD), aber eigenem Pfadraum (`/wege/` statt `/tools/`) und eigener
 * Component-Registry (wege/components.tsx statt tools/components.tsx).
 *
 * Bewusst ohne RelatedTools: Ein Weg verlinkt seine Quell-Tools bereits
 * gezielt im Urteil selbst (WegCallout), eine zusätzliche generische
 * "Passt dazu"-Liste über andere Wege ergäbe bei nur einem Weg keinen Sinn.
 */
export function WegPageShell({
  weg,
  variant,
}: {
  weg: WegManifest;
  variant?: ToolVariant;
}) {
  const { title, heading, description, lead, path } = wegSeo(weg, variant);
  const density = weg.monetization?.adDensity ?? "low";
  const updated = lastModified(lastModifiedKey.weg(weg.slug));

  const about = variant?.about ?? weg.about;
  const faq = variant?.faq ?? weg.faq;
  // Auf der Weg-Seite selbst (kein variant) die eigenen sections des Wegs;
  // auf einer Variantenseite kein Fallback darauf – siehe ToolPageShell.tsx.
  const sections = [
    ...((variant ? variant.sections : weg.sections) ?? []),
    ...sourcesSection(weg.sources),
  ];

  const params = { ...weg.getDefaultParams?.(), ...variant?.params };

  const crumbs = [
    { name: "Start", path: "/" },
    { name: weg.name, path: wegPath(weg.slug) },
    ...(variant ? [{ name: heading, path }] : []),
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
      <div className="tool-column flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Brotkrumen">
          <ol className="flex flex-wrap items-center gap-1 field-hint">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li key={crumb.path} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  )}
                  {isLast ? (
                    <span aria-current="page">{crumb.name}</span>
                  ) : (
                    <Link
                      prefetch={false}
                      href={crumb.path}
                      className="link-hover-ink"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {site.bugReportEnabled && <BugReportButton toolName={weg.name} />}
      </div>

      <header className="tool-column mt-6 text-center">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.75rem)] font-bold tracking-tight">
          {heading}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">{lead}</p>
      </header>

      <div className="tool-column mt-10">
        {/* Die Liste der verketteten Rechner entsteht hier auf dem Server und
            wird als fertiger Knoten hineingereicht. Importierte der Weg sie
            selbst, zöge er die Tool-Registry – die Texte aller 29 Rechner –
            in sein Client-Bundle: 461 KiB auf jeder Weg-Seite. */}
        <WegRenderer
          slug={weg.slug}
          params={params}
          sourceTools={<WegSourceTools tools={weg.sourceTools} />}
        />
      </div>

      <div className="tool-column mt-10">
        <AdSlot placement="below-result" density={density} />
      </div>

      <div className="tool-column mt-14 flex flex-col gap-12">
        {about && about.length > 0 && (
          <section data-prose aria-labelledby="about-heading">
            <h2 id="about-heading" className="section-title">
              So funktioniert’s
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-[17px] leading-relaxed text-muted">
              {about.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        <Prose sections={sections} />

        {faq && faq.length > 0 && <Faq entries={faq} />}

        <PageStand date={updated} />

        <AdSlot placement="below-content" density={density} />

        {variant && (
          <p className="text-sm text-muted">
            <Link
              prefetch={false}
              href={wegPath(weg.slug)}
              className="text-link"
            >
              Zum {weg.name} mit allen Einstellungen
            </Link>
          </p>
        )}
      </div>

      <JsonLd
        data={jsonLdGraph([
          ...siteNodes(),
          webPageNode({
            name: title,
            description,
            path,
            image: ogImagePath(weg.slug, variant?.slug),
            dateModified: updated,
          }),
          applicationNode({ name: heading, description, path }),
          breadcrumbNode(crumbs),
          ...(faq && faq.length > 0 ? [faqNode(faq)] : []),
        ])}
      />
    </div>
  );
}
