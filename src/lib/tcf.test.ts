import { describe, expect, it } from "vitest";
import {
  deriveConsentStatus,
  GOOGLE_VENDOR_ID,
  STORAGE_PURPOSE_ID,
  type TcfData,
} from "./tcf";

/** Vollständige Einwilligung im Geltungsbereich der DSGVO. */
function fullConsent(): TcfData {
  return {
    cmpStatus: "loaded",
    eventStatus: "useractioncomplete",
    gdprApplies: true,
    purpose: { consents: { [STORAGE_PURPOSE_ID]: true } },
    vendor: { consents: { [GOOGLE_VENDOR_ID]: true } },
  };
}

describe("deriveConsentStatus", () => {
  describe("solange die CMP nicht entschieden hat", () => {
    it("behandelt fehlende Daten als unentschieden", () => {
      expect(deriveConsentStatus(null)).toBe("unknown");
      expect(deriveConsentStatus(undefined)).toBe("unknown");
    });

    it("wartet, solange die CMP nur als Stub vorliegt", () => {
      expect(deriveConsentStatus({ cmpStatus: "stub" })).toBe("unknown");
      expect(deriveConsentStatus({ cmpStatus: "loading" })).toBe("unknown");
    });

    it("wartet, solange der Dialog offen steht", () => {
      const data: TcfData = { ...fullConsent(), eventStatus: "cmpuishown" };
      expect(deriveConsentStatus(data)).toBe("unknown");
    });

    it("rät nicht, solange die Region unbestimmt ist", () => {
      const data: TcfData = { ...fullConsent(), gdprApplies: undefined };
      expect(deriveConsentStatus(data)).toBe("unknown");
    });
  });

  describe("Fehlerfall", () => {
    it("scheitert in Richtung 'keine Werbung' statt hängen zu bleiben", () => {
      expect(deriveConsentStatus({ cmpStatus: "error" })).toBe("denied");
    });
  });

  describe("außerhalb der DSGVO", () => {
    it("erlaubt Laden ohne TCF-Zustimmung", () => {
      const data: TcfData = { cmpStatus: "loaded", gdprApplies: false };
      expect(deriveConsentStatus(data)).toBe("granted");
    });
  });

  describe("innerhalb der DSGVO", () => {
    it("erlaubt Laden nur bei Zweck 1 UND Anbieter Google", () => {
      expect(deriveConsentStatus(fullConsent())).toBe("granted");
    });

    it("verweigert ohne Zustimmung zu Zweck 1", () => {
      const data = fullConsent();
      data.purpose = { consents: { [STORAGE_PURPOSE_ID]: false } };
      expect(deriveConsentStatus(data)).toBe("denied");
    });

    it("verweigert ohne Zustimmung für Google als Anbieter", () => {
      const data = fullConsent();
      data.vendor = { consents: { [GOOGLE_VENDOR_ID]: false } };
      expect(deriveConsentStatus(data)).toBe("denied");
    });

    it("verweigert, wenn ein anderer Anbieter zugestimmt bekommt", () => {
      const data = fullConsent();
      data.vendor = { consents: { "999": true } };
      expect(deriveConsentStatus(data)).toBe("denied");
    });

    // § 25 TDDDG kennt für den Zugriff aufs Endgerät kein berechtigtes
    // Interesse – nur eine Einwilligung trägt.
    it("lässt berechtigtes Interesse für Zweck 1 nicht genügen", () => {
      const data = fullConsent();
      data.purpose = {
        consents: {},
        legitimateInterests: { [STORAGE_PURPOSE_ID]: true },
      };
      expect(deriveConsentStatus(data)).toBe("denied");
    });

    it("verweigert bei komplett fehlenden Zustimmungsobjekten", () => {
      const data: TcfData = {
        cmpStatus: "loaded",
        eventStatus: "tcloaded",
        gdprApplies: true,
      };
      expect(deriveConsentStatus(data)).toBe("denied");
    });
  });
});
