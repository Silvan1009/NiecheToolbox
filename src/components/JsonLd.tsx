/** Strukturierte Daten. Ein Script-Tag pro Seite, alles im @graph. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify erzeugt hier ausschließlich Daten aus dem Manifest.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
