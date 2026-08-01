"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, Select, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatEuro, formatInteger } from "@/lib/format";
import { urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { erbschaftsteuerAffiliate } from "./affiliate";
import {
  calculateErbschaftsteuer,
  defaultInput,
  verwandtschaftLabels,
  type ErbschaftInput,
  type ErbschaftModus,
  type Verwandtschaft,
} from "./logic";

interface State extends Record<string, unknown>, ErbschaftInput {}

const DEFAULTS: State = { ...defaultInput() };

const MODUS_OPTIONS = [
  { value: "erbschaft", label: "Erbschaft" },
  { value: "schenkung", label: "Schenkung zu Lebzeiten" },
] as const satisfies readonly { value: ErbschaftModus; label: string }[];

const VERWANDTSCHAFT_OPTIONS = Object.keys(verwandtschaftLabels) as Verwandtschaft[];

const isModus = (value: unknown): value is ErbschaftModus =>
  value === "erbschaft" || value === "schenkung";
const isVerwandtschaft = (value: unknown): value is Verwandtschaft =>
  typeof value === "string" && value in verwandtschaftLabels;

function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    modus: isModus(params?.modus) ? params.modus : DEFAULTS.modus,
    verwandtschaft: isVerwandtschaft(params?.verwandtschaft)
      ? params.verwandtschaft
      : DEFAULTS.verwandtschaft,
    vermoegenswert: toNumber(params?.wert, DEFAULTS.vermoegenswert),
    nachlassverbindlichkeiten: toNumber(
      params?.verbindlichkeiten,
      DEFAULTS.nachlassverbindlichkeiten,
    ),
    bereitsGenutzterFreibetrag: toNumber(params?.genutzt, DEFAULTS.bereitsGenutzterFreibetrag),
  };
}

export default function ErbschaftsteuerTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const modus = search.get("modus");
      const verwandtschaft = search.get("verwandtschaft");
      return {
        modus: isModus(modus) ? modus : fallback.modus,
        verwandtschaft: isVerwandtschaft(verwandtschaft)
          ? verwandtschaft
          : fallback.verwandtschaft,
        vermoegenswert: toNumber(search.get("wert"), fallback.vermoegenswert),
        nachlassverbindlichkeiten: toNumber(
          search.get("verbindlichkeiten"),
          fallback.nachlassverbindlichkeiten,
        ),
        bereitsGenutzterFreibetrag: toNumber(
          search.get("genutzt"),
          fallback.bereitsGenutzterFreibetrag,
        ),
      };
    },
    serialize: (next) => ({
      modus: urlValue(next.modus, DEFAULTS.modus),
      verwandtschaft: urlValue(next.verwandtschaft, DEFAULTS.verwandtschaft),
      wert: urlValue(next.vermoegenswert, DEFAULTS.vermoegenswert),
      verbindlichkeiten: urlValue(
        next.nachlassverbindlichkeiten,
        DEFAULTS.nachlassverbindlichkeiten,
      ),
      genutzt: urlValue(next.bereitsGenutzterFreibetrag, DEFAULTS.bereitsGenutzterFreibetrag),
    }),
  });

  const result = useMemo(() => calculateErbschaftsteuer(state), [state]);
  const istErbschaft = state.modus === "erbschaft";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Art der Übertragung">
        <Field label="Art der Übertragung" htmlFor="es-modus">
          <SegmentedControl
            value={state.modus}
            options={MODUS_OPTIONS}
            onChange={(modus) => update({ modus })}
            ariaLabel="Erbschaft oder Schenkung"
          />
        </Field>
      </Card>

      <Card as="section" className="p-6" aria-label="Verwandtschaft und Wert">
        <CardTitle>Verwandtschaftsverhältnis &amp; Wert</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Verhältnis zur schenkenden / verstorbenen Person"
              htmlFor="es-verwandtschaft"
              hint={
                state.verwandtschaft === "elternGrosseltern"
                  ? "Bei Eltern und Großeltern hängt die Steuerklasse vom Anlass ab – siehe Hinweis unten."
                  : undefined
              }
            >
              <Select
                id="es-verwandtschaft"
                value={state.verwandtschaft}
                onChange={(event) =>
                  update({ verwandtschaft: event.target.value as Verwandtschaft })
                }
              >
                {VERWANDTSCHAFT_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {verwandtschaftLabels[value]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field
            label={istErbschaft ? "Wert des Nachlasses" : "Wert der Schenkung"}
            htmlFor="es-wert"
          >
            <UnitInput
              id="es-wert"
              unit="€"
              value={state.vermoegenswert}
              onChange={(vermoegenswert) => update({ vermoegenswert })}
            />
          </Field>

          {istErbschaft && (
            <Field
              label="Weitere Nachlassverbindlichkeiten"
              htmlFor="es-verbindlichkeiten"
              hint="Über die Erbfallkostenpauschale hinaus – z. B. offene Kredite."
            >
              <UnitInput
                id="es-verbindlichkeiten"
                unit="€"
                value={state.nachlassverbindlichkeiten}
                onChange={(nachlassverbindlichkeiten) =>
                  update({ nachlassverbindlichkeiten })
                }
              />
            </Field>
          )}

          <div className="sm:col-span-2">
            <Field
              label="Davon bereits in den letzten 10 Jahren geschenkt"
              htmlFor="es-genutzt"
              hint="An dieselbe Person – zehrt den Freibetrag entsprechend vor."
            >
              <UnitInput
                id="es-genutzt"
                unit="€"
                value={state.bereitsGenutzterFreibetrag}
                onChange={(bereitsGenutzterFreibetrag) =>
                  update({ bereitsGenutzterFreibetrag })
                }
              />
            </Field>
          </div>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Erbschaft- und Schenkungsteuer-Rechner"
            text={`${formatEuro(result.steuer)} ${istErbschaft ? "Erbschaftsteuer" : "Schenkungsteuer"}`}
          />
        }
      >
        <NumberDisplay
          value={result.steuer}
          format={formatEuro}
          caption={istErbschaft ? "Erbschaftsteuer" : "Schenkungsteuer"}
          announce={`${formatEuro(result.steuer)} ${istErbschaft ? "Erbschaftsteuer" : "Schenkungsteuer"}, bei ${formatEuro(result.steuerpflichtigerErwerb)} steuerpflichtigem Erwerb und ${result.steuersatz} Prozent Steuersatz.`}
          hint={
            result.steuer === 0 ? (
              <>
                Bleibt innerhalb des Freibetrags von{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.freibetragVerbleibend)}
                </strong>{" "}
                – keine Steuer fällig.
              </>
            ) : (
              <>
                Netto bleiben{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.nettoErwerb)}
                </strong>{" "}
                – bei {formatEuro(result.steuerpflichtigerErwerb)} steuerpflichtigem Erwerb
                zum Satz von {result.steuersatz} %.
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Steuerklasse"
          value={`Klasse ${["I", "II", "III"][result.steuerklasse - 1]}`}
          hint={`${formatEuro(result.freibetrag)} Freibetrag`}
        />
        <Stat
          label="Freibetrag verbleibend"
          value={formatEuro(result.freibetragVerbleibend)}
          hint={
            result.freibetragVerbleibend < result.freibetrag
              ? "nach früheren Schenkungen"
              : "voll verfügbar"
          }
        />
        <Stat
          label="Steuerpflichtiger Erwerb"
          value={formatEuro(result.steuerpflichtigerErwerb)}
          hint="nach Freibetrag, auf 100 € abgerundet"
        />
        <Stat
          label="Steuersatz"
          value={`${result.steuersatz} %`}
          hint={
            result.haerteausgleich > 0
              ? `${formatEuro(result.haerteausgleich)} Härteausgleich`
              : "auf den gesamten Erwerb"
          }
        />
      </dl>

      <section aria-labelledby="es-herleitung" className="surface-soft p-6">
        <h2
          id="es-herleitung"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Wie sich der steuerpflichtige Erwerb ergibt
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <Posten
            label={istErbschaft ? "Wert des Nachlasses" : "Wert der Schenkung"}
            value={state.vermoegenswert}
          />
          {istErbschaft && (
            <>
              <Posten
                label="Nachlassverbindlichkeiten"
                value={-state.nachlassverbindlichkeiten}
              />
              <Posten
                label="Erbfallkostenpauschale"
                value={-result.erbfallkostenpauschale}
              />
            </>
          )}
          <Posten label="Bereicherung" value={result.bereicherung} stark />
          <Posten label="Freibetrag verbleibend" value={-result.freibetragVerbleibend} />
          <Posten
            label="Steuerpflichtiger Erwerb"
            value={result.steuerpflichtigerErwerb}
            stark
          />
        </ul>
      </section>

      <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors duration-(--dur-fast) hover:bg-ink-soft">
          <span className="font-display text-lg font-semibold tracking-tight">
            Steuersatz je Wertstufe (Klasse {["I", "II", "III"][result.steuerklasse - 1]})
          </span>
          <ChevronDown
            className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full min-w-[24rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[13px] text-muted">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Steuerpflichtiger Erwerb bis
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Steuersatz
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {result.stufen.map((zeile) => (
                <tr
                  key={zeile.bis}
                  className={`border-b border-line/60 ${zeile.aktuell ? "bg-accent-soft" : ""}`}
                >
                  <td className="py-2 pr-4 text-left">
                    {Number.isFinite(zeile.bis)
                      ? formatEuro(zeile.bis)
                      : "darüber"}
                  </td>
                  <td className="py-2 text-right">{formatInteger(zeile.satz)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {result.warnings.length > 0 && (
        <section aria-labelledby="es-hinweise" className="surface-soft p-6">
          <h2
            id="es-hinweise"
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

      <AffiliateBlock slots={erbschaftsteuerAffiliate} result={result} />
    </div>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg font-semibold tracking-tight">{children}</h2>
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

/**
 * Eine Zeile der Herleitung – Label links, Betrag rechts in Mono.
 *
 * Die Null wird ausdrücklich normalisiert: Abzugsposten kommen hier negiert
 * an, und `-0` schreibt `Intl` als "-0,00 €".
 */
function Posten({
  label,
  value,
  stark = false,
}: {
  label: string;
  value: number;
  stark?: boolean;
}) {
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
