"use client";

import { useMemo, type ReactNode } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, Stepper, TextInput, Toggle } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { elterngeldAffiliate } from "./affiliate";
import {
  calculateElterngeld,
  defaultInput,
  type ElterngeldInput,
  type ElterngeldModus,
} from "./logic";

interface State extends Record<string, unknown>, ElterngeldInput {}

const DEFAULTS: State = { ...defaultInput() };

const MODUS_OPTIONS = [
  { value: "basis", label: "Basiselterngeld" },
  { value: "plus", label: "ElterngeldPlus" },
] as const satisfies readonly { value: ElterngeldModus; label: string }[];

const isModus = (value: unknown): value is ElterngeldModus =>
  value === "basis" || value === "plus";

function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "1" || value === 1 || value === "true";
}

function initialState(params: ToolParams | undefined): State {
  return {
    nettoEinkommenVorGeburt: toNumber(params?.netto, DEFAULTS.nettoEinkommenVorGeburt),
    geschwisterbonus: toBool(params?.geschwister, DEFAULTS.geschwisterbonus),
    mehrlingsKinder: toNumber(params?.mehrlinge, DEFAULTS.mehrlingsKinder),
    modus: isModus(params?.modus) ? params.modus : DEFAULTS.modus,
    bezugsmonate: toNumber(params?.monate, DEFAULTS.bezugsmonate),
  };
}

/** Leerer String heißt: Schlüssel aus der URL entfernen. */
function diff(value: string | number, fallback: string | number): string {
  return value === fallback ? "" : String(value);
}

export default function ElterngeldTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      nettoEinkommenVorGeburt: toNumber(search.get("netto"), fallback.nettoEinkommenVorGeburt),
      geschwisterbonus: toBool(search.get("geschwister"), fallback.geschwisterbonus),
      mehrlingsKinder: toNumber(search.get("mehrlinge"), fallback.mehrlingsKinder),
      modus: isModus(search.get("modus")) ? (search.get("modus") as ElterngeldModus) : fallback.modus,
      bezugsmonate: toNumber(search.get("monate"), fallback.bezugsmonate),
    }),
    serialize: (next) => ({
      netto: diff(next.nettoEinkommenVorGeburt, DEFAULTS.nettoEinkommenVorGeburt),
      geschwister:
        next.geschwisterbonus === DEFAULTS.geschwisterbonus
          ? ""
          : next.geschwisterbonus
            ? "1"
            : "0",
      mehrlinge: diff(next.mehrlingsKinder, DEFAULTS.mehrlingsKinder),
      modus: diff(next.modus, DEFAULTS.modus),
      monate: diff(next.bezugsmonate, DEFAULTS.bezugsmonate),
    }),
  });

  const result = useMemo(() => calculateElterngeld(state), [state]);
  const istPlus = state.modus === "plus";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Einkommen und Familie">
        <CardTitle>Einkommen &amp; Familie</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Nettoeinkommen vor der Geburt"
            htmlFor="eg-netto"
            hint="Durchschnitt der letzten 12 Monate."
          >
            <UnitInput
              id="eg-netto"
              unit="€/Monat"
              value={state.nettoEinkommenVorGeburt}
              onChange={(nettoEinkommenVorGeburt) => update({ nettoEinkommenVorGeburt })}
            />
          </Field>

          <Field label="Kinder bei einer Mehrlingsgeburt" htmlFor="eg-mehrlinge" hint="0 bei einem Einzelkind.">
            <Stepper
              id="eg-mehrlinge"
              value={state.mehrlingsKinder}
              min={0}
              max={5}
              onChange={(mehrlingsKinder) => update({ mehrlingsKinder })}
              suffix="weitere"
              ariaLabel="Weitere Kinder bei Mehrlingsgeburt"
            />
          </Field>

          <div className="sm:col-span-2">
            <Toggle
              checked={state.geschwisterbonus}
              onChange={(geschwisterbonus) => update({ geschwisterbonus })}
              label="Geschwisterbonus"
              hint="Ein weiteres Kind unter 3 Jahren oder zwei weitere Kinder unter 6 Jahren im Haushalt."
            />
          </div>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Bezugsvariante">
        <CardTitle>Bezugsvariante</CardTitle>
        <div className="mt-4 flex flex-col gap-5">
          <Field
            label="Basiselterngeld oder ElterngeldPlus"
            htmlFor="eg-modus"
            hint={
              istPlus
                ? "Halber Monatsbetrag über die doppelte Anzahl Monate."
                : "Voller Monatsbetrag über die gewählte Anzahl Monate."
            }
          >
            <SegmentedControl
              value={state.modus}
              options={MODUS_OPTIONS}
              onChange={(modus) => update({ modus })}
              ariaLabel="Bezugsvariante"
            />
          </Field>

          <Field label="Basismonate" htmlFor="eg-monate" hint="1–12 allein, bis zu 14 mit Partnermonaten.">
            <Stepper
              id="eg-monate"
              value={state.bezugsmonate}
              min={1}
              max={14}
              onChange={(bezugsmonate) => update({ bezugsmonate })}
              suffix="Monate"
              ariaLabel="Basismonate"
            />
          </Field>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Elterngeld-Rechner"
            text={`${formatEuro(result.ausgezahlterMonatsbetrag)} im Monat, ${formatEuro(result.gesamtbetrag)} insgesamt`}
          />
        }
      >
        <NumberDisplay
          value={result.ausgezahlterMonatsbetrag}
          format={formatEuro}
          suffix={istPlus ? "pro Monat (Plus)" : "pro Monat"}
          caption="Elterngeld"
          announce={`${formatEuro(result.ausgezahlterMonatsbetrag)} pro Monat bei ${formatDecimal(result.ersatzrate)} Prozent Ersatzrate, insgesamt ${formatEuro(result.gesamtbetrag)} über ${result.bezugsmonateEffektiv} Monate.`}
          hint={
            <>
              Insgesamt{" "}
              <strong className="font-semibold text-ink">{formatEuro(result.gesamtbetrag)}</strong>{" "}
              über {result.bezugsmonateEffektiv} Monate – bei{" "}
              {formatDecimal(result.ersatzrate)} % Ersatzrate.
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ersatzrate" value={`${formatDecimal(result.ersatzrate)} %`} hint="vom Nettoeinkommen" />
        <Stat
          label="Basiselterngeld"
          value={formatEuro(result.monatsbetragBasis)}
          hint="voller Monatsbetrag inkl. Boni"
        />
        <Stat
          label="ElterngeldPlus"
          value={formatEuro(result.monatsbetragPlus)}
          hint="je Plus-Monat"
        />
        <Stat
          label="Gesamtbetrag"
          value={formatEuro(result.gesamtbetrag)}
          hint={`über ${result.bezugsmonateEffektiv} Monate`}
        />
      </dl>

      {(result.geschwisterbonusMonat > 0 || result.mehrlingszuschlagMonat > 0) && (
        <section aria-labelledby="eg-boni" className="surface-soft p-6">
          <h2 id="eg-boni" className="font-display text-lg font-semibold tracking-tight">
            Zuschläge
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
            <Posten label="Elterngeld ohne Zuschläge" value={result.basisbetragMonat} />
            {result.geschwisterbonusMonat > 0 && (
              <Posten label="Geschwisterbonus" value={result.geschwisterbonusMonat} />
            )}
            {result.mehrlingszuschlagMonat > 0 && (
              <Posten label="Mehrlingszuschlag" value={result.mehrlingszuschlagMonat} />
            )}
            <Posten label="Voller Monatsbetrag" value={result.vollerMonatsbetrag} stark />
          </ul>
        </section>
      )}

      {result.warnings.length > 0 && (
        <section aria-labelledby="eg-hinweise" className="surface-soft p-6">
          <h2 id="eg-hinweise" className="font-display text-lg font-semibold tracking-tight">
            Auffällig
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-[15px] text-muted">
            {result.warnings.map((warning) => (
              <li key={warning} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-pill bg-accent" />
                {warning}
              </li>
            ))}
          </ul>
        </section>
      )}

      <AffiliateBlock slots={elterngeldAffiliate} result={result} />
    </div>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-lg font-semibold tracking-tight">{children}</h2>;
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
        value={value === 0 ? "" : String(value).replace(".", ",")}
        placeholder="0"
        onChange={(event) => onChange(toNumber(event.target.value, 0))}
        className="pr-20 font-mono"
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

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="surface-soft p-5">
      <dt className="text-[13px] font-semibold text-muted">{label}</dt>
      <dd className="mt-2">
        <span className="font-mono text-2xl leading-none font-semibold tabular-nums">{value}</span>
        <span className="mt-1 block text-[13px] text-muted">{hint}</span>
      </dd>
    </div>
  );
}

function Posten({ label, value, stark = false }: { label: string; value: number; stark?: boolean }) {
  return (
    <li
      className={`flex items-baseline justify-between gap-4 ${
        stark ? "border-t border-line pt-2 font-semibold" : ""
      }`}
    >
      <span className={stark ? "" : "text-muted"}>{label}</span>
      <span className="font-mono tabular-nums">{formatEuro(value === 0 ? 0 : value)}</span>
    </li>
  );
}
