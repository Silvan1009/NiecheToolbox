"use client";

import { useMemo, type ReactNode } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, Stepper, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { rentenabschlagAffiliate } from "./affiliate";
import { calculateRentenabschlag, defaultInput, type RentenabschlagInput } from "./logic";

interface State extends Record<string, unknown>, RentenabschlagInput {}

const DEFAULTS: State = { ...defaultInput() };

function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    geburtsjahr: toNumber(params?.jahrgang, DEFAULTS.geburtsjahr),
    geplantesAlterJahre: toNumber(params?.alterj, DEFAULTS.geplantesAlterJahre),
    geplantesAlterMonate: toNumber(params?.alterm, DEFAULTS.geplantesAlterMonate),
    erwarteteRegelrente: toNumber(params?.rente, DEFAULTS.erwarteteRegelrente),
    lebenserwartung: toNumber(params?.leben, DEFAULTS.lebenserwartung),
  };
}

/** Leerer String heißt: Schlüssel aus der URL entfernen. */
function diff(value: string | number, fallback: string | number): string {
  return value === fallback ? "" : String(value);
}

export default function RentenabschlagTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      geburtsjahr: toNumber(search.get("jahrgang"), fallback.geburtsjahr),
      geplantesAlterJahre: toNumber(search.get("alterj"), fallback.geplantesAlterJahre),
      geplantesAlterMonate: toNumber(search.get("alterm"), fallback.geplantesAlterMonate),
      erwarteteRegelrente: toNumber(search.get("rente"), fallback.erwarteteRegelrente),
      lebenserwartung: toNumber(search.get("leben"), fallback.lebenserwartung),
    }),
    serialize: (next) => ({
      jahrgang: diff(next.geburtsjahr, DEFAULTS.geburtsjahr),
      alterj: diff(next.geplantesAlterJahre, DEFAULTS.geplantesAlterJahre),
      alterm: diff(next.geplantesAlterMonate, DEFAULTS.geplantesAlterMonate),
      rente: diff(next.erwarteteRegelrente, DEFAULTS.erwarteteRegelrente),
      leben: diff(next.lebenserwartung, DEFAULTS.lebenserwartung),
    }),
  });

  const result = useMemo(() => calculateRentenabschlag(state), [state]);
  const istAbschlag = result.abschlagProzent > 0;
  const istZuschlag = result.zuschlagProzent > 0;

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Geburtsjahrgang und geplanter Renteneintritt">
        <CardTitle>Geburtsjahrgang &amp; geplanter Renteneintritt</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Field label="Geburtsjahr" htmlFor="ra-jahrgang">
            <Stepper
              id="ra-jahrgang"
              value={state.geburtsjahr}
              min={1940}
              max={2010}
              onChange={(geburtsjahr) => update({ geburtsjahr })}
              ariaLabel="Geburtsjahr"
            />
          </Field>

          <Field label="Geplantes Renteneintrittsalter" htmlFor="ra-alterj">
            <Stepper
              id="ra-alterj"
              value={state.geplantesAlterJahre}
              min={60}
              max={75}
              onChange={(geplantesAlterJahre) => update({ geplantesAlterJahre })}
              suffix="Jahre"
              ariaLabel="Geplantes Renteneintrittsalter in Jahren"
            />
          </Field>

          <Field label="Plus Monate" htmlFor="ra-alterm">
            <Stepper
              id="ra-alterm"
              value={state.geplantesAlterMonate}
              min={0}
              max={11}
              onChange={(geplantesAlterMonate) => update({ geplantesAlterMonate })}
              suffix="Monate"
              ariaLabel="Zusätzliche Monate beim Renteneintritt"
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Erwartete Rente">
        <CardTitle>Erwartete Rente</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Erwartete Regelrente"
            htmlFor="ra-rente"
            hint="Aus deiner Renteninformation, bei Renteneintritt zur Regelaltersgrenze."
          >
            <UnitInput
              id="ra-rente"
              unit="€/Monat"
              value={state.erwarteteRegelrente}
              onChange={(erwarteteRegelrente) => update({ erwarteteRegelrente })}
            />
          </Field>

          <Field label="Angenommene Lebenserwartung" htmlFor="ra-leben">
            <Stepper
              id="ra-leben"
              value={state.lebenserwartung}
              min={state.geplantesAlterJahre + 1}
              max={110}
              onChange={(lebenserwartung) => update({ lebenserwartung })}
              suffix="Jahre"
              ariaLabel="Angenommene Lebenserwartung"
            />
          </Field>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Rentenabschlags-Rechner"
            text={
              istAbschlag
                ? `${formatDecimal(result.abschlagProzent)} % Abschlag, ${formatEuro(result.renteMitAnpassung)} Rente statt ${formatEuro(state.erwarteteRegelrente)}`
                : `${formatEuro(result.renteMitAnpassung)} Rente im Monat`
            }
          />
        }
      >
        <NumberDisplay
          value={result.renteMitAnpassung}
          format={formatEuro}
          suffix="pro Monat"
          caption={
            istAbschlag ? "Rente mit Abschlag" : istZuschlag ? "Rente mit Zuschlag" : "Rente"
          }
          announce={`${formatEuro(result.renteMitAnpassung)} pro Monat, ${istAbschlag ? `${formatDecimal(result.abschlagProzent)} Prozent Abschlag` : istZuschlag ? `${formatDecimal(result.zuschlagProzent)} Prozent Zuschlag` : "ohne Abschlag oder Zuschlag"}.`}
          hint={
            istAbschlag || istZuschlag ? (
              <>
                Das sind{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(Math.abs(result.differenzMonatlich))}
                </strong>{" "}
                im Monat {istAbschlag ? "weniger" : "mehr"} als die Regelrente von{" "}
                {formatEuro(state.erwarteteRegelrente)}.
              </>
            ) : (
              <>Renteneintritt genau zur Regelaltersgrenze – die volle Rente ohne Anpassung.</>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Regelaltersgrenze"
          value={`${result.regelaltersgrenzeJahre} J. ${result.regelaltersgrenzeMonate} M.`}
          hint={`für Jahrgang ${state.geburtsjahr}`}
        />
        <Stat
          label={istAbschlag ? "Abschlag" : "Zuschlag"}
          value={`${formatDecimal(istAbschlag ? result.abschlagProzent : result.zuschlagProzent)} %`}
          hint={`${Math.abs(result.differenzMonate)} Monate ${istAbschlag ? "früher" : istZuschlag ? "später" : "Differenz"}`}
        />
        <Stat
          label="Monatliche Differenz"
          value={formatEuro(result.differenzMonatlich)}
          hint="gegenüber der Regelrente"
        />
        <Stat
          label="Kumulierter Effekt"
          value={formatEuro(result.kumulierterEffekt)}
          hint={`über ${result.jahreRentenbezug} Jahre Rentenbezug`}
        />
      </dl>

      {result.warnings.length > 0 && (
        <section aria-labelledby="ra-hinweise" className="surface-soft p-6">
          <h2 id="ra-hinweise" className="font-display text-lg font-semibold tracking-tight">
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

      <AffiliateBlock slots={rentenabschlagAffiliate} result={result} />
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
