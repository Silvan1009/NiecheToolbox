import { describe, expect, it } from "vitest";
import { buildAdsBootstrap } from "./adsBootstrap";

const CLIENT_ID = "ca-pub-1234567890123456";

describe("buildAdsBootstrap", () => {
  it("liefert nichts ohne gültige Publisher-ID", () => {
    expect(buildAdsBootstrap("")).toBe("");
    expect(buildAdsBootstrap("pub-123")).toBe("");
    expect(buildAdsBootstrap("ca-pub-abc")).toBe("");
  });

  // Das ist die eigentliche Zusage dieses Moduls: die Consent-Defaults stehen,
  // bevor die CMP überhaupt angefordert wird. Andersherum zählt der erste
  // Treffer als unbestimmt und die CMP kann ihn nicht mehr einfangen.
  it("setzt die Consent-Defaults vor dem Laden der CMP", () => {
    const script = buildAdsBootstrap(CLIENT_ID);
    const defaultsAt = script.indexOf("'consent','default'");
    const cmpAt = script.indexOf("fundingchoicesmessages.google.com");

    expect(defaultsAt).toBeGreaterThan(-1);
    expect(cmpAt).toBeGreaterThan(-1);
    expect(defaultsAt).toBeLessThan(cmpAt);
  });

  it("verweigert alle vier Consent-Signale als Ausgangszustand", () => {
    const script = buildAdsBootstrap(CLIENT_ID);
    for (const signal of [
      "ad_storage",
      "ad_user_data",
      "ad_personalization",
      "analytics_storage",
    ]) {
      expect(script).toContain(`'${signal}':'denied'`);
    }
  });

  it("gibt der CMP eine halbe Sekunde zum Nachreichen", () => {
    expect(buildAdsBootstrap(CLIENT_ID)).toContain("'wait_for_update':500");
  });

  // Ein Array im dataLayer kommt in Consent Mode nicht richtig an – Google
  // wertet die Einträge als `arguments`-Objekte aus.
  it("schiebt ein echtes arguments-Objekt in den dataLayer", () => {
    expect(buildAdsBootstrap(CLIENT_ID)).toContain(
      "window.dataLayer.push(arguments)",
    );
  });

  it("spricht die CMP ohne ca-Präfix an", () => {
    const script = buildAdsBootstrap(CLIENT_ID);
    expect(script).toContain(
      "https://fundingchoicesmessages.google.com/i/pub-1234567890123456?ers=1",
    );
    expect(script).not.toContain("i/ca-pub-");
  });

  it("kann das umgebende script-Tag nicht schließen", () => {
    // Die ID-Prüfung lässt nichts durch, was hier landen könnte – der Test
    // hält das fest, falls das Muster je gelockert wird.
    expect(buildAdsBootstrap(CLIENT_ID)).not.toContain("</script");
    expect(buildAdsBootstrap("ca-pub-1</script><script>alert(1)")).toBe("");
  });
});
