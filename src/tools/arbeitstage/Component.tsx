"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Select,
  Stepper,
  TextInput,
  Toggle,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { isValidIso, todayIso } from "@/lib/date";
import {
  formatDate,
  formatInteger,
  formatWeekdayDate,
  plural,
} from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import {
  isRegionCode,
  partialHolidayNames,
  regions,
  type RegionCode,
} from "@/lib/regionen";
import type { ToolParams } from "@/tools/types";
import {
  calculateWorkdays,
  monthRange,
  monthlyBreakdown,
  quarterRange,
  weekPresets,
  yearRange,
  type WeekPreset,
} from "./logic";

interface State extends Record<string, unknown> {
  from: string;
  to: string;
  region: RegionCode;
  week: WeekPreset;
  includePartial: boolean;
  daysOff: number;
}

const WEEK_OPTIONS = [
  { value: "5", label: "Mo–Fr" },
  { value: "6", label: "Mo–Sa" },
  { value: "7", label: "Alle Tage" },
] as const satisfies readonly { value: WeekPreset; label: string }[];

const MONTH_NAMES = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const isWeekPreset = (value: unknown): value is WeekPreset =>
  value === "5" || value === "6" || value === "7";

function toIsoOr(value: unknown, fallback: string): string {
  return isValidIso(value) ? value : fallback;
}

function toCount(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : fallback;
}

function initialState(params: ToolParams | undefined): State {
  const baseYear = toCount(params?.jahr, Number(todayIso().slice(0, 4)));
  const range = yearRange(baseYear);

  return {
    from: toIsoOr(params?.von, range.from),
    to: toIsoOr(params?.bis, range.to),
    region: isRegionCode(params?.bl) ? params.bl : "nw",
    week: isWeekPreset(params?.woche) ? params.woche : "5",
    includePartial: params?.regional === "1",
    daysOff: toCount(params?.urlaub, 0),
  };
}

export default function ArbeitstageTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      from: toIsoOr(search.get("von"), fallback.from),
      to: toIsoOr(search.get("bis"), fallback.to),
      region: isRegionCode(search.get("bl"))
        ? (search.get("bl") as RegionCode)
        : fallback.region,
      week: isWeekPreset(search.get("woche"))
        ? (search.get("woche") as WeekPreset)
        : fallback.week,
      includePartial: search.get("regional") === "1",
      daysOff: toCount(search.get("urlaub"), fallback.daysOff),
    }),
    serialize: (next) => ({
      von: next.from,
      bis: next.to,
      bl: next.region,
      woche: next.week,
      regional: next.includePartial ? "1" : "0",
      urlaub: String(next.daysOff),
    }),
  });

  const workdaySet = weekPresets[state.week].days;

  const result = useMemo(
    () =>
      calculateWorkdays({
        from: state.from,
        to: state.to,
        region: state.region,
        workdays: workdaySet,
        includePartial: state.includePartial,
        daysOff: state.daysOff,
      }),
    [
      state.from,
      state.to,
      state.region,
      state.includePartial,
      state.daysOff,
      workdaySet,
    ],
  );

  const partialNames = partialHolidayNames(state.region);

  // Die Monatsübersicht ist nur sinnvoll, wenn der Zeitraum genau ein
  // Kalenderjahr abdeckt – sonst zeigt sie Monate außerhalb der Auswahl.
  const fullYear =
    result.from.endsWith("-01-01") &&
    result.to.endsWith("-12-31") &&
    result.from.slice(0, 4) === result.to.slice(0, 4);
  const year = Number(result.from.slice(0, 4));

  const months = useMemo(
    () =>
      fullYear
        ? monthlyBreakdown(year, state.region, workdaySet, state.includePartial)
        : [],
    [fullYear, year, state.region, workdaySet, state.includePartial],
  );

  function applyRange(range: { from: string; to: string }) {
    update({ from: range.from, to: range.to });
  }

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Von" htmlFor="at-von">
              <TextInput
                id="at-von"
                type="date"
                value={state.from}
                onChange={(event) =>
                  update({ from: toIsoOr(event.target.value, state.from) })
                }
                className="font-mono"
              />
            </Field>

            <Field label="Bis" htmlFor="at-bis" hint="Beide Tage zählen mit.">
              <TextInput
                id="at-bis"
                type="date"
                value={state.to}
                onChange={(event) =>
                  update({ to: toIsoOr(event.target.value, state.to) })
                }
                className="font-mono"
              />
            </Field>
          </div>

          <fieldset>
            <legend className="text-[13px] font-semibold tracking-wide text-muted uppercase">
              Schnellauswahl
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <RangeButton
                label={`Jahr ${year}`}
                onClick={() => applyRange(yearRange(year))}
              />
              <RangeButton
                label={`Jahr ${year + 1}`}
                onClick={() => applyRange(yearRange(year + 1))}
              />
              {[1, 2, 3, 4].map((quarter) => (
                <RangeButton
                  key={quarter}
                  label={`Q${quarter} ${year}`}
                  onClick={() => applyRange(quarterRange(year, quarter))}
                />
              ))}
              <RangeButton
                label={MONTH_NAMES[Number(result.from.slice(5, 7)) - 1]}
                onClick={() =>
                  applyRange(monthRange(year, Number(result.from.slice(5, 7))))
                }
              />
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Bundesland" htmlFor="at-bl">
              <Select
                id="at-bl"
                value={state.region}
                onChange={(event) =>
                  update({ region: event.target.value as RegionCode })
                }
              >
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Urlaub oder Krankheit"
              htmlFor="at-urlaub"
              hint="Wird von den Arbeitstagen abgezogen."
            >
              <Stepper
                id="at-urlaub"
                value={state.daysOff}
                min={0}
                max={365}
                onChange={(daysOff) => update({ daysOff })}
                suffix="Tage"
                ariaLabel="Urlaubs- oder Krankheitstage"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Arbeitswoche" htmlFor="at-woche">
                <SegmentedControl
                  value={state.week}
                  options={WEEK_OPTIONS}
                  onChange={(week) => update({ week })}
                  ariaLabel="Arbeitswoche"
                />
              </Field>
            </div>
          </div>

          {partialNames.length > 0 && (
            <Toggle
              checked={state.includePartial}
              onChange={(includePartial) => update({ includePartial })}
              label={`Regionale Feiertage mitzählen (${partialNames.join(", ")})`}
              hint="Gilt nur in Teilen des Bundeslandes – zählt nur, wenn es bei dir frei ist."
            />
          )}
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Arbeitstage"
            text={`${formatInteger(result.workdays)} Arbeitstage von ${formatDate(result.from)} bis ${formatDate(result.to)}`}
          />
        }
      >
        <NumberDisplay
          value={result.workdays}
          suffix={plural(result.workdays, "Arbeitstag", "Arbeitstage")}
          caption={`${formatDate(result.from)} bis ${formatDate(result.to)}`}
          announce={`${formatInteger(result.workdays)} Arbeitstage zwischen ${formatDate(result.from)} und ${formatDate(result.to)}.`}
          hint={
            <>
              Von{" "}
              <strong className="font-semibold text-ink">
                {formatInteger(result.calendarDays)} Kalendertagen
              </strong>{" "}
              fallen {formatInteger(result.offDays)} aufs Wochenende und{" "}
              {formatInteger(result.lostToHolidays)} auf{" "}
              {plural(result.lostToHolidays, "einen Feiertag", "Feiertage")}
              {state.daysOff > 0 && (
                <>
                  {" "}
                  – nach Urlaub bleiben{" "}
                  <strong className="font-semibold text-ink">
                    {formatInteger(result.netWorkdays)}
                  </strong>
                </>
              )}
              .
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Kalendertage"
          value={formatInteger(result.calendarDays)}
          hint="beide Enddaten inklusive"
        />
        <Stat
          label="Feiertage, die zählen"
          value={formatInteger(result.lostToHolidays)}
          hint={
            result.wastedHolidays > 0
              ? `${formatInteger(result.wastedHolidays)} weitere fallen auf freie Tage`
              : "alle liegen auf Arbeitstagen"
          }
        />
        <Stat
          label={state.daysOff > 0 ? "Nach Urlaub" : "Freie Tage"}
          value={formatInteger(
            state.daysOff > 0 ? result.netWorkdays : result.offDays,
          )}
          hint={
            state.daysOff > 0
              ? `${formatInteger(state.daysOff)} ${plural(state.daysOff, "Tag", "Tage")} abgezogen`
              : "Wochenende und arbeitsfreie Wochentage"
          }
        />
      </dl>

      {fullYear && months.length > 0 && (
        <section aria-labelledby="at-monate" className="surface-soft p-6">
          <h2
            id="at-monate"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Arbeitstage pro Monat {year}
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[22rem] border-collapse text-[15px]">
              <caption className="sr-only">
                Arbeitstage und Feiertage je Monat im Jahr {year}
              </caption>
              <thead>
                <tr className="text-left text-[13px] font-semibold text-muted">
                  <th scope="col" className="pb-2">
                    Monat
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    Arbeitstage
                  </th>
                  <th scope="col" className="pb-2 text-right">
                    Feiertage
                  </th>
                </tr>
              </thead>
              <tbody>
                {months.map((month) => (
                  <tr key={month.month} className="border-t border-line">
                    <th scope="row" className="py-2 font-normal">
                      {MONTH_NAMES[month.month - 1]}
                    </th>
                    <td className="py-2 text-right font-mono tabular-nums">
                      {formatInteger(month.workdays)}
                    </td>
                    <td className="py-2 text-right font-mono text-muted tabular-nums">
                      {month.holidays > 0 ? formatInteger(month.holidays) : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {result.holidays.length > 0 && (
        <details className="surface-soft p-6">
          <summary className="cursor-pointer font-display text-lg font-semibold tracking-tight">
            Alle {formatInteger(result.holidays.length)} Feiertage im Zeitraum
          </summary>
          <ul className="mt-4 flex flex-col gap-2 text-[15px]">
            {result.holidays.map((holiday) => (
              <li
                key={`${holiday.date}-${holiday.name}`}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-2 first:border-0 first:pt-0"
              >
                <span>
                  {holiday.name}
                  {holiday.partial && (
                    <span className="ml-2 rounded-pill bg-ink-soft px-2 py-0.5 text-[12px] text-muted">
                      nur regional
                    </span>
                  )}
                </span>
                <span className="font-mono text-[13px] text-muted tabular-nums">
                  {formatWeekdayDate(holiday.date)}
                  {holiday.countsAsLoss ? "" : " · fällt auf einen freien Tag"}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function RangeButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 rounded-pill bg-surface px-3.5 text-sm font-semibold text-muted shadow-[var(--elev-inset)] transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
    >
      {label}
    </button>
  );
}

