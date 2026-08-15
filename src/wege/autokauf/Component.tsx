"use client";

import { useMemo } from "react";
import { WegSourceTools } from "@/components/WegSourceTools";
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
import type { PayoffTone } from "@/components/ui/PayoffDisplay";
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
import {
  antriebLabels,
  calculateAutokosten,
  type Antrieb,
} from "@/tools/autokosten/logic";
import {
  calculateBruttoNetto,
  defaultInput as bruttoNettoDefaults,
  type BruttoNettoInput,
  type Zeitraum,
} from "@/tools/bruttonetto/logic";
import { calculateKredit } from "@/tools/kreditrechner/logic";
import {
  calculateKfz,
  kfzAlterLabels,
  kfzDeckungLabels,
  kfzRegionLabels,
  kfzSfLabels,
  type KfzAlter,
  type KfzDeckung,
  type KfzFahrleistung,
  type KfzFahrzeug,
  type KfzRegion,
  type KfzSfKlasse,
} from "@/tools/versicherungsvergleich/logic";
import { autokauf } from "./manifest";
import { bewerteAutokauf } from "./urteil";

interface State extends Record<string, unknown>, BruttoNettoInput {
  antrieb: Antrieb;
  kaufpreis: number;
  restwert: number;
  haltedauerJahre: number;
  verbrauch: number;
  kraftstoffpreis: number;
  kmProJahr: number;
  kfzSteuerJahr: number;
  wartungJahr: number;
  verschleissJahr: number;
  sonstigesJahr: number;

  anzahlung: number;
  sollzinsPercent: number;
  laufzeitJahre: number;
  sfKlasse: KfzSfKlasse;
  /** Preisregion für die Kfz-Versicherung – ein eigenes Konzept, keine Bundesland-Angabe. */
  kfzRegion: KfzRegion;
  fahrerAlter: KfzAlter;
  deckung: KfzDeckung;
  eigenerBeitragJahr: number;
}

const bnBasis = bruttoNettoDefaults();

const DEFAULTS: State = {
  ...bnBasis,
  antrieb: "benzin",
  kaufpreis: 28000,
  restwert: 12000,
  haltedauerJahre: 6,
  verbrauch: 6.5,
  kraftstoffpreis: 1.75,
  kmProJahr: 12000,
  kfzSteuerJahr: 80,
  wartungJahr: 450,
  verschleissJahr: 300,
  sonstigesJahr: 0,

  anzahlung: 5000,
  sollzinsPercent: 6.5,
  laufzeitJahre: 6,
  sfKlasse: "mittel",
  kfzRegion: "mittel",
  fahrerAlter: "30bis60",
  deckung: "teilkasko",
  eigenerBeitragJahr: 0,
};

const ANTRIEB_OPTIONS = [
  { value: "benzin", label: antriebLabels.benzin },
  { value: "diesel", label: antriebLabels.diesel },
  { value: "elektro", label: antriebLabels.elektro },
] as const satisfies readonly { value: Antrieb; label: string }[];

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

/** Grobe Einordnung aus dem Kaufpreis, damit die Fahrzeugklasse nicht extra abgefragt werden muss. */
function fahrzeugAusKaufpreis(kaufpreis: number): KfzFahrzeug {
  if (kaufpreis < 18000) return "klein";
  if (kaufpreis < 35000) return "mittel";
  if (kaufpreis < 60000) return "ober";
  return "sport";
}

/** Grobe Einordnung aus der Fahrleistung, damit sie nicht extra abgefragt werden muss. */
function kmBandAusFahrleistung(kmProJahr: number): KfzFahrleistung {
  if (kmProJahr < 8000) return "wenig";
  if (kmProJahr <= 15000) return "mittel";
  return "viel";
}

const STEPS = [
  { step: 1, id: "ak-auto", label: "1 · Das Auto" },
  { step: 2, id: "ak-finanzierung", label: "2 · Finanzierung & Versicherung" },
  { step: 3, id: "ak-netto", label: "3 · Netto" },
  { step: 4, id: "ak-urteil", label: "4 · Urteil" },
] as const satisfies readonly WegStepDef[];

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    kaufpreis: toNumber(params?.preis, DEFAULTS.kaufpreis),
    brutto: toNumber(params?.brutto, DEFAULTS.brutto),
  };
}

const einstufungTon: Record<
  ReturnType<typeof bewerteAutokauf>["einstufung"],
  PayoffTone
> = {
  komfortabel: "positive",
  tragbar: "ink",
  // Kein eigener "danger"-Ton im Design-System – "accent" ist die Aufmerksamkeitsfarbe.
  eng: "accent",
};

export default function AutokaufWeg({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const zeitraum = search.get("zeitraum");
      const land = search.get("land");
      const antrieb = search.get("antrieb");
      const sfKlasse = search.get("sf");
      const deckung = search.get("deckung");

      return {
        ...fallback,
        antrieb:
          antrieb === "benzin" || antrieb === "diesel" || antrieb === "elektro"
            ? antrieb
            : fallback.antrieb,
        kaufpreis: toNumber(search.get("preis"), fallback.kaufpreis),
        restwert: toNumber(search.get("restwert"), fallback.restwert),
        haltedauerJahre: toNumber(
          search.get("haltedauer"),
          fallback.haltedauerJahre,
        ),
        verbrauch: toNumber(search.get("verbrauch"), fallback.verbrauch),
        kraftstoffpreis: toNumber(
          search.get("spritpreis"),
          fallback.kraftstoffpreis,
        ),
        kmProJahr: toNumber(search.get("km"), fallback.kmProJahr),
        kfzSteuerJahr: toNumber(search.get("steuer"), fallback.kfzSteuerJahr),
        wartungJahr: toNumber(search.get("wartung"), fallback.wartungJahr),
        verschleissJahr: toNumber(
          search.get("verschleiss"),
          fallback.verschleissJahr,
        ),
        sonstigesJahr: toNumber(
          search.get("sonstiges"),
          fallback.sonstigesJahr,
        ),

        anzahlung: toNumber(search.get("anzahlung"), fallback.anzahlung),
        sollzinsPercent: toNumber(search.get("zins"), fallback.sollzinsPercent),
        laufzeitJahre: toNumber(search.get("laufzeit"), fallback.laufzeitJahre),
        sfKlasse: isSfKlasse(sfKlasse) ? sfKlasse : fallback.sfKlasse,
        kfzRegion: isKfzRegion(search.get("kfzregion"))
          ? (search.get("kfzregion") as KfzRegion)
          : fallback.kfzRegion,
        fahrerAlter: isFahrerAlter(search.get("fahreralter"))
          ? (search.get("fahreralter") as KfzAlter)
          : fallback.fahrerAlter,
        deckung: isDeckung(deckung) ? deckung : fallback.deckung,
        eigenerBeitragJahr: toNumber(
          search.get("praemie"),
          fallback.eigenerBeitragJahr,
        ),

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
    serialize: (next) => ({
      antrieb: urlValue(next.antrieb, DEFAULTS.antrieb),
      preis: urlValue(next.kaufpreis, DEFAULTS.kaufpreis),
      restwert: urlValue(next.restwert, DEFAULTS.restwert),
      haltedauer: urlValue(next.haltedauerJahre, DEFAULTS.haltedauerJahre),
      verbrauch: urlValue(next.verbrauch, DEFAULTS.verbrauch),
      spritpreis: urlValue(next.kraftstoffpreis, DEFAULTS.kraftstoffpreis),
      km: urlValue(next.kmProJahr, DEFAULTS.kmProJahr),
      steuer: urlValue(next.kfzSteuerJahr, DEFAULTS.kfzSteuerJahr),
      wartung: urlValue(next.wartungJahr, DEFAULTS.wartungJahr),
      verschleiss: urlValue(next.verschleissJahr, DEFAULTS.verschleissJahr),
      sonstiges: urlValue(next.sonstigesJahr, DEFAULTS.sonstigesJahr),

      anzahlung: urlValue(next.anzahlung, DEFAULTS.anzahlung),
      zins: urlValue(next.sollzinsPercent, DEFAULTS.sollzinsPercent),
      laufzeit: urlValue(next.laufzeitJahre, DEFAULTS.laufzeitJahre),
      sf: urlValue(next.sfKlasse, DEFAULTS.sfKlasse),
      kfzregion: urlValue(next.kfzRegion, DEFAULTS.kfzRegion),
      fahreralter: urlValue(next.fahrerAlter, DEFAULTS.fahrerAlter),
      deckung: urlValue(next.deckung, DEFAULTS.deckung),
      praemie: urlValue(next.eigenerBeitragJahr, DEFAULTS.eigenerBeitragJahr),

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
    }),
  });

  const stepper = useWegStepper(STEPS.length);

  const kfz = useMemo(
    () =>
      calculateKfz({
        deckung: state.deckung,
        sfKlasse: state.sfKlasse,
        region: state.kfzRegion,
        fahrzeug: fahrzeugAusKaufpreis(state.kaufpreis),
        fahrerAlter: state.fahrerAlter,
        kmProJahr: kmBandAusFahrleistung(state.kmProJahr),
        eigenerBeitragJahr: state.eigenerBeitragJahr,
      }),
    [
      state.deckung,
      state.sfKlasse,
      state.kfzRegion,
      state.kaufpreis,
      state.fahrerAlter,
      state.kmProJahr,
      state.eigenerBeitragJahr,
    ],
  );
  const versicherungJahr = kfz.eigenerBeitrag ?? kfz.richtwert;

  const autokosten = useMemo(
    () =>
      calculateAutokosten({
        antrieb: state.antrieb,
        verbrauch: state.verbrauch,
        kraftstoffpreis: state.kraftstoffpreis,
        kmProJahr: state.kmProJahr,
        kaufpreis: state.kaufpreis,
        restwert: state.restwert,
        haltedauerJahre: state.haltedauerJahre,
        kfzSteuerJahr: state.kfzSteuerJahr,
        versicherungJahr,
        wartungJahr: state.wartungJahr,
        verschleissJahr: state.verschleissJahr,
        sonstigesJahr: state.sonstigesJahr,
      }),
    [state, versicherungJahr],
  );

  const kredit = useMemo(
    () =>
      calculateKredit({
        modus: "rate-aus-laufzeit",
        kreditbetrag: Math.max(0, state.kaufpreis - state.anzahlung),
        sollzinsPercent: state.sollzinsPercent,
        laufzeitJahre: state.laufzeitJahre,
        wunschrateMonat: 0,
        sondertilgungJahr: 0,
        bearbeitungsgebuehrPercent: 0,
        restschuldversicherung: 0,
        zinsbindungJahre: 0,
      }),
    [
      state.kaufpreis,
      state.anzahlung,
      state.sollzinsPercent,
      state.laufzeitJahre,
    ],
  );

  const einkommen = useMemo(() => calculateBruttoNetto(state), [state]);

  const gesamtkostenMonat = autokosten.gesamtkostenMonat + kredit.monatsrate;
  const gesamtProKmCent =
    state.kmProJahr > 0
      ? ((autokosten.gesamtkostenJahr + kredit.monatsrate * 12) /
          state.kmProJahr) *
        100
      : 0;

  const urteil = useMemo(
    () =>
      bewerteAutokauf({
        gesamtkostenMonat,
        nettoMonat: einkommen.nettoMonat,
      }),
    [gesamtkostenMonat, einkommen.nettoMonat],
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
        id="ak-auto"
        ariaLabel="Das Auto"
        title="Was kostet das Auto im Unterhalt?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zur Finanzierung"
        onContinue={() => stepper.goTo(2, "ak-finanzierung")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Antrieb" htmlFor="ak-antrieb">
            <SegmentedControl
              value={state.antrieb}
              options={ANTRIEB_OPTIONS}
              onChange={(antrieb) => update({ antrieb })}
              ariaLabel="Antriebsart"
            />
          </Field>

          <Field label="Jährliche Fahrleistung" htmlFor="ak-km">
            <UnitInput
              id="ak-km"
              unit="km"
              value={state.kmProJahr}
              onChange={(kmProJahr) => update({ kmProJahr })}
            />
          </Field>

          <Field label="Kaufpreis" htmlFor="ak-preis">
            <UnitInput
              id="ak-preis"
              unit="€"
              value={state.kaufpreis}
              onChange={(kaufpreis) => update({ kaufpreis })}
            />
          </Field>

          <Field label="Restwert nach Haltedauer" htmlFor="ak-restwert">
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
              max={20}
              onChange={(haltedauerJahre) => update({ haltedauerJahre })}
              suffix="Jahre"
              ariaLabel="Haltedauer in Jahren"
            />
          </Field>

          <Field
            label={
              state.antrieb === "elektro" ? "Verbrauch" : "Verbrauch je 100 km"
            }
            htmlFor="ak-verbrauch"
          >
            <UnitInput
              id="ak-verbrauch"
              unit={state.antrieb === "elektro" ? "kWh/100km" : "l/100km"}
              value={state.verbrauch}
              onChange={(verbrauch) => update({ verbrauch })}
            />
          </Field>

          <Field
            label={
              state.antrieb === "elektro" ? "Strompreis" : "Kraftstoffpreis"
            }
            htmlFor="ak-spritpreis"
          >
            <UnitInput
              id="ak-spritpreis"
              unit={state.antrieb === "elektro" ? "€/kWh" : "€/l"}
              value={state.kraftstoffpreis}
              onChange={(kraftstoffpreis) => update({ kraftstoffpreis })}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Disclosure
            title="Weitere laufende Kosten"
            hint="Steuer, Wartung, Verschleiß und Sonstiges"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Kfz-Steuer" htmlFor="ak-steuer">
                <UnitInput
                  id="ak-steuer"
                  unit="€/Jahr"
                  value={state.kfzSteuerJahr}
                  onChange={(kfzSteuerJahr) => update({ kfzSteuerJahr })}
                />
              </Field>

              <Field label="Wartung & Inspektion" htmlFor="ak-wartung">
                <UnitInput
                  id="ak-wartung"
                  unit="€/Jahr"
                  value={state.wartungJahr}
                  onChange={(wartungJahr) => update({ wartungJahr })}
                />
              </Field>

              <Field label="Verschleiß & Reifen" htmlFor="ak-verschleiss">
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
          </Disclosure>
        </div>
      </WegStep>

      <WegStep
        step={2}
        id="ak-finanzierung"
        ariaLabel="Finanzierung und Versicherung"
        title="Wie wird finanziert, wie wird versichert?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zum Netto"
        onContinue={() => stepper.goTo(3, "ak-netto")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Anzahlung"
            htmlFor="ak-anzahlung"
            hint="Volle Kaufpreishöhe eintragen, um bar statt finanziert zu rechnen."
          >
            <UnitInput
              id="ak-anzahlung"
              unit="€"
              value={state.anzahlung}
              onChange={(anzahlung) => update({ anzahlung })}
            />
          </Field>

          <Field label="Sollzins" htmlFor="ak-zins">
            <UnitInput
              id="ak-zins"
              unit="%"
              value={state.sollzinsPercent}
              onChange={(sollzinsPercent) => update({ sollzinsPercent })}
            />
          </Field>

          <Field label="Kreditlaufzeit" htmlFor="ak-laufzeit">
            <Stepper
              id="ak-laufzeit"
              value={state.laufzeitJahre}
              min={1}
              max={15}
              onChange={(laufzeitJahre) => update({ laufzeitJahre })}
              suffix="Jahre"
              ariaLabel="Kreditlaufzeit in Jahren"
            />
          </Field>

          <Field label="Deckung" htmlFor="ak-deckung">
            <Select
              id="ak-deckung"
              value={state.deckung}
              onChange={(event) => {
                const value = event.target.value;
                if (isDeckung(value)) update({ deckung: value });
              }}
            >
              {Object.entries(kfzDeckungLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Schadenfreiheitsklasse" htmlFor="ak-sf">
            <Select
              id="ak-sf"
              value={state.sfKlasse}
              onChange={(event) => {
                const value = event.target.value;
                if (isSfKlasse(value)) update({ sfKlasse: value });
              }}
            >
              {Object.entries(kfzSfLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Preisregion der Versicherung"
            htmlFor="ak-kfzregion"
            hint="Unabhängig vom Bundesland im nächsten Schritt."
          >
            <Select
              id="ak-kfzregion"
              value={state.kfzRegion}
              onChange={(event) => {
                const value = event.target.value;
                if (isKfzRegion(value)) update({ kfzRegion: value });
              }}
            >
              {Object.entries(kfzRegionLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Alter der fahrenden Person" htmlFor="ak-fahreralter">
            <Select
              id="ak-fahreralter"
              value={state.fahrerAlter}
              onChange={(event) => {
                const value = event.target.value;
                if (isFahrerAlter(value)) update({ fahrerAlter: value });
              }}
            >
              {Object.entries(kfzAlterLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Eigene Prämie"
            htmlFor="ak-praemie"
            hint="Leer lassen für den Marktrichtwert. Liegt ein Angebot vor, hier eintragen."
          >
            <UnitInput
              id="ak-praemie"
              unit="€/Jahr"
              value={state.eigenerBeitragJahr}
              onChange={(eigenerBeitragJahr) => update({ eigenerBeitragJahr })}
            />
          </Field>
        </div>
      </WegStep>

      <WegStep
        step={3}
        id="ak-netto"
        ariaLabel="Netto"
        title="Wie viel Netto steht dagegen?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zum Urteil"
        onContinue={() => stepper.goTo(4, "ak-urteil")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Bruttolohn" htmlFor="ak-brutto">
            <UnitInput
              id="ak-brutto"
              unit="€"
              value={state.brutto}
              onChange={(brutto) => update({ brutto })}
            />
          </Field>

          <Field label="Zeitraum" htmlFor="ak-zeitraum">
            <SegmentedControl
              value={state.zeitraum}
              options={ZEITRAUM_OPTIONS}
              onChange={(zeitraum) => update({ zeitraum })}
              ariaLabel="Zeitraum des Bruttolohns"
            />
          </Field>

          <Field
            label="Steuerklasse"
            htmlFor="ak-klasse"
            hint={steuerklassen[state.steuerklasse].hint}
          >
            <Select
              id="ak-klasse"
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
            htmlFor="ak-land"
            hint={`Gilt für Kirchensteuer und Kfz-Region. ${kirchensteuersatz(state.region)} % Kirchensteuersatz hier.`}
          >
            <Select
              id="ak-land"
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
                <Field label="Kinder unter 25" htmlFor="ak-kinder">
                  <Stepper
                    id="ak-kinder"
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

                <Field label="Kinderfreibeträge" htmlFor="ak-freibetraege">
                  <Stepper
                    id="ak-freibetraege"
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
                    htmlFor="ak-zusatz"
                  >
                    <UnitInput
                      id="ak-zusatz"
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
                    htmlFor="ak-pkv"
                    hint="Voller Monatsbeitrag."
                  >
                    <UnitInput
                      id="ak-pkv"
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

      {stepper.revealedUpTo >= 4 && (
        <div id="ak-urteil" className="scroll-mt-8 flex flex-col gap-8">
          <ResultPanel
            footer={
              <ShareBar
                title="Auto-Weg"
                text={`${formatEuro(gesamtkostenMonat)} Gesamtkosten im Monat`}
              />
            }
          >
            <NumberDisplay
              value={gesamtkostenMonat}
              format={formatEuro}
              suffix="€ Gesamtkosten pro Monat"
              caption="Kredit, Unterhalt und Versicherung"
              tone={einstufungTon[urteil.einstufung]}
              announce={`${formatEuro(gesamtkostenMonat)} Gesamtkosten pro Monat.`}
              hint={
                <>
                  Das sind{" "}
                  <strong className="font-semibold text-ink">
                    {urteil.anteilProzent === null
                      ? "–"
                      : `${formatDecimal(urteil.anteilProzent)} %`}
                  </strong>{" "}
                  eures Nettoeinkommens von {formatEuro(einkommen.nettoMonat)}.
                </>
              }
            />
          </ResultPanel>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Kreditrate"
              value={formatEuro(kredit.monatsrate)}
              hint={`${formatDecimal(state.sollzinsPercent)} % Sollzins`}
            />
            <Stat
              label="Unterhalt inkl. Versicherung"
              value={formatEuro(autokosten.gesamtkostenMonat)}
              hint={`davon ${formatEuro(versicherungJahr / 12)} Versicherung`}
            />
            <Stat
              label="Kosten pro Kilometer"
              value={`${formatDecimal(gesamtProKmCent)} ct`}
              hint="inklusive Kreditrate"
            />
            <Stat
              label="Anteil am Netto"
              value={
                urteil.anteilProzent === null
                  ? "–"
                  : `${formatDecimal(urteil.anteilProzent)} %`
              }
              hint={
                urteil.einstufung === "komfortabel"
                  ? "komfortabel"
                  : urteil.einstufung === "tragbar"
                    ? "tragbar, aber eng"
                    : "eng"
              }
            />
          </dl>

          <section
            aria-labelledby="ak-aufstellung"
            className="surface-soft p-6"
          >
            <h2
              id="ak-aufstellung"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Vom Netto zu den Autokosten
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              <AmountRow label="Nettoeinkommen" value={einkommen.nettoMonat} />
              <AmountRow label="Kreditrate" value={-kredit.monatsrate} />
              <AmountRow
                label="Unterhalt inkl. Versicherung"
                value={-autokosten.gesamtkostenMonat}
              />
              <AmountRow
                label="Bleibt für alles andere"
                value={einkommen.nettoMonat - gesamtkostenMonat}
                stark
              />
            </ul>
          </section>

          {(autokosten.warnings.length > 0 ||
            kredit.warnings.length > 0 ||
            kfz.warnings.length > 0) && (
            <section aria-labelledby="ak-hinweise" className="surface-soft p-6">
              <h2
                id="ak-hinweise"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Auffällig
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5 text-[15px] text-muted">
                {[
                  ...autokosten.warnings,
                  ...kredit.warnings,
                  ...kfz.warnings,
                ].map((warning) => (
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

          <WegSourceTools tools={autokauf.sourceTools} />
        </div>
      )}
    </div>
  );
}

function isDeckung(value: unknown): value is KfzDeckung {
  return (
    value === "haftpflicht" || value === "teilkasko" || value === "vollkasko"
  );
}

function isSfKlasse(value: unknown): value is KfzSfKlasse {
  return (
    value === "einsteiger" ||
    value === "wenig" ||
    value === "mittel" ||
    value === "erfahren" ||
    value === "maximal"
  );
}

function isFahrerAlter(value: unknown): value is KfzAlter {
  return (
    value === "unter23" ||
    value === "23bis30" ||
    value === "30bis60" ||
    value === "ueber60"
  );
}

function isKfzRegion(value: unknown): value is KfzRegion {
  return value === "guenstig" || value === "mittel" || value === "teuer";
}
