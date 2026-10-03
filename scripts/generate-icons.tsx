import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { site } from "@/config/site";

/**
 * Erzeugt die Seitensymbole aus dem Markenzeichen: ein violettes Quadrat mit
 * abgerundeten Ecken und dem Anfangsbuchstaben des Seitennamens – dasselbe
 * Zeichen wie `.brand-mark` im Kopf der Seite.
 *
 * NICHT Teil des Builds. Die Symbole ändern sich nur, wenn sich Name oder
 * Akzentfarbe ändern; dann einmal von Hand ausführen und das Ergebnis
 * einchecken:
 *
 *   npx tsx scripts/generate-icons.tsx
 *
 * Entstanden, weil unter `src/app/favicon.ico` noch das Standard-Symbol von
 * create-next-app lag – der schwarze Kreis mit dem Dreieck, im Browser-Tab und
 * neben jedem Suchergebnis.
 *
 * Next findet die Dateien über ihren Namen (`icon.png`, `apple-icon.png`,
 * `favicon.ico` in `src/app/`) und setzt die passenden <link>-Tags selbst.
 */

const APP_DIR = join(process.cwd(), "src", "app");
const ACCENT = "#6C4CE0";
const LETTER = site.name.charAt(0);

/**
 * @param size   Kantenlänge in Pixeln.
 * @param radius Eckenradius als Anteil der Kante. 0 für das Apple-Symbol –
 *               iOS rundet selbst und zeigte sonst zwei Rundungen ineinander.
 */
async function render(size: number, radius: number): Promise<Buffer> {
  const response = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ACCENT,
        borderRadius: size * radius,
        color: "#FFFFFF",
        fontSize: size * 0.62,
        // Der Buchstabe sitzt optisch etwas zu hoch, wenn er rechnerisch
        // mittig steht – die Oberlänge wiegt schwerer als die fehlende
        // Unterlänge.
        paddingTop: size * 0.02,
      }}
    >
      {LETTER}
    </div>,
    { width: size, height: size },
  );
  const raw = Buffer.from(await response.arrayBuffer());
  return sharp(raw).png({ compressionLevel: 9, palette: true }).toBuffer();
}

/**
 * ICO-Container mit eingebetteten PNGs. Das Format erlaubt PNG-Daten seit
 * Windows Vista, alle heutigen Browser lesen es – und es spart einen
 * BMP-Encoder.
 */
function ico(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserviert
  header.writeUInt16LE(1, 2); // Typ: Icon
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;
  images.forEach(({ size, png }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, entry); // Breite
    directory.writeUInt8(size >= 256 ? 0 : size, entry + 1); // Höhe
    directory.writeUInt8(0, entry + 2); // Farbpalette
    directory.writeUInt8(0, entry + 3); // reserviert
    directory.writeUInt16LE(1, entry + 4); // Farbebenen
    directory.writeUInt16LE(32, entry + 6); // Bit pro Pixel
    directory.writeUInt32LE(png.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });

  return Buffer.concat([header, directory, ...images.map(({ png }) => png)]);
}

async function main() {
  writeFileSync(join(APP_DIR, "icon.png"), await render(512, 0.22));
  writeFileSync(join(APP_DIR, "apple-icon.png"), await render(180, 0));

  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map(async (size) => ({ size, png: await render(size, 0.22) })),
  );
  writeFileSync(join(APP_DIR, "favicon.ico"), ico(images));

  console.log("icon.png, apple-icon.png und favicon.ico geschrieben.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
