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
  UnitInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro, formatInteger } from "@/lib/format";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import { isRegionCode, regions } from "@/lib/regionen";
import type { ToolParams } from "@/tools/types";
import { immobilienAffiliate } from "./affiliate";
import { GREST_STAND, grestFor } from "./grunderwerbsteuer";
import {
  afaArten,
  calculateImmobilie,
  defaultInput,
  type AfaArt,
  type ImmobilienInput,
  type Modus,
} from "./logic";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, ImmobilienInput {}

const DEFAULTS: State = { ...defaultInput() };

const MODUS_OPTIONS = [
  { value: "kapitalanlage", label: "Kapitalanlage" },
  { value: "eigennutzung", label: "Eigennutzung" },
] as const satisfies readonly { value: Modus; label: string }[];

const isModus = (value: unknown): value is Modus =>
  value === "kapitalanlage" || value === "eigennutzung";

const isAfaArt = (value: unknown): value is AfaArt =>
  typeof value === "string" && value in afaArten;

function initialState(params: ToolParams | undefined): State {
  // Die Bundesland-Varianten liefern das Land; der Steuersatz kommt aus der
  // Tabelle, kann aber von der Variante überschrieben werden.
  const region = isRegionCode(params?.land) ? params.land : DEFAULTS.region;
  const basis = defaultInput(region);

  return {
    ...basis,
    grestPercent: toNumber(params?.grest, grestFor(region)),
    kaufpreis: toNumber(params?.preis, basis.kaufpreis),
    kaltmieteMonat: toNumber(params?.miete, basis.kaltmieteMonat),
    modus: isModus(params?.modus) ? params.modus : basis.modus,
  };
}

export default function ImmobilienrechnerTool({
  params,
}: {
  params?: ToolParams;
}) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      // Werte mit Typwächter erst lesen, dann prüfen: über zwei getrennte
      // `search.get`-Aufrufe hinweg engt TypeScript den Typ nicht ein.
      const land = search.get("land");
      const modus = search.get("modus");
      const afa = search.get("afa");

      return {
        ...fallback,
        modus: isModus(modus) ? modus : fallback.modus,
        kaufpreis: toNumber(search.get("preis"), fallback.kaufpreis),
        wohnflaeche: toNumber(search.get("qm"), fallback.wohnflaeche),
        modernisierung: toNumber(search.get("modern"), fallback.modernisierung),
        region: isRegionCode(land) ? land : fallback.region,
        grestPercent: toNumber(search.get("grest"), fallback.grestPercent),
        notarPercent: toNumber(search.get("notar"), fallback.notarPercent),
        maklerPercent: toNumber(search.get("makler"), fallback.maklerPercent),
        eigenkapital: toNumber(search.get("ek"), fallback.eigenkapital),
        sollzinsPercent: toNumber(search.get("zins"), fallback.sollzinsPercent),
        tilgungPercent: toNumber(search.get("tilg"), fallback.tilgungPercent),
        zinsbindungJahre: toNumber(
          search.get("bindung"),
          fallback.zinsbindungJahre,
        ),
        kaltmieteMonat: toNumber(search.get("miete"), fallback.kaltmieteMonat),
        mietsteigerungPercent: toNumber(
          search.get("mietplus"),
          fallback.mietsteigerungPercent,
        ),
        hausgeldMonat: toNumber(search.get("hausgeld"), fallback.hausgeldMonat),
        instandhaltungProQmJahr: toNumber(
          search.get("instand"),
          fallback.instandhaltungProQmJahr,
        ),
        verwaltungMonat: toNumber(
          search.get("verwaltung"),
          fallback.verwaltungMonat,
        ),
        mietausfallPercent: toNumber(
          search.get("ausfall"),
          fallback.mietausfallPercent,
        ),
        gebaeudeanteilPercent: toNumber(
          search.get("gebaeude"),
          fallback.gebaeudeanteilPercent,
        ),
        afaArt: isAfaArt(afa) ? afa : fallback.afaArt,
        grenzsteuersatzPercent: toNumber(
          search.get("steuer"),
          fallback.grenzsteuersatzPercent,
        ),
        ersparteMieteMonat: toNumber(
          search.get("sparmiete"),
          fallback.ersparteMieteMonat,
        ),
        alternativrenditePercent: toNumber(
          search.get("altrendite"),
          fallback.alternativrenditePercent,
        ),
        horizontJahre: toNumber(search.get("jahre"), fallback.horizontJahre),
        wertsteigerungPercent: toNumber(
          search.get("wertplus"),
          fallback.wertsteigerungPercent,
        ),
        verkaufskostenPercent: toNumber(
          search.get("verkauf"),
          fallback.verkaufskostenPercent,
        ),
      };
    },
    // Nur Abweichungen vom Default landen in der URL. Bei sechsundzwanzig
    // Feldern wäre ein vollständiger Query-String nicht mehr teilbar.
    serialize: (next) => ({
      modus: urlValue(next.modus, DEFAULTS.modus),
      preis: urlValue(next.kaufpreis, DEFAULTS.kaufpreis),
      qm: urlValue(next.wohnflaeche, DEFAULTS.wohnflaeche),
      modern: urlValue(next.modernisierung, DEFAULTS.modernisierung),
      land: urlValue(next.region, DEFAULTS.region),
      grest: urlValue(next.grestPercent, DEFAULTS.grestPercent),
      notar: urlValue(next.notarPercent, DEFAULTS.notarPercent),
      makler: urlValue(next.maklerPercent, DEFAULTS.maklerPercent),
      ek: urlValue(next.eigenkapital, DEFAULTS.eigenkapital),
      zins: urlValue(next.sollzinsPercent, DEFAULTS.sollzinsPercent),
      tilg: urlValue(next.tilgungPercent, DEFAULTS.tilgungPercent),
      bindung: urlValue(next.zinsbindungJahre, DEFAULTS.zinsbindungJahre),
      miete: urlValue(next.kaltmieteMonat, DEFAULTS.kaltmieteMonat),
      mietplus: urlValue(
        next.mietsteigerungPercent,
        DEFAULTS.mietsteigerungPercent,
      ),
      hausgeld: urlValue(next.hausgeldMonat, DEFAULTS.hausgeldMonat),
      instand: urlValue(
        next.instandhaltungProQmJahr,
        DEFAULTS.instandhaltungProQmJahr,
      ),
      verwaltung: urlValue(next.verwaltungMonat, DEFAULTS.verwaltungMonat),
      ausfall: urlValue(next.mietausfallPercent, DEFAULTS.mietausfallPercent),
      gebaeude: urlValue(
        next.gebaeudeanteilPercent,
        DEFAULTS.gebaeudeanteilPercent,
      ),
      afa: urlValue(next.afaArt, DEFAULTS.afaArt),
      steuer: urlValue(
        next.grenzsteuersatzPercent,
        DEFAULTS.grenzsteuersatzPercent,
      ),
      sparmiete: urlValue(next.ersparteMieteMonat, DEFAULTS.ersparteMieteMonat),
      altrendite: urlValue(
        next.alternativrenditePercent,
        DEFAULTS.alternativrenditePercent,
      ),
      jahre: urlValue(next.horizontJahre, DEFAULTS.horizontJahre),
      wertplus: urlValue(
        next.wertsteigerungPercent,
        DEFAULTS.wertsteigerungPercent,
      ),
      verkauf: urlValue(
        next.verkaufskostenPercent,
        DEFAULTS.verkaufskostenPercent,
      ),
    }),
  });

  const result = useMemo(() => calculateImmobilie(state), [state]);

  const istAnlage = state.modus === "kapitalanlage";
  const cashflow = result.cashflowNachSteuerMonat;

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Was rechnest du?">
        <Field
          label="Was rechnest du?"
          htmlFor="im-modus"
          hint={
            istAnlage
              ? "Vermietete Immobilie: mit Mietrendite, Abschreibung und Cashflow nach Steuern."
              : "Selbst bewohnt: statt Mieteinnahme zählt die ersparte Miete, dafür ohne Abschreibung und ohne Steuer auf den Verkaufsgewinn."
          }
        >
          <SegmentedControl
            value={state.modus}
            options={MODUS_OPTIONS}
            onChange={(modus) => update({ modus })}
            ariaLabel="Nutzungsart"
          />
        </Field>
      </Card>

      <Card as="section" className="p-6" aria-label="Objekt">
        <CardTitle>Objekt</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Kaufpreis" htmlFor="im-preis">
            <UnitInput
              id="im-preis"
              unit="€"
              value={state.kaufpreis}
              onChange={(kaufpreis) => update({ kaufpreis })}
            />
          </Field>

          <Field
            label="Wohnfläche"
            htmlFor="im-qm"
            hint="Für den Quadratmeterpreis und die Instandhaltungsrücklage."
          >
            <UnitInput
              id="im-qm"
              unit="m²"
              value={state.wohnflaeche}
              onChange={(wohnflaeche) => update({ wohnflaeche })}
            />
          </Field>

          <Field
            label="Modernisierung"
            htmlFor="im-modern"
            hint="Was direkt nach dem Kauf hineinfließt."
          >
            <UnitInput
              id="im-modern"
              unit="€"
              value={state.modernisierung}
              onChange={(modernisierung) => update({ modernisierung })}
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Kaufnebenkosten">
        <CardTitle>Kaufnebenkosten</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Bundesland"
            htmlFor="im-land"
            hint={`Setzt die Grunderwerbsteuer. Stand der Sätze: ${GREST_STAND.slice(0, 4)}.`}
          >
            <Select
              id="im-land"
              value={state.region}
              onChange={(event) => {
                const region = event.target.value;
                if (!isRegionCode(region)) return;
                update({ region, grestPercent: grestFor(region) });
              }}
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name} – {formatDecimal(grestFor(region.code))} %
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Grunderwerbsteuer"
            htmlFor="im-grest"
            hint="Aus dem Bundesland vorbelegt, aber überschreibbar."
          >
            <UnitInput
              id="im-grest"
              unit="%"
              value={state.grestPercent}
              onChange={(grestPercent) => update({ grestPercent })}
            />
          </Field>

          <Field
            label="Notar und Grundbuch"
            htmlFor="im-notar"
            hint="Üblich sind 1,5 bis 2 Prozent."
          >
            <UnitInput
              id="im-notar"
              unit="%"
              value={state.notarPercent}
              onChange={(notarPercent) => update({ notarPercent })}
            />
          </Field>

          <Field
            label="Maklerprovision"
            htmlFor="im-makler"
            hint="Käuferanteil inklusive Umsatzsteuer. Ohne Makler: 0."
          >
            <UnitInput
              id="im-makler"
              unit="%"
              value={state.maklerPercent}
              onChange={(maklerPercent) => update({ maklerPercent })}
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Finanzierung">
        <CardTitle>Finanzierung</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Eigenkapital"
            htmlFor="im-ek"
            hint="Sollte mindestens die Kaufnebenkosten abdecken."
          >
            <UnitInput
              id="im-ek"
              unit="€"
              value={state.eigenkapital}
              onChange={(eigenkapital) => update({ eigenkapital })}
            />
          </Field>

          <Field label="Sollzins pro Jahr" htmlFor="im-zins">
            <UnitInput
              id="im-zins"
              unit="%"
              value={state.sollzinsPercent}
              onChange={(sollzinsPercent) => update({ sollzinsPercent })}
            />
          </Field>

          <Field
            label="Anfängliche Tilgung"
            htmlFor="im-tilg"
            hint="Unter zwei Prozent dauert die Rückzahlung sehr lange."
          >
            <UnitInput
              id="im-tilg"
              unit="%"
              value={state.tilgungPercent}
              onChange={(tilgungPercent) => update({ tilgungPercent })}
            />
          </Field>

          <Field label="Zinsbindung" htmlFor="im-bindung">
            <Stepper
              id="im-bindung"
              value={state.zinsbindungJahre}
              min={1}
              max={40}
              onChange={(zinsbindungJahre) => update({ zinsbindungJahre })}
              suffix="Jahre"
              ariaLabel="Zinsbindung in Jahren"
            />
          </Field>
        </div>
      </Card>

      {istAnlage ? (
        <Card
          as="section"
          className="p-6"
          aria-label="Miete und Bewirtschaftung"
        >
          <CardTitle>Miete und Bewirtschaftung</CardTitle>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="Kaltmiete" htmlFor="im-miete">
              <UnitInput
                id="im-miete"
                unit="€/Monat"
                value={state.kaltmieteMonat}
                onChange={(kaltmieteMonat) => update({ kaltmieteMonat })}
              />
            </Field>

            <Field
              label="Nicht umlagefähiges Hausgeld"
              htmlFor="im-hausgeld"
              hint="Der Teil, den du nicht auf die Miete umlegen darfst."
            >
              <UnitInput
                id="im-hausgeld"
                unit="€/Monat"
                value={state.hausgeldMonat}
                onChange={(hausgeldMonat) => update({ hausgeldMonat })}
              />
            </Field>

            <Field
              label="Instandhaltungsrücklage"
              htmlFor="im-instand"
              hint="Faustwert: 10 bis 15 Euro je m² und Jahr."
            >
              <UnitInput
                id="im-instand"
                unit="€/m²/Jahr"
                value={state.instandhaltungProQmJahr}
                onChange={(instandhaltungProQmJahr) =>
                  update({ instandhaltungProQmJahr })
                }
              />
            </Field>

            <Field label="Verwaltung" htmlFor="im-verwaltung">
              <UnitInput
                id="im-verwaltung"
                unit="€/Monat"
                value={state.verwaltungMonat}
                onChange={(verwaltungMonat) => update({ verwaltungMonat })}
              />
            </Field>

            <Field
              label="Mietausfallwagnis"
              htmlFor="im-ausfall"
              hint="Leerstand und Zahlungsausfall, üblich 2 bis 5 Prozent."
            >
              <UnitInput
                id="im-ausfall"
                unit="%"
                value={state.mietausfallPercent}
                onChange={(mietausfallPercent) =>
                  update({ mietausfallPercent })
                }
              />
            </Field>

            <Field label="Mietsteigerung pro Jahr" htmlFor="im-mietplus">
              <UnitInput
                id="im-mietplus"
                unit="%"
                value={state.mietsteigerungPercent}
                onChange={(mietsteigerungPercent) =>
                  update({ mietsteigerungPercent })
                }
              />
            </Field>
          </div>
        </Card>
      ) : (
        <Card as="section" className="p-6" aria-label="Miete und Alternative">
          <CardTitle>Miete und Alternative</CardTitle>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field
              label="Miete, die entfällt"
              htmlFor="im-sparmiete"
              hint="Deine heutige Kaltmiete – sie zahlst du nach dem Kauf nicht mehr."
            >
              <UnitInput
                id="im-sparmiete"
                unit="€/Monat"
                value={state.ersparteMieteMonat}
                onChange={(ersparteMieteMonat) =>
                  update({ ersparteMieteMonat })
                }
              />
            </Field>

            <Field
              label="Nebenkosten als Eigentümer"
              htmlFor="im-hausgeld"
              hint="Hausgeld ohne die Posten, die du als Mieter auch zahlst."
            >
              <UnitInput
                id="im-hausgeld"
                unit="€/Monat"
                value={state.hausgeldMonat}
                onChange={(hausgeldMonat) => update({ hausgeldMonat })}
              />
            </Field>

            <Field
              label="Instandhaltungsrücklage"
              htmlFor="im-instand"
              hint="Als Eigentümer trägst du Dach und Heizung selbst."
            >
              <UnitInput
                id="im-instand"
                unit="€/m²/Jahr"
                value={state.instandhaltungProQmJahr}
                onChange={(instandhaltungProQmJahr) =>
                  update({ instandhaltungProQmJahr })
                }
              />
            </Field>

            <Field
              label="Verwaltung"
              htmlFor="im-verwaltung"
              hint="Die WEG-Verwaltergebühr zahlst du auch als Selbstnutzer."
            >
              <UnitInput
                id="im-verwaltung"
                unit="€/Monat"
                value={state.verwaltungMonat}
                onChange={(verwaltungMonat) => update({ verwaltungMonat })}
              />
            </Field>

            <Field label="Mietsteigerung pro Jahr" htmlFor="im-mietplus">
              <UnitInput
                id="im-mietplus"
                unit="%"
                value={state.mietsteigerungPercent}
                onChange={(mietsteigerungPercent) =>
                  update({ mietsteigerungPercent })
                }
              />
            </Field>

            <Field
              label="Rendite der Geldanlage"
              htmlFor="im-altrendite"
              hint="Was dein Eigenkapital brächte, wenn du es nicht in die Immobilie stecken würdest."
            >
              <UnitInput
                id="im-altrendite"
                unit="%"
                value={state.alternativrenditePercent}
                onChange={(alternativrenditePercent) =>
                  update({ alternativrenditePercent })
                }
              />
            </Field>
          </div>
        </Card>
      )}

      {/*
       * Der Rechner hat sechsundzwanzig Felder. Alle gleichzeitig zu zeigen
       * würde abschrecken, obwohl die Voreinstellungen für die meisten schon
       * passen – deshalb bleiben sie hinter Disclosure eingeklappt.
       */}
      {istAnlage && (
        <Disclosure
          title="Steuer"
          hint="Abschreibung und persönlicher Steuersatz"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Gebäudeanteil am Kaufpreis"
              htmlFor="im-gebaeude"
              hint="Nur das Gebäude wird abgeschrieben, der Grund und Boden nicht. Üblich sind 70 bis 80 Prozent."
            >
              <UnitInput
                id="im-gebaeude"
                unit="%"
                value={state.gebaeudeanteilPercent}
                onChange={(gebaeudeanteilPercent) =>
                  update({ gebaeudeanteilPercent })
                }
              />
            </Field>

            <Field
              label="Abschreibung"
              htmlFor="im-afa"
              hint={afaArten[state.afaArt].hint}
            >
              <Select
                id="im-afa"
                value={state.afaArt}
                onChange={(event) => {
                  const afaArt = event.target.value;
                  if (isAfaArt(afaArt)) update({ afaArt });
                }}
              >
                {Object.entries(afaArten).map(([key, def]) => (
                  <option key={key} value={key}>
                    {def.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Persönlicher Steuersatz"
              htmlFor="im-steuer"
              hint="Dein Grenzsteuersatz – der Satz auf den nächsten verdienten Euro."
            >
              <UnitInput
                id="im-steuer"
                unit="%"
                value={state.grenzsteuersatzPercent}
                onChange={(grenzsteuersatzPercent) =>
                  update({ grenzsteuersatzPercent })
                }
              />
            </Field>
          </div>
        </Disclosure>
      )}

      <Disclosure
        title="Langfristige Annahmen"
        hint="Betrachtungszeitraum, Wertentwicklung, Verkauf"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Betrachtungszeitraum"
            htmlFor="im-jahre"
            hint="Nach dieser Zeit wird ein Verkauf unterstellt."
          >
            <Stepper
              id="im-jahre"
              value={state.horizontJahre}
              min={1}
              max={50}
              onChange={(horizontJahre) => update({ horizontJahre })}
              suffix="Jahre"
              ariaLabel="Betrachtungszeitraum in Jahren"
            />
          </Field>

          <Field
            label="Wertentwicklung pro Jahr"
            htmlFor="im-wertplus"
            hint="Die unsicherste Annahme im ganzen Rechner. Im Zweifel niedrig ansetzen."
          >
            <UnitInput
              id="im-wertplus"
              unit="%"
              value={state.wertsteigerungPercent}
              onChange={(wertsteigerungPercent) =>
                update({ wertsteigerungPercent })
              }
            />
          </Field>

          <Field
            label="Verkaufskosten"
            htmlFor="im-verkauf"
            hint="Makler, Energieausweis, Vorfälligkeitsentschädigung."
          >
            <UnitInput
              id="im-verkauf"
              unit="%"
              value={state.verkaufskostenPercent}
              onChange={(verkaufskostenPercent) =>
                update({ verkaufskostenPercent })
              }
            />
          </Field>
        </div>
      </Disclosure>

      <ResultPanel
        footer={
          <ShareBar
            title="Immobilien-Rechner"
            text={
              istAnlage
                ? `${formatEuro(cashflow)} Cashflow im Monat bei ${formatEuro(result.gesamtinvestition)} Gesamtinvestition`
                : `${formatEuro(result.belastungMonat)} im Monat statt ${formatEuro(result.ersparteMieteMonat)} Miete`
            }
          />
        }
      >
        {istAnlage ? (
          <NumberDisplay
            value={cashflow}
            format={formatEuro}
            suffix="pro Monat"
            caption="Cashflow nach Steuern"
            tone={cashflow >= 0 ? "positive" : "ink"}
            announce={`${formatEuro(cashflow)} Cashflow pro Monat nach Steuern, das sind ${formatEuro(result.cashflowNachSteuerJahr)} im Jahr.`}
            hint={
              <>
                {cashflow >= 0 ? (
                  <>
                    Die Wohnung trägt sich und wirft{" "}
                    <strong className="font-semibold text-ink">
                      {formatEuro(result.cashflowNachSteuerJahr)} im Jahr
                    </strong>{" "}
                    ab.
                  </>
                ) : (
                  <>
                    Du legst{" "}
                    <strong className="font-semibold text-ink">
                      {formatEuro(-cashflow)} im Monat
                    </strong>{" "}
                    dazu.
                  </>
                )}{" "}
                Vor Steuern wären es {formatEuro(result.cashflowVorSteuerMonat)}{" "}
                im Monat.
              </>
            }
          />
        ) : (
          <NumberDisplay
            value={result.belastungMonat}
            format={formatEuro}
            suffix="pro Monat"
            caption="Rate und Nebenkosten"
            tone="ink"
            announce={`${formatEuro(result.belastungMonat)} pro Monat für Rate und Nebenkosten.`}
            hint={
              <>
                Gegenüber {formatEuro(result.ersparteMieteMonat)} Miete sind das{" "}
                <strong className="font-semibold text-ink">
                  {result.mehrbelastungMonat >= 0
                    ? `${formatEuro(result.mehrbelastungMonat)} mehr`
                    : `${formatEuro(-result.mehrbelastungMonat)} weniger`}
                </strong>{" "}
                im Monat – davon {formatEuro(result.tilgungErstesJahr / 12)}{" "}
                Tilgung, also Geld, das dir bleibt.
              </>
            }
          />
        )}
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {istAnlage ? (
          <>
            <Stat
              label="Bruttomietrendite"
              value={`${formatDecimal(result.bruttomietrendite)} %`}
              hint="Jahresmiete zum Kaufpreis"
            />
            <Stat
              label="Nettomietrendite"
              value={`${formatDecimal(result.nettomietrendite)} %`}
              hint="nach Kosten, auf die Gesamtinvestition"
            />
            <Stat
              label="Kaufpreisfaktor"
              value={formatDecimal(result.kaufpreisfaktor)}
              hint={
                result.kaufpreisfaktor > 30
                  ? "sehr hoch – trägt sich kaum"
                  : "Jahresmieten bis zum Kaufpreis"
              }
            />
            <Stat
              label="Eigenkapitalrendite"
              value={`${formatDecimal(result.eigenkapitalrendite)} %`}
              hint="nach Zinsen und Steuern, ohne Tilgung"
            />
          </>
        ) : (
          <>
            <Stat
              label="Preis je m²"
              value={formatEuro(result.preisProQm)}
              hint={`${formatInteger(result.gesamtinvestition)} € Gesamtinvestition`}
            />
            <Stat
              label="Vermögen mit Kauf"
              value={formatEuro(result.vermoegenKaufen)}
              hint={`nach ${result.horizontJahre} Jahren, nach Verkauf`}
            />
            <Stat
              label="Vermögen mit Miete"
              value={formatEuro(result.vermoegenMieten)}
              hint={`Eigenkapital zu ${formatDecimal(state.alternativrenditePercent)} % angelegt`}
            />
            <Stat
              label={
                result.vorteilKaufen >= 0 ? "Vorteil Kaufen" : "Vorteil Mieten"
              }
              value={formatEuro(Math.abs(result.vorteilKaufen))}
              hint={`Unterschied nach ${result.horizontJahre} Jahren`}
            />
          </>
        )}

        <Stat
          label="Monatsrate"
          value={formatEuro(result.monatsrate)}
          hint={`${formatEuro(result.zinsErstesJahr / 12)} Zins, ${formatEuro(result.tilgungErstesJahr / 12)} Tilgung`}
        />
        <Stat
          label="Beleihungsauslauf"
          value={`${formatDecimal(result.beleihungsauslauf)} %`}
          hint={`${formatEuro(result.darlehen)} Darlehen`}
        />
        <Stat
          label={`Restschuld nach ${state.zinsbindungJahre} Jahren`}
          value={formatEuro(result.restschuldZinsbindung)}
          hint={
            result.volltilgungJahre === null
              ? "wird ohne Tilgung nie weniger"
              : `schuldenfrei nach ${formatDecimal(result.volltilgungJahre)} Jahren`
          }
        />
        {istAnlage ? (
          <Stat
            label="Gesamtrendite pro Jahr"
            value={
              result.gesamtrenditeProJahr === null
                ? "–"
                : `${formatDecimal(result.gesamtrenditeProJahr)} %`
            }
            hint={`über ${result.horizontJahre} Jahre, inklusive Verkauf`}
          />
        ) : (
          <Stat
            label="Zinsen bis Zinsbindungsende"
            value={formatEuro(result.zinsenBisZinsbindung)}
            hint={`${formatEuro(result.gesamtzinsen)} bis zur vollen Tilgung`}
          />
        )}
      </dl>

      <section aria-labelledby="im-kosten" className="surface-soft p-6">
        <h2
          id="im-kosten"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Was der Kauf wirklich kostet
        </h2>
        <ul className="mt-4 flex flex-col gap-2 text-[15px]">
          <AmountRow label="Kaufpreis" value={state.kaufpreis} />
          <AmountRow
            label={`Grunderwerbsteuer (${formatDecimal(state.grestPercent)} %)`}
            value={result.grunderwerbsteuer}
          />
          <AmountRow
            label={`Notar und Grundbuch (${formatDecimal(state.notarPercent)} %)`}
            value={result.notarUndGrundbuch}
          />
          <AmountRow
            label={`Maklerprovision (${formatDecimal(state.maklerPercent)} %)`}
            value={result.maklerprovision}
          />
          {result.modernisierung > 0 && (
            <AmountRow label="Modernisierung" value={result.modernisierung} />
          )}
          <AmountRow
            label="Gesamtinvestition"
            value={result.gesamtinvestition}
            stark
          />
          <AmountRow
            label="davon Eigenkapital"
            value={result.eigenkapitalEingesetzt}
          />
          <AmountRow label="davon Darlehen" value={result.darlehen} />
        </ul>
        <p className="mt-4 text-[13px] text-muted">
          Die Kaufnebenkosten von {formatEuro(result.nebenkosten)} entsprechen{" "}
          {formatDecimal(result.nebenkostenQuote)} Prozent des Kaufpreises. Sie
          sind zum Notartermin fällig und werden von Banken in aller Regel nicht
          mitfinanziert.
        </p>
      </section>

      <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-semibold transition-colors duration-(--dur-fast) hover:bg-ink-soft">
          Jahr für Jahr ansehen
          <ChevronDown
            className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-[44rem] border-collapse text-[13px]">
            <caption className="sr-only">
              Jahresverlauf von Zins, Tilgung, Restschuld und Vermögen
            </caption>
            <thead>
              <tr className="text-left text-muted">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Jahr
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  Zins
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  Tilgung
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  Restschuld
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  Wert
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-semibold">
                  {istAnlage ? "Cashflow" : "Ggü. Miete"}
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Vermögen
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {result.jahre.map((zeile) => (
                <tr key={zeile.jahr} className="border-t border-line">
                  <th scope="row" className="py-2 pr-3 text-left font-semibold">
                    {zeile.jahr}
                  </th>
                  <td className="py-2 pr-3 text-right">
                    {formatEuro(zeile.zins)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {formatEuro(zeile.tilgung)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {formatEuro(zeile.restschuld)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {formatEuro(zeile.immobilienwert)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {formatEuro(zeile.cashflow)}
                  </td>
                  <td className="py-2 text-right">
                    {formatEuro(zeile.vermoegen)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[13px] text-muted">
            Nach dem Ende der Zinsbindung wird mit demselben Zinssatz
            weitergerechnet. Miete und Bewirtschaftungskosten steigen mit{" "}
            {formatDecimal(state.mietsteigerungPercent)} Prozent pro Jahr.
          </p>
        </div>
      </details>

      {istAnlage && (
        <section
          aria-labelledby="im-verkauf-titel"
          className="surface-soft p-6"
        >
          <h2
            id="im-verkauf-titel"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Verkauf nach {result.horizontJahre} Jahren
          </h2>
          <ul className="mt-4 flex flex-col gap-2 text-[15px]">
            <AmountRow
              label="Immobilienwert"
              value={result.immobilienwertEnde}
            />
            <AmountRow label="Verkaufskosten" value={-result.verkaufskosten} />
            <AmountRow label="Restschuld" value={-result.restschuldEnde} />
            {result.spekulationssteuer > 0 && (
              <AmountRow
                label="Steuer auf den Veräußerungsgewinn"
                value={-result.spekulationssteuer}
              />
            )}
            <AmountRow
              label="Netto-Verkaufserlös"
              value={result.nettoVerkaufserloes}
              stark
            />
            <AmountRow
              label={`Cashflow über ${result.horizontJahre} Jahre`}
              value={result.kumulierterCashflow}
            />
            <AmountRow
              label="Eingesetztes Eigenkapital"
              value={-result.eigenkapitalEingesetzt}
            />
            <AmountRow
              label="Vermögenszuwachs"
              value={result.vermoegenszuwachs}
              stark
            />
          </ul>
        </section>
      )}

      {result.warnings.length > 0 && (
        <section aria-labelledby="im-hinweise" className="surface-soft p-6">
          <h2
            id="im-hinweise"
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

      <AffiliateBlock slots={immobilienAffiliate} result={result} />
    </div>
  );
}
