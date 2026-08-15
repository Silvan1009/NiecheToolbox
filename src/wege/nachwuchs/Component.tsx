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
  TextInput,
  Toggle,
  UnitInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import type { PayoffTone } from "@/components/ui/PayoffDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { isValidIso, todayIso } from "@/lib/date";
import { formatDecimal, formatEuro, formatLongDate } from "@/lib/format";
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
  calculateGeburtstermin,
  STANDARD_ZYKLUS_TAGE,
} from "@/tools/geburtstermin/logic";
import {
  calculateBruttoNetto,
  defaultInput as bruttoNettoDefaults,
  type BruttoNettoInput,
  type Zeitraum,
} from "@/tools/bruttonetto/logic";
import {
  calculateElterngeld,
  type ElterngeldModus,
} from "@/tools/elterngeld/logic";
import { calculateElternzeit } from "@/tools/elternzeit/logic";
import { kindergeldSatz } from "@/tools/kindergeld/saetze";
import { nachwuchs } from "./manifest";
import { bewerteNachwuchs } from "./urteil";

interface State extends Record<string, unknown>, BruttoNettoInput {
  letzteRegel: string;
  zykluslaengeTage: number;
  heute: string;

  elternteil1Monate: number;
  elternteil2Monate: number;
  singleParent: boolean;
  extendedMutterschutz: boolean;
  geschwisterbonus: boolean;
  mehrlingsKinder: number;
  modus: ElterngeldModus;
}

const bnBasis = bruttoNettoDefaults();

const DEFAULTS: State = {
  ...bnBasis,
  letzteRegel: todayIso(),
  zykluslaengeTage: STANDARD_ZYKLUS_TAGE,
  heute: todayIso(),

  elternteil1Monate: 12,
  elternteil2Monate: 2,
  singleParent: false,
  extendedMutterschutz: false,
  geschwisterbonus: false,
  mehrlingsKinder: 0,
  modus: "basis",
};

const ZEITRAUM_OPTIONS = [
  { value: "monat", label: "pro Monat" },
  { value: "jahr", label: "pro Jahr" },
] as const satisfies readonly { value: Zeitraum; label: string }[];

const MODUS_OPTIONS = [
  { value: "basis", label: "Basiselterngeld" },
  { value: "plus", label: "ElterngeldPlus" },
] as const satisfies readonly { value: ElterngeldModus; label: string }[];

const isZeitraum = (value: unknown): value is Zeitraum =>
  value === "monat" || value === "jahr";
const isModus = (value: unknown): value is ElterngeldModus =>
  value === "basis" || value === "plus";

function toSteuerklasse(value: unknown, fallback: Steuerklasse): Steuerklasse {
  const parsed = Number(value);
  return isSteuerklasse(parsed) ? parsed : fallback;
}

const STEPS = [
  { step: 1, id: "nw-termin", label: "1 · Termin" },
  { step: 2, id: "nw-einkommen", label: "2 · Einkommen vor der Geburt" },
  { step: 3, id: "nw-elterngeld", label: "3 · Elterngeld-Aufteilung" },
  { step: 4, id: "nw-urteil", label: "4 · Urteil" },
] as const satisfies readonly WegStepDef[];

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    letzteRegel: isValidIso(params?.regel)
      ? params.regel
      : DEFAULTS.letzteRegel,
    brutto: toNumber(params?.brutto, DEFAULTS.brutto),
    // Vom Server, damit der erste Client-Render dem SSR-HTML gleicht.
    heute: isValidIso(params?.heute) ? params.heute : DEFAULTS.heute,
  };
}

const einstufungTon: Record<
  ReturnType<typeof bewerteNachwuchs>["einstufung"],
  PayoffTone
> = {
  komfortabel: "positive",
  tragbar: "ink",
  // Kein eigener "danger"-Ton im Design-System – "accent" ist die Aufmerksamkeitsfarbe.
  eng: "accent",
};

export default function NachwuchsWeg({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const zeitraum = search.get("zeitraum");
      const land = search.get("land");
      const regel = search.get("regel");
      const modus = search.get("modus");

      return {
        ...fallback,
        letzteRegel: isValidIso(regel) ? regel : fallback.letzteRegel,
        zykluslaengeTage: toNumber(
          search.get("zyklus"),
          fallback.zykluslaengeTage,
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

        elternteil1Monate: toNumber(
          search.get("ez1"),
          fallback.elternteil1Monate,
        ),
        elternteil2Monate: toNumber(
          search.get("ez2"),
          fallback.elternteil2Monate,
        ),
        singleParent: toBool(search.get("allein"), fallback.singleParent),
        extendedMutterschutz: toBool(
          search.get("mehrling"),
          fallback.extendedMutterschutz,
        ),
        geschwisterbonus: toBool(
          search.get("geschwister"),
          fallback.geschwisterbonus,
        ),
        mehrlingsKinder: toNumber(
          search.get("mehrlingskinder"),
          fallback.mehrlingsKinder,
        ),
        modus: isModus(modus) ? modus : fallback.modus,
      };
    },
    serialize: (next) => ({
      regel: urlValue(next.letzteRegel, DEFAULTS.letzteRegel),
      zyklus: urlValue(next.zykluslaengeTage, DEFAULTS.zykluslaengeTage),

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

      ez1: urlValue(next.elternteil1Monate, DEFAULTS.elternteil1Monate),
      ez2: urlValue(next.elternteil2Monate, DEFAULTS.elternteil2Monate),
      allein: boolValue(next.singleParent, DEFAULTS.singleParent),
      mehrling: boolValue(
        next.extendedMutterschutz,
        DEFAULTS.extendedMutterschutz,
      ),
      geschwister: boolValue(next.geschwisterbonus, DEFAULTS.geschwisterbonus),
      mehrlingskinder: urlValue(next.mehrlingsKinder, DEFAULTS.mehrlingsKinder),
      modus: urlValue(next.modus, DEFAULTS.modus),
    }),
  });

  const stepper = useWegStepper(STEPS.length);

  const termin = useMemo(
    () =>
      calculateGeburtstermin({
        letzteRegel: state.letzteRegel,
        zykluslaengeTage: state.zykluslaengeTage,
        heute: state.heute,
      }),
    [state.letzteRegel, state.zykluslaengeTage, state.heute],
  );

  const einkommen = useMemo(() => calculateBruttoNetto(state), [state]);

  const elternzeit = useMemo(
    () =>
      calculateElternzeit({
        birthDate: termin.errechneterTermin,
        extendedMutterschutz: state.extendedMutterschutz,
        singleParent: state.singleParent,
        parentOne: { months: state.elternteil1Monate, startMonth: 1 },
        parentTwo: {
          months: state.elternteil2Monate,
          startMonth: state.elternteil1Monate + 1,
        },
      }),
    [
      termin.errechneterTermin,
      state.extendedMutterschutz,
      state.singleParent,
      state.elternteil1Monate,
      state.elternteil2Monate,
    ],
  );

  const elterngeld = useMemo(
    () =>
      calculateElterngeld({
        nettoEinkommenVorGeburt: einkommen.nettoMonat,
        geschwisterbonus: state.geschwisterbonus,
        mehrlingsKinder: state.mehrlingsKinder,
        modus: state.modus,
        bezugsmonate: elternzeit.elterngeld.maxMonths,
      }),
    [
      einkommen.nettoMonat,
      state.geschwisterbonus,
      state.mehrlingsKinder,
      state.modus,
      elternzeit.elterngeld.maxMonths,
    ],
  );

  const kindergeldJahr = Number(termin.errechneterTermin.slice(0, 4));
  const kindergeld = kindergeldSatz(kindergeldJahr);
  const kindergeldMonat = kindergeld.satz * (1 + state.mehrlingsKinder);

  const elterngeldPlusKindergeldMonat =
    elterngeld.ausgezahlterMonatsbetrag + kindergeldMonat;

  const urteil = useMemo(
    () =>
      bewerteNachwuchs({
        nettoVorGeburtMonat: einkommen.nettoMonat,
        elterngeldPlusKindergeldMonat,
      }),
    [einkommen.nettoMonat, elterngeldPlusKindergeldMonat],
  );

  const fristen = elternzeit.milestones.filter(
    (m) => m.kind === "frist" || m.title === "Mutterschutz beginnt",
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
        id="nw-termin"
        ariaLabel="Termin"
        title="Wann ist der errechnete Termin?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zum Einkommen"
        onContinue={() => stepper.goTo(2, "nw-einkommen")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Erster Tag der letzten Periode"
            htmlFor="nw-regel"
            hint="Nicht der vermutete Tag der Empfängnis."
          >
            <TextInput
              id="nw-regel"
              type="date"
              value={state.letzteRegel}
              aria-invalid={!termin.gueltig}
              onChange={(event) => update({ letzteRegel: event.target.value })}
              className="max-w-52 font-mono"
            />
          </Field>

          <Field
            label="Zykluslänge"
            htmlFor="nw-zyklus"
            hint={`Standard sind ${STANDARD_ZYKLUS_TAGE} Tage.`}
          >
            <Stepper
              id="nw-zyklus"
              value={state.zykluslaengeTage}
              min={20}
              max={40}
              onChange={(zykluslaengeTage) => update({ zykluslaengeTage })}
              suffix="Tage"
              ariaLabel="Zykluslänge in Tagen"
            />
          </Field>
        </div>

        {termin.gueltig && (
          <p className="mt-4 field-hint">
            Errechneter Termin: {formatLongDate(termin.errechneterTermin)}, das
            entspricht SSW {termin.ssw}+{termin.sswTag} heute.
          </p>
        )}
      </WegStep>

      <WegStep
        step={2}
        id="nw-einkommen"
        ariaLabel="Einkommen vor der Geburt"
        title="Wie viel Netto kommt vor der Geburt an?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zur Elterngeld-Aufteilung"
        onContinue={() => stepper.goTo(3, "nw-elterngeld")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Bruttolohn"
            htmlFor="nw-brutto"
            hint="Zwei Einkommen im Haushalt? Addiere beide Bruttogehälter."
          >
            <UnitInput
              id="nw-brutto"
              unit="€"
              value={state.brutto}
              onChange={(brutto) => update({ brutto })}
            />
          </Field>

          <Field label="Zeitraum" htmlFor="nw-zeitraum">
            <SegmentedControl
              value={state.zeitraum}
              options={ZEITRAUM_OPTIONS}
              onChange={(zeitraum) => update({ zeitraum })}
              ariaLabel="Zeitraum des Bruttolohns"
            />
          </Field>

          <Field
            label="Steuerklasse"
            htmlFor="nw-klasse"
            hint={steuerklassen[state.steuerklasse].hint}
          >
            <Select
              id="nw-klasse"
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
            htmlFor="nw-land"
            hint={`Bestimmt den Kirchensteuersatz (${kirchensteuersatz(state.region)} %).`}
          >
            <Select
              id="nw-land"
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
                label="Bisher kinderlos, mindestens 23 Jahre alt"
                hint="Zuschlag von 0,6 Prozentpunkten zur Pflegeversicherung."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Bereits vorhandene Kinder unter 25"
                  htmlFor="nw-kinder"
                >
                  <Stepper
                    id="nw-kinder"
                    value={state.kinderZahl}
                    min={0}
                    max={10}
                    onChange={(kinderZahl) =>
                      update({
                        kinderZahl,
                        kinderlos: kinderZahl > 0 ? false : state.kinderlos,
                      })
                    }
                    ariaLabel="Zahl bereits vorhandener Kinder unter 25"
                  />
                </Field>

                <Field label="Kinderfreibeträge" htmlFor="nw-freibetraege">
                  <Stepper
                    id="nw-freibetraege"
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
                    htmlFor="nw-zusatz"
                  >
                    <UnitInput
                      id="nw-zusatz"
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
                    htmlFor="nw-pkv"
                    hint="Voller Monatsbeitrag."
                  >
                    <UnitInput
                      id="nw-pkv"
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
        step={3}
        id="nw-elterngeld"
        ariaLabel="Elterngeld-Aufteilung"
        title="Wer nimmt wie viel Elternzeit?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zum Urteil"
        onContinue={() => stepper.goTo(4, "nw-urteil")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Elternteil 1"
            htmlFor="nw-ez1"
            hint="Beginnt direkt ab der Geburt, Mutterschutz eingerechnet."
          >
            <Stepper
              id="nw-ez1"
              value={state.elternteil1Monate}
              min={0}
              max={36}
              onChange={(elternteil1Monate) => update({ elternteil1Monate })}
              suffix="Monate"
              ariaLabel="Elternzeit-Monate von Elternteil 1"
            />
          </Field>

          <Field
            label="Elternteil 2"
            htmlFor="nw-ez2"
            hint="Schließt direkt an Elternteil 1 an."
          >
            <Stepper
              id="nw-ez2"
              value={state.elternteil2Monate}
              min={0}
              max={36}
              onChange={(elternteil2Monate) => update({ elternteil2Monate })}
              suffix="Monate"
              ariaLabel="Elternzeit-Monate von Elternteil 2"
            />
          </Field>

          <Toggle
            checked={state.singleParent}
            onChange={(singleParent) => update({ singleParent })}
            label="Alleinerziehend"
            hint="14 Basiselterngeld-Monate auch ohne Partnermonate."
          />

          <Toggle
            checked={state.extendedMutterschutz}
            onChange={(extendedMutterschutz) =>
              update({ extendedMutterschutz })
            }
            label="Mehrlings- oder Frühgeburt"
            hint="Verlängert den Mutterschutz nach der Geburt auf 12 Wochen."
          />

          <Field label="Elterngeld-Variante" htmlFor="nw-modus">
            <SegmentedControl
              value={state.modus}
              options={MODUS_OPTIONS}
              onChange={(modus) => update({ modus })}
              ariaLabel="Basiselterngeld oder ElterngeldPlus"
            />
          </Field>

          <Field
            label="Weitere Kinder bei Mehrlingsgeburt"
            htmlFor="nw-mehrlinge"
          >
            <Stepper
              id="nw-mehrlinge"
              value={state.mehrlingsKinder}
              min={0}
              max={4}
              onChange={(mehrlingsKinder) => update({ mehrlingsKinder })}
              ariaLabel="Zusätzliche Kinder bei Mehrlingsgeburt"
            />
          </Field>

          <Toggle
            checked={state.geschwisterbonus}
            onChange={(geschwisterbonus) => update({ geschwisterbonus })}
            label="Geschwisterbonus"
            hint="Weiteres Kind unter 3 oder zwei weitere unter 6 im Haushalt."
          />
        </div>
      </WegStep>

      {stepper.revealedUpTo >= 4 && (
        <div id="nw-urteil" className="scroll-mt-8 flex flex-col gap-8">
          <ResultPanel
            footer={
              <ShareBar
                title="Nachwuchs-Weg"
                text={`${formatEuro(Math.abs(urteil.deltaMonat))} ${urteil.deltaMonat >= 0 ? "Plus" : "Lücke"} während des Bezugs`}
              />
            }
          >
            <NumberDisplay
              value={urteil.deltaMonat}
              format={(value) => formatEuro(Math.abs(value))}
              suffix={
                urteil.deltaMonat >= 0
                  ? "€ Plus pro Monat"
                  : "€ Lücke pro Monat"
              }
              caption="Elterngeld und Kindergeld gegen das bisherige Netto"
              tone={einstufungTon[urteil.einstufung]}
              announce={`${formatEuro(Math.abs(urteil.deltaMonat))} ${urteil.deltaMonat >= 0 ? "Plus" : "Lücke"} pro Monat.`}
              hint={
                <>
                  Elterngeld und Kindergeld zusammen decken{" "}
                  <strong className="font-semibold text-ink">
                    {urteil.ersatzquoteProzent === null
                      ? "–"
                      : `${formatDecimal(urteil.ersatzquoteProzent)} %`}
                  </strong>{" "}
                  des bisherigen Nettos.
                </>
              }
            />
          </ResultPanel>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Netto vor der Geburt"
              value={formatEuro(einkommen.nettoMonat)}
              hint="pro Monat"
            />
            <Stat
              label="Elterngeld"
              value={formatEuro(elterngeld.ausgezahlterMonatsbetrag)}
              hint={`${formatDecimal(elterngeld.ersatzrate)} % Ersatzrate, ${elternzeit.elterngeld.maxMonths} Monate`}
            />
            <Stat
              label="Kindergeld"
              value={formatEuro(kindergeldMonat)}
              hint={`${kindergeldJahr}${kindergeld.extrapoliert ? ", fortgeschrieben" : ""}`}
            />
            <Stat
              label="Ersatzquote"
              value={
                urteil.ersatzquoteProzent === null
                  ? "–"
                  : `${formatDecimal(urteil.ersatzquoteProzent)} %`
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

          {fristen.length > 0 && (
            <section aria-labelledby="nw-fristen" className="surface-soft p-6">
              <h2
                id="nw-fristen"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Wichtige Termine
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-[15px]">
                {fristen.map((frist) => (
                  <li key={`${frist.date}-${frist.title}`}>
                    <span className="font-semibold text-ink">
                      {formatLongDate(frist.date)}
                    </span>{" "}
                    – {frist.title}
                    <span className="block field-hint">{frist.detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(termin.warnings.length > 0 ||
            elternzeit.warnings.length > 0 ||
            elterngeld.warnings.length > 0) && (
            <section aria-labelledby="nw-hinweise" className="surface-soft p-6">
              <h2
                id="nw-hinweise"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Auffällig
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5 text-[15px] text-muted">
                {[
                  ...termin.warnings,
                  ...elternzeit.warnings,
                  ...elterngeld.warnings,
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

          <section
            aria-labelledby="nw-aufstellung"
            className="surface-soft p-6"
          >
            <h2
              id="nw-aufstellung"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Vom bisherigen Netto zur Bezugszeit
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              <AmountRow
                label="Netto vor der Geburt"
                value={einkommen.nettoMonat}
              />
              <AmountRow
                label="Elterngeld und Kindergeld"
                value={elterngeldPlusKindergeldMonat}
              />
              <AmountRow label="Differenz" value={urteil.deltaMonat} stark />
            </ul>
          </section>

          <WegSourceTools tools={nachwuchs.sourceTools} />
        </div>
      )}
    </div>
  );
}
