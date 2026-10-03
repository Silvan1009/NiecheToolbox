import { describe, expect, it } from "vitest";
import { analyticsOrigins } from "./analyticsOrigins";

describe("analyticsOrigins", () => {
  it("liefert ohne Anbieter nichts", () => {
    expect(analyticsOrigins({})).toEqual({ script: null, connect: [] });
    expect(
      analyticsOrigins({ NEXT_PUBLIC_ANALYTICS_PROVIDER: "none" }),
    ).toEqual({ script: null, connect: [] });
  });

  // Regressionstest: Skript-Host und Sende-Host sind bei Umami Cloud
  // verschieden. Nur den ersten zu kennen, hat jede Messung blockiert.
  it("kennt bei Umami Cloud den abweichenden Sende-Host", () => {
    expect(
      analyticsOrigins({
        NEXT_PUBLIC_ANALYTICS_PROVIDER: "umami",
        NEXT_PUBLIC_UMAMI_SCRIPT_URL: "https://cloud.umami.is/script.js",
      }),
    ).toEqual({
      script: "https://cloud.umami.is",
      connect: ["https://gateway.umami.is"],
    });
  });

  it("braucht für eine selbst gehostete Instanz keinen zweiten Host", () => {
    expect(
      analyticsOrigins({
        NEXT_PUBLIC_ANALYTICS_PROVIDER: "umami",
        NEXT_PUBLIC_UMAMI_SCRIPT_URL: "https://stats.example.org/script.js",
      }),
    ).toEqual({ script: "https://stats.example.org", connect: [] });
  });

  it("fällt bei Plausible auf den Standard-Host zurück", () => {
    expect(
      analyticsOrigins({ NEXT_PUBLIC_ANALYTICS_PROVIDER: "plausible" }),
    ).toEqual({ script: "https://plausible.io", connect: [] });
  });

  it("übersteht eine kaputte URL", () => {
    expect(
      analyticsOrigins({
        NEXT_PUBLIC_ANALYTICS_PROVIDER: "umami",
        NEXT_PUBLIC_UMAMI_SCRIPT_URL: "kein-url",
      }),
    ).toEqual({ script: null, connect: [] });
  });
});
