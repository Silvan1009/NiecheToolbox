/** Einheitliche de-DE-Formatierung für Server und Client. */

const integer = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

const decimal = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Mengenangaben: höchstens eine Dezimale, ohne angehängte Nullen.
 *
 * Geld braucht immer zwei Stellen ("3,50 €"), eine Menge nicht: "1 kg" liest
 * sich besser als "1,00 kg", und "5,6 kg" besser als "5,60 kg".
 */
const amount = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });

export const formatInteger = (n: number) => integer.format(n);
export const formatDecimal = (n: number) => decimal.format(n);
export const formatAmount = (n: number) => amount.format(n);
export const formatEuro = (n: number) => euro.format(n);

/**
 * "6,5 %" – wie eine Mengenangabe, plus Zeichen.
 *
 * Das Leerzeichen vor dem Prozentzeichen ist ein geschütztes: nach DIN 5008
 * gehört es dort hin, und ohne Schutz bricht es am Zeilenende zwischen Zahl
 * und Zeichen um.
 */
export const formatPercent = (n: number) => `${amount.format(n)} %`;

/**
 * Datumsangaben sind reine Kalendertage (ISO "YYYY-MM-DD"). Sie werden als
 * UTC-Mitternacht gelesen und in UTC formatiert – dadurch ist die Ausgabe auf
 * Server und Client identisch, unabhängig von der Zeitzone des Besuchers.
 */
function isoToUtcDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

const dayMonth = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});

const fullDate = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const longDate = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const weekdayShort = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  timeZone: "UTC",
});

const weekdayLong = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  timeZone: "UTC",
});

export const formatWeekdayLong = (iso: string) =>
  weekdayLong.format(isoToUtcDate(iso));

export const formatDayMonth = (iso: string) => dayMonth.format(isoToUtcDate(iso));
export const formatDate = (iso: string) => fullDate.format(isoToUtcDate(iso));
export const formatLongDate = (iso: string) => longDate.format(isoToUtcDate(iso));
export const formatWeekday = (iso: string) =>
  weekdayShort.format(isoToUtcDate(iso)).replace(".", "");

/** "Mo 04.05." – kompakte Angabe für Listen. */
export const formatWeekdayDate = (iso: string) =>
  `${formatWeekday(iso)} ${formatDayMonth(iso)}`;

/** Pluralisierung ohne Bibliothek. */
export const plural = (n: number, one: string, many: string) =>
  n === 1 ? one : many;
