import type { Metadata } from "next";
import { site } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { absoluteUrl, jsonLdGraph, toolPath, websiteNode } from "@/lib/seo";
import { publicTools } from "@/tools/registry";

export const metadata: Metadata = {
  title: `${site.name} – ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const tools = publicTools();

  return (
    <div className="mx-auto w-full max-w-5xl px-5">
      <section className="py-16 text-center sm:py-24">
        <h1 className="mx-auto max-w-2xl font-display text-[clamp(2rem,7vw,3.25rem)] font-bold tracking-tight">
          Kleine Rechner, die eine Frage wirklich beantworten.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Keine Anmeldung, keine Tabelle, kein Download. Werte eintragen,
          Ergebnis ablesen, Link teilen. Alles rechnet direkt in deinem Browser.
        </p>
      </section>

      <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-8">
        <h2
          id="tools-heading"
          className="font-display text-xl font-semibold tracking-tight"
        >
          Alle Rechner
        </h2>

        {tools.length === 0 ? (
          <p className="mt-4 text-muted">Bald geht es hier los.</p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <li key={tool.slug} className="flex">
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <JsonLd
        data={jsonLdGraph([
          websiteNode(),
          {
            "@type": "ItemList",
            name: `Alle Rechner auf ${site.name}`,
            numberOfItems: tools.length,
            itemListElement: tools.map((tool, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: tool.name,
              description: tool.tagline,
              url: absoluteUrl(toolPath(tool.slug)),
            })),
          },
        ])}
      />
    </div>
  );
}
