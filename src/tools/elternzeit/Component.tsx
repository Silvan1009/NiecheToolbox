"use client";

import { useMemo } from "react";
import { AlertTriangle, CalendarClock, Flag, Play, Square } from "lucide-react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, Stepper, TextInput, Toggle } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { isValidIso } from "@/lib/date";
import { formatDate, plural } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { elternzeitAffiliate } from "./affiliate";
import { calculateElternzeit, type MilestoneKind } from "./logic";

interface State extends Record<string, unknown> {
  birthDate: string;
  extendedMutterschutz: boolean;
  singleParent: boolean;
  monthsOne: number;
  startOne: number;
  monthsTwo: number;
  startTwo: number;
}

function toCount(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function initialState(params: ToolParams | undefined): State {
  const fromParams = params?.termin;
  return {
    birthDate: isValidIso(fromParams)
      ? fromParams
      : String(params?.heute ?? "2026-06-10"),
    extendedMutterschutz: params?.mehrlinge === "1",
    singleParent: params?.allein === "1",
    monthsOne: toCount(params?.m1, 12),
    startOne: toCount(params?.s1, 1),
    monthsTwo: toCount(params?.m2, 2),
    startTwo: toCount(params?.s2, 13),
  };
}

const kindStyles: Record<
  MilestoneKind,
  { icon: typeof Flag; className: string }
> = {
  frist: { icon: AlertTriangle, className: "bg-accent-soft text-accent" },
  start: { icon: Play, className: "bg-positive-soft text-positive" },
  ende: { icon: Square, className: "bg-ink-soft text-muted" },
  info: { icon: Flag, className: "bg-ink-soft text-muted" },
};

export default function ElternzeitTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const termin = search.get("termin");
      return {
        birthDate: isValidIso(termin) ? termin : fallback.birthDate,
        extendedMutterschutz: search.has("mehrlinge")
          ? search.get("mehrlinge") === "1"
          : fallback.extendedMutterschutz,
        singleParent: search.has("allein")
          ? search.get("allein") === "1"
          : fallback.singleParent,
        monthsOne: toCount(search.get("m1"), fallback.monthsOne),
        startOne: toCount(search.get("s1"), fallback.startOne),
        monthsTwo: toCount(search.get("m2"), fallback.monthsTwo),
        startTwo: toCount(search.get("s2"), fallback.startTwo),
      };
    },
    serialize: (next) => ({
      termin: next.birthDate,
      mehrlinge: next.extendedMutterschutz ? "1" : "",
      allein: next.singleParent ? "1" : "",
      m1: String(next.monthsOne),
      s1: String(next.startOne),
      m2: String(next.monthsTwo),
      s2: String(next.startTwo),
    }),
  });

  const validDate = isValidIso(state.birthDate);

  const result = useMemo(() => {
    if (!validDate) return null;
    return calculateElternzeit({
      birthDate: state.birthDate,
      extendedMutterschutz: state.extendedMutterschutz,
      singleParent: state.singleParent,
      parentOne: { months: state.monthsOne, startMonth: state.startOne },
      parentTwo: { months: state.monthsTwo, startMonth: state.startTwo },
    });
  }, [
    validDate,
    state.birthDate,
    state.extendedMutterschutz,
    state.singleParent,
    state.monthsOne,
    state.startOne,
    state.monthsTwo,
    state.startTwo,
  ]);

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <Field
          label="Errechneter Geburtstermin"
          htmlFor="ez-date"
          hint="Oder das tatsächliche Geburtsdatum, wenn das Kind schon da ist."
        >
          <TextInput
            id="ez-date"
            type="date"
            value={state.birthDate}
            aria-invalid={!validDate}
            onChange={(event) => update({ birthDate: event.target.value })}
            className="max-w-52 font-mono"
          />
        </Field>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <ParentFields
            title="Elternteil 1"
            note="Die Person, die entbindet – für sie gilt der Mutterschutz."
            idPrefix="ez-p1"
            months={state.monthsOne}
            startMonth={state.startOne}
            onMonths={(monthsOne) => update({ monthsOne })}
            onStart={(startOne) => update({ startOne })}
          />
          <ParentFields
            title="Elternteil 2"
            note="Partner*in – kann parallel oder danach übernehmen."
            idPrefix="ez-p2"
            months={state.monthsTwo}
            startMonth={state.startTwo}
            onMonths={(monthsTwo) => update({ monthsTwo })}
            onStart={(startTwo) => update({ startTwo })}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Toggle
            checked={state.extendedMutterschutz}
            onChange={(extendedMutterschutz) =>
              update({ extendedMutterschutz })
            }
            label="Mehrlings- oder Frühgeburt"
            hint="Der Mutterschutz nach der Geburt beträgt dann 12 statt 8 Wochen."
          />
          <Toggle
            checked={state.singleParent}
            onChange={(singleParent) => update({ singleParent })}
            label="Alleinerziehend"
            hint="Dann gibt es die 14 Monate Basiselterngeld ohne zweiten Elternteil."
          />
        </div>
      </Card>

      {!result ? (
        <Card className="p-7 text-center">
          <p className="font-display text-lg font-semibold">
            Trage einen Geburtstermin ein, um den Plan zu sehen.
          </p>
          <p className="mt-2 text-muted">
            Daraus ergeben sich alle Lebensmonate und Fristen.
          </p>
        </Card>
      ) : (
        <>
          <ResultPanel
            footer={
              <ShareBar
                title="Elternzeit-Plan"
                text={`${result.totalMonths} Monate Elternzeit ab ${formatDate(result.birthDate)}`}
              />
            }
          >
            <NumberDisplay
              value={result.totalMonths}
              suffix={plural(result.totalMonths, "Monat frei", "Monate frei")}
              caption="Geplante Elternzeit insgesamt"
              tone={result.totalMonths > 0 ? "positive" : "ink"}
              announce={`${result.totalMonths} Monate Elternzeit geplant, davon ${result.elterngeld.coveredMonths} mit Basiselterngeld.`}
              hint={
                <>
                  Davon{" "}
                  <strong className="font-semibold text-ink">
                    {result.elterngeld.coveredMonths}{" "}
                    {plural(result.elterngeld.coveredMonths, "Monat", "Monate")}
                  </strong>{" "}
                  mit Basiselterngeld
                  {result.elterngeld.uncoveredMonths > 0 && (
                    <>
                      {" "}
                      und {result.elterngeld.uncoveredMonths}{" "}
                      {plural(
                        result.elterngeld.uncoveredMonths,
                        "Monat",
                        "Monate",
                      )}{" "}
                      unbezahlt
                    </>
                  )}
                  .{" "}
                  {result.elterngeld.partnerBonus
                    ? "Die zwei Partnermonate sind dabei."
                    : "Ohne die zwei Partnermonate."}
                </>
              }
            />
          </ResultPanel>

          {result.periods.length > 0 && (
            <section aria-labelledby="ez-periods">
              <h2
                id="ez-periods"
                className="font-display text-xl font-semibold tracking-tight"
              >
                Die Zeiträume
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {result.periods.map((period) => (
                  <li key={period.label} className="surface-soft p-5">
                    <p className="text-[13px] font-semibold tracking-wide text-muted uppercase">
                      {period.label}
                    </p>
                    <p className="mt-2 font-mono text-[17px] font-semibold tabular-nums">
                      {formatDate(period.start)} – {formatDate(period.end)}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {period.months} {plural(period.months, "Monat", "Monate")}{" "}
                      · Lebensmonat {period.startMonth} bis {period.endMonth}
                    </p>
                    {period.note && (
                      <p className="mt-2 text-[13px] text-muted">
                        {period.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="ez-timeline">
            <h2
              id="ez-timeline"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Termine und Fristen
            </h2>
            <ol className="mt-4 flex flex-col gap-2">
              {result.milestones.map((milestone) => {
                const { icon: Icon, className } = kindStyles[milestone.kind];
                return (
                  <li
                    key={`${milestone.date}-${milestone.title}`}
                    className="surface-soft flex items-start gap-4 p-4"
                  >
                    <span
                      className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-control ${className}`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-mono text-sm font-semibold tabular-nums">
                          {formatDate(milestone.date)}
                        </span>
                        <span className="font-semibold">{milestone.title}</span>
                      </div>
                      <p className="mt-1 text-[14px] text-muted">
                        {milestone.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {result.warnings.length > 0 && (
            <section
              aria-labelledby="ez-warnings"
              className="rounded-card bg-accent-soft p-5 shadow-[inset_0_0_0_1px_var(--accent-ring)]"
            >
              <h2
                id="ez-warnings"
                className="flex items-center gap-2 font-display text-base font-semibold"
              >
                <CalendarClock
                  className="size-4 text-accent"
                  aria-hidden="true"
                />
                Darauf solltest du achten
              </h2>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] text-muted">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          )}

          <AffiliateBlock slots={elternzeitAffiliate} result={result} />
        </>
      )}
    </div>
  );
}

function ParentFields({
  title,
  note,
  idPrefix,
  months,
  startMonth,
  onMonths,
  onStart,
}: {
  title: string;
  note: string;
  idPrefix: string;
  months: number;
  startMonth: number;
  onMonths: (value: number) => void;
  onStart: (value: number) => void;
}) {
  return (
    <fieldset className="rounded-control bg-ink-soft p-4">
      <legend className="px-1 text-[13px] font-semibold tracking-wide text-muted uppercase">
        {title}
      </legend>
      <p className="text-[13px] text-muted">{note}</p>
      <div className="mt-3 flex flex-col gap-4">
        <Field label="Monate Elternzeit" htmlFor={`${idPrefix}-months`}>
          <Stepper
            id={`${idPrefix}-months`}
            value={months}
            min={0}
            max={36}
            onChange={onMonths}
            suffix={plural(months, "Monat", "Monate")}
            ariaLabel={`${title}: Monate Elternzeit`}
          />
        </Field>
        <Field
          label="Ab Lebensmonat"
          htmlFor={`${idPrefix}-start`}
          hint="Lebensmonat 1 beginnt am Geburtstag."
        >
          <Stepper
            id={`${idPrefix}-start`}
            value={startMonth}
            min={1}
            max={96}
            onChange={onStart}
            ariaLabel={`${title}: Start-Lebensmonat`}
          />
        </Field>
      </div>
    </fieldset>
  );
}
