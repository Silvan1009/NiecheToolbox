import { describe, expect, it } from "vitest";
import {
  SPEAKING_WPM,
  calculateReadingTime,
  countWords,
  formatDuration,
  getPace,
  paceOptions,
} from "./logic";

describe("Wörter zählen", () => {
  it("zählt einfache Sätze", () => {
    expect(countWords("Hallo Welt")).toEqual(["Hallo", "Welt"]);
    expect(countWords("Ein Satz mit fünf Wörtern hier")).toHaveLength(6);
  });

  it("ignoriert überflüssigen Leerraum", () => {
    expect(countWords("  viel   Platz \n\n dazwischen  ")).toHaveLength(3);
    expect(countWords("")).toHaveLength(0);
    expect(countWords("   \n\t  ")).toHaveLength(0);
  });

  it("behandelt Satzzeichen richtig", () => {
    // Satzzeichen am Rand fallen weg, das Wort bleibt.
    expect(countWords("Hallo, Welt!")).toEqual(["Hallo", "Welt"]);
    // Ein alleinstehender Gedankenstrich ist kein Wort.
    expect(countWords("Ja – nein")).toEqual(["Ja", "nein"]);
    expect(countWords("...")).toHaveLength(0);
  });

  it("hält zusammengesetzte Wörter und Zahlen zusammen", () => {
    expect(countWords("E-Mail")).toEqual(["E-Mail"]);
    expect(countWords("1.500 Euro")).toEqual(["1.500", "Euro"]);
    expect(countWords("Größe: 42")).toEqual(["Größe", "42"]);
  });

  it("kommt mit Umlauten und ß klar", () => {
    expect(countWords("Äpfel Öl Über straße")).toHaveLength(4);
  });
});

describe("Lesezeit", () => {
  it("rechnet Wörter durch Lesegeschwindigkeit", () => {
    const text = Array.from({ length: 220 }, () => "Wort").join(" ");
    const result = calculateReadingTime({ text, pace: "normal" });
    expect(result.words).toBe(220);
    expect(result.wpm).toBe(220);
    expect(result.readingSeconds).toBeCloseTo(60, 6);
    expect(result.speakingSeconds).toBeCloseTo((220 / SPEAKING_WPM) * 60, 6);
  });

  it("wird mit höherer Geschwindigkeit schneller", () => {
    const text = Array.from({ length: 1000 }, () => "Wort").join(" ");
    const slow = calculateReadingTime({ text, pace: "langsam" });
    const normal = calculateReadingTime({ text, pace: "normal" });
    const fast = calculateReadingTime({ text, pace: "schnell" });
    expect(slow.readingSeconds).toBeGreaterThan(normal.readingSeconds);
    expect(normal.readingSeconds).toBeGreaterThan(fast.readingSeconds);
  });

  it("zählt Zeichen mit und ohne Leerraum", () => {
    const result = calculateReadingTime({ text: "ab cd", pace: "normal" });
    expect(result.characters).toBe(5);
    expect(result.charactersNoSpaces).toBe(4);
  });

  it("zählt Sätze", () => {
    expect(
      calculateReadingTime({ text: "Eins. Zwei! Drei?", pace: "normal" })
        .sentences,
    ).toBe(3);
    // Mehrere Satzzeichen hintereinander sind ein Satzende.
    expect(
      calculateReadingTime({ text: "Wirklich?! Ja.", pace: "normal" })
        .sentences,
    ).toBe(2);
    // Text ohne Satzzeichen ist trotzdem ein Satz.
    expect(
      calculateReadingTime({ text: "Ohne Punkt am Ende", pace: "normal" })
        .sentences,
    ).toBe(1);
    // Abkürzungspunkte mitten im Wort beenden keinen Satz.
    expect(
      calculateReadingTime({
        text: "Das kostet 1.500 Euro netto",
        pace: "normal",
      }).sentences,
    ).toBe(1);
  });

  it("zählt Absätze über Leerzeilen", () => {
    const result = calculateReadingTime({
      text: "Erster Absatz.\n\nZweiter Absatz.\n\n\nDritter Absatz.",
      pace: "normal",
    });
    expect(result.paragraphs).toBe(3);
    // Ein einfacher Zeilenumbruch trennt keinen Absatz.
    expect(
      calculateReadingTime({ text: "Zeile eins\nZeile zwei", pace: "normal" })
        .paragraphs,
    ).toBe(1);
  });

  it("liefert für leeren Text lauter Nullen", () => {
    const result = calculateReadingTime({ text: "   ", pace: "normal" });
    expect(result.words).toBe(0);
    expect(result.sentences).toBe(0);
    expect(result.paragraphs).toBe(0);
    expect(result.readingSeconds).toBe(0);
    expect(result.speakingSeconds).toBe(0);
    expect(result.averageWordLength).toBe(0);
  });

  it("rechnet auch mit einer reinen Wortzahl statt Text", () => {
    const result = calculateReadingTime({ words: 440, pace: "normal" });
    expect(result.words).toBe(440);
    expect(result.readingSeconds).toBeCloseTo(120, 6);
    // Ohne Text gibt es keine Textstatistik.
    expect(result.characters).toBe(0);
    expect(result.sentences).toBe(0);
    expect(result.paragraphs).toBe(0);
  });

  it("bevorzugt den Text, wenn beides angegeben ist", () => {
    const result = calculateReadingTime({
      text: "genau drei Wörter",
      words: 9999,
      pace: "normal",
    });
    expect(result.words).toBe(3);
  });

  it("berechnet die durchschnittliche Wortlänge", () => {
    const result = calculateReadingTime({ text: "ab abcd", pace: "normal" });
    expect(result.averageWordLength).toBe(3);
  });

  it("fällt bei unbekannter Geschwindigkeit auf 'normal' zurück", () => {
    expect(getPace("gibtsnicht").id).toBe("normal");
    for (const option of paceOptions) {
      expect(getPace(option.id)).toBe(option);
    }
  });

  it("braucht für Vorlesen immer länger als für stilles Lesen", () => {
    const text = Array.from({ length: 500 }, () => "Wort").join(" ");
    for (const option of paceOptions) {
      const result = calculateReadingTime({ text, pace: option.id });
      expect(result.speakingSeconds).toBeGreaterThan(result.readingSeconds);
    }
  });
});

describe("Dauer formatieren", () => {
  it("nennt kurze Zeiten in Sekunden", () => {
    expect(formatDuration(0)).toBe("0 Sekunden");
    expect(formatDuration(1)).toBe("1 Sekunde");
    expect(formatDuration(45)).toBe("45 Sekunden");
    expect(formatDuration(59.4)).toBe("59 Sekunden");
  });

  it("nennt mittlere Zeiten in Minuten", () => {
    expect(formatDuration(60)).toBe("1 Minute");
    expect(formatDuration(150)).toBe("3 Minuten");
    expect(formatDuration(59.6)).toBe("1 Minute");
  });

  it("nennt lange Zeiten in Stunden und Minuten", () => {
    expect(formatDuration(3600)).toBe("1 Stunde");
    expect(formatDuration(3600 + 60)).toBe("1 Stunde 1 Minute");
    expect(formatDuration(3600 * 2 + 60 * 25)).toBe("2 Stunden 25 Minuten");
  });
});
