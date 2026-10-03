import type { ContentBlock, ContentSection } from "@/tools/types";

/**
 * Rendert den ausführlichen Teil einer Seite aus `ContentSection[]`.
 *
 * Kein Markdown, kein `dangerouslySetInnerHTML`: Die Blöcke sind eine
 * geschlossene, typgeprüfte Menge, jeder mit genau einer Darstellung. Was der
 * Typ nicht hergibt, kann hier auch nicht schiefgehen.
 *
 * Die Überschriften sind <h2> – auf derselben Stufe wie „So funktioniert’s“
 * und „Häufige Fragen“, denn sie stehen im selben Abschnittsrang. Über ihnen
 * steht nur das <h1> der Seite.
 */
export function Prose({ sections }: { sections?: ContentSection[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        // `data-prose` grenzt den redaktionellen Teil vom Rahmen ab –
        // scripts/content-audit.ts misst genau diese Bereiche und nicht
        // Kopfzeile, Fußzeile oder die Beschriftungen des Rechners.
        <section
          key={section.heading}
          data-prose
          aria-labelledby={headingId(section)}
        >
          <h2 id={headingId(section)} className="section-title">
            {section.heading}
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-[17px] leading-relaxed text-muted">
            {section.blocks.map((block, index) => (
              <Block key={blockKey(block, index)} block={block} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

/**
 * Aus der Überschrift, damit Sprungmarken stabil bleiben: Sie ändern sich nur,
 * wenn sich die Überschrift selbst ändert – nicht bei jedem Umsortieren.
 */
function headingId(section: ContentSection): string {
  return `abschnitt-${slugify(section.heading)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Der Index gehört in den Schlüssel: Zwei Absätze mit gleichem Anfang sind in
 * einem langen Text nichts Ungewöhnliches, zwei gleiche Schlüssel dagegen ein
 * Fehler.
 */
function blockKey(block: ContentBlock, index: number): string {
  return `${index}-${block.type}`;
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;

    case "ul":
      return (
        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-line">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="flex list-decimal flex-col gap-2 pl-5 marker:font-semibold marker:text-muted">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );

    case "note":
      return (
        <p className="rounded-control border-l-2 border-accent bg-accent-soft px-4 py-3 text-[15px]">
          {block.text}
        </p>
      );

    case "table":
      return (
        // Breite Tabellen scrollen in ihrem eigenen Kasten, damit nie die
        // ganze Seite seitlich wandert.
        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[28rem] border-collapse text-left text-[15px]">
            {block.caption && (
              <caption className="mb-2 text-left text-[13px] text-muted">
                {block.caption}
              </caption>
            )}
            <thead>
              <tr className="border-b border-line">
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="py-2 pr-4 font-semibold text-ink"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-line/60">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cellIndex}-${cell}`}
                      className={
                        cellIndex === 0
                          ? "py-2 pr-4 font-medium text-ink"
                          : "py-2 pr-4 tabular-nums"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "links":
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-link"
                // Quellen zeigen nach außen: Referrer sparsam halten und das
                // Zielfenster vom eigenen Kontext trennen.
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
              {item.note && <span className="text-[15px]"> – {item.note}</span>}
            </li>
          ))}
        </ul>
      );
  }
}
