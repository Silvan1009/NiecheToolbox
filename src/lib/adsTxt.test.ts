import { describe, expect, it } from "vitest";
import { buildAdsTxt } from "./adsTxt";

describe("buildAdsTxt", () => {
  it("liefert nichts ohne Publisher-ID", () => {
    // null statt "" – eine leere ads.txt liest sich als „autorisiert niemanden".
    expect(buildAdsTxt("")).toBeNull();
  });

  it("weist unplausible Kennungen ab", () => {
    expect(buildAdsTxt("pub-123")).toBeNull();
    expect(buildAdsTxt("ca-pub-")).toBeNull();
    expect(buildAdsTxt("ca-pub-abc")).toBeNull();
  });

  it("schreibt den Datensatz nach IAB-Spezifikation", () => {
    expect(buildAdsTxt("ca-pub-1234567890123456")).toBe(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n",
    );
  });

  it("entfernt das ca-Präfix", () => {
    const result = buildAdsTxt("ca-pub-1234567890123456");
    expect(result).toContain("pub-1234567890123456");
    expect(result).not.toContain("ca-pub-");
  });
});
