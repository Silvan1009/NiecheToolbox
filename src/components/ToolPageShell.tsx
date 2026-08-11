import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { BugReportButton } from "@/components/BugReportButton";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { RelatedTools } from "@/components/RelatedTools";
import { site } from "@/config/site";
import {
  breadcrumbNode,
  faqNode,
  jsonLdGraph,
  toolNode,
  toolPath,
  toolSeo,
} from "@/lib/seo";
import { toolComponents } from "@/tools/components";
import type { ToolManifest, ToolVariant } from "@/tools/types";

/**
 * Generischer Rahmen für jede Tool- und Variantenseite.
 *
 * Alles hier ist aus dem Manifest abgeleitet – ein neues Tool braucht keine
 * eigene Seite und keine Änderung an dieser Datei.
 *
 * Werbeplatzierung: ein Slot unter dem Tool (also unter dem Ergebnis und der
 * Ergebnisliste), optional ein zweiter unter dem Erklärtext. Nie über dem Tool,
 * nie zwischen Eingabefeldern.
 */
export function ToolPageShell({
  tool,
  variant,
}: {
  tool: ToolManifest;
  variant?: ToolVariant;
}) {
  const { heading, description, path } = toolSeo(tool, variant);
  const density = tool.monetization?.adDensity ?? "low";
  const Component = toolComponents[tool.slug];

  // Eine Variante darf eigenen Text mitbringen. Tut sie es nicht, gilt der des
  // Tools – so bleiben alle bestehenden Varianten unverändert.
  const about = variant?.about ?? tool.about;
  const faq = variant?.faq ?? tool.faq;

  // Startparameter: Laufzeit-Defaults vom Server, von der Variante überschrieben.
  const params = { ...tool.getDefaultParams?.(), ...variant?.params };

  const crumbs = [
    { name: "Start", path: "/" },
    { name: tool.name, path: toolPath(tool.slug) },
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
                    <Link href={crumb.path} className="link-hover-ink">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {site.bugReportEnabled && <BugReportButton toolName={tool.name} />}
      </div>

      <header className="tool-column mt-6 text-center">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.75rem)] font-bold tracking-tight">
          {heading}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
          {description}
        </p>
      </header>

      <div className="tool-column mt-10">
        <Component params={params} />
      </div>

      <div className="tool-column mt-10">
        <AdSlot placement="below-result" density={density} />
      </div>

      <div className="tool-column mt-14 flex flex-col gap-12">
        {about && about.length > 0 && (
          <section aria-labelledby="about-heading">
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

        {faq && faq.length > 0 && <Faq entries={faq} />}

        <AdSlot placement="below-content" density={density} />

        <RelatedTools slug={tool.slug} />

        {variant && (
          <p className="text-sm text-muted">
            <Link
              href={toolPath(tool.slug)}
              className="underline decoration-line underline-offset-2 hover:text-ink"
            >
              Zum {tool.name} mit allen Einstellungen
            </Link>
          </p>
        )}
      </div>

      <JsonLd
        data={jsonLdGraph([
          toolNode(tool, { name: heading, description, path }),
          breadcrumbNode(crumbs),
          ...(faq && faq.length > 0 ? [faqNode(faq)] : []),
        ])}
      />
    </div>
  );
}
