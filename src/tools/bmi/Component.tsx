"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Field, UnitInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatAmount } from "@/lib/format";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { bmiKategorieLabels, calculateBmi, defaultInput } from "./logic";

interface State extends Record<string, unknown> {
  gewichtKg: number;
  groesseCm: number;
  /** 0 = nicht angegeben – ändert nur den Hinweis für Minderjährige, nicht den BMI. */
  alter: number;
}

const DEFAULTS: State = { ...defaultInput(), alter: 0 };

function initialState(params: ToolParams | undefined): State {
  return {
    gewichtKg: toNumber(params?.kg, DEFAULTS.gewichtKg),
    groesseCm: toNumber(params?.cm, DEFAULTS.groesseCm),
    alter: toNumber(params?.alter, DEFAULTS.alter),
  };
}

export default function BmiTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      gewichtKg: toNumber(search.get("kg"), fallback.gewichtKg),
      groesseCm: toNumber(search.get("cm"), fallback.groesseCm),
      alter: toNumber(search.get("alter"), fallback.alter),
    }),
    serialize: (next) => ({
      kg: urlValue(next.gewichtKg, DEFAULTS.gewichtKg),
      cm: urlValue(next.groesseCm, DEFAULTS.groesseCm),
      alter: urlValue(next.alter, DEFAULTS.alter),
    }),
  });

  const result = useMemo(
    () =>
      calculateBmi({
        gewichtKg: state.gewichtKg,
        groesseCm: state.groesseCm,
        alter: state.alter > 0 ? state.alter : undefined,
      }),
    [state.gewichtKg, state.groesseCm, state.alter],
  );

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Gewicht" htmlFor="bmi-kg">
            <UnitInput
              id="bmi-kg"
              unit="kg"
              value={state.gewichtKg}
              onChange={(gewichtKg) => update({ gewichtKg })}
            />
          </Field>
          <Field label="Größe" htmlFor="bmi-cm">
            <UnitInput
              id="bmi-cm"
              unit="cm"
              value={state.groesseCm}
              onChange={(groesseCm) => update({ groesseCm })}
            />
          </Field>
          <Field
            label="Alter (optional)"
            htmlFor="bmi-alter"
            hint="Nur für einen Hinweis bei Minderjährigen – ändert den BMI nicht."
          >
            <UnitInput
              id="bmi-alter"
              unit="Jahre"
              value={state.alter}
              onChange={(alter) => update({ alter })}
              blankWhenZero
            />
          </Field>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="BMI-Rechner"
            text={`BMI ${formatAmount(result.bmi)} – ${bmiKategorieLabels[result.kategorie]}`}
          />
        }
      >
        <NumberDisplay
          value={result.bmi}
          format={formatAmount}
          suffix="kg/m²"
          caption="Dein BMI"
          announce={`BMI ${formatAmount(result.bmi)}, ${bmiKategorieLabels[result.kategorie]}.`}
          hint={
            <>
              Das entspricht{" "}
              <strong className="font-semibold text-ink">
                {bmiKategorieLabels[result.kategorie]}
              </strong>{" "}
              nach der WHO-Einteilung. Normalgewicht liegt bei deiner Größe
              zwischen{" "}
              <strong className="font-semibold text-ink">
                {formatAmount(result.normalgewichtMinKg)} und{" "}
                {formatAmount(result.normalgewichtMaxKg)} kg
              </strong>
              .
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Kategorie"
          value={bmiKategorieLabels[result.kategorie]}
          hint="WHO-Einteilung für Erwachsene"
        />
        <Stat
          label="Normalgewichtsspanne"
          value={`${formatAmount(result.normalgewichtMinKg)} – ${formatAmount(result.normalgewichtMaxKg)} kg`}
          hint="entspricht BMI 18,5–24,9 bei deiner Größe"
        />
      </dl>

      {result.warnings.length > 0 && (
        <section aria-labelledby="bmi-hinweise" className="surface-soft p-6">
          <h2
            id="bmi-hinweise"
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
