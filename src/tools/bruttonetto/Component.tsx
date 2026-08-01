"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card, CardTitle, Disclosure } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Select,
  Stepper,
  TextInput,
  Toggle,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import { isRegionCode, regions } from "@/tools/brueckentage/logic";
import type { ToolParams } from "@/tools/types";
import { bruttonettoAffiliate } from "./affiliate";
import {
  calculateBruttoNetto,
  defaultInput,
  type BruttoNettoInput,
  type Zeitraum,
} from "./logic";
import {
  STEUERDATEN_STAND,
  isSteuerklasse,
  kirchensteuersatz,
  steuerklassen,
  type Steuerklasse,
} from "./steuerdaten";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, BruttoNettoInput {}

const DEFAULTS: State = { ...defaultInput() };

const ZEITRAUM_OPTIONS = [
  { value: "monat", label: "pro Monat" },
  { value: "jahr", label: "pro Jahr" },
] as const satisfies readonly { value: Zeitraum; label: string }[];

const isZeitraum = (value: unknown): value is Zeitraum =>
  value === "monat" || value === "jahr";

/** Schalter kommen als 0/1 aus der URL und aus den Varianten-Params. */
function toBool(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "1" || value === 1 || value === "true";
}

function toSteuerklasse(value: unknown, fallback: Steuerklasse): Steuerklasse {
  const parsed = Number(value);
  return isSteuerklasse(parsed) ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  const land = params?.land;

  return {
    ...DEFAULTS,
    brutto: toNumber(params?.brutto, DEFAULTS.brutto),
    steuerklasse: toSteuerklasse(params?.klasse, DEFAULTS.steuerklasse),
    region: isRegionCode(land) ? land : DEFAULTS.region,
    kirchensteuerpflichtig: toBool(
      params?.kirche,
      DEFAULTS.kirchensteuerpflichtig,
    ),
    kinderZahl: toNumber(params?.kinder, DEFAULTS.kinderZahl),
    kinderfreibetraege: toNumber(
      params?.freibetraege,
      DEFAULTS.kinderfreibetraege,
    ),
    // Wer Kinder mitbringt, ist nicht kinderlos – sonst stünde der Zuschlag
    // zur Pflegeversicherung im Widerspruch zur Kinderzahl der Variante.
    kinderlos: toNumber(params?.kinder, 0) > 0 ? false : DEFAULTS.kinderlos,
  };
}

export default function BruttoNettoTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      // Werte mit Typwächter erst lesen, dann prüfen: über zwei getrennte
      // `search.get`-Aufrufe hinweg engt TypeScript den Typ nicht ein.
      const zeitraum = search.get("zeitraum");
      const land = search.get("land");

      return {
        ...fallback,
        brutto: toNumber(search.get("brutto"), fallback.brutto),
        zeitraum: isZeitraum(zeitraum) ? zeitraum : fallback.zeitraum,
        steuerklasse: toSteuerklasse(
          search.get("klasse"),
          fallback.steuerklasse,
        ),
        region: isRegionCode(land) ? land : fallback.region,
        kirchensteuerpflichtig: toBool(
          search.get("kirche"),
          fallback.kirchensteuerpflichtig,
        ),
        kinderfreibetraege: toNumber(
          search.get("freibetraege"),
          fallback.kinderfreibetraege,
        ),
        kinderZahl: toNumber(search.get("kinder"), fallback.kinderZahl),
        kinderlos: toBool(search.get("kinderlos"), fallback.kinderlos),
        gesetzlichVersichert: toBool(
          search.get("gkv"),
          fallback.gesetzlichVersichert,
        ),
        zusatzbeitragPercent: toNumber(
          search.get("zusatz"),
          fallback.zusatzbeitragPercent,
        ),
        privatBeitragMonat: toNumber(
          search.get("pkv"),
          fallback.privatBeitragMonat,
        ),
        rentenversicherungspflichtig: toBool(
          search.get("rv"),
          fallback.rentenversicherungspflichtig,
        ),
      };
    },
    // Nur Abweichungen vom Default landen in der URL – so bleibt der Link teilbar.
    serialize: (next) => ({
      brutto: urlValue(next.brutto, DEFAULTS.brutto),
      zeitraum: urlValue(next.zeitraum, DEFAULTS.zeitraum),
      klasse: urlValue(next.steuerklasse, DEFAULTS.steuerklasse),
      land: urlValue(next.region, DEFAULTS.region),
      kirche: bool(
        next.kirchensteuerpflichtig,
        DEFAULTS.kirchensteuerpflichtig,
      ),
      freibetraege: urlValue(
        next.kinderfreibetraege,
        DEFAULTS.kinderfreibetraege,
      ),
      kinder: urlValue(next.kinderZahl, DEFAULTS.kinderZahl),
      kinderlos: bool(next.kinderlos, DEFAULTS.kinderlos),
      gkv: bool(next.gesetzlichVersichert, DEFAULTS.gesetzlichVersichert),
      zusatz: urlValue(next.zusatzbeitragPercent, DEFAULTS.zusatzbeitragPercent),
      pkv: urlValue(next.privatBeitragMonat, DEFAULTS.privatBeitragMonat),
      rv: bool(
        next.rentenversicherungspflichtig,
        DEFAULTS.rentenversicherungspflichtig,
      ),
    }),
  });

  const result = useMemo(() => calculateBruttoNetto(state), [state]);

  const proMonat = state.zeitraum === "monat";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Gehalt">
        <CardTitle>Gehalt</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Bruttolohn" htmlFor="bn-brutto">
            <UnitInput
              id="bn-brutto"
              unit="€"
              value={state.brutto}
              onChange={(brutto) => update({ brutto })}
            />
          </Field>

          <Field label="Zeitraum" htmlFor="bn-zeitraum">
            <SegmentedControl
              value={state.zeitraum}
              options={ZEITRAUM_OPTIONS}
              onChange={(zeitraum) => update({ zeitraum })}
              ariaLabel="Zeitraum des Bruttolohns"
            />
          </Field>

          <Field
            label="Steuerklasse"
            htmlFor="bn-klasse"
            hint={steuerklassen[state.steuerklasse].hint}
          >
            <Select
              id="bn-klasse"
              value={state.steuerklasse}
              onChange={(event) => {
                const klasse = Number(event.target.value);
                if (isSteuerklasse(klasse)) update({ steuerklasse: klasse });
              }}
            >
              {Object.entries(steuerklassen).map(([key, def]) => (
                <option key={key} value={key}>
                  {def.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Bundesland"
            htmlFor="bn-land"
            hint={`Setzt den Kirchensteuersatz (${kirchensteuersatz(state.region)} %) und in Sachsen die Pflegeversicherung.`}
          >
            <Select
              id="bn-land"
              value={state.region}
              onChange={(event) => {
                const region = event.target.value;
                if (isRegionCode(region)) update({ region });
              }}
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Disclosure
        title="Kirche, Kinder und Versicherung"
        hint={`Die Angaben, die das Netto am stärksten verschieben. Rechengrößen: ${STEUERDATEN_STAND.slice(0, 4)}.`}
      >
        <div className="flex flex-col gap-5">
          <Toggle
            checked={state.kirchensteuerpflichtig}
            onChange={(kirchensteuerpflichtig) =>
              update({ kirchensteuerpflichtig })
            }
            label="Kirchensteuerpflichtig"
            hint={`${kirchensteuersatz(state.region)} Prozent der Lohnsteuer in diesem Bundesland.`}
          />

          <Toggle
            checked={state.kinderlos}
            onChange={(kinderlos) => update({ kinderlos })}
            label="Kinderlos, mindestens 23 Jahre alt"
            hint="Zuschlag von 0,6 Prozentpunkten zur Pflegeversicherung, allein vom Arbeitnehmer getragen."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Kinder unter 25"
              htmlFor="bn-kinder"
              hint="Ab dem zweiten Kind sinkt der Pflegebeitrag um je 0,25 Punkte."
            >
              <Stepper
                id="bn-kinder"
                value={state.kinderZahl}
                min={0}
                max={10}
                onChange={(kinderZahl) =>
                  update({
                    kinderZahl,
                    // Mit Kind gibt es keinen Kinderlosenzuschlag.
                    kinderlos: kinderZahl > 0 ? false : state.kinderlos,
                  })
                }
                ariaLabel="Zahl der Kinder unter 25"
              />
            </Field>

            <Field
              label="Kinderfreibeträge"
              htmlFor="bn-freibetraege"
              hint="Wirkt nur auf Soli und Kirchensteuer, nicht auf die Lohnsteuer."
            >
              <Stepper
                id="bn-freibetraege"
                value={state.kinderfreibetraege}
                min={0}
                max={10}
                step={0.5}
                onChange={(kinderfreibetraege) =>
                  update({ kinderfreibetraege })
                }
                ariaLabel="Zahl der Kinderfreibeträge"
              />
            </Field>
          </div>

          <Toggle
            checked={state.gesetzlichVersichert}
            onChange={(gesetzlichVersichert) => update({ gesetzlichVersichert })}
            label="Gesetzlich krankenversichert"
            hint="Ausschalten für die private Krankenversicherung."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {state.gesetzlichVersichert ? (
              <Field
                label="Zusatzbeitrag der Krankenkasse"
                htmlFor="bn-zusatz"
                hint="Steht auf der Gehaltsabrechnung. Durchschnitt 2026: 2,9 %."
              >
                <UnitInput
                  id="bn-zusatz"
                  unit="%"
                  value={state.zusatzbeitragPercent}
                  onChange={(zusatzbeitragPercent) =>
                    update({ zusatzbeitragPercent })
                  }
                />
              </Field>
            ) : (
              <Field
                label="Beitrag zur privaten Kranken- und Pflegeversicherung"
                htmlFor="bn-pkv"
                hint="Voller Monatsbeitrag. Der Arbeitgeber gibt die Hälfte dazu, gedeckelt auf den Höchstzuschuss."
              >
                <UnitInput
                  id="bn-pkv"
                  unit="€"
                  value={state.privatBeitragMonat}
                  onChange={(privatBeitragMonat) =>
                    update({ privatBeitragMonat })
                  }
                />
              </Field>
            )}

            <Toggle
              checked={state.rentenversicherungspflichtig}
              onChange={(rentenversicherungspflichtig) =>
                update({ rentenversicherungspflichtig })
              }
              label="Renten- und arbeitslosenversicherungspflichtig"
              hint="Der Normalfall. Ausschalten etwa für Beamte oder Versorgungswerke."
            />
          </div>
        </div>
      </Disclosure>

      <ResultPanel
        footer={
          <ShareBar
            title="Brutto-Netto-Rechner"
            text={`${formatEuro(result.nettoMonat)} netto aus ${formatEuro(result.bruttoMonat)} brutto im Monat`}
          />
        }
      >
        <NumberDisplay
          value={proMonat ? result.nettoMonat : result.nettoJahr}
          format={formatEuro}
          suffix={proMonat ? "pro Monat" : "pro Jahr"}
          caption="Netto"
          tone="positive"
          announce={`${formatEuro(result.nettoMonat)} netto pro Monat aus ${formatEuro(result.bruttoMonat)} brutto.`}
          hint={
            <>
              Von{" "}
              <strong className="font-semibold text-ink">
                {formatEuro(proMonat ? result.bruttoMonat : result.bruttoJahr)}
              </strong>{" "}
              brutto gehen{" "}
              <strong className="font-semibold text-ink">
                {formatDecimal(result.abgabenquoteProzent)} %
              </strong>{" "}
              an Steuern und Sozialabgaben ab.
            </>
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Steuern"
          value={formatEuro(result.steuernGesamtJahr / 12)}
          hint={`${formatDecimal(result.steuersatzDurchschnittProzent)} % vom Brutto`}
        />
        <Stat
          label="Sozialabgaben"
          value={formatEuro(result.sozialabgabenGesamtJahr / 12)}
          hint="Renten-, Arbeitslosen-, Kranken- und Pflegeversicherung"
        />
        <Stat
          label="Von 100 € mehr bleiben"
          value={formatEuro(result.netto100Euro)}
          hint={`${formatDecimal(result.grenzbelastungProzent)} % Grenzbelastung`}
        />
        <Stat
          label="Kosten für den Arbeitgeber"
          value={formatEuro(result.arbeitgeberkostenMonat)}
          hint="Brutto plus Arbeitgeberanteil"
        />
      </dl>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="bn-steuern" className="surface-soft p-6">
          <h2
            id="bn-steuern"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Steuern
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
            {result.steuern.map((posten) => (
              <AmountRow
                key={posten.label}
                label={posten.label}
                value={proMonat ? posten.monat : posten.jahr}
              />
            ))}
            <AmountRow
              label="Summe"
              value={
                proMonat
                  ? result.steuernGesamtJahr / 12
                  : result.steuernGesamtJahr
              }
              stark
            />
          </ul>
        </section>

        <section aria-labelledby="bn-sozial" className="surface-soft p-6">
          <h2
            id="bn-sozial"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Sozialabgaben
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
            {result.sozialabgaben.map((posten) => (
              <AmountRow
                key={posten.label}
                label={posten.label}
                value={proMonat ? posten.monat : posten.jahr}
              />
            ))}
            <AmountRow
              label="Summe"
              value={
                proMonat
                  ? result.sozialabgabenGesamtJahr / 12
                  : result.sozialabgabenGesamtJahr
              }
              stark
            />
          </ul>
        </section>
      </div>

      <section aria-labelledby="bn-weg" className="surface-soft p-6">
        <h2
          id="bn-weg"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Vom Brutto zum Netto
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <AmountRow
            label="Bruttolohn"
            value={proMonat ? result.bruttoMonat : result.bruttoJahr}
          />
          <AmountRow
            label="Sozialabgaben"
            value={
              -(proMonat
                ? result.sozialabgabenGesamtJahr / 12
                : result.sozialabgabenGesamtJahr)
            }
          />
          <AmountRow
            label="Steuern"
            value={
              -(proMonat
                ? result.steuernGesamtJahr / 12
                : result.steuernGesamtJahr)
            }
          />
          <AmountRow
            label="Netto"
            value={proMonat ? result.nettoMonat : result.nettoJahr}
            stark
          />
        </ul>
        <p className="mt-4 text-[13px] text-muted">
          Zu versteuerndes Einkommen im Jahr:{" "}
          {formatEuro(result.zuVersteuerndesEinkommen)}, davon abgezogene
          Vorsorgepauschale: {formatEuro(result.vorsorgepauschale)}.
        </p>
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="bn-hinweise" className="surface-soft p-6">
          <h2
            id="bn-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Wichtig zu wissen
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

      <AffiliateBlock slots={bruttonettoAffiliate} result={result} />
    </div>
  );
}

/** Schalter als 0/1, damit ein bewusstes Aus vom Default unterscheidbar bleibt. */
function bool(value: boolean, fallback: boolean): string {
  return value === fallback ? "" : value ? "1" : "0";
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
        className="pr-24 font-mono"
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

