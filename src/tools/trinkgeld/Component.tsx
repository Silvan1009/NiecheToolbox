"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Select,
  Stepper,
  TextInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro, plural } from "@/lib/format";
import { toNumber } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { trinkgeldAffiliate } from "./affiliate";
import {
  calculatePersonSplit,
  calculateTip,
  roundingLabels,
  type PersonEntry,
  type Rounding,
} from "./logic";

type BillMode = "gesamt" | "person";

interface State extends Record<string, unknown> {
  billMode: BillMode;
  /** Rechnungsbetrag gesamt in Euro – maßgeblich, wenn billMode "gesamt" ist. */
  bill: number;
  tipPercent: number;
  people: number;
  rounding: Rounding;
  /** Je-Person-Zeilen – maßgeblich, wenn billMode "person" ist. */
  persons: PersonEntry[];
}

const TIP_PRESETS = [0, 5, 10, 15, 20];

const isRounding = (value: unknown): value is Rounding =>
  typeof value === "string" && value in roundingLabels;

const isBillMode = (value: unknown): value is BillMode =>
  value === "gesamt" || value === "person";

function roundToCent(value: number) {
  return Math.round(value * 100) / 100;
}

function defaultPersons(
  bill: number,
  people: number,
  tipPercent: number,
): PersonEntry[] {
  const perHead = roundToCent(bill / people);
  return Array.from({ length: people }, (_, i) => ({
    name: `Person ${i + 1}`,
    bill: perHead,
    tipPercent,
  }));
}

function parsePersons(value: unknown, fallback: PersonEntry[]): PersonEntry[] {
  if (typeof value !== "string" || value === "") return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return fallback;
    const persons = parsed.slice(0, 50).map((entry): PersonEntry => {
      const record = entry as Record<string, unknown>;
      return {
        name: typeof record.name === "string" ? record.name.slice(0, 40) : "",
        bill: toNumber(record.bill, 0),
        tipPercent: toNumber(record.tipPercent, 10),
      };
    });
    return persons.length > 0 ? persons : fallback;
  } catch {
    return fallback;
  }
}

const BILL_MODES = [
  { value: "gesamt", label: "Gesamtbetrag" },
  { value: "person", label: "Pro Person" },
] as const satisfies readonly { value: BillMode; label: string }[];

function initialState(params: ToolParams | undefined): State {
  const bill = toNumber(params?.betrag, 48.6);
  const tipPercent = toNumber(params?.prozent, 10);
  const people = Math.max(1, Math.trunc(toNumber(params?.personen, 3)));

  return {
    billMode: isBillMode(params?.modus) ? params.modus : "gesamt",
    bill,
    tipPercent,
    people,
    rounding: isRounding(params?.runden) ? params.runden : "cent",
    persons: parsePersons(
      params?.personenliste,
      defaultPersons(bill, people, tipPercent),
    ),
  };
}

export default function TrinkgeldTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      billMode: isBillMode(search.get("modus"))
        ? (search.get("modus") as BillMode)
        : fallback.billMode,
      bill: toNumber(search.get("betrag"), fallback.bill),
      tipPercent: toNumber(search.get("prozent"), fallback.tipPercent),
      people: Math.max(
        1,
        Math.trunc(toNumber(search.get("personen"), fallback.people)),
      ),
      rounding: isRounding(search.get("runden"))
        ? (search.get("runden") as Rounding)
        : fallback.rounding,
      persons: parsePersons(search.get("personenliste"), fallback.persons),
    }),
    serialize: (next) => ({
      modus: next.billMode,
      betrag: String(next.bill),
      prozent: String(next.tipPercent),
      personen: String(next.people),
      runden: next.rounding,
      personenliste:
        next.billMode === "person" ? JSON.stringify(next.persons) : "",
    }),
  });

  function switchBillMode(mode: BillMode) {
    if (mode === state.billMode) return;
    if (mode === "person") {
      update({
        billMode: "person",
        persons: defaultPersons(state.bill, state.people, state.tipPercent),
      });
    } else {
      const totalBill = state.persons.reduce((sum, p) => sum + p.bill, 0);
      update({
        billMode: "gesamt",
        bill: roundToCent(totalBill),
        people: state.persons.length,
      });
    }
  }

  function updatePersonAt(index: number, patch: Partial<PersonEntry>) {
    const persons = state.persons.map((person, i) =>
      i === index ? { ...person, ...patch } : person,
    );
    update({ persons });
  }

  function addPerson() {
    const persons = [
      ...state.persons,
      {
        name: `Person ${state.persons.length + 1}`,
        bill: 0,
        tipPercent: state.tipPercent,
      },
    ];
    update({ persons });
  }

  function removePersonAt(index: number) {
    if (state.persons.length <= 1) return;
    update({ persons: state.persons.filter((_, i) => i !== index) });
  }

  function applyPercentToAll() {
    update({
      persons: state.persons.map((person) => ({
        ...person,
        tipPercent: state.tipPercent,
      })),
    });
  }

  const isPersonMode = state.billMode === "person";

  const result = useMemo(
    () =>
      calculateTip({
        bill: state.bill,
        tipPercent: state.tipPercent,
        people: state.people,
        rounding: state.rounding,
      }),
    [state.bill, state.tipPercent, state.people, state.rounding],
  );

  const split = useMemo(
    () => calculatePersonSplit(state.persons, state.rounding),
    [state.persons, state.rounding],
  );

  const summary = isPersonMode
    ? {
        total: split.total,
        tip: split.tip,
        effectiveTipPercent: split.effectiveTipPercent,
        roundingExtra: split.roundingExtra,
      }
    : {
        total: result.total,
        tip: result.tip,
        effectiveTipPercent: result.effectiveTipPercent,
        roundingExtra: result.roundingExtra,
      };

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Betrag" htmlFor="tg-bill">
            <div className="flex flex-col gap-2">
              <SegmentedControl
                value={state.billMode}
                options={BILL_MODES}
                onChange={switchBillMode}
                ariaLabel="Eingabeart"
              />

              {!isPersonMode && (
                <div className="relative">
                  <TextInput
                    id="tg-bill"
                    type="text"
                    inputMode="decimal"
                    aria-label="Rechnungsbetrag gesamt"
                    value={
                      state.bill === 0
                        ? ""
                        : String(state.bill).replace(".", ",")
                    }
                    placeholder="0,00"
                    onChange={(event) =>
                      update({ bill: toNumber(event.target.value, 0) })
                    }
                    className="pr-9 font-mono"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
                  >
                    €
                  </span>
                </div>
              )}

              {isPersonMode && (
                <p className="text-[13px] text-muted">
                  Jede Person mit eigenem Betrag und eigenem Trinkgeld – macht{" "}
                  {formatEuro(split.totalBill)} insgesamt für{" "}
                  {state.persons.length}{" "}
                  {plural(state.persons.length, "Person", "Personen")}.
                </p>
              )}
            </div>
          </Field>

          {!isPersonMode && (
            <Field label="Personen" htmlFor="tg-people">
              <Stepper
                id="tg-people"
                value={state.people}
                min={1}
                max={50}
                onChange={(people) => update({ people })}
                ariaLabel="Anzahl Personen"
              />
            </Field>
          )}

          <div className="sm:col-span-2">
            <Field
              label={isPersonMode ? "Standard-Trinkgeld" : "Trinkgeld"}
              htmlFor="tg-tip"
              hint={
                isPersonMode
                  ? "Gilt für neu hinzugefügte Personen – jede Zeile kann abweichen."
                  : undefined
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                {TIP_PRESETS.map((preset) => {
                  const active = state.tipPercent === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      aria-pressed={active}
                      onClick={() => update({ tipPercent: preset })}
                      className={`h-10 rounded-pill px-4 text-sm font-semibold transition-colors duration-(--dur-fast) ${
                        active
                          ? "bg-accent text-white shadow-soft"
                          : "bg-surface text-muted shadow-[var(--elev-inset)] hover:bg-ink-soft hover:text-ink"
                      }`}
                    >
                      {preset} %
                    </button>
                  );
                })}
                <div className="relative w-28">
                  <TextInput
                    id="tg-tip"
                    type="text"
                    inputMode="decimal"
                    aria-label="Trinkgeld in Prozent"
                    value={String(state.tipPercent).replace(".", ",")}
                    onChange={(event) =>
                      update({ tipPercent: toNumber(event.target.value, 0) })
                    }
                    className="pr-8 text-center font-mono"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted"
                  >
                    %
                  </span>
                </div>
                {isPersonMode && (
                  <button
                    type="button"
                    onClick={applyPercentToAll}
                    className="h-10 rounded-pill bg-ink-soft px-4 text-sm font-semibold text-ink transition-colors duration-(--dur-fast) hover:bg-ink-soft/70"
                  >
                    Auf alle anwenden
                  </button>
                )}
              </div>
            </Field>
          </div>

          {isPersonMode && (
            <div className="sm:col-span-2">
              <Field label="Personen" htmlFor="tg-person-0-name">
                <div className="flex flex-col gap-3">
                  {state.persons.map((person, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-2 rounded-control bg-ink-soft p-3"
                    >
                      <TextInput
                        id={`tg-person-${index}-name`}
                        type="text"
                        aria-label={`Name Person ${index + 1}`}
                        placeholder={`Person ${index + 1}`}
                        value={person.name}
                        onChange={(event) =>
                          updatePersonAt(index, { name: event.target.value })
                        }
                        className="min-w-0 flex-1 basis-32 bg-surface"
                      />
                      <div className="relative w-28 shrink-0">
                        <TextInput
                          type="text"
                          inputMode="decimal"
                          aria-label={`Betrag Person ${index + 1}`}
                          value={
                            person.bill === 0
                              ? ""
                              : String(person.bill).replace(".", ",")
                          }
                          placeholder="0,00"
                          onChange={(event) =>
                            updatePersonAt(index, {
                              bill: toNumber(event.target.value, 0),
                            })
                          }
                          className="bg-surface pr-8 text-right font-mono"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted"
                        >
                          €
                        </span>
                      </div>
                      <div className="relative w-20 shrink-0">
                        <TextInput
                          type="text"
                          inputMode="decimal"
                          aria-label={`Trinkgeld Person ${index + 1} in Prozent`}
                          value={String(person.tipPercent).replace(".", ",")}
                          onChange={(event) =>
                            updatePersonAt(index, {
                              tipPercent: toNumber(event.target.value, 0),
                            })
                          }
                          className="bg-surface pr-7 text-right font-mono"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-sm text-muted"
                        >
                          %
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePersonAt(index)}
                        disabled={state.persons.length <= 1}
                        aria-label={`${person.name || `Person ${index + 1}`} entfernen`}
                        className="grid size-9 shrink-0 place-items-center rounded-control text-lg text-muted transition-colors duration-(--dur-fast) hover:bg-surface hover:text-ink disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPerson}
                    className="self-start rounded-pill bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-[var(--elev-inset)] transition-colors duration-(--dur-fast) hover:bg-ink-soft"
                  >
                    + Person hinzufügen
                  </button>
                </div>
              </Field>
            </div>
          )}

          <div className="sm:col-span-2">
            <Field
              label="Aufrunden"
              htmlFor="tg-rounding"
              hint="Aufrunden macht das Zahlen einfacher – der Aufschlag geht als Trinkgeld mit."
            >
              <Select
                id="tg-rounding"
                value={state.rounding}
                onChange={(event) =>
                  update({ rounding: event.target.value as Rounding })
                }
              >
                {Object.entries(roundingLabels)
                  .filter(([value]) => !isPersonMode || value !== "total-100")
                  .map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
              </Select>
            </Field>
          </div>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Rechnung teilen"
            text={
              isPersonMode
                ? `${formatEuro(summary.total)} insgesamt aufgeteilt`
                : `${formatEuro(result.perPerson)} pro Person`
            }
          />
        }
      >
        {isPersonMode ? (
          <NumberDisplay
            value={summary.total}
            format={formatEuro}
            suffix="insgesamt"
            caption={`Aufgeteilt auf ${state.persons.length} ${plural(state.persons.length, "Person", "Personen")}`}
            announce={`${formatEuro(summary.total)} insgesamt, davon ${formatEuro(summary.tip)} Trinkgeld.`}
            hint={
              <>
                Auf den Tisch kommen{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(summary.total)}
                </strong>{" "}
                – davon {formatEuro(summary.tip)} Trinkgeld.
              </>
            }
          />
        ) : (
          <NumberDisplay
            value={result.perPerson}
            format={formatEuro}
            suffix="pro Person"
            caption={`Aufgeteilt auf ${result.people} ${plural(result.people, "Person", "Personen")}`}
            announce={`${formatEuro(result.perPerson)} pro Person, insgesamt ${formatEuro(result.total)} inklusive ${formatEuro(result.tip)} Trinkgeld.`}
            hint={
              <>
                Jede Person zahlt{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.perPerson)}
                </strong>
                . Auf den Tisch kommen{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.total)}
                </strong>{" "}
                – davon {formatEuro(result.tip)} Trinkgeld.
              </>
            }
          />
        )}
      </ResultPanel>

      {isPersonMode && (
        <section className="surface-soft p-6" aria-label="Aufteilung je Person">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Wer zahlt was
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {split.people.map((person, index) => (
              <li
                key={index}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-3 first:border-0 first:pt-0"
              >
                <span className="text-[15px]">
                  {person.name || `Person ${index + 1}`}
                  <span className="ml-2 text-[13px] text-muted">
                    {formatDecimal(person.tipPercent)} %
                  </span>
                </span>
                <span className="font-mono font-semibold tabular-nums">
                  {formatEuro(person.total)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Gesamtbetrag"
          value={formatEuro(summary.total)}
          hint="mit Trinkgeld"
        />
        <Stat
          label="Trinkgeld"
          value={formatEuro(summary.tip)}
          hint="für den Service"
        />
        <Stat
          label="Trinkgeld effektiv"
          value={`${formatDecimal(summary.effectiveTipPercent)} %`}
          hint={
            summary.roundingExtra > 0
              ? `davon ${formatEuro(summary.roundingExtra)} durch Aufrunden`
              : "genau wie eingestellt"
          }
        />
      </dl>

      <AffiliateBlock
        slots={trinkgeldAffiliate}
        result={isPersonMode ? split : result}
      />
    </div>
  );
}
