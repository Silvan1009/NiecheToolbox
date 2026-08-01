"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card, CardTitle } from "@/components/ui/Card";
import { Field, SegmentedControl, Stepper, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { autokostenAffiliate } from "./affiliate";
import {
  antriebLabels,
  calculateAutokosten,
  defaultInput,
  type Antrieb,
  type AutokostenInput,
} from "./logic";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, AutokostenInput {}

const DEFAULTS: State = { ...defaultInput() };

const ANTRIEB_OPTIONS = [
  { value: "benzin", label: antriebLabels.benzin },
  { value: "diesel", label: antriebLabels.diesel },
  { value: "elektro", label: antriebLabels.elektro },
] as const satisfies readonly { value: Antrieb; label: string }[];

const isAntrieb = (value: unknown): value is Antrieb =>
  value === "benzin" || value === "diesel" || value === "elektro";

/** Deutsches Dezimalkomma erlauben; fehlende oder unbrauchbare Werte fallen auf `fallback`. */
function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    antrieb: isAntrieb(params?.antrieb) ? params.antrieb : DEFAULTS.antrieb,
    verbrauch: toNumber(params?.verbrauch, DEFAULTS.verbrauch),
    kraftstoffpreis: toNumber(params?.preis, DEFAULTS.kraftstoffpreis),
    kmProJahr: toNumber(params?.km, DEFAULTS.kmProJahr),
    kaufpreis: toNumber(params?.kaufpreis, DEFAULTS.kaufpreis),
    restwert: toNumber(params?.restwert, DEFAULTS.restwert),
    haltedauerJahre: toNumber(params?.haltedauer, DEFAULTS.haltedauerJahre),
    kfzSteuerJahr: toNumber(params?.steuer, DEFAULTS.kfzSteuerJahr),
    versicherungJahr: toNumber(params?.versicherung, DEFAULTS.versicherungJahr),
    wartungJahr: toNumber(params?.wartung, DEFAULTS.wartungJahr),
    verschleissJahr: toNumber(params?.verschleiss, DEFAULTS.verschleissJahr),
    sonstigesJahr: toNumber(params?.sonstiges, DEFAULTS.sonstigesJahr),
  };
}

export default function AutokostenTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const antrieb = search.get("antrieb");
      return {
        ...fallback,
        antrieb: isAntrieb(antrieb) ? antrieb : fallback.antrieb,
        verbrauch: toNumber(search.get("verbrauch"), fallback.verbrauch),
        kraftstoffpreis: toNumber(search.get("preis"), fallback.kraftstoffpreis),
        kmProJahr: toNumber(search.get("km"), fallback.kmProJahr),
        kaufpreis: toNumber(search.get("kaufpreis"), fallback.kaufpreis),
        restwert: toNumber(search.get("restwert"), fallback.restwert),
        haltedauerJahre: toNumber(search.get("haltedauer"), fallback.haltedauerJahre),
        kfzSteuerJahr: toNumber(search.get("steuer"), fallback.kfzSteuerJahr),
        versicherungJahr: toNumber(search.get("versicherung"), fallback.versicherungJahr),
        wartungJahr: toNumber(search.get("wartung"), fallback.wartungJahr),
        verschleissJahr: toNumber(search.get("verschleiss"), fallback.verschleissJahr),
        sonstigesJahr: toNumber(search.get("sonstiges"), fallback.sonstigesJahr),
      };
    },
    serialize: (next) => ({
      antrieb: urlValue(next.antrieb, DEFAULTS.antrieb),
      verbrauch: urlValue(next.verbrauch, DEFAULTS.verbrauch),
      preis: urlValue(next.kraftstoffpreis, DEFAULTS.kraftstoffpreis),
      km: urlValue(next.kmProJahr, DEFAULTS.kmProJahr),
      kaufpreis: urlValue(next.kaufpreis, DEFAULTS.kaufpreis),
      restwert: urlValue(next.restwert, DEFAULTS.restwert),
      haltedauer: urlValue(next.haltedauerJahre, DEFAULTS.haltedauerJahre),
      steuer: urlValue(next.kfzSteuerJahr, DEFAULTS.kfzSteuerJahr),
      versicherung: urlValue(next.versicherungJahr, DEFAULTS.versicherungJahr),
      wartung: urlValue(next.wartungJahr, DEFAULTS.wartungJahr),
      verschleiss: urlValue(next.verschleissJahr, DEFAULTS.verschleissJahr),
      sonstiges: urlValue(next.sonstigesJahr, DEFAULTS.sonstigesJahr),
    }),
  });

  const result = useMemo(() => calculateAutokosten(state), [state]);
  const istElektro = state.antrieb === "elektro";
  const verbrauchEinheit = istElektro ? "kWh/100 km" : "l/100 km";
  const preisEinheit = istElektro ? "€/kWh" : "€/l";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Antrieb und Fahrleistung">
        <CardTitle>Antrieb &amp; Fahrleistung</CardTitle>
        <div className="mt-4 flex flex-col gap-5">
          <Field label="Antrieb" htmlFor="ak-antrieb">
            <SegmentedControl
              value={state.antrieb}
              options={ANTRIEB_OPTIONS}
              onChange={(antrieb) => update({ antrieb })}
              ariaLabel="Antriebsart"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="Verbrauch"
              htmlFor="ak-verbrauch"
              hint={istElektro ? "Ø 15–22 kWh/100 km" : "Ø 6–8 l/100 km"}
            >
              <UnitInput
                id="ak-verbrauch"
                unit={verbrauchEinheit}
                value={state.verbrauch}
                onChange={(verbrauch) => update({ verbrauch })}
              />
            </Field>

            <Field
              label={istElektro ? "Strompreis" : "Kraftstoffpreis"}
              htmlFor="ak-preis"
            >
              <UnitInput
                id="ak-preis"
                unit={preisEinheit}
                value={state.kraftstoffpreis}
                onChange={(kraftstoffpreis) => update({ kraftstoffpreis })}
              />
            </Field>

            <Field label="Fahrleistung" htmlFor="ak-km">
              <Stepper
                id="ak-km"
                value={state.kmProJahr}
                min={0}
                max={100000}
                step={500}
                onChange={(kmProJahr) => update({ kmProJahr })}
                suffix="km/Jahr"
                ariaLabel="Kilometer pro Jahr"
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Wertverlust">
        <CardTitle>Wertverlust</CardTitle>
        <p className="mt-1.5 text-[15px] text-muted">
          Wird linear auf die Haltedauer verteilt – meist der größte, aber
          unsichtbarste Kostenposten.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Field label="Kaufpreis" htmlFor="ak-kaufpreis" hint="Neu oder gebraucht.">
            <UnitInput
              id="ak-kaufpreis"
              unit="€"
              value={state.kaufpreis}
              onChange={(kaufpreis) => update({ kaufpreis })}
            />
          </Field>

          <Field
            label="Restwert danach"
            htmlFor="ak-restwert"
            hint="Erwarteter Wiederverkaufswert."
          >
            <UnitInput
              id="ak-restwert"
              unit="€"
              value={state.restwert}
              onChange={(restwert) => update({ restwert })}
            />
          </Field>

          <Field label="Haltedauer" htmlFor="ak-haltedauer">
            <Stepper
              id="ak-haltedauer"
              value={state.haltedauerJahre}
              min={1}
              max={30}
              onChange={(haltedauerJahre) => update({ haltedauerJahre })}
              suffix="Jahre"
              ariaLabel="Haltedauer in Jahren"
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Fixkosten">
        <CardTitle>Fixkosten</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Kfz-Steuer" htmlFor="ak-steuer" hint="Pro Jahr.">
            <UnitInput
              id="ak-steuer"
              unit="€/Jahr"
              value={state.kfzSteuerJahr}
              onChange={(kfzSteuerJahr) => update({ kfzSteuerJahr })}
            />
          </Field>

          <Field
            label="Versicherung"
            htmlFor="ak-versicherung"
            hint="Haftpflicht, ggf. Teil- oder Vollkasko zusammen."
          >
            <UnitInput
              id="ak-versicherung"
              unit="€/Jahr"
              value={state.versicherungJahr}
              onChange={(versicherungJahr) => update({ versicherungJahr })}
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Wartung, Verschleiß und Sonstiges">
        <CardTitle>Wartung, Verschleiß &amp; Sonstiges</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Field
            label="Wartung & Inspektion"
            htmlFor="ak-wartung"
            hint="Werkstatt, Ölwechsel, TÜV/HU."
          >
            <UnitInput
              id="ak-wartung"
              unit="€/Jahr"
              value={state.wartungJahr}
              onChange={(wartungJahr) => update({ wartungJahr })}
            />
          </Field>

          <Field
            label="Verschleiß & Reifen"
            htmlFor="ak-verschleiss"
            hint="Reifensatz, Bremsen, Batterie."
          >
            <UnitInput
              id="ak-verschleiss"
              unit="€/Jahr"
              value={state.verschleissJahr}
              onChange={(verschleissJahr) => update({ verschleissJahr })}
            />
          </Field>

          <Field
            label="Sonstiges"
            htmlFor="ak-sonstiges"
            hint="Stellplatz, ADAC, Maut, Autowäsche."
          >
            <UnitInput
              id="ak-sonstiges"
              unit="€/Jahr"
              value={state.sonstigesJahr}
              onChange={(sonstigesJahr) => update({ sonstigesJahr })}
            />
          </Field>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Auto-Unterhaltskosten-Rechner"
            text={`${formatEuro(result.gesamtkostenMonat)} pro Monat, ${formatDecimal(result.kostenProKmCent)} Cent pro Kilometer`}
          />
        }
      >
        <NumberDisplay
          value={result.gesamtkostenMonat}
          format={formatEuro}
          suffix="pro Monat"
          caption="Gesamtkosten"
          announce={`${formatEuro(result.gesamtkostenMonat)} pro Monat, das sind ${formatDecimal(result.kostenProKmCent)} Cent pro Kilometer.`}
          hint={
            <>
              Das sind{" "}
              <strong className="font-semibold text-ink">
                {formatEuro(result.gesamtkostenJahr)}
              </strong>{" "}
              im Jahr oder{" "}
              <strong className="font-semibold text-ink">
                {formatDecimal(result.kostenProKmCent)} Cent
              </strong>{" "}
              pro gefahrenem Kilometer.
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Kosten pro Kilometer"
          value={`${formatDecimal(result.kostenProKmCent)} ct`}
          hint={`bei ${formatDecimal(state.kmProJahr)} km im Jahr`}
        />
        <Stat
          label="Wertverlust"
          value={formatEuro(result.wertverlustJahr)}
          hint="pro Jahr, linear über die Haltedauer"
        />
        <Stat
          label={result.kraftstoffLabel}
          value={formatEuro(result.kraftstoffJahr)}
          hint={`${formatDecimal(result.kraftstoffLiterOderKwh)} ${istElektro ? "kWh" : "Liter"} im Jahr`}
        />
        <Stat
          label="Gesamtkosten"
          value={formatEuro(result.gesamtkostenJahr)}
          hint="pro Jahr, alle Posten zusammen"
        />
      </dl>

      <section aria-labelledby="ak-aufteilung" className="surface-soft p-6">
        <h2
          id="ak-aufteilung"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Woraus sich die Kosten zusammensetzen
        </h2>
        <ul className="mt-4 flex flex-col gap-4">
          {result.posten
            .filter((posten) => posten.jahr > 0)
            .map((posten) => (
              <li key={posten.label}>
                <div className="flex items-baseline justify-between gap-4 text-[15px]">
                  <span>{posten.label}</span>
                  <span className="font-mono tabular-nums">
                    {formatEuro(posten.jahr)}
                    <span className="ml-2 text-[13px] text-muted">
                      {formatDecimal(posten.anteilProzent)} %
                    </span>
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2 overflow-hidden rounded-pill bg-ink-soft"
                  role="img"
                  aria-label={`${posten.label}: ${formatDecimal(posten.anteilProzent)} Prozent der Gesamtkosten`}
                >
                  <div
                    className="h-full rounded-pill bg-accent"
                    style={{ width: `${Math.min(100, posten.anteilProzent)}%` }}
                  />
                </div>
              </li>
            ))}
        </ul>
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="ak-hinweise" className="surface-soft p-6">
          <h2
            id="ak-hinweise"
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

      <AffiliateBlock slots={autokostenAffiliate} result={result} />
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
        <span className="font-mono text-2xl leading-none font-semibold tabular-nums">
          {value}
        </span>
        <span className="mt-1 block text-[13px] text-muted">{hint}</span>
      </dd>
    </div>
  );
}
