"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Stepper,
  TextInput,
  Toggle,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatAmount, formatInteger, plural } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { umzugAffiliate } from "./affiliate";
import { calculateMove, householdStyles, type HouseholdStyle } from "./logic";

interface State extends Record<string, unknown> {
  area: number;
  people: number;
  style: HouseholdStyle;
  shelfMetres: number;
  wardrobeMetres: number;
  hasBasement: boolean;
  trips: number;
}

const STYLE_OPTIONS = [
  { value: "wenig", label: "Eher wenig" },
  { value: "normal", label: "Normal" },
  { value: "viel", label: "Eher viel" },
] as const satisfies readonly { value: HouseholdStyle; label: string }[];

const isStyle = (value: unknown): value is HouseholdStyle =>
  typeof value === "string" && value in householdStyles;

function toNumber(value: unknown, fallback: number): number {
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    area: toNumber(params?.qm, 80),
    people: Math.max(1, Math.trunc(toNumber(params?.personen, 2))),
    style: isStyle(params?.stil) ? params.stil : "normal",
    shelfMetres: toNumber(params?.regal, 6),
    wardrobeMetres: toNumber(params?.kleider, 1.5),
    hasBasement: params?.keller !== "0",
    trips: Math.max(1, Math.trunc(toNumber(params?.fahrten, 1))),
  };
}

export default function UmzugTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      area: toNumber(search.get("qm"), fallback.area),
      people: Math.max(
        1,
        Math.trunc(toNumber(search.get("personen"), fallback.people)),
      ),
      style: isStyle(search.get("stil"))
        ? (search.get("stil") as HouseholdStyle)
        : fallback.style,
      shelfMetres: toNumber(search.get("regal"), fallback.shelfMetres),
      wardrobeMetres: toNumber(search.get("kleider"), fallback.wardrobeMetres),
      hasBasement: search.has("keller")
        ? search.get("keller") === "1"
        : fallback.hasBasement,
      trips: Math.max(
        1,
        Math.trunc(toNumber(search.get("fahrten"), fallback.trips)),
      ),
    }),
    serialize: (next) => ({
      qm: String(next.area),
      personen: String(next.people),
      stil: next.style,
      regal: String(next.shelfMetres),
      kleider: String(next.wardrobeMetres),
      keller: next.hasBasement ? "1" : "0",
      fahrten: String(next.trips),
    }),
  });

  const result = useMemo(
    () =>
      calculateMove({
        area: state.area,
        people: state.people,
        style: state.style,
        shelfMetres: state.shelfMetres,
        wardrobeMetres: state.wardrobeMetres,
        hasBasement: state.hasBasement,
        trips: state.trips,
      }),
    [
      state.area,
      state.people,
      state.style,
      state.shelfMetres,
      state.wardrobeMetres,
      state.hasBasement,
      state.trips,
    ],
  );

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Wohnfläche" htmlFor="um-qm">
              <div className="relative">
                <TextInput
                  id="um-qm"
                  type="text"
                  inputMode="decimal"
                  value={state.area === 0 ? "" : String(state.area).replace(".", ",")}
                  placeholder="80"
                  onChange={(event) =>
                    update({ area: toNumber(event.target.value, 0) })
                  }
                  className="pr-10 font-mono"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted"
                >
                  m²
                </span>
              </div>
            </Field>

            <Field label="Personen im Haushalt" htmlFor="um-personen">
              <Stepper
                id="um-personen"
                value={state.people}
                min={1}
                max={12}
                onChange={(people) => update({ people })}
                ariaLabel="Personen im Haushalt"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field
                label="Wie viel besitzt du?"
                htmlFor="um-stil"
                hint={householdStyles[state.style].hint}
              >
                <SegmentedControl
                  value={state.style}
                  options={STYLE_OPTIONS}
                  onChange={(style) => update({ style })}
                  ariaLabel="Haushaltsgröße"
                />
              </Field>
            </div>

            <Field
              label="Bücher und Ordner"
              htmlFor="um-regal"
              hint="Laufende Regalmeter. Ein Meter füllt einen Bücherkarton."
            >
              <div className="relative">
                <TextInput
                  id="um-regal"
                  type="text"
                  inputMode="decimal"
                  value={String(state.shelfMetres).replace(".", ",")}
                  onChange={(event) =>
                    update({ shelfMetres: toNumber(event.target.value, 0) })
                  }
                  className="pr-10 font-mono"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted"
                >
                  m
                </span>
              </div>
            </Field>

            <Field
              label="Kleidung auf Stange"
              htmlFor="um-kleider"
              hint="Laufende Meter, die hängend transportiert werden soll."
            >
              <div className="relative">
                <TextInput
                  id="um-kleider"
                  type="text"
                  inputMode="decimal"
                  value={String(state.wardrobeMetres).replace(".", ",")}
                  onChange={(event) =>
                    update({ wardrobeMetres: toNumber(event.target.value, 0) })
                  }
                  className="pr-10 font-mono"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted"
                >
                  m
                </span>
              </div>
            </Field>

            <div className="sm:col-span-2">
              <Field
                label="Fahrten"
                htmlFor="um-fahrten"
                hint="Mehr Fahrten heißt kleineres Fahrzeug."
              >
                <Stepper
                  id="um-fahrten"
                  value={state.trips}
                  min={1}
                  max={10}
                  onChange={(trips) => update({ trips })}
                  ariaLabel="Anzahl Fahrten"
                />
              </Field>
            </div>
          </div>

          <Toggle
            checked={state.hasBasement}
            onChange={(hasBasement) => update({ hasBasement })}
            label="Keller, Dachboden oder Garage kommen mit"
            hint="Schlägt erfahrungsgemäß mit rund einem Sechstel extra zu Buche."
          />
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Umzug planen"
            text={`${formatInteger(result.totalBoxes)} Kartons und ${formatAmount(result.volume)} m³ für ${formatInteger(state.area)} m²`}
          />
        }
      >
        <NumberDisplay
          value={result.totalBoxes}
          suffix={plural(result.totalBoxes, "Karton", "Kartons")}
          caption={`${formatInteger(state.area)} m², ${formatInteger(state.people)} ${plural(state.people, "Person", "Personen")}`}
          announce={`Etwa ${formatInteger(result.totalBoxes)} Kartons und ${formatAmount(result.volume)} Kubikmeter Umzugsgut.`}
          hint={
            <>
              Davon {formatInteger(result.boxes)} Standardkartons,{" "}
              {formatInteger(result.bookBoxes)} Bücherkartons und{" "}
              {formatInteger(result.wardrobeBoxes)} Kleiderboxen. Insgesamt rund{" "}
              <strong className="font-semibold text-ink">
                {formatAmount(result.volume)} m³
              </strong>{" "}
              Umzugsgut.
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Fahrzeug"
          value={`${formatInteger(result.van.volume)} m³`}
          hint={result.van.label}
        />
        <Stat
          label={state.trips > 1 ? "Je Fahrt" : "Zu transportieren"}
          value={`${formatAmount(result.volumePerTrip)} m³`}
          hint={
            state.trips > 1
              ? `auf ${formatInteger(state.trips)} Fahrten verteilt`
              : "in einer Fahrt"
          }
        />
        <Stat
          label="Packzeit"
          value={`${formatInteger(result.packingHours)} h`}
          hint="etwa 12 Minuten je Karton"
        />
      </dl>

      <section aria-labelledby="um-material" className="surface-soft p-6">
        <h2
          id="um-material"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Einkaufsliste
        </h2>
        <ul className="mt-4 flex flex-col gap-2 text-[15px]">
          <MaterialRow
            label="Umzugskartons (Standard)"
            value={formatInteger(result.boxes)}
          />
          <MaterialRow
            label="Bücherkartons"
            value={formatInteger(result.bookBoxes)}
          />
          <MaterialRow
            label="Kleiderboxen"
            value={formatInteger(result.wardrobeBoxes)}
          />
          <MaterialRow
            label="Packpapier (Bogen)"
            value={formatInteger(result.packingPaperSheets)}
          />
          <MaterialRow
            label="Rollen Klebeband"
            value={formatInteger(result.tapeRolls)}
          />
        </ul>
        <p className="mt-4 text-[13px] text-muted">
          Schätzwerte aus Erfahrungswerten, keine Messung. Wie viele Kartons du
          wirklich brauchst, hängt vor allem daran, wie voll die Schränke sind.
          Rechne bei Geschirr und Büchern eher großzügig.
        </p>
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="um-hinweise" className="surface-soft p-6">
          <h2
            id="um-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Vorher bedenken
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

      <AffiliateBlock slots={umzugAffiliate} result={result} />
    </div>
  );
}

function MaterialRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4 border-t border-line pt-2 first:border-0 first:pt-0">
      <span>{label}</span>
      <span className="font-mono font-semibold tabular-nums">{value}</span>
    </li>
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
