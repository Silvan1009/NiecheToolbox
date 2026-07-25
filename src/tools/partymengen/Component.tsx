"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, Stepper, Toggle } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatAmount, formatInteger, plural } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { partymengenAffiliate } from "./affiliate";
import {
  calculateParty,
  occasions,
  type Occasion,
  type PartyItem,
} from "./logic";

interface State extends Record<string, unknown> {
  adults: number;
  children: number;
  hours: number;
  occasion: Occasion;
  vegetarianPercent: number;
  alcohol: boolean;
  heartyEaters: boolean;
}

const OCCASION_OPTIONS = [
  { value: "grillen", label: "Grillen" },
  { value: "buffet", label: "Buffet" },
  { value: "kuchen", label: "Kaffee & Kuchen" },
  { value: "apero", label: "Apéro" },
] as const satisfies readonly { value: Occasion; label: string }[];

const isOccasion = (value: unknown): value is Occasion =>
  typeof value === "string" && value in occasions;

function toCount(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    adults: toCount(params?.erwachsene, 12),
    children: toCount(params?.kinder, 0),
    hours: Math.max(1, toCount(params?.stunden, 4)),
    occasion: isOccasion(params?.anlass) ? params.anlass : "grillen",
    vegetarianPercent: Math.min(100, toCount(params?.veggie, 20)),
    alcohol: params?.alkohol !== "0",
    heartyEaters: params?.hunger === "1",
  };
}

/** "3,5 kg", "18 Stück" – Einheit direkt am Wert. */
function amountText(item: PartyItem): string {
  const value =
    item.unit === "Stück" || item.unit === "g"
      ? formatInteger(item.amount)
      : formatAmount(item.amount);
  return `${value} ${item.unit}`;
}

export default function PartymengenTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      adults: toCount(search.get("erwachsene"), fallback.adults),
      children: toCount(search.get("kinder"), fallback.children),
      hours: Math.max(1, toCount(search.get("stunden"), fallback.hours)),
      occasion: isOccasion(search.get("anlass"))
        ? (search.get("anlass") as Occasion)
        : fallback.occasion,
      vegetarianPercent: Math.min(
        100,
        toCount(search.get("veggie"), fallback.vegetarianPercent),
      ),
      alcohol: search.has("alkohol")
        ? search.get("alkohol") === "1"
        : fallback.alcohol,
      heartyEaters: search.get("hunger") === "1",
    }),
    serialize: (next) => ({
      anlass: next.occasion,
      erwachsene: String(next.adults),
      kinder: String(next.children),
      stunden: String(next.hours),
      veggie: String(next.vegetarianPercent),
      alkohol: next.alcohol ? "1" : "0",
      hunger: next.heartyEaters ? "1" : "0",
    }),
  });

  const result = useMemo(
    () =>
      calculateParty({
        adults: state.adults,
        children: state.children,
        hours: state.hours,
        occasion: state.occasion,
        vegetarianPercent: state.vegetarianPercent,
        alcohol: state.alcohol,
        heartyEaters: state.heartyEaters,
      }),
    [
      state.adults,
      state.children,
      state.hours,
      state.occasion,
      state.vegetarianPercent,
      state.alcohol,
      state.heartyEaters,
    ],
  );

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="flex flex-col gap-5">
          <Field
            label="Anlass"
            htmlFor="pm-anlass"
            hint={occasions[state.occasion].hint}
          >
            <SegmentedControl
              value={state.occasion}
              options={OCCASION_OPTIONS}
              onChange={(occasion) => update({ occasion })}
              ariaLabel="Anlass"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Erwachsene" htmlFor="pm-erwachsene">
              <Stepper
                id="pm-erwachsene"
                value={state.adults}
                min={0}
                max={200}
                onChange={(adults) => update({ adults })}
                ariaLabel="Anzahl Erwachsene"
              />
            </Field>

            <Field
              label="Kinder"
              htmlFor="pm-kinder"
              hint="Zählen als halbe Portion."
            >
              <Stepper
                id="pm-kinder"
                value={state.children}
                min={0}
                max={100}
                onChange={(children) => update({ children })}
                ariaLabel="Anzahl Kinder"
              />
            </Field>

            <Field
              label="Dauer"
              htmlFor="pm-stunden"
              hint="Bestimmt die Getränke, nicht das Essen."
            >
              <Stepper
                id="pm-stunden"
                value={state.hours}
                min={1}
                max={12}
                onChange={(hours) => update({ hours })}
                suffix="Std."
                ariaLabel="Dauer in Stunden"
              />
            </Field>

            <Field
              label="Davon vegetarisch"
              htmlFor="pm-veggie"
              hint="Anteil der Gäste ohne Fleisch."
            >
              <Stepper
                id="pm-veggie"
                value={state.vegetarianPercent}
                min={0}
                max={100}
                step={5}
                onChange={(vegetarianPercent) => update({ vegetarianPercent })}
                suffix="%"
                ariaLabel="Anteil vegetarisch in Prozent"
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <Toggle
              checked={state.alcohol}
              onChange={(alcohol) => update({ alcohol })}
              label="Alkohol wird angeboten"
              hint="Bier und Wein nur für Erwachsene."
            />
            <Toggle
              checked={state.heartyEaters}
              onChange={(heartyEaters) => update({ heartyEaters })}
              label="Kräftige Esser"
              hint="Legt ein Viertel aufs Essen – die Getränke bleiben gleich."
            />
          </div>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Partymengen"
            text={`${amountText(result.primary)} ${result.primary.label} für ${formatInteger(result.guests)} Gäste`}
          />
        }
      >
        <NumberDisplay
          value={result.primary.amount}
          format={
            result.primary.unit === "Stück" || result.primary.unit === "g"
              ? formatInteger
              : formatAmount
          }
          suffix={`${result.primary.unit} ${result.primary.label}`}
          caption={`${formatInteger(result.guests)} ${plural(result.guests, "Gast", "Gäste")}, ${formatInteger(state.hours)} Stunden`}
          announce={`${amountText(result.primary)} ${result.primary.label} für ${formatInteger(result.guests)} Gäste.`}
          hint={
            <>
              Gerechnet mit{" "}
              <strong className="font-semibold text-ink">
                {formatAmount(result.eaterUnits)} Erwachsenen-Portionen
              </strong>
              {state.children > 0 && " – Kinder zählen halb"}. Die vollständige
              Liste steht darunter.
            </>
          }
        />
      </ResultPanel>

      <div className="grid gap-4 sm:grid-cols-2">
        <ItemList title="Essen" items={result.food} />
        <ItemList title="Getränke" items={result.drinks} />
      </div>

      <ItemList title="Drumherum" items={result.supplies} />

      {result.warnings.length > 0 && (
        <section aria-labelledby="pm-hinweise" className="surface-soft p-6">
          <h2
            id="pm-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Aus Erfahrung
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

      <AffiliateBlock slots={partymengenAffiliate} result={result} />
    </div>
  );
}

function ItemList({ title, items }: { title: string; items: PartyItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="surface-soft p-6">
      <h2 className="font-display text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.key}
            className="border-t border-line pt-3 first:border-0 first:pt-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[15px]">{item.label}</span>
              <span className="font-mono font-semibold tabular-nums">
                {amountText(item)}
              </span>
            </div>
            {item.note && (
              <p className="mt-0.5 text-[13px] text-muted">{item.note}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
