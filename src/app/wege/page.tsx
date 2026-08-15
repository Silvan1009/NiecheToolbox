import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { WegCard } from "@/components/WegCard";
import { site } from "@/config/site";
import { absoluteUrl, breadcrumbNode, jsonLdGraph, wegPath } from "@/lib/seo";
import { publicWege } from "@/wege/registry";

/**
 * Übersicht aller Wege – Gegenstück zu /rechner für Wege statt Tools. Heute
 * nur über den Abschnitt auf der Startseite erreichbar; diese Seite macht
 * /wege/ selbst verlinkbar und indexierbar.
 */
export const metadata: Metadata = {
  title: "Wege – mehrere Rechner zu einem Urteil",
  description:
    "Jeder Weg verkettet mehrere Rechner der Rechnerkiste zu einem Urteil, statt einer isolierten Zahl.",
  alternates: { canonical: "/wege/" },
};

export default function WegePage() {
  const wege = publicWege();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div className="tool-column">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight">
          Wege
        </h1>
        <p className="mt-3 text-lg text-muted">
          Ein Weg kombiniert mehrere Rechner zu einem Urteil: komfortabel,
          tragbar oder eng – statt einer Zahl allein.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wege.map((weg) => (
          <li key={weg.slug} className="flex">
            <WegCard weg={weg} />
          </li>
        ))}
      </ul>

      <JsonLd
        data={jsonLdGraph([
          {
            "@type": "CollectionPage",
            name: "Wege",
            url: absoluteUrl("/wege/"),
            inLanguage: "de-DE",
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
            hasPart: wege.map((weg) => ({
              "@type": "WebApplication",
              name: weg.name,
              url: absoluteUrl(wegPath(weg.slug)),
            })),
          },
          breadcrumbNode([
            { name: site.name, path: "/" },
            { name: "Wege", path: "/wege/" },
          ]),
        ])}
      />
    </div>
  );
}
