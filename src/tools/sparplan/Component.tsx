"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card, CardTitle, Disclosure } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Select,
  Stepper,
  Toggle,
  UnitInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { sparplanAffiliate } from "./affiliate";
import {
  calculateSparplan,
  defaultInput,
  type SparplanInput,
  type SparplanModus,
} from "./logic";
import { STEUER_STAND, anlagearten, type Anlageart } from "./steuern";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, SparplanInput {}

const DEFAULTS: State = { ...defaultInput() };

const MODUS_OPTIONS = [
  { value: "endkapital", label: "Was wird daraus?" },
  { value: "sparrate", label: "Was muss ich sparen?" },
] as const satisfies readonly { value: SparplanModus; label: string }[];

const KIRCHENSTEUER_OPTIONS = [
  { value: 0, label: "keine Kirchensteuer" },
  { value: 8, label: "8 % (Bayern, Baden-Württemberg)" },
  { value: 9, label: "9 % (übrige Bundesländer)" },
];

const isModus = (value: unknown): value is SparplanModus =>
  value === "endkapital" || value === "sparrate";

const isAnlageart = (value: unknown): value is Anlageart =>
  typeof value === "string" && value in anlagearten;

/** Schalter kommen als 0/1 aus der URL und aus den Varianten-Params. */
function toBool(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "1" || value === 1 || value === "true";
}

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    modus: isModus(params?.modus) ? params.modus : DEFAULTS.modus,
    startkapital: toNumber(params?.start, DEFAULTS.startkapital),
    sparrateMonat: toNumber(params?.rate, DEFAULTS.sparrateMonat),
    zielkapital: toNumber(params?.ziel, DEFAULTS.zielkapital),
    laufzeitJahre: toNumber(params?.jahre, DEFAULTS.laufzeitJahre),
    renditePercent: toNumber(params?.rendite, DEFAULTS.renditePercent),
    kostenPercent: toNumber(params?.kosten, DEFAULTS.kostenPercent),
    entnahmeJahre: toNumber(params?.entnahme, DEFAULTS.entnahmeJahre),
    steuernBeruecksichtigen: toBool(
      params?.steuern,
      DEFAULTS.steuernBeruecksichtigen,
    ),
  };
}

export default function SparplanTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      // Werte mit Typwächter erst lesen, dann prüfen: über zwei getrennte
      // `search.get`-Aufrufe hinweg engt TypeScript den Typ nicht ein.
      const modus = search.get("modus");
      const art = search.get("art");

      return {
        ...fallback,
        modus: isModus(modus) ? modus : fallback.modus,
        startkapital: toNumber(search.get("start"), fallback.startkapital),
        sparrateMonat: toNumber(search.get("rate"), fallback.sparrateMonat),
        zielkapital: toNumber(search.get("ziel"), fallback.zielkapital),
        dynamikPercent: toNumber(search.get("dyn"), fallback.dynamikPercent),
        renditePercent: toNumber(search.get("rendite"), fallback.renditePercent),
        laufzeitJahre: toNumber(search.get("jahre"), fallback.laufzeitJahre),
        kostenPercent: toNumber(search.get("kosten"), fallback.kostenPercent),
        ausgabeaufschlagPercent: toNumber(
          search.get("aufschlag"),
          fallback.ausgabeaufschlagPercent,
        ),
        inflationPercent: toNumber(
          search.get("inflation"),
          fallback.inflationPercent,
        ),
        anlageart: isAnlageart(art) ? art : fallback.anlageart,
        steuernBeruecksichtigen: toBool(
          search.get("steuern"),
          fallback.steuernBeruecksichtigen,
        ),
        kirchensteuerPercent: toNumber(
          search.get("kirche"),
          fallback.kirchensteuerPercent,
        ),
        entnahmeJahre: toNumber(search.get("entnahme"), fallback.entnahmeJahre),
      };
    },
    // Nur Abweichungen vom Default landen in der URL – sonst wäre der Link
    // bei vierzehn Feldern nicht mehr teilbar.
    serialize: (next) => ({
      modus: urlValue(next.modus, DEFAULTS.modus),
      start: urlValue(next.startkapital, DEFAULTS.startkapital),
      rate: urlValue(next.sparrateMonat, DEFAULTS.sparrateMonat),
      ziel: urlValue(next.zielkapital, DEFAULTS.zielkapital),
      dyn: urlValue(next.dynamikPercent, DEFAULTS.dynamikPercent),
      rendite: urlValue(next.renditePercent, DEFAULTS.renditePercent),
      jahre: urlValue(next.laufzeitJahre, DEFAULTS.laufzeitJahre),
      kosten: urlValue(next.kostenPercent, DEFAULTS.kostenPercent),
      aufschlag: urlValue(
        next.ausgabeaufschlagPercent,
        DEFAULTS.ausgabeaufschlagPercent,
      ),
      inflation: urlValue(next.inflationPercent, DEFAULTS.inflationPercent),
      art: urlValue(next.anlageart, DEFAULTS.anlageart),
      steuern:
        next.steuernBeruecksichtigen === DEFAULTS.steuernBeruecksichtigen
          ? ""
          : next.steuernBeruecksichtigen
            ? "1"
            : "0",
      kirche: urlValue(next.kirchensteuerPercent, DEFAULTS.kirchensteuerPercent),
      entnahme: urlValue(next.entnahmeJahre, DEFAULTS.entnahmeJahre),
    }),
  });

  const result = useMemo(() => calculateSparplan(state), [state]);

  const istZielmodus = state.modus === "sparrate";
  const payoff = istZielmodus ? result.sparrateMonat : result.endkapitalNachSteuer;

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Was rechnest du?">
        <Field
          label="Was rechnest du?"
          htmlFor="sp-modus"
          hint={
            istZielmodus
              ? "Du nennst den Betrag, der am Ende dastehen soll – der Rechner sucht die Rate dafür."
              : "Du nennst die Sparrate – der Rechner zeigt, was daraus wird."
          }
        >
          <SegmentedControl
            value={state.modus}
            options={MODUS_OPTIONS}
            onChange={(modus) => update({ modus })}
            ariaLabel="Rechenrichtung"
          />
        </Field>
      </Card>

      <Card as="section" className="p-6" aria-label="Sparplan">
        <CardTitle>Sparplan</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Startkapital"
            htmlFor="sp-start"
            hint="Was heute schon da ist. Kann 0 sein."
          >
            <UnitInput
              id="sp-start"
              unit="€"
              value={state.startkapital}
              onChange={(startkapital) => update({ startkapital })}
            />
          </Field>

          {istZielmodus ? (
            <Field
              label="Zielbetrag"
              htmlFor="sp-ziel"
              hint="Was am Ende zur Verfügung stehen soll – nach Steuern."
            >
              <UnitInput
                id="sp-ziel"
                unit="€"
                value={state.zielkapital}
                onChange={(zielkapital) => update({ zielkapital })}
              />
            </Field>
          ) : (
            <Field
              label="Sparrate im Monat"
              htmlFor="sp-rate"
              hint="Wird jeweils zu Monatsbeginn eingezahlt."
            >
              <UnitInput
                id="sp-rate"
                unit="€"
                value={state.sparrateMonat}
                onChange={(sparrateMonat) => update({ sparrateMonat })}
              />
            </Field>
          )}

          <Field label="Laufzeit" htmlFor="sp-jahre">
            <Stepper
              id="sp-jahre"
              value={state.laufzeitJahre}
              min={1}
              max={60}
              onChange={(laufzeitJahre) => update({ laufzeitJahre })}
              suffix="Jahre"
              ariaLabel="Laufzeit in Jahren"
            />
          </Field>

          <Field
            label="Rendite pro Jahr"
            htmlFor="sp-rendite"
            hint="Breiter Aktien-ETF langfristig 5 bis 7 %, Tagesgeld 2 bis 3 %."
          >
            <UnitInput
              id="sp-rendite"
              unit="%"
              value={state.renditePercent}
              onChange={(renditePercent) => update({ renditePercent })}
            />
          </Field>
        </div>
      </Card>

      <Disclosure
        title="Kosten und Dynamik"
        hint="Fondsgebühr, Ausgabeaufschlag und eine jährlich steigende Rate."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Laufende Kosten (TER)"
            htmlFor="sp-kosten"
            hint="Breite ETFs 0,1 bis 0,3 %, aktive Fonds 1,5 bis 2 %."
          >
            <UnitInput
              id="sp-kosten"
              unit="% p. a."
              value={state.kostenPercent}
              onChange={(kostenPercent) => update({ kostenPercent })}
            />
          </Field>

          <Field
            label="Ausgabeaufschlag"
            htmlFor="sp-aufschlag"
            hint="Je Einzahlung. Bei ETF-Sparplänen meist 0 %."
          >
            <UnitInput
              id="sp-aufschlag"
              unit="%"
              value={state.ausgabeaufschlagPercent}
              onChange={(ausgabeaufschlagPercent) =>
                update({ ausgabeaufschlagPercent })
              }
            />
          </Field>

          <Field
            label="Dynamik"
            htmlFor="sp-dyn"
            hint="Jährliche Erhöhung der Sparrate, damit sie mit dem Einkommen mitwächst."
          >
            <UnitInput
              id="sp-dyn"
              unit="% p. a."
              value={state.dynamikPercent}
              onChange={(dynamikPercent) => update({ dynamikPercent })}
            />
          </Field>

          <Field
            label="Inflation"
            htmlFor="sp-inflation"
            hint="Für die Umrechnung in heutige Kaufkraft."
          >
            <UnitInput
              id="sp-inflation"
              unit="% p. a."
              value={state.inflationPercent}
              onChange={(inflationPercent) => update({ inflationPercent })}
            />
          </Field>
        </div>
      </Disclosure>

      <Disclosure
        title="Steuern"
        hint={`Abgeltungsteuer, Teilfreistellung und Vorabpauschale. Stand: ${STEUER_STAND.slice(0, 4)}.`}
      >
        <div className="flex flex-col gap-5">
          <Toggle
            checked={state.steuernBeruecksichtigen}
            onChange={(steuernBeruecksichtigen) =>
              update({ steuernBeruecksichtigen })
            }
            label="Steuern mitrechnen"
            hint="Abgeltungsteuer und Soli auf den Gewinn, jährliche Vorabpauschale, Sparerpauschbetrag von 1.000 Euro."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Anlageart"
              htmlFor="sp-art"
              hint={anlagearten[state.anlageart].hint}
            >
              <Select
                id="sp-art"
                value={state.anlageart}
                onChange={(event) => {
                  const anlageart = event.target.value;
                  if (isAnlageart(anlageart)) update({ anlageart });
                }}
              >
                {Object.entries(anlagearten).map(([key, def]) => (
                  <option key={key} value={key}>
                    {def.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Kirchensteuer" htmlFor="sp-kirche">
              <Select
                id="sp-kirche"
                value={state.kirchensteuerPercent}
                onChange={(event) =>
                  update({ kirchensteuerPercent: Number(event.target.value) })
                }
              >
                {KIRCHENSTEUER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      </Disclosure>

      <ResultPanel
        footer={
          <ShareBar
            title="Sparplan-Rechner"
            text={
              istZielmodus
                ? `${formatEuro(result.sparrateMonat)} im Monat für ${formatEuro(state.zielkapital)} in ${result.laufzeitJahre} Jahren`
                : `${formatEuro(result.endkapitalNachSteuer)} nach ${result.laufzeitJahre} Jahren aus ${formatEuro(result.eingezahlt)} Einzahlung`
            }
          />
        }
      >
        <NumberDisplay
          value={payoff}
          format={formatEuro}
          suffix={istZielmodus ? "pro Monat" : undefined}
          caption={istZielmodus ? "Nötige Sparrate" : "Endkapital nach Steuern"}
          tone="positive"
          announce={
            istZielmodus
              ? `${formatEuro(result.sparrateMonat)} Sparrate pro Monat, um in ${result.laufzeitJahre} Jahren ${formatEuro(state.zielkapital)} zu erreichen.`
              : `${formatEuro(result.endkapitalNachSteuer)} nach ${result.laufzeitJahre} Jahren, davon ${formatEuro(result.eingezahlt)} eingezahlt.`
          }
          hint={
            istZielmodus ? (
              <>
                Damit stehen nach {result.laufzeitJahre} Jahren{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.endkapitalNachSteuer)}
                </strong>{" "}
                zur Verfügung – bei{" "}
                {formatEuro(result.eingezahlt)} eigener Einzahlung.
              </>
            ) : (
              <>
                Aus{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.eingezahlt)}
                </strong>{" "}
                Einzahlung werden{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.ertrag)}
                </strong>{" "}
                Ertrag. In heutiger Kaufkraft sind das{" "}
                {formatEuro(result.endkapitalReal)}.
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Eingezahlt"
          value={formatEuro(result.eingezahlt)}
          hint={
            istZielmodus
              ? `${formatEuro(result.sparrateMonat)} im Monat`
              : `über ${result.laufzeitJahre} Jahre`
          }
        />
        <Stat
          label="Depotwert vor Steuern"
          value={formatEuro(result.endkapital)}
          hint={
            result.zinsanteilProzent === null
              ? "ohne Ertrag"
              : `${formatDecimal(result.zinsanteilProzent)} % davon sind Ertrag`
          }
        />
        <Stat
          label="In heutiger Kaufkraft"
          value={formatEuro(result.endkapitalReal)}
          hint={`bei ${formatDecimal(state.inflationPercent)} % Inflation`}
        />
        <Stat
          label={
            state.steuernBeruecksichtigen
              ? "Rendite nach Kosten und Steuern"
              : "Rendite nach Kosten"
          }
          value={
            result.renditeNachKostenUndSteuernProJahr === null
              ? "–"
              : `${formatDecimal(result.renditeNachKostenUndSteuernProJahr)} %`
          }
          hint={
            result.verdopplungJahre === null
              ? "keine Verdopplung"
              : `Verdopplung in ${formatDecimal(result.verdopplungJahre)} Jahren`
          }
        />
      </dl>

      <section aria-labelledby="sp-abzuege" className="surface-soft p-6">
        <h2
          id="sp-abzuege"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Was vom Ertrag abgeht
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <AmountRow label="Depotwert vor Steuern" value={result.endkapital} />
          <AmountRow label="Eingezahlt" value={-result.eingezahlt} />
          <AmountRow label="Ertrag" value={result.ertrag} stark />
          <AmountRow
            label="Laufende Kosten und Ausgabeaufschlag"
            value={-result.kostenGesamt}
          />
          <AmountRow
            label="Vorabpauschale während der Laufzeit"
            value={-result.steuerLaufend}
          />
          <AmountRow label="Steuer beim Verkauf" value={-result.steuerVerkauf} />
          <AmountRow
            label="Endkapital nach Steuern"
            value={result.endkapitalNachSteuer}
            stark
          />
        </ul>
      </section>

      <section aria-labelledby="sp-entnahme" className="surface-soft p-6">
        <h2
          id="sp-entnahme"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Was sich davon entnehmen lässt
        </h2>
        <p className="mt-1.5 text-[15px] text-muted">
          Ein Sparplan endet nicht mit dem Endkapital, sondern mit der Frage,
          was monatlich herauskommt. Beide Beträge sind vor Steuer auf die
          enthaltenen Gewinnanteile.
        </p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Entnahme über" htmlFor="sp-entnahme-jahre">
            <Stepper
              id="sp-entnahme-jahre"
              value={state.entnahmeJahre}
              min={1}
              max={60}
              onChange={(entnahmeJahre) => update({ entnahmeJahre })}
              suffix="Jahre"
              ariaLabel="Entnahmedauer in Jahren"
            />
          </Field>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <Stat
            label={`Entnahme über ${result.entnahmeJahre} Jahre`}
            value={formatEuro(result.entnahmeMonat)}
            hint="pro Monat, danach ist das Kapital aufgebraucht"
          />
          <Stat
            label="Entnahme ohne Kapitalverzehr"
            value={formatEuro(result.entnahmeEwigMonat)}
            hint="pro Monat, nur aus den Erträgen – dauerhaft"
          />
        </dl>
      </section>

      <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors duration-(--dur-fast) hover:bg-ink-soft">
          <span className="font-display text-lg font-semibold tracking-tight">
            Jahr für Jahr
          </span>
          <ChevronDown
            className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[13px] text-muted">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Jahr
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Eingezahlt
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Depotwert
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  davon Ertrag
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Steuer
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {result.jahre.map((zeile) => (
                <tr key={zeile.jahr} className="border-b border-line/60">
                  <th scope="row" className="py-2 pr-4 text-left font-sans">
                    {zeile.jahr}
                  </th>
                  <td className="py-2 pr-4 text-right">
                    {formatEuro(zeile.eingezahltGesamt)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {formatEuro(zeile.wertEnde)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {formatEuro(zeile.ertragGesamt)}
                  </td>
                  <td className="py-2 text-right">
                    {formatEuro(zeile.steuerJahr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {result.warnings.length > 0 && (
        <section aria-labelledby="sp-hinweise" className="surface-soft p-6">
          <h2
            id="sp-hinweise"
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

      <AffiliateBlock slots={sparplanAffiliate} result={result} />
    </div>
  );
}

