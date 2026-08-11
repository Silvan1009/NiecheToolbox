"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, UnitInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatInteger, formatRate } from "@/lib/format";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import {
  aktivitaetOptions,
  calculateKalorienbedarf,
  defaultInput,
  type Aktivitaetslevel,
  type Geschlecht,
} from "./logic";

interface State extends Record<string, unknown> {
  gewichtKg: number;
  groesseCm: number;
  alter: number;
  geschlecht: Geschlecht;
  aktivitaet: Aktivitaetslevel;
}

const DEFAULTS: State = { ...defaultInput() };

const GESCHLECHT_OPTIONS = [
  { value: "maennlich", label: "Männlich" },
  { value: "weiblich", label: "Weiblich" },
] as const satisfies readonly { value: Geschlecht; label: string }[];

const isGeschlecht = (value: unknown): value is Geschlecht =>
  value === "maennlich" || value === "weiblich";

const isAktivitaet = (value: unknown): value is Aktivitaetslevel =>
  aktivitaetOptions.some((option) => option.id === value);

function initialState(params: ToolParams | undefined): State {
  return {
    gewichtKg: toNumber(params?.kg, DEFAULTS.gewichtKg),
    groesseCm: toNumber(params?.cm, DEFAULTS.groesseCm),
    alter: toNumber(params?.alter, DEFAULTS.alter),
    geschlecht: isGeschlecht(params?.geschlecht)
      ? params.geschlecht
      : DEFAULTS.geschlecht,
    aktivitaet: isAktivitaet(params?.aktivitaet)
      ? params.aktivitaet
      : DEFAULTS.aktivitaet,
  };
}

export default function KalorienbedarfTool({
  params,
}: {
  params?: ToolParams;
}) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const geschlecht = search.get("geschlecht");
      const aktivitaet = search.get("aktivitaet");
      return {
        gewichtKg: toNumber(search.get("kg"), fallback.gewichtKg),
        groesseCm: toNumber(search.get("cm"), fallback.groesseCm),
        alter: toNumber(search.get("alter"), fallback.alter),
        geschlecht: isGeschlecht(geschlecht) ? geschlecht : fallback.geschlecht,
        aktivitaet: isAktivitaet(aktivitaet) ? aktivitaet : fallback.aktivitaet,
      };
    },
    serialize: (next) => ({
      kg: urlValue(next.gewichtKg, DEFAULTS.gewichtKg),
      cm: urlValue(next.groesseCm, DEFAULTS.groesseCm),
      alter: urlValue(next.alter, DEFAULTS.alter),
      geschlecht: urlValue(next.geschlecht, DEFAULTS.geschlecht),
      aktivitaet: urlValue(next.aktivitaet, DEFAULTS.aktivitaet),
    }),
  });

  const result = useMemo(() => calculateKalorienbedarf(state), [state]);

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Gewicht" htmlFor="kb-kg">
            <UnitInput
              id="kb-kg"
              unit="kg"
              value={state.gewichtKg}
              onChange={(gewichtKg) => update({ gewichtKg })}
            />
          </Field>
          <Field label="Größe" htmlFor="kb-cm">
            <UnitInput
              id="kb-cm"
              unit="cm"
              value={state.groesseCm}
              onChange={(groesseCm) => update({ groesseCm })}
            />
          </Field>
          <Field label="Alter" htmlFor="kb-alter">
            <UnitInput
              id="kb-alter"
              unit="Jahre"
              value={state.alter}
              onChange={(alter) => update({ alter })}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Geschlecht" htmlFor="kb-geschlecht">
            <SegmentedControl
              value={state.geschlecht}
              options={GESCHLECHT_OPTIONS}
              onChange={(geschlecht) => update({ geschlecht })}
              ariaLabel="Geschlecht"
            />
          </Field>
        </div>

        <fieldset className="mt-6">
          <legend className="text-[13px] font-semibold tracking-wide text-muted uppercase">
            Wie aktiv bist du?
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {aktivitaetOptions.map((option) => {
              const active = state.aktivitaet === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer flex-col gap-0.5 rounded-control p-3.5 text-left transition-shadow duration-(--dur-fast) ${
                    active
                      ? "bg-accent-soft shadow-[inset_0_0_0_1px_var(--accent)]"
                      : "bg-surface shadow-[var(--elev-inset)] hover:bg-ink-soft"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="kb-aktivitaet"
                      value={option.id}
                      checked={active}
                      onChange={() => update({ aktivitaet: option.id })}
                      className="size-4 accent-[var(--accent)]"
                    />
                    <span className="text-[15px] font-semibold">
                      {option.label}
                    </span>
                    <span className="font-mono text-[13px] text-muted">
                      PAL {formatRate(option.pal)}
                    </span>
                  </span>
                  <span className="pl-6 text-[13px] text-muted">
                    {option.hint}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Kalorienbedarf-Rechner"
            text={`${formatInteger(result.gesamtumsatz)} kcal Gesamtumsatz am Tag`}
          />
        }
      >
        <NumberDisplay
          value={result.gesamtumsatz}
          format={formatInteger}
          suffix="kcal am Tag"
          caption="Dein Kalorienbedarf"
          announce={`${formatInteger(result.gesamtumsatz)} Kilokalorien Gesamtumsatz am Tag.`}
          hint={
            <>
              Davon{" "}
              <strong className="font-semibold text-ink">
                {formatInteger(result.grundumsatz)} kcal
              </strong>{" "}
              Grundumsatz allein für die Körperfunktionen in Ruhe – der Rest
              kommt aus deiner Aktivität.
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Grundumsatz"
          value={`${formatInteger(result.grundumsatz)} kcal`}
          hint="pro Tag, in völliger Ruhe"
        />
        <Stat
          label="Aktivitätsfaktor"
          value={`PAL ${formatRate(result.pal)}`}
          hint="multipliziert den Grundumsatz zum Gesamtumsatz"
        />
      </dl>

      {result.warnings.length > 0 && (
        <section aria-labelledby="kb-hinweise" className="surface-soft p-6">
          <h2
            id="kb-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Wichtig dazu
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-[15px] text-muted">
            {result.warnings.map((warning) => (
              <li key={warning} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-pill bg-accent"
                />
                {warning}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
