import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { site } from "@/config/site";
import {
  STATIC_OG_PREFIX,
  toolSeo,
  wegSeo,
  type StaticPageKey,
} from "@/lib/seo";
import { publicTools } from "@/tools/registry";
import { publicWege } from "@/wege/registry";

/**
 * Erzeugt die OG-Bilder einmalig beim Build als PNG-Dateien unter public/og/.
 *
 * Ersetzt die frühere Route `app/api/og/route.tsx`: bei `output: "export"`
 * gibt es keinen Server mehr, der pro Request ein Bild rendern könnte. Titel
 * und Untertitel stammen ohnehin nur aus der Tool-Registry – eine zur
 * Build-Zeit bekannte, endliche Menge –, also lässt sich jedes Bild einmal
 * hier erzeugen statt live nachzufragen.
 *
 * `ImageResponse` (resvg) liefert True-Color-PNGs ohne Palette-Optimierung.
 * Das Layout kommt mit einer Handvoll Flächenfarben aus, daher komprimiert
 * sharp verlustfrei auf eine Palette nach – rund 60 % kleiner, pixelgleich.
 */

const OUT_DIR = join(process.cwd(), "public", "og");
const SIZE = { width: 1200, height: 630 };

function renderImage(title: string, subtitle: string) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#FBFBFE",
      }}
    >
      <div
        style={{
          width: 20,
          height: "100%",
          display: "flex",
          backgroundColor: "#6C4CE0",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              fontWeight: 700,
              color: "#17161C",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#6A6975",
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 28,
            borderTop: "1px solid #ECECF3",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "#6C4CE0",
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {site.name.charAt(0)}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#17161C",
              display: "flex",
            }}
          >
            {site.name}
          </div>
          <div style={{ fontSize: 24, color: "#6A6975", display: "flex" }}>
            · kostenlos, ohne Anmeldung
          </div>
        </div>
      </div>
    </div>,
    SIZE,
  );
}

async function writeImage(fileName: string, title: string, subtitle: string) {
  const response = renderImage(title, subtitle);
  const rawBuffer = Buffer.from(await response.arrayBuffer());
  const buffer = await sharp(rawBuffer)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  writeFileSync(join(OUT_DIR, fileName), buffer);
  console.log(`  ${fileName}`);
}

/**
 * Vorschaubilder für die Seiten ohne Manifest. Vorher hatten Startseite,
 * Übersichten, Über uns und die Rechtsseiten gar kein `og:image` – ein
 * geteilter Link zeigte dort eine leere Kachel.
 */
const STATIC_PAGES: Record<StaticPageKey, { title: string; subtitle: string }> =
  {
    start: { title: site.name, subtitle: site.tagline },
    rechner: {
      title: "Rechner nach Thema",
      subtitle:
        "Alle Rechner, sortiert nach dem Anlass, für den du sie brauchst.",
    },
    wege: {
      title: "Wege",
      subtitle:
        "Mehrere Rechner zu einem Urteil kombiniert, statt einer Zahl allein.",
    },
    ueber: {
      title: `Über ${site.name}`,
      subtitle:
        "Wer dahintersteht, wie die Rechner entstehen und geprüft werden.",
    },
    rechtliches: {
      title: "Impressum & Datenschutz",
      subtitle: `Rechtliche Angaben zu ${site.name}.`,
    },
  };

async function main() {
  // Erst leeren: Bilder eingeschmolzener oder umbenannter Seiten blieben sonst
  // liegen und wanderten mit in den Export.
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("OG-Bilder werden generiert...");

  for (const [key, page] of Object.entries(STATIC_PAGES)) {
    await writeImage(
      `${STATIC_OG_PREFIX}${key}.png`,
      page.title,
      page.subtitle,
    );
  }

  for (const tool of publicTools()) {
    const { heading } = toolSeo(tool);
    await writeImage(`${tool.slug}.png`, heading, tool.tagline);

    for (const variant of tool.getVariants?.() ?? []) {
      const { heading: variantHeading } = toolSeo(tool, variant);
      await writeImage(
        `${tool.slug}--${variant.slug}.png`,
        variantHeading,
        tool.name,
      );
    }
  }

  for (const weg of publicWege()) {
    const { heading } = wegSeo(weg);
    await writeImage(`${weg.slug}.png`, heading, weg.tagline);

    for (const variant of weg.getVariants?.() ?? []) {
      const { heading: variantHeading } = wegSeo(weg, variant);
      await writeImage(
        `${weg.slug}--${variant.slug}.png`,
        variantHeading,
        weg.name,
      );
    }
  }

  console.log("Fertig.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
