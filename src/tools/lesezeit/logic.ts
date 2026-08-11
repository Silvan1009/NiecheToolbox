/**
 * Lesezeit-Rechner – reine Berechnung.
 *
 * Grundlage ist die Lesegeschwindigkeit in Wörtern pro Minute. Für stilles
 * Lesen deutscher Sachtexte werden üblicherweise rund 200 bis 250 Wörter pro
 * Minute angesetzt, für lautes Vorlesen deutlich weniger (rund 130).
 */

export type ReadingPace = "langsam" | "normal" | "schnell";

export interface PaceOption {
  id: ReadingPace;
  label: string;
  wpm: number;
  hint: string;
}

export const paceOptions: readonly PaceOption[] = [
  {
    id: "langsam",
    label: "Aufmerksam",
    wpm: 150,
    hint: "Fachtext, Vertrag, etwas zum Lernen",
  },
  {
    id: "normal",
    label: "Normal",
    wpm: 220,
    hint: "Artikel, Blogbeitrag, Newsletter",
  },
  {
    id: "schnell",
    label: "Überfliegen",
    wpm: 350,
    hint: "Nur die Kernaussagen mitnehmen",
  },
] as const;

/** Wörter pro Minute beim lauten Vorlesen – für Vorträge und Videotexte. */
export const SPEAKING_WPM = 130;

export const getPace = (id: string): PaceOption =>
  paceOptions.find((option) => option.id === id) ?? paceOptions[1];

export interface ReadingInput {
  /** Der Text, der gelesen werden soll. */
  text?: string;
  /**
   * Alternative, wenn der Text nicht vorliegt: die bekannte Wortzahl.
   * Wird nur verwendet, wenn `text` leer ist – so lässt sich ein Ergebnis
   * auch teilen, ohne den Text selbst in die URL zu schreiben.
   */
  words?: number;
  pace: ReadingPace;
}

export interface ReadingResult {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  /** Wörter pro Minute, mit denen gerechnet wurde. */
  wpm: number;
  /** Lesedauer in Sekunden. */
  readingSeconds: number;
  /** Dauer beim lauten Vorlesen, in Sekunden. */
  speakingSeconds: number;
  /** Durchschnittliche Wortlänge in Zeichen – ein Hinweis auf die Schwere. */
  averageWordLength: number;
}

/**
 * Wörter zählen. Getrennt wird an Leerraum; reine Satzzeichen zählen nicht als
 * Wort, "E-Mail" und "1.500" bleiben dagegen ein Wort.
 */
export function countWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter((token) => token.length > 0);
}

export function calculateReadingTime(input: ReadingInput): ReadingResult {
  const text = input.text ?? "";
  const pace = getPace(input.pace);

  // Ohne Text, aber mit bekannter Wortzahl: nur die Dauer, keine Textstatistik.
  if (text.trim().length === 0) {
    const wordCount = Math.max(0, Math.trunc(input.words ?? 0));
    return {
      words: wordCount,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      wpm: pace.wpm,
      readingSeconds: wordCount === 0 ? 0 : (wordCount / pace.wpm) * 60,
      speakingSeconds: wordCount === 0 ? 0 : (wordCount / SPEAKING_WPM) * 60,
      averageWordLength: 0,
    };
  }

  const words = countWords(text);
  const wordCount = words.length;

  const trimmed = text.trim();
  const sentences =
    trimmed.length === 0
      ? 0
      : Math.max(1, (trimmed.match(/[.!?…]+(?=\s|$)/g) ?? []).length);

  const paragraphs =
    trimmed.length === 0
      ? 0
      : trimmed.split(/\n\s*\n/).filter((part) => part.trim().length > 0)
          .length;

  const charactersNoSpaces = text.replace(/\s/g, "").length;

  return {
    words: wordCount,
    characters: text.length,
    charactersNoSpaces,
    sentences,
    paragraphs,
    wpm: pace.wpm,
    readingSeconds: wordCount === 0 ? 0 : (wordCount / pace.wpm) * 60,
    speakingSeconds: wordCount === 0 ? 0 : (wordCount / SPEAKING_WPM) * 60,
    averageWordLength:
      wordCount === 0
        ? 0
        : words.reduce((sum, word) => sum + word.length, 0) / wordCount,
  };
}

/**
 * Sekunden in eine lesbare Angabe übersetzen.
 * Unter einer Minute in Sekunden, ab einer Stunde mit Stundenangabe.
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0 Sekunden";

  const rounded = Math.round(seconds);
  if (rounded < 60) {
    return `${rounded} ${rounded === 1 ? "Sekunde" : "Sekunden"}`;
  }

  const totalMinutes = Math.round(rounded / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes} ${totalMinutes === 1 ? "Minute" : "Minuten"}`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourPart = `${hours} ${hours === 1 ? "Stunde" : "Stunden"}`;
  if (minutes === 0) return hourPart;
  return `${hourPart} ${minutes} ${minutes === 1 ? "Minute" : "Minuten"}`;
}
