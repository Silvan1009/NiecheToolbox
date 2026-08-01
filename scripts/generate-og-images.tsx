import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { toolSeo } from "@/lib/seo";
import { publicTools } from "@/tools/registry";

/**
 * Erzeugt die OG-Bilder einmalig beim Build als PNG-Dateien unter public/og/.
 *
 * Ersetzt die frühere Route `app/api/og/route.tsx`: bei `output: "export"`
 * gibt es keinen Server mehr, der pro Request ein Bild rendern könnte. Titel
 * und Untertitel stammen ohnehin nur aus der Tool-Registry – eine zur
 * Build-Zeit bekannte, endliche Menge –, also lässt sich jedes Bild einmal
 * hier erzeugen statt live nachzufragen.
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
            N
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
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(join(OUT_DIR, fileName), buffer);
  console.log(`  ${fileName}`);
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  console.log("OG-Bilder werden generiert...");

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

  console.log("Fertig.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
