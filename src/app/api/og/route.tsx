import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/**
 * Dynamisches Open-Graph-Bild für teilbare Links.
 *
 * Die Gestaltung folgt den Design-Tokens: kühles Fast-Weiß, warmes
 * Tinten-Schwarz, ein violetter Akzent. Satori (der Renderer hinter
 * ImageResponse) versteht nur ein Flexbox-Subset von CSS – daher alles
 * als Inline-Styles mit expliziten `display: flex`.
 */

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

const TITLE_MAX = 90;
const SUBTITLE_MAX = 140;

/** Steuerzeichen entfernen und kürzen – die Route ist öffentlich aufrufbar. */
function clean(value: string | null, fallback: string, max: number): string {
  const raw = (value ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  const text = raw.length > 0 ? raw : fallback;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clean(searchParams.get("title"), site.name, TITLE_MAX);
  const subtitle = clean(
    searchParams.get("subtitle"),
    site.tagline,
    SUBTITLE_MAX,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#FBFBFE",
        }}
      >
        {/* Akzentkante links – das Wiedererkennungszeichen. */}
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
      </div>
    ),
    size,
  );
}
