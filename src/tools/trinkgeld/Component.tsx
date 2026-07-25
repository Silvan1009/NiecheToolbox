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
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro, plural } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { trinkgeldAffiliate } from "./affiliate";
import { calculateTip, roundingLabels, type Rounding } from "./logic";

type BillMode = "gesamt" | "person";

interface State extends Record<string, unknown> {
  billMode: BillMode;
  /** Rechnungsbetrag gesamt in Euro – maßgeblich, wenn billMode "gesamt" ist. */
  bill: number;
  /** Betrag pro Person in Euro – maßgeblich, wenn billMode "person" ist. */
  billPerPerson: number;
  tipPercent: number;
  people: number;
  rounding: Rounding;
}

const TIP_PRESETS = [0, 5, 10, 15, 20];

const isRounding = (value: unknown): value is Rounding =>
  typeof value === "string" && value in roundingLabels;

const isBillMode = (value: unknown): value is BillMode =>
  value === "gesamt" || value === "person";

function toNumber(value: unknown, fallback: number) {
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function roundToCent(value: number) {
  return Math.round(value * 100) / 100;
}

const BILL_MODES = [
  { value: "gesamt", label: "Gesamtbetrag" },
  { value: "person", label: "Pro Person" },
] as const satisfies readonly { value: BillMode; label: string }[];

function initialState(params: ToolParams | undefined): State {
  return {
    billMode: isBillMode(params?.modus) ? params.modus : "gesamt",
    bill: toNumber(params?.betrag, 48.6),
    billPerPerson: toNumber(params?.proPerson, 16.2),
    tipPercent: toNumber(params?.prozent, 10),
    people: Math.max(1, Math.trunc(toNumber(params?.personen, 3))),
    rounding: isRounding(params?.runden) ? params.runden : "cent",
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
      billPerPerson: toNumber(search.get("proPerson"), fallback.billPerPerson),
      tipPercent: toNumber(search.get("prozent"), fallback.tipPercent),
      people: Math.max(
        1,
        Math.trunc(toNumber(search.get("personen"), fallback.people)),
      ),
      rounding: isRounding(search.get("runden"))
        ? (search.get("runden") as Rounding)
        : fallback.rounding,
    }),
    serialize: (next) => ({
      modus: next.billMode,
      betrag: String(next.bill),
      proPerson: String(next.billPerPerson),
      prozent: String(next.tipPercent),
      personen: String(next.people),
      runden: next.rounding,
    }),
  });

  function switchBillMode(mode: BillMode) {
    if (mode === state.billMode) return;
    if (mode === "person") {
      update({
        billMode: "person",
        billPerPerson: roundToCent(state.bill / state.people),
      });
    } else {
      update({
        billMode: "gesamt",
        bill: roundToCent(state.billPerPerson * state.people),
      });
    }
  }

  // Bei "Pro Person" bestimmt der eingegebene Wert die Summe – ändert sich die
  // Personenzahl, skaliert die Gesamtrechnung mit, statt fix zu bleiben.
  const effectiveBill =
    state.billMode === "person" ? state.billPerPerson * state.people : state.bill;

  const result = useMemo(
    () =>
      calculateTip({
        bill: effectiveBill,
        tipPercent: state.tipPercent,
        people: state.people,
        rounding: state.rounding,
      }),
    [effectiveBill, state.tipPercent, state.people, state.rounding],
  );

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

              <div className="relative">
                <TextInput
                  id="tg-bill"
                  type="text"
                  inputMode="decimal"
                  aria-label={
                    state.billMode === "person"
                      ? "Betrag pro Person"
                      : "Rechnungsbetrag gesamt"
                  }
                  value={
                    state.billMode === "person"
                      ? state.billPerPerson === 0
                        ? ""
                        : String(state.billPerPerson).replace(".", ",")
                      : state.bill === 0
                        ? ""
                        : String(state.bill).replace(".", ",")
                  }
                  placeholder="0,00"
                  onChange={(event) => {
                    const value = toNumber(event.target.value, 0);
                    if (state.billMode === "person") {
                      update({ billPerPerson: value });
                    } else {
                      update({ bill: value });
                    }
                  }}
                  className="pr-9 font-mono"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
                >
                  €
                </span>
              </div>

              {state.billMode === "person" && (
                <p className="text-[13px] text-muted">
                  Macht {formatEuro(effectiveBill)} insgesamt für {state.people}{" "}
                  {plural(state.people, "Person", "Personen")}.
                </p>
              )}
            </div>
          </Field>

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

          <div className="sm:col-span-2">
            <Field label="Trinkgeld" htmlFor="tg-tip">
              <div className="flex flex-wrap gap-2">
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
              </div>
            </Field>
          </div>

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
                {Object.entries(roundingLabels).map(([value, label]) => (
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
            text={`${formatEuro(result.perPerson)} pro Person`}
          />
        }
      >
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
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat label="Gesamtbetrag" value={formatEuro(result.total)} hint="mit Trinkgeld" />
        <Stat label="Trinkgeld" value={formatEuro(result.tip)} hint="für den Service" />
        <Stat
          label="Trinkgeld effektiv"
          value={`${formatDecimal(result.effectiveTipPercent)} %`}
          hint={
            result.roundingExtra > 0
              ? `davon ${formatEuro(result.roundingExtra)} durch Aufrunden`
              : "genau wie eingestellt"
          }
        />
      </dl>

      <AffiliateBlock slots={trinkgeldAffiliate} result={result} />
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="surface-soft p-5">
      <dt className="text-[13px] font-semibold text-muted">{label}</dt>
      <dd className="mt-2">
        <span className="font-mono text-2xl leading-none font-semibold tabular-nums">
          {value}
        </span>
        <span className="mt-1 block text-[13px] text-muted">{hint}</span>
      </dd>
    </div>
  );
}
