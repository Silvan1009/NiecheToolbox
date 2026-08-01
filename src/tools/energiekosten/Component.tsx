"use client";

import { Fragment, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card, Disclosure } from "@/components/ui/Card";
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
import { formatAmount, formatEuro, formatInteger } from "@/lib/format";
import { toEuro } from "@/lib/finanzmath";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { energiekostenAffiliate } from "./affiliate";
import {
  calculateEnergie,
  defaultInput,
  energieartLabels,
  gebaeudestandardLabels,
  type Energieart,
  type EnergieInput,
  type Gebaeudestandard,
  type Modus,
  type TarifInput,
} from "./logic";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, EnergieInput {}

const DEFAULTS: State = { ...defaultInput() };

const MODUS_OPTIONS = [
  { value: "strom", label: "Nur Strom" },
  { value: "gas", label: "Nur Gas" },
  { value: "beide", label: "Strom & Gas" },
] as const satisfies readonly { value: Modus; label: string }[];

const isModus = (value: unknown): value is Modus =>
  value === "strom" || value === "gas" || value === "beide";

const isStandard = (value: unknown): value is Gebaeudestandard =>
  value === "unsaniert" ||
  value === "teilsaniert" ||
  value === "saniert" ||
  value === "neubau";

function toBool(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "1" || value === 1 || value === "true";
}

/** URL-Schlüssel je Sparte – Präfix "s" für Strom, "g" für Gas. */
const KEYS: Record<Energieart, Record<keyof TarifInput, string>> = {
  strom: {
    verbrauchKwh: "skwh",
    arbeitspreisCt: "sct",
    grundpreisMonat: "sgrund",
    abschlagMonat: "sab",
    neuArbeitspreisCt: "snct",
    neuGrundpreisMonat: "sngrund",
  },
  gas: {
    verbrauchKwh: "gkwh",
    arbeitspreisCt: "gct",
    grundpreisMonat: "ggrund",
    abschlagMonat: "gab",
    neuArbeitspreisCt: "gnct",
    neuGrundpreisMonat: "gngrund",
  },
};

function tarifAus(
  art: Energieart,
  lies: (key: string) => unknown,
  fallback: TarifInput,
): TarifInput {
  const keys = KEYS[art];
  return {
    verbrauchKwh: toNumber(lies(keys.verbrauchKwh), fallback.verbrauchKwh),
    arbeitspreisCt: toNumber(lies(keys.arbeitspreisCt), fallback.arbeitspreisCt),
    grundpreisMonat: toNumber(
      lies(keys.grundpreisMonat),
      fallback.grundpreisMonat,
    ),
    abschlagMonat: toNumber(lies(keys.abschlagMonat), fallback.abschlagMonat),
    neuArbeitspreisCt: toNumber(
      lies(keys.neuArbeitspreisCt),
      fallback.neuArbeitspreisCt,
    ),
    neuGrundpreisMonat: toNumber(
      lies(keys.neuGrundpreisMonat),
      fallback.neuGrundpreisMonat,
    ),
  };
}

function serialisiereTarif(
  art: Energieart,
  tarif: TarifInput,
): Record<string, string> {
  const keys = KEYS[art];
  const fallback = DEFAULTS[art];
  const out: Record<string, string> = {};
  for (const feld of Object.keys(keys) as (keyof TarifInput)[]) {
    out[keys[feld]] = urlValue(tarif[feld], fallback[feld]);
  }
  return out;
}

function initialState(params: ToolParams | undefined): State {
  const lies = (key: string) => params?.[key];
  return {
    ...DEFAULTS,
    modus: isModus(params?.modus) ? params.modus : DEFAULTS.modus,
    personen: toNumber(params?.personen, DEFAULTS.personen),
    wohnflaecheM2: toNumber(params?.qm, DEFAULTS.wohnflaecheM2),
    standard: isStandard(params?.standard) ? params.standard : DEFAULTS.standard,
    warmwasserElektrisch: toBool(params?.eww, DEFAULTS.warmwasserElektrisch),
    strom: tarifAus("strom", lies, DEFAULTS.strom),
    gas: tarifAus("gas", lies, DEFAULTS.gas),
  };
}

export default function EnergiekostenTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const lies = (key: string) => search.get(key);
      const modus = search.get("modus");
      const standard = search.get("standard");

      return {
        ...fallback,
        modus: isModus(modus) ? modus : fallback.modus,
        personen: toNumber(search.get("personen"), fallback.personen),
        wohnflaecheM2: toNumber(search.get("qm"), fallback.wohnflaecheM2),
        standard: isStandard(standard) ? standard : fallback.standard,
        warmwasserElektrisch: toBool(
          search.get("eww"),
          fallback.warmwasserElektrisch,
        ),
        strom: tarifAus("strom", lies, fallback.strom),
        gas: tarifAus("gas", lies, fallback.gas),
      };
    },
    // Nur Abweichungen vom Default landen in der URL – bei achtzehn Feldern
    // wäre der Link sonst nicht mehr teilbar.
    serialize: (next) => ({
      modus: urlValue(next.modus, DEFAULTS.modus),
      personen: urlValue(next.personen, DEFAULTS.personen),
      qm: urlValue(next.wohnflaecheM2, DEFAULTS.wohnflaecheM2),
      standard: urlValue(next.standard, DEFAULTS.standard),
      eww:
        next.warmwasserElektrisch === DEFAULTS.warmwasserElektrisch
          ? ""
          : next.warmwasserElektrisch
            ? "1"
            : "0",
      ...serialisiereTarif("strom", next.strom),
      ...serialisiereTarif("gas", next.gas),
    }),
  });

  const result = useMemo(() => calculateEnergie(state), [state]);

  /** Eine Sparte anfassen, ohne die andere zu verlieren. */
  const updateTarif = (art: Energieart, patch: Partial<TarifInput>) =>
    update({ [art]: { ...state[art], ...patch } } as Partial<State>);

  const zeigtStrom = state.modus !== "gas";
  const zeigtGas = state.modus !== "strom";
  const nachzahlung = result.differenzC > 0;

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Welche Sparten?">
        <Field
          label="Was willst du rechnen?"
          htmlFor="ek-modus"
          hint="Strom und Gas sind getrennte Verträge mit getrennten Abschlägen – deshalb auch hier getrennte Felder."
        >
          <SegmentedControl
            value={state.modus}
            options={MODUS_OPTIONS}
            onChange={(modus) => update({ modus })}
            ariaLabel="Energiearten"
          />
        </Field>
      </Card>

      {zeigtStrom && (
        <SparteCard
          art="strom"
          tarif={state.strom}
          vergleichKwh={
            result.sparten.find((s) => s.art === "strom")?.vergleichKwh ?? 0
          }
          onChange={(patch) => updateTarif("strom", patch)}
        />
      )}

      {zeigtGas && (
        <SparteCard
          art="gas"
          tarif={state.gas}
          vergleichKwh={
            result.sparten.find((s) => s.art === "gas")?.vergleichKwh ?? 0
          }
          onChange={(patch) => updateTarif("gas", patch)}
        />
      )}

      <Disclosure
        title="Mein Haushalt"
        hint="Bestimmt den Vergleichswert, an dem du siehst, ob dein Verbrauch normal ist."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Personen im Haushalt"
            htmlFor="ek-personen"
            hint="Der erste Kopf verbraucht am meisten – Kühlschrank und Router laufen ohnehin."
          >
            <Stepper
              id="ek-personen"
              value={state.personen}
              min={1}
              max={12}
              onChange={(personen) => update({ personen })}
              suffix={state.personen === 1 ? "Person" : "Personen"}
              ariaLabel="Personen im Haushalt"
            />
          </Field>

          <Field
            label="Wohnfläche"
            htmlFor="ek-qm"
            hint="Grundlage für den erwarteten Heizbedarf."
          >
            <UnitInput
              id="ek-qm"
              unit="m²"
              value={state.wohnflaecheM2}
              onChange={(wohnflaecheM2) => update({ wohnflaecheM2 })}
            />
          </Field>

          <Field label="Zustand des Gebäudes" htmlFor="ek-standard">
            <Select
              id="ek-standard"
              value={state.standard}
              onChange={(event) => {
                const naechster = event.target.value;
                if (isStandard(naechster)) update({ standard: naechster });
              }}
            >
              {(
                Object.keys(gebaeudestandardLabels) as Gebaeudestandard[]
              ).map((key) => (
                <option key={key} value={key}>
                  {gebaeudestandardLabels[key]}
                </option>
              ))}
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Toggle
              checked={state.warmwasserElektrisch}
              onChange={(warmwasserElektrisch) =>
                update({ warmwasserElektrisch })
              }
              label="Warmwasser über Strom"
              hint="Durchlauferhitzer oder Boiler statt Heizung. Hebt den Stromverbrauch deutlich."
            />
          </div>
        </div>
      </Disclosure>

      <ResultPanel
        footer={
          <ShareBar
            title="Energiekosten-Rechner"
            text={`${formatEuro(toEuro(result.jahreskostenC))} im Jahr für ${result.sparten.map((s) => energieartLabels[s.art]).join(" und ")}`}
          />
        }
      >
        <NumberDisplay
          value={toEuro(result.jahreskostenC)}
          format={formatEuro}
          suffix="im Jahr"
          caption="Energiekosten"
          announce={`${formatEuro(toEuro(result.jahreskostenC))} im Jahr, ${formatEuro(toEuro(result.monatskostenC))} im Monat.`}
          hint={
            result.abschlagJahrC === 0 ? (
              <>
                Das sind{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(toEuro(result.monatskostenC))}
                </strong>{" "}
                im Monat. Trag deinen Abschlag ein, dann siehst du auch die
                Nachzahlung.
              </>
            ) : (
              <>
                Dein Abschlag deckt davon{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(toEuro(result.abschlagJahrC))}
                </strong>{" "}
                ab – {nachzahlung ? "es fehlen " : "du bekommst "}
                <strong className="font-semibold text-ink">
                  {formatEuro(Math.abs(toEuro(result.differenzC)))}
                </strong>
                {nachzahlung ? "." : " zurück."}
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Pro Monat"
          value={formatEuro(toEuro(result.monatskostenC))}
          hint="rechnerisch, nicht der Abschlag"
        />
        <Stat
          label={nachzahlung ? "Nachzahlung" : "Guthaben"}
          value={
            result.abschlagJahrC === 0
              ? "–"
              : formatEuro(Math.abs(toEuro(result.differenzC)))
          }
          hint={
            result.abschlagJahrC === 0
              ? "kein Abschlag eingetragen"
              : nachzahlung
                ? "fehlt bis zur Jahresrechnung"
                : "kommt zurück"
          }
        />
        <Stat
          label="Ersparnis bei Wechsel"
          value={
            result.ersparnisJahrC === null
              ? "–"
              : formatEuro(toEuro(result.ersparnisJahrC))
          }
          hint={
            result.ersparnisJahrC === null
              ? "kein Vergleichstarif"
              : "pro Jahr gegenüber jetzt"
          }
        />
        <Stat
          label="CO₂"
          value={`${formatInteger(result.co2KgPerYear)} kg`}
          hint="Näherung, pro Jahr"
        />
      </dl>

      <section aria-labelledby="ek-aufstellung" className="surface-soft p-6">
        <h2
          id="ek-aufstellung"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Woraus sich die Rechnung zusammensetzt
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
          {result.sparten.map((sparte) => (
            <Fragment key={sparte.art}>
              <AmountRow
                label={`${energieartLabels[sparte.art]}: Arbeitspreis (${formatInteger(sparte.verbrauchKwh)} kWh)`}
                value={toEuro(sparte.arbeitskostenC)}
              />
              <AmountRow
                label={`${energieartLabels[sparte.art]}: Grundpreis`}
                value={toEuro(sparte.grundkostenC)}
              />
              <AmountRow
                label={`${energieartLabels[sparte.art]} zusammen`}
                value={toEuro(sparte.jahreskostenC)}
                stark
              />
            </Fragment>
          ))}
          {result.sparten.length > 1 && (
            <AmountRow
              label="Energiekosten im Jahr"
              value={toEuro(result.jahreskostenC)}
              stark
            />
          )}
        </ul>
      </section>

      <section aria-labelledby="ek-vergleich" className="surface-soft p-6">
        <h2
          id="ek-vergleich"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Preis je Kilowattstunde und Vergleichsverbrauch
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          Der Effektivpreis rechnet den Grundpreis mit ein. Er ist die Zahl, mit
          der sich Tarife wirklich vergleichen lassen – nicht der Arbeitspreis
          allein.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[13px] text-muted">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Sparte
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Arbeitspreis
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Effektivpreis
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Dein Verbrauch
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Erwartet
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {result.sparten.map((sparte) => (
                <tr key={sparte.art} className="border-b border-line/60">
                  <th scope="row" className="py-2 pr-4 text-left font-sans">
                    {energieartLabels[sparte.art]}
                  </th>
                  <td className="py-2 pr-4 text-right">
                    {formatAmount(state[sparte.art].arbeitspreisCt)} ct
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {sparte.effektivpreisCt === null
                      ? "–"
                      : `${formatAmount(sparte.effektivpreisCt)} ct`}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {formatInteger(sparte.verbrauchKwh)} kWh
                  </td>
                  <td className="py-2 text-right">
                    {formatInteger(sparte.vergleichKwh)} kWh
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="ek-hinweise" className="surface-soft p-6">
          <h2
            id="ek-hinweise"
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

      <AffiliateBlock slots={energiekostenAffiliate} result={result} />
    </div>
  );
}

/** Ein Vertrag: Verbrauch, Preise, Abschlag – und optional ein Vergleichstarif. */
function SparteCard({
  art,
  tarif,
  vergleichKwh,
  onChange,
}: {
  art: Energieart;
  tarif: TarifInput;
  vergleichKwh: number;
  onChange: (patch: Partial<TarifInput>) => void;
}) {
  const name = energieartLabels[art];
  const id = art === "strom" ? "s" : "g";
  const kenntVerbrauch = tarif.verbrauchKwh > 0;

  return (
    <Card as="section" className="p-6" aria-label={name}>
      <h2 className="font-display text-lg font-semibold tracking-tight">
        {name}
      </h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <Field
          label="Jahresverbrauch"
          htmlFor={`ek-${id}-kwh`}
          hint={
            kenntVerbrauch ? (
              `Erwartet für deinen Haushalt: ${formatInteger(vergleichKwh)} kWh.`
            ) : (
              <>
                Steht auf der Jahresabrechnung.{" "}
                <button
                  type="button"
                  onClick={() => onChange({ verbrauchKwh: vergleichKwh })}
                  className="underline decoration-line underline-offset-2 hover:text-ink"
                >
                  Schätzwert {formatInteger(vergleichKwh)} kWh übernehmen
                </button>
              </>
            )
          }
        >
          <UnitInput
            id={`ek-${id}-kwh`}
            unit="kWh"
            value={tarif.verbrauchKwh}
            onChange={(verbrauchKwh) => onChange({ verbrauchKwh })}
          />
        </Field>

        <Field
          label="Arbeitspreis"
          htmlFor={`ek-${id}-ct`}
          hint="Der Preis je Kilowattstunde, ohne Grundpreis."
        >
          <UnitInput
            id={`ek-${id}-ct`}
            unit="ct/kWh"
            value={tarif.arbeitspreisCt}
            onChange={(arbeitspreisCt) => onChange({ arbeitspreisCt })}
          />
        </Field>

        <Field
          label="Grundpreis"
          htmlFor={`ek-${id}-grund`}
          hint="Fällt unabhängig vom Verbrauch an."
        >
          <UnitInput
            id={`ek-${id}-grund`}
            unit="€/Monat"
            value={tarif.grundpreisMonat}
            onChange={(grundpreisMonat) => onChange({ grundpreisMonat })}
          />
        </Field>

        <Field
          label="Monatlicher Abschlag"
          htmlFor={`ek-${id}-ab`}
          hint="Was du gerade zahlst. Ohne Angabe: 0."
        >
          <UnitInput
            id={`ek-${id}-ab`}
            unit="€/Monat"
            value={tarif.abschlagMonat}
            onChange={(abschlagMonat) => onChange({ abschlagMonat })}
          />
        </Field>
      </div>

      <details className="group mt-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent">
          Anderen {name}-Tarif vergleichen
          <ChevronDown
            className="size-4 transition-transform duration-(--dur-base) group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Arbeitspreis neu"
            htmlFor={`ek-${id}-nct`}
            hint="0 lässt den Vergleich weg."
          >
            <UnitInput
              id={`ek-${id}-nct`}
              unit="ct/kWh"
              value={tarif.neuArbeitspreisCt}
              onChange={(neuArbeitspreisCt) => onChange({ neuArbeitspreisCt })}
            />
          </Field>
          <Field label="Grundpreis neu" htmlFor={`ek-${id}-ngrund`}>
            <UnitInput
              id={`ek-${id}-ngrund`}
              unit="€/Monat"
              value={tarif.neuGrundpreisMonat}
              onChange={(neuGrundpreisMonat) => onChange({ neuGrundpreisMonat })}
            />
          </Field>
        </div>
      </details>
    </Card>
  );
}

