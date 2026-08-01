import { describe, expect, it } from "vitest";
import { parseNumberInput, toNumber, urlValue } from "./parse";

describe("toNumber", () => {
  it("fällt auf den Fallback zurück, wenn der Schlüssel in der URL fehlt", () => {
    expect(toNumber(null, 42)).toBe(42);
    expect(toNumber(undefined, 42)).toBe(42);
    expect(toNumber("", 42)).toBe(42);
  });

  it("liest deutsches Dezimalkomma", () => {
    expect(toNumber("1,5", 0)).toBe(1.5);
  });

  it("liest englischen Dezimalpunkt genauso", () => {
    expect(toNumber("1.5", 0)).toBe(1.5);
  });

  it("fällt auf den Fallback zurück, wenn der Text keine Zahl ist", () => {
    expect(toNumber("abc", 42)).toBe(42);
    expect(toNumber("-", 42)).toBe(42);
  });

  it("verwirft negative Werte – kein Feld hier ist ein Betrag mit Vorzeichen", () => {
    expect(toNumber("-5", 42)).toBe(42);
    expect(toNumber(-5, 42)).toBe(42);
  });

  it("verwirft Infinity und NaN", () => {
    expect(toNumber(Infinity, 42)).toBe(42);
    expect(toNumber(NaN, 42)).toBe(42);
  });

  it("lässt 0 als gültigen Wert durch", () => {
    expect(toNumber(0, 42)).toBe(0);
    expect(toNumber("0", 42)).toBe(0);
  });

  it("liest eine Zahl direkt, ohne Stringumweg", () => {
    expect(toNumber(7, 0)).toBe(7);
  });
});

describe("parseNumberInput", () => {
  it("liefert null, solange noch keine lesbare Zahl dasteht", () => {
    expect(parseNumberInput("")).toBeNull();
    expect(parseNumberInput("-")).toBeNull();
    expect(parseNumberInput("abc")).toBeNull();
  });

  it("liest ein Vorzeichen", () => {
    expect(parseNumberInput("-5")).toBe(-5);
  });

  it("liest deutsches Dezimalkomma", () => {
    expect(parseNumberInput("1,5")).toBe(1.5);
  });

  it("liest Tausenderpunkte", () => {
    expect(parseNumberInput("4.800")).toBe(4800);
  });

  it("unterscheidet Tausenderpunkt von Dezimalpunkt", () => {
    expect(parseNumberInput("4.8")).toBe(4.8);
  });

  it("verwirft Text ohne lesbare Zahl auch mit Einheiten", () => {
    expect(parseNumberInput("5 €")).toBe(5);
    expect(parseNumberInput("5 %")).toBe(5);
  });
});

describe("urlValue", () => {
  it("liefert einen leeren String, wenn der Wert dem Default entspricht", () => {
    expect(urlValue(5, 5)).toBe("");
    expect(urlValue("a", "a")).toBe("");
  });

  it("liefert den Wert als String, wenn er vom Default abweicht", () => {
    expect(urlValue(6, 5)).toBe("6");
    expect(urlValue("b", "a")).toBe("b");
  });
});
