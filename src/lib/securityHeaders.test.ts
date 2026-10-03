import { describe, expect, it } from "vitest";
import { securityHeaders } from "./securityHeaders";

function headerValue(
  headers: ReturnType<typeof securityHeaders>,
  key: string,
): string | undefined {
  return headers.find((h) => h.key.toLowerCase() === key.toLowerCase())?.value;
}

function csp(options: Parameters<typeof securityHeaders>[0] = {}): string {
  const headers = securityHeaders(options);
  return (
    headerValue(headers, "Content-Security-Policy-Report-Only") ??
    headerValue(headers, "Content-Security-Policy") ??
    ""
  );
}

describe("securityHeaders", () => {
  describe("Permissions-Policy", () => {
    const value = () =>
      headerValue(securityHeaders(), "Permissions-Policy") ?? "";

    // Der wichtigste Test dieser Datei. Ein restriktiver Permissions-Policy-
    // Header schaltet die Privacy-Sandbox-Signale still ab: keine Warnung,
    // kein Fehler, nur weniger Umsatz. Wer hier etwas entfernt, soll es merken.
    it.each([
      "browsing-topics",
      "attribution-reporting",
      "private-state-token-issuance",
      "private-state-token-redemption",
      "join-ad-interest-group",
      "run-ad-auction",
    ])("gibt %s an Googles Werbe-Origins frei", (feature) => {
      const match = value().match(new RegExp(`${feature}=\\(([^)]*)\\)`));
      expect(match, `${feature} fehlt im Header`).not.toBeNull();
      expect(match?.[1].trim(), `${feature} hat eine leere Allowlist`).not.toBe(
        "",
      );
      expect(match?.[1]).toContain("googlesyndication.com");
    });

    it("verbietet, was die Seite nie braucht", () => {
      for (const feature of [
        "camera",
        "microphone",
        "geolocation",
        "payment",
      ]) {
        expect(value()).toContain(`${feature}=()`);
      }
    });
  });

  describe("Content Security Policy", () => {
    it("läuft standardmäßig nur im Report-Modus", () => {
      const headers = securityHeaders();
      expect(
        headerValue(headers, "Content-Security-Policy-Report-Only"),
      ).toBeDefined();
      expect(headerValue(headers, "Content-Security-Policy")).toBeUndefined();
    });

    it("schaltet auf Durchsetzung um", () => {
      const headers = securityHeaders({ cspMode: "enforce" });
      expect(headerValue(headers, "Content-Security-Policy")).toBeDefined();
      expect(
        headerValue(headers, "Content-Security-Policy-Report-Only"),
      ).toBeUndefined();
    });

    it("lässt sich ganz abschalten", () => {
      const headers = securityHeaders({ cspMode: "off" });
      expect(csp({ cspMode: "off" })).toBe("");
      expect(headers.some((h) => h.key.startsWith("Content-Security"))).toBe(
        false,
      );
    });

    it("lässt die Werbe-Skripte von Google zu", () => {
      const policy = csp();
      for (const host of [
        "https://pagead2.googlesyndication.com",
        "https://googleads.g.doubleclick.net",
        "https://tpc.googlesyndication.com",
        "https://fundingchoicesmessages.google.com",
        "https://ep1.adtrafficquality.google",
      ]) {
        expect(policy).toContain(host);
      }
    });

    it("erlaubt Anzeigen- und CMP-iframes", () => {
      expect(csp()).toMatch(
        /frame-src[^;]*https:\/\/fundingchoicesmessages\.google\.com/,
      );
    });

    // Die Rechner zeichnen Balken über style-Attribute, next/font setzt seine
    // Variablen inline. Hashes müssten je Route neu erzeugt werden, ein Nonce
    // steht im statischen Export nicht zur Verfügung.
    it("erlaubt Inline-Styles", () => {
      expect(csp()).toMatch(/style-src[^;]*'unsafe-inline'/);
    });

    it("verbietet Plugins und fremde Einbettung", () => {
      const policy = csp();
      expect(policy).toContain("object-src 'none'");
      expect(policy).toContain("frame-ancestors 'none'");
      expect(policy).toContain("base-uri 'self'");
    });

    it("nimmt die Reichweitenmessung nur auf, wenn sie konfiguriert ist", () => {
      expect(csp()).not.toContain("plausible.io");
      expect(csp({ analyticsOrigin: "https://plausible.io" })).toContain(
        "https://plausible.io",
      );
    });

    // Regressionstest: Umami Cloud lädt von cloud.umami.is, sendet aber an
    // gateway.umami.is. Fehlte der zweite Host, blockierte die CSP jeden
    // Messpunkt – die Seite lief monatelang ohne eine einzige Zählung.
    it("lässt den Sende-Host der Reichweitenmessung zu, nicht nur den Skript-Host", () => {
      const policy = csp({
        analyticsOrigin: "https://cloud.umami.is",
        analyticsConnectOrigins: ["https://gateway.umami.is"],
      });
      const directive = (name: string) =>
        policy.split("; ").find((part) => part.startsWith(`${name} `)) ?? "";
      expect(directive("connect-src")).toContain("https://gateway.umami.is");
      expect(directive("connect-src")).toContain("https://cloud.umami.is");
      // Der Sende-Host liefert kein Skript aus und gehört nicht in script-src.
      expect(directive("script-src")).not.toContain("gateway.umami.is");
    });

    it("braucht unsafe-eval nur in der Entwicklung", () => {
      expect(csp({ isProduction: false })).toContain("'unsafe-eval'");
      expect(csp({ isProduction: true })).not.toContain("'unsafe-eval'");
    });
  });

  describe("Transportsicherheit", () => {
    it("setzt HSTS nur in Produktion", () => {
      expect(
        headerValue(
          securityHeaders({ isProduction: true }),
          "Strict-Transport-Security",
        ),
      ).toContain("max-age=63072000");
      expect(
        headerValue(
          securityHeaders({ isProduction: false }),
          "Strict-Transport-Security",
        ),
      ).toBeUndefined();
    });

    it("setzt die üblichen Basis-Header", () => {
      const headers = securityHeaders();
      expect(headerValue(headers, "X-Content-Type-Options")).toBe("nosniff");
      expect(headerValue(headers, "Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
    });

    it("widerspricht sich beim Einbettungsverbot nicht", () => {
      const headers = securityHeaders();
      expect(headerValue(headers, "X-Frame-Options")).toBe("DENY");
      expect(csp()).toContain("frame-ancestors 'none'");
    });
  });
});
