"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card, CardTitle } from "@/components/ui/Card";
import { Field, Select, TextInput, Toggle } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { abfindungAffiliate } from "./affiliate";
import { calculateAbfindung, defaultInput, type AbfindungInput } from "./logic";

interface State extends Record<string, unknown>, AbfindungInput {}

const DEFAULTS: State = { ...defaultInput() };

const KIRCHENSTEUER_OPTIONS = [
  { value: 0, label: "keine Kirchensteuer" },
  { value: 8, label: "8 % (Bayern, Baden-Württemberg)" },
  { value: 9, label: "9 % (übrige Bundesländer)" },
];

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
    zvEOhneAbfindung: toNumber(params?.zve, DEFAULTS.zvEOhneAbfindung),
    abfindungsbetrag: toNumber(params?.abfindung, DEFAULTS.abfindungsbetrag),
    zusammenveranlagung: toBool(params?.verheiratet, DEFAULTS.zusammenveranlagung),
    kirchensteuerPercent: toNumber(params?.kirche, DEFAULTS.kirchensteuerPercent),
  };
}

export default function AbfindungTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      zvEOhneAbfindung: toNumber(search.get("zve"), fallback.zvEOhneAbfindung),
      abfindungsbetrag: toNumber(search.get("abfindung"), fallback.abfindungsbetrag),
      zusammenveranlagung: toBool(search.get("verheiratet"), fallback.zusammenveranlagung),
      kirchensteuerPercent: toNumber(search.get("kirche"), fallback.kirchensteuerPercent),
    }),
    serialize: (next) => ({
      zve: urlValue(next.zvEOhneAbfindung, DEFAULTS.zvEOhneAbfindung),
      abfindung: urlValue(next.abfindungsbetrag, DEFAULTS.abfindungsbetrag),
      verheiratet:
        next.zusammenveranlagung === DEFAULTS.zusammenveranlagung
          ? ""
          : next.zusammenveranlagung
            ? "1"
            : "0",
      kirche: urlValue(next.kirchensteuerPercent, DEFAULTS.kirchensteuerPercent),
    }),
  });

  const result = useMemo(() => calculateAbfindung(state), [state]);

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Einkommen und Abfindung">
        <CardTitle>Einkommen &amp; Abfindung</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Zu versteuerndes Einkommen ohne Abfindung"
            htmlFor="af-zve"
            hint="Für das Jahr der Auszahlung, laut Steuerbescheid oder überschlagen."
          >
            <UnitInput
              id="af-zve"
              unit="€/Jahr"
              value={state.zvEOhneAbfindung}
              onChange={(zvEOhneAbfindung) => update({ zvEOhneAbfindung })}
            />
          </Field>

          <Field label="Abfindungsbetrag" htmlFor="af-abfindung" hint="Brutto, laut Aufhebungsvertrag.">
            <UnitInput
              id="af-abfindung"
              unit="€"
              value={state.abfindungsbetrag}
              onChange={(abfindungsbetrag) => update({ abfindungsbetrag })}
            />
          </Field>

          <div className="sm:col-span-2">
            <Toggle
              checked={state.zusammenveranlagung}
              onChange={(zusammenveranlagung) => update({ zusammenveranlagung })}
              label="Zusammenveranlagung (verheiratet oder verpartnert)"
              hint="Rechnet mit dem günstigeren Splittingtarif statt dem Grundtarif."
            />
          </div>

          <Field label="Kirchensteuer" htmlFor="af-kirche">
            <Select
              id="af-kirche"
              value={state.kirchensteuerPercent}
              onChange={(event) => update({ kirchensteuerPercent: Number(event.target.value) })}
            >
              {KIRCHENSTEUER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Abfindungsrechner"
            text={`${formatEuro(result.nettoAbfindung)} netto von ${formatEuro(state.abfindungsbetrag)} Abfindung`}
          />
        }
      >
        <NumberDisplay
          value={result.nettoAbfindung}
          format={formatEuro}
          caption="Netto von der Abfindung"
          announce={`${formatEuro(result.nettoAbfindung)} netto von ${formatEuro(state.abfindungsbetrag)} Abfindung, das sind ${formatDecimal(result.effektiverSteuersatz)} Prozent Abgaben.`}
          hint={
            <>
              Davon gehen{" "}
              <strong className="font-semibold text-ink">
                {formatEuro(result.gesamtabgabeAufAbfindung)}
              </strong>{" "}
              an Steuern und Abgaben ab – das sind {formatDecimal(result.effektiverSteuersatz)} %
              der Abfindung.
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Steuer mit Fünftelregelung"
          value={formatEuro(result.steuerAufAbfindungFuenftel)}
          hint="auf die Abfindung"
        />
        <Stat
          label="Steuer ohne Fünftelregelung"
          value={formatEuro(result.steuerAufAbfindungVoll)}
          hint="bei voller Versteuerung im selben Jahr"
        />
        <Stat
          label="Ersparnis"
          value={formatEuro(result.ersparnisEinkommensteuer)}
          hint="durch die Fünftelregelung"
        />
        <Stat
          label="Effektiver Steuersatz"
          value={`${formatDecimal(result.effektiverSteuersatz)} %`}
          hint="auf die Abfindung"
        />
      </dl>

      <section aria-labelledby="af-abzuege" className="surface-soft p-6">
        <h2 id="af-abzuege" className="font-display text-lg font-semibold tracking-tight">
          Was von der Abfindung abgeht
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <AmountRow label="Abfindung (brutto)" value={state.abfindungsbetrag} />
          <AmountRow label="Einkommensteuer (Fünftelregelung)" value={-result.steuerAufAbfindungFuenftel} />
          <AmountRow label="Solidaritätszuschlag" value={-result.soliAufAbfindung} />
          {state.kirchensteuerPercent > 0 && (
            <AmountRow label="Kirchensteuer" value={-result.kirchensteuerAufAbfindung} />
          )}
          <AmountRow label="Netto von der Abfindung" value={result.nettoAbfindung} stark />
        </ul>
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="af-hinweise" className="surface-soft p-6">
          <h2 id="af-hinweise" className="font-display text-lg font-semibold tracking-tight">
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

      <AffiliateBlock slots={abfindungAffiliate} result={result} />
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

