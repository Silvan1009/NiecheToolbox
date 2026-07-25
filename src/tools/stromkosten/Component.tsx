"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatAmount, formatEuro, formatInteger } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { stromkostenAffiliate } from "./affiliate";
import {
  CO2_G_PER_KWH,
  calculatePower,
  devicePresets,
  usagePatterns,
  type UsagePattern,
} from "./logic";

interface State extends Record<string, unknown> {
  watts: number;
  pattern: UsagePattern;
  usage: number;
  kwhPerCycle: number;
  standbyWatts: number;
  pricePerKwhCents: number;
}

const PATTERN_OPTIONS = [
  { value: "taeglich", label: "Std./Tag" },
  { value: "woechentlich", label: "Std./Woche" },
  { value: "durchgaenge", label: "Durchgänge/Woche" },
] as const satisfies readonly { value: UsagePattern; label: string }[];

const isPattern = (value: unknown): value is UsagePattern =>
  typeof value === "string" && value in usagePatterns;

function toNumber(value: unknown, fallback: number): number {
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    watts: toNumber(params?.watt, 90),
    pattern: isPattern(params?.muster) ? params.muster : "taeglich",
    usage: toNumber(params?.nutzung, 4),
    kwhPerCycle: toNumber(params?.kwh, 0.9),
    standbyWatts: toNumber(params?.standby, 0.5),
    pricePerKwhCents: toNumber(params?.preis, 35),
  };
}

export default function StromkostenTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      watts: toNumber(search.get("watt"), fallback.watts),
      pattern: isPattern(search.get("muster"))
        ? (search.get("muster") as UsagePattern)
        : fallback.pattern,
      usage: toNumber(search.get("nutzung"), fallback.usage),
      kwhPerCycle: toNumber(search.get("kwh"), fallback.kwhPerCycle),
      standbyWatts: toNumber(search.get("standby"), fallback.standbyWatts),
      pricePerKwhCents: toNumber(search.get("preis"), fallback.pricePerKwhCents),
    }),
    serialize: (next) => ({
      watt: String(next.watts),
      muster: next.pattern,
      nutzung: String(next.usage),
      kwh: String(next.kwhPerCycle),
      standby: String(next.standbyWatts),
      preis: String(next.pricePerKwhCents),
    }),
  });

  const result = useMemo(
    () =>
      calculatePower({
        watts: state.watts,
        pattern: state.pattern,
        usage: state.usage,
        kwhPerCycle: state.kwhPerCycle,
        standbyWatts: state.standbyWatts,
        pricePerKwhCents: state.pricePerKwhCents,
      }),
    [
      state.watts,
      state.pattern,
      state.usage,
      state.kwhPerCycle,
      state.standbyWatts,
      state.pricePerKwhCents,
    ],
  );

  const byCycle = state.pattern === "durchgaenge";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Gerät wählen">
        <fieldset>
          <legend className="text-[13px] font-semibold tracking-wide text-muted uppercase">
            Typisches Gerät als Startpunkt
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {devicePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  update({
                    watts: preset.watts,
                    pattern: preset.pattern,
                    usage: preset.usage,
                    kwhPerCycle: preset.kwhPerCycle,
                    standbyWatts: preset.standbyWatts,
                  })
                }
                className="h-9 rounded-pill bg-surface px-3.5 text-sm font-semibold text-muted shadow-[var(--elev-inset)] transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="flex flex-col gap-5">
          <Field
            label="Wie wird es genutzt?"
            htmlFor="sk-muster"
            hint={usagePatterns[state.pattern].hint}
          >
            <SegmentedControl
              value={state.pattern}
              options={PATTERN_OPTIONS}
              onChange={(pattern) => update({ pattern })}
              ariaLabel="Nutzungsmuster"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            {byCycle ? (
              <Field
                label="Verbrauch je Durchgang"
                htmlFor="sk-kwh"
                hint="Steht im Handbuch oder auf dem Energielabel."
              >
                <UnitInput
                  id="sk-kwh"
                  unit="kWh"
                  value={state.kwhPerCycle}
                  onChange={(kwhPerCycle) => update({ kwhPerCycle })}
                />
              </Field>
            ) : (
              <Field
                label="Leistung"
                htmlFor="sk-watt"
                hint="Steht auf dem Typenschild oder Netzteil."
              >
                <UnitInput
                  id="sk-watt"
                  unit="W"
                  value={state.watts}
                  onChange={(watts) => update({ watts })}
                />
              </Field>
            )}

            <Field label={usagePatterns[state.pattern].label} htmlFor="sk-nutzung">
              <UnitInput
                id="sk-nutzung"
                unit={byCycle ? "×" : "h"}
                value={state.usage}
                onChange={(usage) => update({ usage })}
              />
            </Field>

            <Field
              label="Standby"
              htmlFor="sk-standby"
              hint="Dauerverbrauch, wenn das Gerät nur wartet."
            >
              <UnitInput
                id="sk-standby"
                unit="W"
                value={state.standbyWatts}
                onChange={(standbyWatts) => update({ standbyWatts })}
              />
            </Field>

            <Field
              label="Strompreis"
              htmlFor="sk-preis"
              hint="Der Arbeitspreis von deiner Abrechnung."
            >
              <UnitInput
                id="sk-preis"
                unit="ct/kWh"
                value={state.pricePerKwhCents}
                onChange={(pricePerKwhCents) => update({ pricePerKwhCents })}
              />
            </Field>
          </div>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Stromkosten"
            text={`${formatEuro(result.costPerYear)} im Jahr bei ${formatAmount(result.totalKwh)} kWh`}
          />
        }
      >
        <NumberDisplay
          value={result.costPerYear}
          format={formatEuro}
          suffix="pro Jahr"
          caption={`${formatAmount(result.totalKwh)} kWh bei ${formatAmount(state.pricePerKwhCents)} ct/kWh`}
          announce={`${formatEuro(result.costPerYear)} pro Jahr, das sind ${formatEuro(result.costPerMonth)} im Monat.`}
          hint={
            <>
              Das sind{" "}
              <strong className="font-semibold text-ink">
                {formatEuro(result.costPerMonth)} im Monat
              </strong>{" "}
              oder {formatEuro(result.costPerDay)} am Tag
              {result.standbyCostPerYear > 0.5 && (
                <>
                  {" "}
                  – davon {formatEuro(result.standbyCostPerYear)} allein für den
                  Standby
                </>
              )}
              .
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Verbrauch"
          value={`${formatAmount(result.totalKwh)} kWh`}
          hint="im Jahr"
        />
        <Stat
          label="Standby-Anteil"
          value={`${formatInteger(Math.round(result.standbyShare))} %`}
          hint={
            result.standbyShare >= 30
              ? "auffällig hoch – Steckdosenleiste prüfen"
              : `${formatEuro(result.standbyCostPerYear)} im Jahr`
          }
        />
        <Stat
          label="CO₂"
          value={`${formatAmount(result.co2KgPerYear)} kg`}
          hint={`Näherung mit ${CO2_G_PER_KWH} g je kWh`}
        />
      </dl>

      {result.warnings.length > 0 && (
        <section aria-labelledby="sk-hinweise" className="surface-soft p-6">
          <h2
            id="sk-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Auffällig
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

      <AffiliateBlock slots={stromkostenAffiliate} result={result} />
    </div>
  );
}

function UnitInput({
  id,
  unit,
  value,
  onChange,
}: {
  id: string;
  unit: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="relative">
      <TextInput
        id={id}
        type="text"
        inputMode="decimal"
        value={String(value).replace(".", ",")}
        onChange={(event) => onChange(toNumber(event.target.value, 0))}
        className="pr-16 font-mono"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted"
      >
        {unit}
      </span>
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
