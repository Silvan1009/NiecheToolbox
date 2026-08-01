"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, Stepper, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { rentenlueckeAffiliate } from "./affiliate";
import {
  calculateRentenluecke,
  defaultInput,
  type EinkommenModus,
  type RentenlueckeInput,
} from "./logic";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, RentenlueckeInput {}

const DEFAULTS: State = { ...defaultInput() };

const MODUS_OPTIONS = [
  { value: "prozent", label: "Vom Einkommen" },
  { value: "fest", label: "Fester Betrag" },
] as const satisfies readonly { value: EinkommenModus; label: string }[];

const NIVEAU_PRESETS = [70, 80, 90, 100];

const isModus = (value: unknown): value is EinkommenModus =>
  value === "prozent" || value === "fest";

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
    aktuellesAlter: toNumber(params?.alter, DEFAULTS.aktuellesAlter),
    renteneintrittsalter: toNumber(params?.renteneintritt, DEFAULTS.renteneintrittsalter),
    lebenserwartung: toNumber(params?.leben, DEFAULTS.lebenserwartung),
    einkommenModus: isModus(params?.modus) ? params.modus : DEFAULTS.einkommenModus,
    nettoEinkommen: toNumber(params?.netto, DEFAULTS.nettoEinkommen),
    versorgungsniveauPercent: toNumber(params?.niveau, DEFAULTS.versorgungsniveauPercent),
    gewuenschtesEinkommenFest: toNumber(params?.wunsch, DEFAULTS.gewuenschtesEinkommenFest),
    gesetzlicheRente: toNumber(params?.gesetzlich, DEFAULTS.gesetzlicheRente),
    weitereRenten: toNumber(params?.weitere, DEFAULTS.weitereRenten),
    vorhandenesVermoegen: toNumber(params?.vermoegen, DEFAULTS.vorhandenesVermoegen),
    monatlicheSparrate: toNumber(params?.sparrate, DEFAULTS.monatlicheSparrate),
    renditeAnsparphasePercent: toNumber(
      params?.renditean,
      DEFAULTS.renditeAnsparphasePercent,
    ),
    renditeRentenphasePercent: toNumber(
      params?.renditerente,
      DEFAULTS.renditeRentenphasePercent,
    ),
    inflationPercent: toNumber(params?.inflation, DEFAULTS.inflationPercent),
  };
}

export default function RentenlueckeTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const modus = search.get("modus");
      return {
        ...fallback,
        aktuellesAlter: toNumber(search.get("alter"), fallback.aktuellesAlter),
        renteneintrittsalter: toNumber(
          search.get("renteneintritt"),
          fallback.renteneintrittsalter,
        ),
        lebenserwartung: toNumber(search.get("leben"), fallback.lebenserwartung),
        einkommenModus: isModus(modus) ? modus : fallback.einkommenModus,
        nettoEinkommen: toNumber(search.get("netto"), fallback.nettoEinkommen),
        versorgungsniveauPercent: toNumber(
          search.get("niveau"),
          fallback.versorgungsniveauPercent,
        ),
        gewuenschtesEinkommenFest: toNumber(
          search.get("wunsch"),
          fallback.gewuenschtesEinkommenFest,
        ),
        gesetzlicheRente: toNumber(search.get("gesetzlich"), fallback.gesetzlicheRente),
        weitereRenten: toNumber(search.get("weitere"), fallback.weitereRenten),
        vorhandenesVermoegen: toNumber(
          search.get("vermoegen"),
          fallback.vorhandenesVermoegen,
        ),
        monatlicheSparrate: toNumber(search.get("sparrate"), fallback.monatlicheSparrate),
        renditeAnsparphasePercent: toNumber(
          search.get("renditean"),
          fallback.renditeAnsparphasePercent,
        ),
        renditeRentenphasePercent: toNumber(
          search.get("renditerente"),
          fallback.renditeRentenphasePercent,
        ),
        inflationPercent: toNumber(search.get("inflation"), fallback.inflationPercent),
      };
    },
    serialize: (next) => ({
      alter: urlValue(next.aktuellesAlter, DEFAULTS.aktuellesAlter),
      renteneintritt: urlValue(next.renteneintrittsalter, DEFAULTS.renteneintrittsalter),
      leben: urlValue(next.lebenserwartung, DEFAULTS.lebenserwartung),
      modus: urlValue(next.einkommenModus, DEFAULTS.einkommenModus),
      netto: urlValue(next.nettoEinkommen, DEFAULTS.nettoEinkommen),
      niveau: urlValue(next.versorgungsniveauPercent, DEFAULTS.versorgungsniveauPercent),
      wunsch: urlValue(next.gewuenschtesEinkommenFest, DEFAULTS.gewuenschtesEinkommenFest),
      gesetzlich: urlValue(next.gesetzlicheRente, DEFAULTS.gesetzlicheRente),
      weitere: urlValue(next.weitereRenten, DEFAULTS.weitereRenten),
      vermoegen: urlValue(next.vorhandenesVermoegen, DEFAULTS.vorhandenesVermoegen),
      sparrate: urlValue(next.monatlicheSparrate, DEFAULTS.monatlicheSparrate),
      renditean: urlValue(next.renditeAnsparphasePercent, DEFAULTS.renditeAnsparphasePercent),
      renditerente: urlValue(
        next.renditeRentenphasePercent,
        DEFAULTS.renditeRentenphasePercent,
      ),
      inflation: urlValue(next.inflationPercent, DEFAULTS.inflationPercent),
    }),
  });

  const result = useMemo(() => calculateRentenluecke(state), [state]);
  const istProzentModus = state.einkommenModus === "prozent";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Wunscheinkommen im Ruhestand">
        <CardTitle>Wunscheinkommen im Ruhestand</CardTitle>
        <div className="mt-4 flex flex-col gap-5">
          <Field
            label="Wunscheinkommen"
            htmlFor="rl-modus"
            hint={
              istProzentModus
                ? "Ein Anteil deines heutigen Nettoeinkommens."
                : "Ein fester Betrag pro Monat, in heutiger Kaufkraft."
            }
          >
            <SegmentedControl
              value={state.einkommenModus}
              options={MODUS_OPTIONS}
              onChange={(einkommenModus) => update({ einkommenModus })}
              ariaLabel="Art des Wunscheinkommens"
            />
          </Field>

          {istProzentModus ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Heutiges Nettoeinkommen"
                htmlFor="rl-netto"
                hint="Das, was monatlich netto ankommt."
              >
                <UnitInput
                  id="rl-netto"
                  unit="€"
                  value={state.nettoEinkommen}
                  onChange={(nettoEinkommen) => update({ nettoEinkommen })}
                />
              </Field>

              <Field
                label="Versorgungsniveau"
                htmlFor="rl-niveau"
                hint="70–80 % gelten als Richtwert, weil im Ruhestand einige Ausgaben wegfallen."
              >
                <div className="flex flex-wrap items-center gap-2">
                  {NIVEAU_PRESETS.map((preset) => {
                    const active = state.versorgungsniveauPercent === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={active}
                        onClick={() => update({ versorgungsniveauPercent: preset })}
                        className={`h-10 rounded-pill px-3.5 text-sm font-semibold transition-colors duration-(--dur-fast) ${
                          active
                            ? "bg-accent text-white shadow-soft"
                            : "bg-surface text-muted shadow-[var(--elev-inset)] hover:bg-ink-soft hover:text-ink"
                        }`}
                      >
                        {preset} %
                      </button>
                    );
                  })}
                  <div className="w-24">
                    <UnitInput
                      id="rl-niveau"
                      unit="%"
                      value={state.versorgungsniveauPercent}
                      onChange={(versorgungsniveauPercent) =>
                        update({ versorgungsniveauPercent })
                      }
                    />
                  </div>
                </div>
              </Field>
            </div>
          ) : (
            <Field
              label="Gewünschtes Nettoeinkommen im Ruhestand"
              htmlFor="rl-wunsch"
              hint="In heutiger Kaufkraft, also vergleichbar mit einem Nettogehalt von heute."
            >
              <UnitInput
                id="rl-wunsch"
                unit="€"
                value={state.gewuenschtesEinkommenFest}
                onChange={(gewuenschtesEinkommenFest) =>
                  update({ gewuenschtesEinkommenFest })
                }
              />
            </Field>
          )}
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Alter und Zeitraum">
        <CardTitle>Alter &amp; Zeitraum</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Field label="Aktuelles Alter" htmlFor="rl-alter">
            <Stepper
              id="rl-alter"
              value={state.aktuellesAlter}
              min={16}
              max={80}
              onChange={(aktuellesAlter) => update({ aktuellesAlter })}
              suffix="Jahre"
              ariaLabel="Aktuelles Alter"
            />
          </Field>

          <Field label="Renteneintritt" htmlFor="rl-renteneintritt">
            <Stepper
              id="rl-renteneintritt"
              value={state.renteneintrittsalter}
              min={16}
              max={80}
              onChange={(renteneintrittsalter) => update({ renteneintrittsalter })}
              suffix="Jahre"
              ariaLabel="Renteneintrittsalter"
            />
          </Field>

          <Field
            label="Lebenserwartung"
            htmlFor="rl-leben"
            hint="Bis wann das Kapital reichen soll."
          >
            <Stepper
              id="rl-leben"
              value={state.lebenserwartung}
              min={state.renteneintrittsalter + 1}
              max={110}
              onChange={(lebenserwartung) => update({ lebenserwartung })}
              suffix="Jahre"
              ariaLabel="Lebenserwartung"
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Erwartete Rente">
        <CardTitle>Erwartete Rente</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Gesetzliche Rente"
            htmlFor="rl-gesetzlich"
            hint="Aus deiner jährlichen Renteninformation, in heutiger Kaufkraft."
          >
            <UnitInput
              id="rl-gesetzlich"
              unit="€"
              value={state.gesetzlicheRente}
              onChange={(gesetzlicheRente) => update({ gesetzlicheRente })}
            />
          </Field>

          <Field
            label="Weitere Renten"
            htmlFor="rl-weitere"
            hint="Betriebsrente, Riester, Rürup – alles, was schon feststeht."
          >
            <UnitInput
              id="rl-weitere"
              unit="€"
              value={state.weitereRenten}
              onChange={(weitereRenten) => update({ weitereRenten })}
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Vorsorgevermögen">
        <CardTitle>Vorsorgevermögen</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Vorhandenes Vermögen"
            htmlFor="rl-vermoegen"
            hint="Depot, Riester, Rürup, Betriebsrente-Kapital – was schon da ist."
          >
            <UnitInput
              id="rl-vermoegen"
              unit="€"
              value={state.vorhandenesVermoegen}
              onChange={(vorhandenesVermoegen) => update({ vorhandenesVermoegen })}
            />
          </Field>

          <Field
            label="Monatliche Sparrate"
            htmlFor="rl-sparrate"
            hint="Was aktuell zusätzlich für den Ruhestand zurückgelegt wird."
          >
            <UnitInput
              id="rl-sparrate"
              unit="€"
              value={state.monatlicheSparrate}
              onChange={(monatlicheSparrate) => update({ monatlicheSparrate })}
            />
          </Field>
        </div>
      </Card>

      <Klapp
        title="Rendite &amp; Inflation"
        hint="Vorgabewerte anpassen – wichtig für die Kapitallücke."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="Rendite Ansparphase"
            htmlFor="rl-renditean"
            hint="Breiter Aktien-ETF langfristig 5–7 %, sicherer angelegt weniger."
          >
            <UnitInput
              id="rl-renditean"
              unit="% p. a."
              value={state.renditeAnsparphasePercent}
              onChange={(renditeAnsparphasePercent) =>
                update({ renditeAnsparphasePercent })
              }
            />
          </Field>

          <Field
            label="Rendite Rentenphase"
            htmlFor="rl-renditerente"
            hint="Meist niedriger – im Ruhestand wird oft sicherer angelegt."
          >
            <UnitInput
              id="rl-renditerente"
              unit="% p. a."
              value={state.renditeRentenphasePercent}
              onChange={(renditeRentenphasePercent) =>
                update({ renditeRentenphasePercent })
              }
            />
          </Field>

          <Field
            label="Inflation"
            htmlFor="rl-inflation"
            hint="Für die Umrechnung in heutige Kaufkraft."
          >
            <UnitInput
              id="rl-inflation"
              unit="% p. a."
              value={state.inflationPercent}
              onChange={(inflationPercent) => update({ inflationPercent })}
            />
          </Field>
        </div>
      </Klapp>

      <ResultPanel
        footer={
          <ShareBar
            title="Rentenlücken-Rechner"
            text={`${formatEuro(result.monatlicheLuecke)} Rentenlücke pro Monat`}
          />
        }
      >
        <NumberDisplay
          value={result.monatlicheLuecke}
          format={formatEuro}
          suffix="pro Monat"
          caption="Monatliche Rentenlücke"
          announce={`${formatEuro(result.monatlicheLuecke)} Rentenlücke pro Monat, dafür braucht es ${formatEuro(result.kapitalbedarf)} Kapital bei Renteneintritt.`}
          hint={
            result.monatlicheLuecke === 0 ? (
              <>
                Die erwartete Rente deckt dein Wunscheinkommen bereits – rechnerisch
                braucht es kein zusätzliches Kapital.
              </>
            ) : result.kapitalLuecke === 0 ? (
              <>
                Dafür braucht es{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.kapitalbedarf)}
                </strong>{" "}
                bei Renteneintritt – mit vorhandenem Vermögen und aktueller Sparrate
                rechnerisch bereits erreicht.
              </>
            ) : (
              <>
                Dafür braucht es{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.kapitalbedarf)}
                </strong>{" "}
                bei Renteneintritt – zusätzlich zur aktuellen Sparrate fehlen dafür{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.zusaetzlicheSparrateNoetig)}
                </strong>{" "}
                im Monat.
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Kapitalbedarf bei Rente"
          value={formatEuro(result.kapitalbedarf)}
          hint={`für ${result.jahreRentenbezug} Jahre Rentenbezug`}
        />
        <Stat
          label="Voraussichtliches Kapital"
          value={formatEuro(result.projiziertesKapital)}
          hint={`nach ${result.jahreBisRente} Jahren Ansparphase`}
        />
        <Stat
          label="Kapitallücke"
          value={formatEuro(result.kapitalLuecke)}
          hint={result.zielErreichbar ? "rechnerisch geschlossen" : "bei Renteneintritt"}
        />
        <Stat
          label="Sparrate insgesamt nötig"
          value={formatEuro(result.sparrateGesamtNoetig)}
          hint={
            result.zusaetzlicheSparrateNoetig > 0
              ? `davon ${formatEuro(result.zusaetzlicheSparrateNoetig)} zusätzlich`
              : "aktuelle Sparrate reicht"
          }
        />
      </dl>

      <section aria-labelledby="rl-ewig" className="surface-soft p-6">
        <h2 id="rl-ewig" className="font-display text-lg font-semibold tracking-tight">
          Wie lange soll das Kapital reichen?
        </h2>
        <p className="mt-1.5 text-[15px] text-muted">
          Beide Beträge schließen dieselbe monatliche Lücke – nur unterschiedlich lang.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Stat
            label={`Befristet auf ${result.jahreRentenbezug} Jahre`}
            value={formatEuro(result.kapitalbedarf)}
            hint="danach ist das Kapital aufgebraucht"
          />
          <Stat
            label="Für immer, ohne Kapitalverzehr"
            value={
              result.kapitalbedarfEwig === null
                ? "–"
                : formatEuro(result.kapitalbedarfEwig)
            }
            hint={
              result.kapitalbedarfEwig === null
                ? "nicht möglich ohne positive Realrendite"
                : "nur aus den laufenden Erträgen"
            }
          />
        </dl>
      </section>

      <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors duration-(--dur-fast) hover:bg-ink-soft">
          <span className="font-display text-lg font-semibold tracking-tight">
            Jahr für Jahr bis zur Rente
          </span>
          <ChevronDown
            className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="overflow-x-auto px-6 pb-6">
          {result.jahre.length === 0 ? (
            <p className="text-[15px] text-muted">
              Der Renteneintritt liegt nicht mehr in der Zukunft – es gibt keine
              Ansparphase mehr.
            </p>
          ) : (
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[13px] text-muted">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Alter
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-semibold">
                    Einzahlung im Jahr
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-semibold">
                    Eingezahlt gesamt
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Kapital (heutige Kaufkraft)
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {result.jahre.map((zeile) => (
                  <tr key={zeile.jahr} className="border-b border-line/60">
                    <th scope="row" className="py-2 pr-4 text-left font-sans">
                      {zeile.alter}
                    </th>
                    <td className="py-2 pr-4 text-right">
                      {formatEuro(zeile.einzahlungJahr)}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      {formatEuro(zeile.eingezahltGesamt)}
                    </td>
                    <td className="py-2 text-right">{formatEuro(zeile.kapitalEnde)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </details>

      {result.warnings.length > 0 && (
        <section aria-labelledby="rl-hinweise" className="surface-soft p-6">
          <h2
            id="rl-hinweise"
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

      <p className="text-[13px] text-muted">
        Reale Rendite Ansparphase: {formatDecimal(result.realeRenditeAnsparphase)} % ·
        Rentenphase: {formatDecimal(result.realeRenditeRentenphase)} % – jeweils nach
        Abzug der Inflation.
      </p>

      <AffiliateBlock slots={rentenlueckeAffiliate} result={result} />
    </div>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg font-semibold tracking-tight">{children}</h2>
  );
}

/** Eingaben, die nicht jeder braucht, bleiben eingeklappt. */
function Klapp({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors duration-(--dur-fast) hover:bg-ink-soft">
        <span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {title}
          </span>
          <span className="mt-0.5 block text-[13px] text-muted">{hint}</span>
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-6 pb-6">{children}</div>
    </details>
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
