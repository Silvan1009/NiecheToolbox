"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { WegCallout } from "@/components/WegCallout";
import { Card, CardTitle, Disclosure } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Field,
  Select,
  SegmentedControl,
  Stepper,
  Toggle,
  UnitInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import type { PayoffTone } from "@/components/ui/PayoffDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { toBool, toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import { getRegion, isRegionCode, regions, type RegionCode } from "@/lib/regionen";
import {
  isSteuerklasse,
  kirchensteuersatz,
  steuerklassen,
  type Steuerklasse,
} from "@/lib/steuerdaten";
import { getTool } from "@/tools/registry";
import type { ToolParams } from "@/tools/types";
import {
  calculateBruttoNetto,
  defaultInput as bruttoNettoDefaults,
  type BruttoNettoInput,
  type Zeitraum,
} from "@/tools/bruttonetto/logic";
import {
  calculateImmobilie,
  defaultInput as immobilienDefaults,
  type ImmobilienInput,
} from "@/tools/immobilienrechner/logic";
import { hauskaufAffiliate } from "./affiliate";
import {
  bewerteHauskauf,
  einstufungLabel,
  type HauskaufEinstufung,
} from "./urteil";

/**
 * Der Zustand ist ein einziges flaches Objekt – Vereinigungsmenge der Felder,
 * die für dieses Urteil wirklich zählen, nicht die vollen 26 bzw. 12 Felder
 * der beiden Quell-Tools. Alles, was hier nicht steht, kommt aus deren
 * defaultInput() und bleibt unangetastet – siehe die Verdrahtung unten.
 */
interface State extends Record<string, unknown> {
  // Immobilie
  kaufpreis: number;
  wohnflaeche: number;
  region: RegionCode;
  eigenkapital: number;
  sollzinsPercent: number;
  tilgungPercent: number;
  zinsbindungJahre: number;
  modernisierung: number;
  notarPercent: number;
  maklerPercent: number;
  hausgeldMonat: number;
  instandhaltungProQmJahr: number;
  verwaltungMonat: number;

  // Einkommen
  brutto: number;
  zeitraum: Zeitraum;
  steuerklasse: Steuerklasse;
  kirchensteuerpflichtig: boolean;
  kinderZahl: number;
  kinderfreibetraege: number;
  kinderlos: boolean;
  gesetzlichVersichert: boolean;
  zusatzbeitragPercent: number;
  privatBeitragMonat: number;
  rentenversicherungspflichtig: boolean;
}

const immoBasis = immobilienDefaults();
const bnBasis = bruttoNettoDefaults();

/** Kanonischer Default für das geteilte Feld `region` ist der der Immobilie – der Weg dreht sich um den Kauf. */
const DEFAULTS: State = {
  kaufpreis: immoBasis.kaufpreis,
  wohnflaeche: immoBasis.wohnflaeche,
  region: immoBasis.region,
  eigenkapital: immoBasis.eigenkapital,
  sollzinsPercent: immoBasis.sollzinsPercent,
  tilgungPercent: immoBasis.tilgungPercent,
  zinsbindungJahre: immoBasis.zinsbindungJahre,
  modernisierung: immoBasis.modernisierung,
  notarPercent: immoBasis.notarPercent,
  maklerPercent: immoBasis.maklerPercent,
  hausgeldMonat: immoBasis.hausgeldMonat,
  instandhaltungProQmJahr: immoBasis.instandhaltungProQmJahr,
  verwaltungMonat: immoBasis.verwaltungMonat,

  brutto: bnBasis.brutto,
  zeitraum: bnBasis.zeitraum,
  steuerklasse: bnBasis.steuerklasse,
  kirchensteuerpflichtig: bnBasis.kirchensteuerpflichtig,
  kinderZahl: bnBasis.kinderZahl,
  kinderfreibetraege: bnBasis.kinderfreibetraege,
  kinderlos: bnBasis.kinderlos,
  gesetzlichVersichert: bnBasis.gesetzlichVersichert,
  zusatzbeitragPercent: bnBasis.zusatzbeitragPercent,
  privatBeitragMonat: bnBasis.privatBeitragMonat,
  rentenversicherungspflichtig: bnBasis.rentenversicherungspflichtig,
};

const ZEITRAUM_OPTIONS = [
  { value: "monat", label: "pro Monat" },
  { value: "jahr", label: "pro Jahr" },
] as const satisfies readonly { value: Zeitraum; label: string }[];

const isZeitraum = (value: unknown): value is Zeitraum =>
  value === "monat" || value === "jahr";

/** Schalter kommen als 0/1 aus der URL und aus künftigen Varianten-Params. */
/** Schalter als 0/1, damit ein bewusstes Aus vom Default unterscheidbar bleibt. */
function bool(value: boolean, fallback: boolean): string {
  return value === fallback ? "" : value ? "1" : "0";
}

function toSteuerklasse(value: unknown, fallback: Steuerklasse): Steuerklasse {
  const parsed = Number(value);
  return isSteuerklasse(parsed) ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  const region = isRegionCode(params?.land) ? params.land : DEFAULTS.region;
  return {
    ...DEFAULTS,
    region,
    kaufpreis: toNumber(params?.preis, DEFAULTS.kaufpreis),
    brutto: toNumber(params?.brutto, DEFAULTS.brutto),
  };
}

const einstufungTon: Record<HauskaufEinstufung, PayoffTone> = {
  komfortabel: "positive",
  tragbar: "ink",
  // Kein eigener "danger"-Ton im Design-System – "accent" ist die Aufmerksamkeitsfarbe.
  eng: "accent",
};

const einstufungHint: Record<HauskaufEinstufung, string> = {
  komfortabel:
    "Rate und Nebenkosten lassen deutlich Luft für Rücklagen und Unvorhergesehenes.",
  tragbar:
    "Die Rechnung geht auf, aber mit wenig Spielraum für mehrere größere Ausgaben im selben Jahr.",
  eng: "Rate und Nebenkosten beanspruchen einen großen Teil des Nettos – oder es fehlt ein Nettoeinkommen.",
};

/** Wie ShareBars hasShareApi(): Query-String lesen, ohne Hydrate-Konflikt und ohne Effekt. */
const noopSubscribe = () => () => {};
const hasSearchParams = () => window.location.search.length > 0;
const noSearchParamsOnServer = () => false;

export default function HauskaufWeg({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const land = search.get("land");
      const zeitraum = search.get("zeitraum");

      return {
        ...fallback,
        kaufpreis: toNumber(search.get("preis"), fallback.kaufpreis),
        wohnflaeche: toNumber(search.get("qm"), fallback.wohnflaeche),
        region: isRegionCode(land) ? land : fallback.region,
        eigenkapital: toNumber(search.get("ek"), fallback.eigenkapital),
        sollzinsPercent: toNumber(search.get("zins"), fallback.sollzinsPercent),
        tilgungPercent: toNumber(search.get("tilg"), fallback.tilgungPercent),
        zinsbindungJahre: toNumber(
          search.get("bindung"),
          fallback.zinsbindungJahre,
        ),
        modernisierung: toNumber(search.get("modern"), fallback.modernisierung),
        notarPercent: toNumber(search.get("notar"), fallback.notarPercent),
        maklerPercent: toNumber(search.get("makler"), fallback.maklerPercent),
        hausgeldMonat: toNumber(search.get("hausgeld"), fallback.hausgeldMonat),
        instandhaltungProQmJahr: toNumber(
          search.get("instand"),
          fallback.instandhaltungProQmJahr,
        ),
        verwaltungMonat: toNumber(
          search.get("verwaltung"),
          fallback.verwaltungMonat,
        ),

        brutto: toNumber(search.get("brutto"), fallback.brutto),
        zeitraum: isZeitraum(zeitraum) ? zeitraum : fallback.zeitraum,
        steuerklasse: toSteuerklasse(
          search.get("klasse"),
          fallback.steuerklasse,
        ),
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
    serialize: (next) => ({
      preis: urlValue(next.kaufpreis, DEFAULTS.kaufpreis),
      qm: urlValue(next.wohnflaeche, DEFAULTS.wohnflaeche),
      land: urlValue(next.region, DEFAULTS.region),
      ek: urlValue(next.eigenkapital, DEFAULTS.eigenkapital),
      zins: urlValue(next.sollzinsPercent, DEFAULTS.sollzinsPercent),
      tilg: urlValue(next.tilgungPercent, DEFAULTS.tilgungPercent),
      bindung: urlValue(next.zinsbindungJahre, DEFAULTS.zinsbindungJahre),
      modern: urlValue(next.modernisierung, DEFAULTS.modernisierung),
      notar: urlValue(next.notarPercent, DEFAULTS.notarPercent),
      makler: urlValue(next.maklerPercent, DEFAULTS.maklerPercent),
      hausgeld: urlValue(next.hausgeldMonat, DEFAULTS.hausgeldMonat),
      instand: urlValue(
        next.instandhaltungProQmJahr,
        DEFAULTS.instandhaltungProQmJahr,
      ),
      verwaltung: urlValue(next.verwaltungMonat, DEFAULTS.verwaltungMonat),

      brutto: urlValue(next.brutto, DEFAULTS.brutto),
      zeitraum: urlValue(next.zeitraum, DEFAULTS.zeitraum),
      klasse: urlValue(next.steuerklasse, DEFAULTS.steuerklasse),
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
      zusatz: urlValue(
        next.zusatzbeitragPercent,
        DEFAULTS.zusatzbeitragPercent,
      ),
      pkv: urlValue(next.privatBeitragMonat, DEFAULTS.privatBeitragMonat),
      rv: bool(
        next.rentenversicherungspflichtig,
        DEFAULTS.rentenversicherungspflichtig,
      ),
    }),
  });

  // Ankunft über einen geteilten Link: sofort alles zeigen statt von vorn
  // beginnen zu lassen. useSyncExternalStore statt Effekt+setState – wie
  // ShareBars hasShareApi() liest das einen Browser-Wert, ohne SSR-HTML und
  // ersten Client-Render auseinanderlaufen zu lassen (kein Hydrate-Konflikt).
  const arrivedViaLink = useSyncExternalStore(
    noopSubscribe,
    hasSearchParams,
    noSearchParamsOnServer,
  );

  // Fortschritt ist kein Wert, der das Ergebnis bestimmt – bleibt lokaler
  // State statt in der URL (README-Regel für useUrlState).
  const [manualStep, setManualStep] = useState<1 | 2 | 3>(1);
  const revealedUpTo = arrivedViaLink ? 3 : manualStep;

  // Ziel eines Klicks auf Pill/Button: ein Ref statt State, damit der
  // Scroll-Effekt unten keinen eigenen setState-Aufruf braucht (nur lesen +
  // scrollIntoView). scrollPulse ist der einzige Auslöser des Effekts – auch
  // wenn manualStep sich nicht ändert (z. B. Klick auf die bereits aktive
  // Pille), muss trotzdem gescrollt werden.
  const pendingScrollRef = useRef<string | null>(null);
  const [scrollPulse, setScrollPulse] = useState(0);

  useEffect(() => {
    const target = pendingScrollRef.current;
    if (!target) return;
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollPulse]);

  function goTo(step: 1 | 2 | 3, id: string) {
    pendingScrollRef.current = id;
    setManualStep((current) => (step > current ? step : current));
    setScrollPulse((pulse) => pulse + 1);
  }

  const immobilienInput: ImmobilienInput = useMemo(
    () => ({
      ...immobilienDefaults(state.region),
      modus: "eigennutzung",
      kaufpreis: state.kaufpreis,
      wohnflaeche: state.wohnflaeche,
      modernisierung: state.modernisierung,
      eigenkapital: state.eigenkapital,
      sollzinsPercent: state.sollzinsPercent,
      tilgungPercent: state.tilgungPercent,
      zinsbindungJahre: state.zinsbindungJahre,
      hausgeldMonat: state.hausgeldMonat,
      instandhaltungProQmJahr: state.instandhaltungProQmJahr,
      verwaltungMonat: state.verwaltungMonat,
      notarPercent: state.notarPercent,
      maklerPercent: state.maklerPercent,
    }),
    [state],
  );
  const immobilie = useMemo(
    () => calculateImmobilie(immobilienInput),
    [immobilienInput],
  );

  const einkommenInput: BruttoNettoInput = useMemo(
    () => ({
      ...bnBasis,
      brutto: state.brutto,
      zeitraum: state.zeitraum,
      steuerklasse: state.steuerklasse,
      region: state.region,
      kirchensteuerpflichtig: state.kirchensteuerpflichtig,
      kinderZahl: state.kinderZahl,
      kinderfreibetraege: state.kinderfreibetraege,
      kinderlos: state.kinderlos,
      gesetzlichVersichert: state.gesetzlichVersichert,
      zusatzbeitragPercent: state.zusatzbeitragPercent,
      privatBeitragMonat: state.privatBeitragMonat,
      rentenversicherungspflichtig: state.rentenversicherungspflichtig,
    }),
    [state],
  );
  const einkommen = useMemo(
    () => calculateBruttoNetto(einkommenInput),
    [einkommenInput],
  );

  const urteil = useMemo(
    () =>
      bewerteHauskauf({
        belastungMonat: immobilie.belastungMonat,
        nettoMonat: einkommen.nettoMonat,
        darlehen: immobilie.darlehen,
        restschuldZinsbindung: immobilie.restschuldZinsbindung,
      }),
    [immobilie, einkommen],
  );

  const immobilienTool = getTool("immobilienrechner");
  const bruttonettoTool = getTool("bruttonetto");
  const region = getRegion(state.region);
  const warnings = [...immobilie.warnings, ...einkommen.warnings];

  return (
    <div className="flex flex-col gap-8">
      <nav
        aria-label="Fortschritt"
        className="flex flex-wrap items-center gap-2"
      >
        {(
          [
            { step: 1, id: "hk-immobilie", label: "1 · Immobilie" },
            { step: 2, id: "hk-einkommen", label: "2 · Einkommen" },
            { step: 3, id: "hk-urteil", label: "3 · Urteil" },
          ] as const
        ).map(({ step, id, label }) => {
          const active = revealedUpTo === step;
          const reachable = revealedUpTo >= step;
          return (
            <button
              key={step}
              type="button"
              onClick={() => goTo(step, id)}
              aria-current={active ? "step" : undefined}
              className={`rounded-pill px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-(--dur-fast) ${
                active
                  ? "bg-accent text-white shadow-soft"
                  : reachable
                    ? "bg-ink-soft text-ink hover:bg-accent-soft hover:text-accent"
                    : "bg-ink-soft text-muted hover:bg-accent-soft hover:text-accent"
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <Card
        as="section"
        id="hk-immobilie"
        className="scroll-mt-8 p-6"
        aria-label="Immobilie"
      >
        <CardTitle>Was kostet die Immobilie?</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Kaufpreis" htmlFor="hk-preis">
            <UnitInput
              id="hk-preis"
              unit="€"
              value={state.kaufpreis}
              onChange={(kaufpreis) => update({ kaufpreis })}
            />
          </Field>

          <Field label="Wohnfläche" htmlFor="hk-qm">
            <UnitInput
              id="hk-qm"
              unit="m²"
              value={state.wohnflaeche}
              onChange={(wohnflaeche) => update({ wohnflaeche })}
            />
          </Field>

          <Field
            label="Bundesland"
            htmlFor="hk-land"
            hint="Bestimmt Grunderwerbsteuer hier und Kirchensteuer in Schritt 2."
          >
            <Select
              id="hk-land"
              value={state.region}
              onChange={(event) => {
                const next = event.target.value;
                if (isRegionCode(next)) update({ region: next });
              }}
            >
              {regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Eigenkapital"
            htmlFor="hk-ek"
            hint="Sollte mindestens die Kaufnebenkosten abdecken."
          >
            <UnitInput
              id="hk-ek"
              unit="€"
              value={state.eigenkapital}
              onChange={(eigenkapital) => update({ eigenkapital })}
            />
          </Field>

          <Field label="Sollzins pro Jahr" htmlFor="hk-zins">
            <UnitInput
              id="hk-zins"
              unit="%"
              value={state.sollzinsPercent}
              onChange={(sollzinsPercent) => update({ sollzinsPercent })}
            />
          </Field>

          <Field label="Anfängliche Tilgung" htmlFor="hk-tilg">
            <UnitInput
              id="hk-tilg"
              unit="%"
              value={state.tilgungPercent}
              onChange={(tilgungPercent) => update({ tilgungPercent })}
            />
          </Field>

          <Field label="Zinsbindung" htmlFor="hk-bindung">
            <Stepper
              id="hk-bindung"
              value={state.zinsbindungJahre}
              min={1}
              max={40}
              onChange={(zinsbindungJahre) => update({ zinsbindungJahre })}
              suffix="Jahre"
              ariaLabel="Zinsbindung in Jahren"
            />
          </Field>
        </div>

        <div className="mt-5">
          <Disclosure
            title="Nebenkosten & laufende Kosten"
            hint="Notar, Makler, Hausgeld, Instandhaltung und Verwaltung"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Modernisierung" htmlFor="hk-modern">
                <UnitInput
                  id="hk-modern"
                  unit="€"
                  value={state.modernisierung}
                  onChange={(modernisierung) => update({ modernisierung })}
                />
              </Field>

              <Field label="Notar und Grundbuch" htmlFor="hk-notar">
                <UnitInput
                  id="hk-notar"
                  unit="%"
                  value={state.notarPercent}
                  onChange={(notarPercent) => update({ notarPercent })}
                />
              </Field>

              <Field
                label="Maklerprovision"
                htmlFor="hk-makler"
                hint="Käuferanteil inklusive Umsatzsteuer. Ohne Makler: 0."
              >
                <UnitInput
                  id="hk-makler"
                  unit="%"
                  value={state.maklerPercent}
                  onChange={(maklerPercent) => update({ maklerPercent })}
                />
              </Field>

              <Field
                label="Nicht umlagefähiges Hausgeld"
                htmlFor="hk-hausgeld"
              >
                <UnitInput
                  id="hk-hausgeld"
                  unit="€/Monat"
                  value={state.hausgeldMonat}
                  onChange={(hausgeldMonat) => update({ hausgeldMonat })}
                />
              </Field>

              <Field
                label="Instandhaltungsrücklage"
                htmlFor="hk-instand"
                hint="Faustwert: 10 bis 15 Euro je m² und Jahr."
              >
                <UnitInput
                  id="hk-instand"
                  unit="€/m²/Jahr"
                  value={state.instandhaltungProQmJahr}
                  onChange={(instandhaltungProQmJahr) =>
                    update({ instandhaltungProQmJahr })
                  }
                />
              </Field>

              <Field label="Verwaltung" htmlFor="hk-verwaltung">
                <UnitInput
                  id="hk-verwaltung"
                  unit="€/Monat"
                  value={state.verwaltungMonat}
                  onChange={(verwaltungMonat) => update({ verwaltungMonat })}
                />
              </Field>
            </div>
          </Disclosure>
        </div>

        {revealedUpTo === 1 && (
          <div className="mt-6 flex justify-end">
            <Button onClick={() => goTo(2, "hk-einkommen")}>
              Weiter zum Einkommen
            </Button>
          </div>
        )}
      </Card>

      {revealedUpTo >= 2 && (
        <Card
          as="section"
          id="hk-einkommen"
          className="scroll-mt-8 p-6"
          aria-label="Einkommen"
        >
          <CardTitle>Wie viel Netto bleibt im Haushalt?</CardTitle>

          <p className="mt-1.5 field-hint">
            Bundesland: {region?.name ?? state.region} – aus Schritt 1,
            bestimmt hier den Kirchensteuersatz ({kirchensteuersatz(state.region)}{" "}
            %).{" "}
            <button
              type="button"
              onClick={() => goTo(1, "hk-immobilie")}
              className="underline decoration-line underline-offset-2 hover:text-ink"
            >
              Ändern
            </button>
          </p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field
              label="Bruttolohn"
              htmlFor="hk-brutto"
              hint="Zwei Einkommen im Haushalt? Addiere beide Bruttogehälter."
            >
              <UnitInput
                id="hk-brutto"
                unit="€"
                value={state.brutto}
                onChange={(brutto) => update({ brutto })}
              />
            </Field>

            <Field label="Zeitraum" htmlFor="hk-zeitraum">
              <SegmentedControl
                value={state.zeitraum}
                options={ZEITRAUM_OPTIONS}
                onChange={(zeitraum) => update({ zeitraum })}
                ariaLabel="Zeitraum des Bruttolohns"
              />
            </Field>

            <Field
              label="Steuerklasse"
              htmlFor="hk-klasse"
              hint={steuerklassen[state.steuerklasse].hint}
            >
              <Select
                id="hk-klasse"
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
                  <Field label="Kinder unter 25" htmlFor="hk-kinder">
                    <Stepper
                      id="hk-kinder"
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

                  <Field label="Kinderfreibeträge" htmlFor="hk-freibetraege">
                    <Stepper
                      id="hk-freibetraege"
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
                      htmlFor="hk-zusatz"
                    >
                      <UnitInput
                        id="hk-zusatz"
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
                      htmlFor="hk-pkv"
                      hint="Voller Monatsbeitrag."
                    >
                      <UnitInput
                        id="hk-pkv"
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

          {revealedUpTo === 2 && (
            <div className="mt-6 flex justify-end">
              <Button onClick={() => goTo(3, "hk-urteil")}>
                Weiter zum Urteil
              </Button>
            </div>
          )}
        </Card>
      )}

      {revealedUpTo >= 3 && (
        <div id="hk-urteil" className="scroll-mt-8 flex flex-col gap-8">
          <ResultPanel
            footer={
              <ShareBar
                title="Hauskauf-Weg"
                text={`${formatEuro(urteil.liquiditaetspuffer)} Puffer im Monat – ${einstufungLabel[urteil.einstufung]}`}
              />
            }
          >
            <NumberDisplay
              value={urteil.liquiditaetspuffer}
              format={formatEuro}
              suffix="€ pro Monat übrig"
              caption="Liquiditätspuffer"
              tone={einstufungTon[urteil.einstufung]}
              announce={`${formatEuro(urteil.liquiditaetspuffer)} pro Monat übrig, Einstufung ${einstufungLabel[urteil.einstufung]}.`}
              hint={
                <>
                  Deine monatliche Belastung von{" "}
                  <strong className="font-semibold text-ink">
                    {formatEuro(urteil.belastungMonat)}
                  </strong>{" "}
                  entspricht{" "}
                  <strong className="font-semibold text-ink">
                    {urteil.belastungsquote === null
                      ? "–"
                      : `${formatDecimal(urteil.belastungsquote)} %`}
                  </strong>{" "}
                  eures Nettoeinkommens von {formatEuro(urteil.nettoMonat)}. Das
                  gilt als <strong className="font-semibold text-ink">
                    {einstufungLabel[urteil.einstufung]}
                  </strong>{" "}
                  – {einstufungHint[urteil.einstufung]}
                </>
              }
            />
          </ResultPanel>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Belastungsquote"
              value={
                urteil.belastungsquote === null
                  ? "–"
                  : `${formatDecimal(urteil.belastungsquote)} %`
              }
              hint="Rate und Nebenkosten vom Nettoeinkommen"
            />
            <Stat
              label="Kaufnebenkosten"
              value={formatEuro(immobilie.nebenkosten)}
              hint={`${formatDecimal(immobilie.nebenkostenQuote)} % des Kaufpreises`}
            />
            <Stat
              label="Darlehen"
              value={formatEuro(immobilie.darlehen)}
              hint={`${formatDecimal(immobilie.beleihungsauslauf)} % Beleihungsauslauf`}
            />
            <Stat
              label={`Restschuld nach ${state.zinsbindungJahre} Jahren`}
              value={formatEuro(immobilie.restschuldZinsbindung)}
              hint={
                urteil.restschuldRisiko
                  ? "über 70 % der Darlehenssumme – Risiko"
                  : urteil.restschuldQuote === null
                    ? "kein Darlehen"
                    : `${formatDecimal(urteil.restschuldQuote)} % der Darlehenssumme`
              }
            />
          </dl>

          <section aria-labelledby="hk-aufstellung" className="surface-soft p-6">
            <h2
              id="hk-aufstellung"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Vom Netto zur Wohnbelastung
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              <AmountRow label="Haushaltsnetto" value={urteil.nettoMonat} />
              <AmountRow
                label="Rate und Nebenkosten"
                value={-urteil.belastungMonat}
              />
              <AmountRow
                label="Liquiditätspuffer"
                value={urteil.liquiditaetspuffer}
                stark
              />
            </ul>
          </section>

          {warnings.length > 0 && (
            <section aria-labelledby="hk-hinweise" className="surface-soft p-6">
              <h2
                id="hk-hinweise"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Auffällig
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5 text-[15px] text-muted">
                {warnings.map((warning) => (
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

          <AffiliateBlock slots={hauskaufAffiliate} result={urteil} />

          <section aria-labelledby="hk-weiterrechnen">
            <h2
              id="hk-weiterrechnen"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Im Detail weiterrechnen
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {immobilienTool && (
                <li>
                  <WegCallout
                    href="/tools/immobilienrechner/"
                    icon={immobilienTool.icon}
                    eyebrow="Alle Angaben zur Immobilie"
                    title={immobilienTool.name}
                    description="Tilgungsplan, Jahresverlauf und Kaufen-oder-Mieten im Detail."
                  />
                </li>
              )}
              {bruttonettoTool && (
                <li>
                  <WegCallout
                    href="/tools/bruttonetto/"
                    icon={bruttonettoTool.icon}
                    eyebrow="Alle Angaben zum Einkommen"
                    title={bruttonettoTool.name}
                    description="Jeder Abzug einzeln, mit Steuerklassen-Vergleich."
                  />
                </li>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
