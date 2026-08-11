"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import {
  Field,
  Select,
  Stepper,
  TextArea,
  TextInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatInteger } from "@/lib/format";
import { toNumber } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { backformAffiliate } from "./affiliate";
import {
  convertForm,
  formLabel,
  shapes,
  type FormSpec,
  type ShapeKind,
} from "./logic";

interface State extends Record<string, unknown> {
  sourceKind: ShapeKind;
  sourceA: number;
  sourceB: number;
  sourceCount: number;
  targetKind: ShapeKind;
  targetA: number;
  targetB: number;
  targetCount: number;
  ingredients: string;
}

/** Die Größen, die im Handel üblich sind – ein Klick statt Zahleneingabe. */
const ROUND_PRESETS = [16, 18, 20, 22, 24, 26, 28, 30];

const SHAPE_ORDER: ShapeKind[] = [
  "rund",
  "quadratisch",
  "rechteckig",
  "kastenform",
  "blech",
  "muffins",
];

const isShape = (value: unknown): value is ShapeKind =>
  typeof value === "string" && value in shapes;

function initialState(params: ToolParams | undefined): State {
  return {
    sourceKind: isShape(params?.vonForm) ? params.vonForm : "rund",
    sourceA: toNumber(params?.vonA, 26),
    sourceB: toNumber(params?.vonB, 11),
    sourceCount: Math.trunc(toNumber(params?.vonAnzahl, 12)),
    targetKind: isShape(params?.zuForm) ? params.zuForm : "rund",
    targetA: toNumber(params?.zuA, 20),
    targetB: toNumber(params?.zuB, 11),
    targetCount: Math.trunc(toNumber(params?.zuAnzahl, 12)),
    // Die Zutatenliste steht bewusst nicht in der URL: sie kann lang sein und
    // gehört niemandem außer der Person, die sie eingetippt hat.
    ingredients: "",
  };
}

export default function BackformTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      sourceKind: isShape(search.get("vonForm"))
        ? (search.get("vonForm") as ShapeKind)
        : fallback.sourceKind,
      sourceA: toNumber(search.get("vonA"), fallback.sourceA),
      sourceB: toNumber(search.get("vonB"), fallback.sourceB),
      sourceCount: Math.trunc(
        toNumber(search.get("vonAnzahl"), fallback.sourceCount),
      ),
      targetKind: isShape(search.get("zuForm"))
        ? (search.get("zuForm") as ShapeKind)
        : fallback.targetKind,
      targetA: toNumber(search.get("zuA"), fallback.targetA),
      targetB: toNumber(search.get("zuB"), fallback.targetB),
      targetCount: Math.trunc(
        toNumber(search.get("zuAnzahl"), fallback.targetCount),
      ),
      ingredients: fallback.ingredients,
    }),
    serialize: (next) => ({
      vonForm: next.sourceKind,
      vonA: String(next.sourceA),
      vonB: String(next.sourceB),
      vonAnzahl: String(next.sourceCount),
      zuForm: next.targetKind,
      zuA: String(next.targetA),
      zuB: String(next.targetB),
      zuAnzahl: String(next.targetCount),
    }),
  });

  const result = useMemo(
    () =>
      convertForm({
        source: {
          kind: state.sourceKind,
          a: state.sourceA,
          b: state.sourceB,
          count: state.sourceCount,
        },
        target: {
          kind: state.targetKind,
          a: state.targetA,
          b: state.targetB,
          count: state.targetCount,
        },
        ingredients: state.ingredients,
      }),
    [
      state.sourceKind,
      state.sourceA,
      state.sourceB,
      state.sourceCount,
      state.targetKind,
      state.targetA,
      state.targetB,
      state.targetCount,
      state.ingredients,
    ],
  );

  // Die Logik gibt die normalisierten Formen zurück – von dort lesen, statt
  // bei jedem Render neue Objekte zu bauen.
  const { source, target } = result;

  const rounded = result.ingredients.filter((item) => item.rounded).length;

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Formen">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormFields
            legend="Rezept ist für"
            idPrefix="bf-von"
            spec={source}
            onChange={(next) =>
              update({
                sourceKind: next.kind,
                sourceA: next.a,
                sourceB: next.b,
                sourceCount: next.count,
              })
            }
          />
          <FormFields
            legend="Du hast"
            idPrefix="bf-zu"
            spec={target}
            onChange={(next) =>
              update({
                targetKind: next.kind,
                targetA: next.a,
                targetB: next.b,
                targetCount: next.count,
              })
            }
          />
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Backform umrechnen"
            text={`${formLabel(source)} auf ${formLabel(target)}: alle Mengen × ${formatDecimal(result.factor)}`}
          />
        }
      >
        <NumberDisplay
          value={result.factor}
          format={formatDecimal}
          suffix="× alle Mengen"
          caption={`${formLabel(source)} → ${formLabel(target)}`}
          announce={`Alle Mengen mit ${formatDecimal(result.factor)} multiplizieren.`}
          hint={
            <>
              Nimm{" "}
              <strong className="font-semibold text-ink">
                {formatInteger(Math.round(Math.abs(result.percentDelta)))} %{" "}
                {result.factor >= 1 ? "mehr" : "weniger"}
              </strong>{" "}
              von allem – aus {formatInteger(Math.round(result.sourceVolume))}{" "}
              ml Teig werden {formatInteger(Math.round(result.targetVolume))}{" "}
              ml.
            </>
          }
        />
      </ResultPanel>

      <Card as="section" className="p-6" aria-label="Zutaten umrechnen">
        <Field
          label="Zutatenliste einfügen"
          htmlFor="bf-zutaten"
          hint="Eine Zutat pro Zeile, so wie im Rezept. Der Text bleibt auf deinem Gerät und steht nicht im geteilten Link."
        >
          <TextArea
            id="bf-zutaten"
            value={state.ingredients}
            placeholder={
              "250 g Mehl\n1 Pck. Backpulver\n200 g Zucker\n4 Eier\n125 g Butter\n1 Prise Salz"
            }
            onChange={(event) => update({ ingredients: event.target.value })}
            className="font-mono text-[15px]"
          />
        </Field>

        {result.ingredients.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[13px] font-semibold tracking-wide text-muted uppercase">
              Für {formLabel(target)}
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {result.ingredients.map((item, index) => (
                <li
                  key={`${index}-${item.raw}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-2 first:border-0 first:pt-0"
                >
                  <span className="font-mono text-[15px]">
                    {item.text}
                    {item.rounded && (
                      <span
                        title="Auf ein praktikables Maß gerundet"
                        className="ml-2 rounded-pill bg-ink-soft px-2 py-0.5 text-[12px] text-muted"
                      >
                        gerundet
                      </span>
                    )}
                  </span>
                  {item.quantity !== null && (
                    <span className="font-mono text-[13px] text-muted tabular-nums">
                      war {item.quantity.toLocaleString("de-DE")}
                      {item.unit ? ` ${item.unit}` : ""}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {rounded > 0 && (
              <p className="mt-4 text-[13px] text-muted">
                {rounded} {rounded === 1 ? "Zeile wurde" : "Zeilen wurden"} auf
                ein Maß gerundet, das sich abmessen lässt – halbe Eier gehen
                verquirlt, ein Viertel Päckchen Backpulver nicht.
              </p>
            )}
          </div>
        )}
      </Card>

      {(result.timeHint || result.warnings.length > 0) && (
        <section aria-labelledby="bf-hinweise" className="surface-soft p-6">
          <h2
            id="bf-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Beim Backen beachten
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-[15px] text-muted">
            {result.timeHint && (
              <li className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-pill bg-accent"
                />
                {result.timeHint}
              </li>
            )}
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

      <AffiliateBlock slots={backformAffiliate} result={result} />
    </div>
  );
}

/** Ein Formular-Block für eine Form: Bauart plus die passenden Maße. */
function FormFields({
  legend,
  idPrefix,
  spec,
  onChange,
}: {
  legend: string;
  idPrefix: string;
  spec: FormSpec;
  onChange: (next: FormSpec) => void;
}) {
  const def = shapes[spec.kind];

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="font-display text-base font-semibold">{legend}</legend>

      <Field label="Bauart" htmlFor={`${idPrefix}-form`}>
        <Select
          id={`${idPrefix}-form`}
          value={spec.kind}
          onChange={(event) =>
            onChange({ ...spec, kind: event.target.value as ShapeKind })
          }
        >
          {SHAPE_ORDER.map((kind) => (
            <option key={kind} value={kind}>
              {shapes[kind].label}
            </option>
          ))}
        </Select>
      </Field>

      {def.fields.includes("count") && (
        <Field label="Anzahl Mulden" htmlFor={`${idPrefix}-anzahl`}>
          <Stepper
            id={`${idPrefix}-anzahl`}
            value={spec.count}
            min={1}
            max={48}
            onChange={(count) => onChange({ ...spec, count })}
            ariaLabel="Anzahl Muffinmulden"
          />
        </Field>
      )}

      {def.fields.includes("a") && (
        <Field
          label={
            spec.kind === "rund"
              ? "Durchmesser"
              : spec.kind === "quadratisch"
                ? "Seitenlänge"
                : "Länge"
          }
          htmlFor={`${idPrefix}-a`}
        >
          <div className="relative">
            <TextInput
              id={`${idPrefix}-a`}
              type="text"
              inputMode="decimal"
              value={String(spec.a).replace(".", ",")}
              onChange={(event) =>
                onChange({ ...spec, a: toNumber(event.target.value, 0) })
              }
              className="pr-10 font-mono"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted"
            >
              cm
            </span>
          </div>
        </Field>
      )}

      {def.fields.includes("b") && (
        <Field label="Breite" htmlFor={`${idPrefix}-b`}>
          <div className="relative">
            <TextInput
              id={`${idPrefix}-b`}
              type="text"
              inputMode="decimal"
              value={String(spec.b).replace(".", ",")}
              onChange={(event) =>
                onChange({ ...spec, b: toNumber(event.target.value, 0) })
              }
              className="pr-10 font-mono"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted"
            >
              cm
            </span>
          </div>
        </Field>
      )}

      {spec.kind === "rund" && (
        <div className="flex flex-wrap gap-1.5">
          {ROUND_PRESETS.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={spec.a === size}
              onClick={() => onChange({ ...spec, a: size })}
              className={`h-8 rounded-pill px-2.5 font-mono text-[13px] font-semibold transition-colors duration-(--dur-fast) ${
                spec.a === size
                  ? "bg-accent text-white shadow-soft"
                  : "bg-surface text-muted shadow-[var(--elev-inset)] hover:bg-ink-soft hover:text-ink"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {spec.kind !== "muffins" && (
        <p className="text-[13px] text-muted">
          Gerechnet mit {String(def.depth).replace(".", ",")} cm Teighöhe.
        </p>
      )}
    </fieldset>
  );
}
