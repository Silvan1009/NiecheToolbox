"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { WegStep } from "@/components/WegStep";
import { WegSteps, type WegStepDef } from "@/components/WegSteps";
import { Disclosure } from "@/components/ui/Card";
import {
  Field,
  Select,
  SegmentedControl,
  Stepper,
  Toggle,
  UnitInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { boolValue, toBool, toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import { useWegStepper } from "@/lib/useWegStepper";
import { isRegionCode, regions } from "@/lib/regionen";
import {
  isSteuerklasse,
  kirchensteuersatz,
  steuerklassen,
  type Steuerklasse,
} from "@/lib/steuerdaten";
import type { ToolParams } from "@/tools/types";
import { berechneAnteil } from "@/tools/prozentrechner/logic";
import {
  calculateBruttoNetto,
  defaultInput as bruttoNettoDefaults,
  type BruttoNettoInput,
  type Zeitraum,
} from "@/tools/bruttonetto/logic";
import {
  calculateSparplan,
  defaultInput as sparplanDefaults,
} from "@/tools/sparplan/logic";
import { SPARHORIZONT_JAHRE_STANDARD, bewerteGehalt } from "./urteil";

interface State extends Record<string, unknown>, BruttoNettoInput {
  erhoehungPercent: number;
  sparHorizontJahre: number;
}

const bnBasis = bruttoNettoDefaults();

const DEFAULTS: State = {
  ...bnBasis,
  erhoehungPercent: 5,
  sparHorizontJahre: SPARHORIZONT_JAHRE_STANDARD,
};

const ZEITRAUM_OPTIONS = [
  { value: "monat", label: "pro Monat" },
  { value: "jahr", label: "pro Jahr" },
] as const satisfies readonly { value: Zeitraum; label: string }[];

const isZeitraum = (value: unknown): value is Zeitraum =>
  value === "monat" || value === "jahr";

function toSteuerklasse(value: unknown, fallback: Steuerklasse): Steuerklasse {
  const parsed = Number(value);
  return isSteuerklasse(parsed) ? parsed : fallback;
}

const STEPS = [
  { step: 1, id: "gh-gehalt", label: "1 · Aktuelles Gehalt" },
  { step: 2, id: "gh-erhoehung", label: "2 · Die Erhöhung" },
  { step: 3, id: "gh-urteil", label: "3 · Urteil" },
] as const satisfies readonly WegStepDef[];

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    brutto: toNumber(params?.brutto, DEFAULTS.brutto),
    steuerklasse: toSteuerklasse(params?.klasse, DEFAULTS.steuerklasse),
    erhoehungPercent: toNumber(params?.erhoehung, DEFAULTS.erhoehungPercent),
  };
}

export default function GehaltWeg({
  params,
  sourceTools,
}: {
  params?: ToolParams;
  /**
   * „Im Detail weiterrechnen“, fertig gerendert vom Server (WegPageShell).
   * Als Knoten hereingereicht statt hier erzeugt: Die Liste braucht die
   * Tool-Registry, und die gehört nicht in ein Client-Modul.
   */
  sourceTools?: ReactNode;
}) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
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
        erhoehungPercent: toNumber(
          search.get("erhoehung"),
          fallback.erhoehungPercent,
        ),
        sparHorizontJahre: toNumber(
          search.get("jahre"),
          fallback.sparHorizontJahre,
        ),
      };
    },
    serialize: (next) => ({
      brutto: urlValue(next.brutto, DEFAULTS.brutto),
      zeitraum: urlValue(next.zeitraum, DEFAULTS.zeitraum),
      klasse: urlValue(next.steuerklasse, DEFAULTS.steuerklasse),
      land: urlValue(next.region, DEFAULTS.region),
      kirche: boolValue(
        next.kirchensteuerpflichtig,
        DEFAULTS.kirchensteuerpflichtig,
      ),
      freibetraege: urlValue(
        next.kinderfreibetraege,
        DEFAULTS.kinderfreibetraege,
      ),
      kinder: urlValue(next.kinderZahl, DEFAULTS.kinderZahl),
      kinderlos: boolValue(next.kinderlos, DEFAULTS.kinderlos),
      gkv: boolValue(next.gesetzlichVersichert, DEFAULTS.gesetzlichVersichert),
      zusatz: urlValue(
        next.zusatzbeitragPercent,
        DEFAULTS.zusatzbeitragPercent,
      ),
      pkv: urlValue(next.privatBeitragMonat, DEFAULTS.privatBeitragMonat),
      rv: boolValue(
        next.rentenversicherungspflichtig,
        DEFAULTS.rentenversicherungspflichtig,
      ),
      erhoehung: urlValue(next.erhoehungPercent, DEFAULTS.erhoehungPercent),
      jahre: urlValue(next.sparHorizontJahre, DEFAULTS.sparHorizontJahre),
    }),
  });

  const stepper = useWegStepper(STEPS.length);

  const bruttoNachher = useMemo(
    () =>
      berechneAnteil({ basis: state.brutto, prozent: state.erhoehungPercent })
        .nachZuschlag,
    [state.brutto, state.erhoehungPercent],
  );

  const nettoVorher = useMemo(() => calculateBruttoNetto(state), [state]);
  const nettoNachher = useMemo(
    () => calculateBruttoNetto({ ...state, brutto: bruttoNachher }),
    [state, bruttoNachher],
  );

  // Immer auf den Monat normiert – unabhängig davon, ob das Gehalt oben als
  // Monats- oder Jahreswert eingetragen ist. calculateBruttoNetto liefert
  // beide Formen, egal welchen Zeitraum die Eingabe wählt.
  const bruttoPlusMonat = nettoNachher.bruttoMonat - nettoVorher.bruttoMonat;
  const nettoPlusMonat = nettoNachher.nettoMonat - nettoVorher.nettoMonat;

  const urteil = useMemo(
    () => bewerteGehalt({ bruttoPlusMonat, nettoPlusMonat }),
    [bruttoPlusMonat, nettoPlusMonat],
  );

  const sparplan = useMemo(
    () =>
      calculateSparplan({
        ...sparplanDefaults(),
        startkapital: 0,
        sparrateMonat: Math.max(0, nettoPlusMonat),
        laufzeitJahre: state.sparHorizontJahre,
      }),
    [nettoPlusMonat, state.sparHorizontJahre],
  );

  return (
    <div className="flex flex-col gap-8">
      <WegSteps
        steps={STEPS}
        revealedUpTo={stepper.revealedUpTo}
        onSelect={stepper.goTo}
      />

      <WegStep
        step={1}
        id="gh-gehalt"
        ariaLabel="Aktuelles Gehalt"
        title="Was verdienst du aktuell?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zur Erhöhung"
        onContinue={() => stepper.goTo(2, "gh-erhoehung")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Bruttolohn" htmlFor="gh-brutto">
            <UnitInput
              id="gh-brutto"
              unit="€"
              value={state.brutto}
              onChange={(brutto) => update({ brutto })}
            />
          </Field>

          <Field label="Zeitraum" htmlFor="gh-zeitraum">
            <SegmentedControl
              value={state.zeitraum}
              options={ZEITRAUM_OPTIONS}
              onChange={(zeitraum) => update({ zeitraum })}
              ariaLabel="Zeitraum des Bruttolohns"
            />
          </Field>

          <Field
            label="Steuerklasse"
            htmlFor="gh-klasse"
            hint={steuerklassen[state.steuerklasse].hint}
          >
            <Select
              id="gh-klasse"
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
            htmlFor="gh-land"
            hint={`Setzt den Kirchensteuersatz (${kirchensteuersatz(state.region)} %).`}
          >
            <Select
              id="gh-land"
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

        <div className="mt-5">
          <Disclosure
            title="Kirche, Kinder und Versicherung"
            hint="Die Angaben, die das Netto am stärksten verschieben."
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
                hint="Zuschlag von 0,6 Prozentpunkten zur Pflegeversicherung."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Kinder unter 25" htmlFor="gh-kinder">
                  <Stepper
                    id="gh-kinder"
                    value={state.kinderZahl}
                    min={0}
                    max={10}
                    onChange={(kinderZahl) =>
                      update({
                        kinderZahl,
                        kinderlos: kinderZahl > 0 ? false : state.kinderlos,
                      })
                    }
                    ariaLabel="Zahl der Kinder unter 25"
                  />
                </Field>

                <Field label="Kinderfreibeträge" htmlFor="gh-freibetraege">
                  <Stepper
                    id="gh-freibetraege"
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
                onChange={(gesetzlichVersichert) =>
                  update({ gesetzlichVersichert })
                }
                label="Gesetzlich krankenversichert"
                hint="Ausschalten für die private Krankenversicherung."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                {state.gesetzlichVersichert ? (
                  <Field
                    label="Zusatzbeitrag der Krankenkasse"
                    htmlFor="gh-zusatz"
                  >
                    <UnitInput
                      id="gh-zusatz"
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
                    htmlFor="gh-pkv"
                    hint="Voller Monatsbeitrag."
                  >
                    <UnitInput
                      id="gh-pkv"
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
                  hint="Der Normalfall. Ausschalten etwa für Beamte."
                />
              </div>
            </div>
          </Disclosure>
        </div>
      </WegStep>

      <WegStep
        step={2}
        id="gh-erhoehung"
        ariaLabel="Die Erhöhung"
        title="Wie groß fällt die Erhöhung aus?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zum Urteil"
        onContinue={() => stepper.goTo(3, "gh-urteil")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Erhöhung" htmlFor="gh-erhoehung-percent">
            <UnitInput
              id="gh-erhoehung-percent"
              unit="%"
              value={state.erhoehungPercent}
              onChange={(erhoehungPercent) => update({ erhoehungPercent })}
            />
          </Field>

          <Field
            label="Anlagehorizont"
            htmlFor="gh-jahre"
            hint="Falls die Differenz angelegt statt ausgegeben wird."
          >
            <Stepper
              id="gh-jahre"
              value={state.sparHorizontJahre}
              min={1}
              max={40}
              onChange={(sparHorizontJahre) => update({ sparHorizontJahre })}
              suffix="Jahre"
              ariaLabel="Anlagehorizont in Jahren"
            />
          </Field>
        </div>
      </WegStep>

      {stepper.revealedUpTo >= 3 && (
        <div id="gh-urteil" className="scroll-mt-8 flex flex-col gap-8">
          <ResultPanel
            footer={
              <ShareBar
                title="Check: Gehaltserhöhung"
                text={`${formatEuro(nettoPlusMonat)} netto mehr im Monat`}
              />
            }
          >
            <NumberDisplay
              value={nettoPlusMonat}
              format={formatEuro}
              suffix="€ mehr netto pro Monat"
              caption="Netto-Plus"
              tone="positive"
              announce={`${formatEuro(nettoPlusMonat)} mehr netto pro Monat.`}
              hint={
                <>
                  Von{" "}
                  <strong className="font-semibold text-ink">
                    {formatEuro(bruttoPlusMonat)}
                  </strong>{" "}
                  brutto mehr bleiben{" "}
                  <strong className="font-semibold text-ink">
                    {formatEuro(nettoPlusMonat)}
                  </strong>{" "}
                  netto –{" "}
                  {urteil.grenzbelastungProzent === null
                    ? "keine Erhöhung eingetragen"
                    : `${formatDecimal(urteil.grenzbelastungProzent)} % gehen an Steuer und Sozialabgaben`}
                  .
                </>
              }
            />
          </ResultPanel>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Brutto-Plus"
              value={formatEuro(bruttoPlusMonat)}
              hint="pro Monat"
            />
            <Stat
              label="Netto-Plus"
              value={formatEuro(nettoPlusMonat)}
              hint="pro Monat"
            />
            <Stat
              label="Grenzbelastung"
              value={
                urteil.grenzbelastungProzent === null
                  ? "–"
                  : `${formatDecimal(urteil.grenzbelastungProzent)} %`
              }
              hint="Anteil, der abgeht"
            />
            <Stat
              label={`Angelegt nach ${state.sparHorizontJahre} Jahren`}
              value={formatEuro(sparplan.endkapitalNachSteuer)}
              hint={`eingezahlt ${formatEuro(sparplan.eingezahlt)}`}
            />
          </dl>

          <section
            aria-labelledby="gh-aufstellung"
            className="surface-soft p-6"
          >
            <h2
              id="gh-aufstellung"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Von Brutto-Plus zu Netto-Plus
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              <AmountRow label="Brutto-Plus" value={bruttoPlusMonat} />
              <AmountRow
                label="Steuer und Sozialabgaben"
                value={-(bruttoPlusMonat - nettoPlusMonat)}
              />
              <AmountRow label="Netto-Plus" value={nettoPlusMonat} stark />
            </ul>
          </section>

          {sourceTools}
        </div>
      )}
    </div>
  );
}
