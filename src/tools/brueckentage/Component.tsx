"use client";

import { useCallback, useMemo } from "react";
import { CalendarCheck2, CalendarX2, Sparkles } from "lucide-react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, Select, Stepper } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDate, formatWeekday, formatWeekdayDate, plural } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { brueckentageAffiliate } from "./affiliate";
import {
  calculateBrueckentage,
  isRegionCode,
  partialHolidayNames,
  regions,
  type BridgeBlock,
  type RegionCode,
} from "./logic";

interface State extends Record<string, unknown> {
  region: RegionCode;
  year: number;
  budget: number;
  includePartial: boolean;
}

const DEFAULT_REGION: RegionCode = "nw";
const DEFAULT_BUDGET = 5;
/** Wie viele Jahre im Auswahlfeld angeboten werden. */
const YEAR_SPAN = 5;

function clampYear(value: number, base: number) {
  return Math.min(base + YEAR_SPAN - 1, Math.max(base - 1, Math.trunc(value)));
}

function initialState(params: ToolParams | undefined, baseYear: number): State {
  const region = params?.bl;
  const year = Number(params?.jahr);
  const budget = Number(params?.tage);

  return {
    region: isRegionCode(region) ? region : DEFAULT_REGION,
    year: Number.isFinite(year) && year > 0 ? clampYear(year, baseYear) : baseYear,
    budget:
      Number.isFinite(budget) && budget > 0
        ? Math.min(30, Math.trunc(budget))
        : DEFAULT_BUDGET,
    includePartial: params?.regional === "1",
  };
}

/**
 * Ein Tag als Label. Freie Spannen reichen über den Jahreswechsel hinaus –
 * liegt der Tag außerhalb des gewählten Jahres, wird das Jahr mitgenannt,
 * sonst wäre "Fr 01.01." zweideutig.
 */
function dayLabel(iso: string, year: number) {
  return Number(iso.slice(0, 4)) === year
    ? formatWeekdayDate(iso)
    : `${formatWeekday(iso)} ${formatDate(iso)}`;
}

/** Urlaubstage als lesbare Spanne: "Fr 15.05." bzw. "Di 07.04. – Fr 10.04." */
function vacationLabel(block: BridgeBlock, year: number) {
  if (block.vacationDays.length === 1) {
    return dayLabel(block.vacationDays[0], year);
  }
  return `${dayLabel(block.vacationStart, year)} – ${dayLabel(
    block.vacationEnd,
    year,
  )}`;
}

export default function BrueckentageTool({ params }: { params?: ToolParams }) {
  // Basisjahr kommt vom Server (getDefaultParams), damit SSR und Client
  // denselben ersten Render erzeugen.
  const baseYear = Number(params?.basisJahr) || new Date().getUTCFullYear();

  const [state, update] = useUrlState<State>({
    initialState: initialState(params, baseYear),
    parse: (search, fallback) => {
      const region = search.get("bl");
      const year = Number(search.get("jahr"));
      const budget = Number(search.get("tage"));
      return {
        region: isRegionCode(region) ? region : fallback.region,
        year:
          Number.isFinite(year) && year > 0
            ? clampYear(year, baseYear)
            : fallback.year,
        budget:
          Number.isFinite(budget) && budget > 0
            ? Math.min(30, Math.trunc(budget))
            : fallback.budget,
        includePartial: search.has("regional")
          ? search.get("regional") === "1"
          : fallback.includePartial,
      };
    },
    serialize: (next) => ({
      bl: next.region,
      jahr: String(next.year),
      tage: String(next.budget),
      regional: next.includePartial ? "1" : "",
    }),
  });

  const result = useMemo(
    () =>
      calculateBrueckentage({
        year: state.year,
        region: state.region,
        budget: state.budget,
        includePartial: state.includePartial,
      }),
    [state.year, state.region, state.budget, state.includePartial],
  );

  const years = useMemo(
    () => Array.from({ length: YEAR_SPAN }, (_, index) => baseYear + index),
    [baseYear],
  );

  const partialNames = partialHolidayNames(state.region);

  // Nach Anlass-Schlüssel vergleichen, nicht nach Datum: mehrere Anlässe können
  // am selben Tag beginnen (z. B. Neujahr allein vs. Neujahr + Drei Könige).
  const planned = useMemo(
    () =>
      new Set(
        result.plan.blocks.map((block) =>
          block.holidays.map((holiday) => holiday.date).join("|"),
        ),
      ),
    [result.plan.blocks],
  );

  const setBudget = useCallback(
    (budget: number) => update({ budget }),
    [update],
  );

  const best = result.best;

  return (
    <div className="flex flex-col gap-8">
      {/* --- Eingaben ----------------------------------------------------- */}
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Bundesland" htmlFor="bt-region">
            <Select
              id="bt-region"
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

          <Field label="Jahr" htmlFor="bt-year">
            <Select
              id="bt-year"
              value={state.year}
              onChange={(event) => update({ year: Number(event.target.value) })}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Urlaubstage, die du einsetzen willst"
              htmlFor="bt-budget"
              hint="Gilt für den Jahresplan. Ein einzelner Brückentag-Block nutzt höchstens 5 Tage."
            >
              <Stepper
                id="bt-budget"
                value={state.budget}
                min={1}
                max={30}
                onChange={setBudget}
                suffix={plural(state.budget, "Tag", "Tage")}
                ariaLabel="Urlaubstage-Budget"
              />
            </Field>
          </div>

          {partialNames.length > 0 && (
            <label className="flex cursor-pointer items-start gap-3 rounded-control bg-ink-soft p-3.5 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={state.includePartial}
                onChange={(event) =>
                  update({ includePartial: event.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
              />
              <span>
                <span className="font-semibold">
                  {partialNames.join(" und ")} gilt bei mir
                </span>
                <span className="mt-0.5 block text-muted">
                  {partialNames.join(" und ")} ist in{" "}
                  {result.region.name} kein landesweiter Feiertag, sondern gilt
                  nur in bestimmten Gemeinden.
                </span>
              </span>
            </label>
          )}
        </div>
      </Card>

      {/* --- Ergebnis ----------------------------------------------------- */}
      {best ? (
        <ResultPanel
          footer={
            <ShareBar
              title={`Brückentage ${result.year} in ${result.region.name}`}
              text={`${best.freeDays} Tage am Stück frei mit ${best.vacationDays.length} Urlaubstagen`}
            />
          }
        >
          <NumberDisplay
            value={best.freeDays}
            suffix={plural(best.freeDays, "Tag frei", "Tage frei")}
            caption={`Längste freie Spanne ${result.year}`}
            announce={`${best.freeDays} Tage am Stück frei für ${best.vacationDays.length} Urlaubstage, von ${formatDate(best.freeStart)} bis ${formatDate(best.freeEnd)}`}
            hint={
              <>
                Setze{" "}
                <strong className="font-semibold text-ink">
                  {best.vacationDays.length}{" "}
                  {plural(best.vacationDays.length, "Urlaubstag", "Urlaubstage")}
                </strong>{" "}
                ein ({vacationLabel(best, result.year)}) und bekomme{" "}
                <strong className="font-semibold text-ink">
                  {best.freeDays} Tage am Stück
                </strong>{" "}
                frei: {formatDate(best.freeStart)} bis{" "}
                {formatDate(best.freeEnd)}
              </>
            }
          />
        </ResultPanel>
      ) : (
        <Card className="p-7 text-center">
          <p className="font-display text-lg font-semibold">
            {result.year} gibt es in {result.region.name} keine Brückentage.
          </p>
          <p className="mt-2 text-muted">
            Alle Feiertage fallen auf ein Wochenende. Probiere ein anderes Jahr.
          </p>
        </Card>
      )}

      {/* --- Kennzahlen --------------------------------------------------- */}
      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<CalendarCheck2 className="size-4" aria-hidden="true" />}
          label="Feiertage an Werktagen"
          value={String(result.holidaysOnWorkday)}
          hint={`von ${result.holidaysOnWorkday + result.holidaysOnWeekend} insgesamt`}
        />
        <Stat
          icon={<CalendarX2 className="size-4" aria-hidden="true" />}
          label="Aufs Wochenende gefallen"
          value={String(result.holidaysOnWeekend)}
          hint="bringen keinen freien Tag"
        />
        <Stat
          icon={<Sparkles className="size-4" aria-hidden="true" />}
          label={`Jahresplan mit ${result.plan.vacationDaysUsed} ${plural(result.plan.vacationDaysUsed, "Urlaubstag", "Urlaubstagen")}`}
          value={String(result.plan.freeDays)}
          hint="freie Tage insgesamt"
        />
      </dl>

      <AffiliateBlock slots={brueckentageAffiliate} result={result} />

      {/* --- Alle Anlässe ------------------------------------------------- */}
      {result.occasions.length > 0 && (
        <section aria-labelledby="bt-occasions">
          <h2
            id="bt-occasions"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Alle Brückentage {result.year} in {result.region.name}
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Die {result.plan.blocks.length} mit{" "}
            <span className="font-semibold text-accent">Im Plan</span> markierten
            Vorschläge passen zusammen in dein Budget von {state.budget}{" "}
            {plural(state.budget, "Urlaubstag", "Urlaubstagen")}.
          </p>

          <ul className="mt-4 flex flex-col gap-3">
            {result.occasions.map((occasion) => {
              const block = occasion.recommended;
              const longest = occasion.options
                .filter((option) => option.vacationDays.length <= state.budget)
                .at(-1);
              const showAlternative =
                longest && longest.freeDays > block.freeDays;

              return (
                <li
                  key={occasion.key}
                  className="surface-soft flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-5"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">
                        {occasion.holidays.map((h) => h.name).join(" + ")}
                      </h3>
                      {planned.has(occasion.key) && (
                        <span className="rounded-pill bg-accent-soft px-2 py-0.5 text-[11px] font-semibold tracking-wide text-accent uppercase">
                          Im Plan
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {occasion.holidays
                        .map((h) => dayLabel(h.date, result.year))
                        .join(", ")}{" "}
                      · Urlaub nehmen: {vacationLabel(block, result.year)}
                    </p>
                    {showAlternative && (
                      <p className="mt-1.5 text-[13px] text-muted">
                        Mehr Urlaub einsetzen:{" "}
                        {longest.vacationDays.length} Tage (
                        {vacationLabel(longest, result.year)}) ergeben{" "}
                        <span className="font-semibold text-ink">
                          {longest.freeDays} freie Tage
                        </span>
                        .
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-mono text-2xl leading-none font-semibold text-positive tabular-nums">
                      {block.freeDays}
                    </p>
                    <p className="mt-1 text-[12px] text-muted">
                      Tage frei für {block.vacationDays.length}{" "}
                      {plural(
                        block.vacationDays.length,
                        "Urlaubstag",
                        "Urlaubstage",
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* --- Alle Feiertage ----------------------------------------------- */}
      <details className="surface-soft group overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold transition-colors duration-(--dur-fast) hover:bg-ink-soft">
          Alle Feiertage {result.year} in {result.region.name}
          <span className="text-sm font-normal text-muted group-open:hidden">
            anzeigen
          </span>
        </summary>
        <ul className="divide-y divide-line border-t border-line">
          {result.holidays.map((holiday) => (
            <li
              key={`${holiday.date}-${holiday.name}`}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 text-[15px]"
            >
              <span className="w-24 shrink-0 font-mono text-sm text-muted tabular-nums">
                {formatWeekdayDate(holiday.date)}
              </span>
              <span className="font-medium">{holiday.name}</span>
              {holiday.onWeekend && (
                <span className="rounded-pill bg-ink-soft px-2 py-0.5 text-[11px] text-muted">
                  Wochenende
                </span>
              )}
              {holiday.partial && (
                <span className="rounded-pill bg-ink-soft px-2 py-0.5 text-[11px] text-muted">
                  nur regional
                </span>
              )}
              {holiday.note && (
                <span className="w-full text-[13px] text-muted">
                  {holiday.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

