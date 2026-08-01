"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, Select, Stepper, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { PayoffDisplay, type PayoffTone } from "@/components/ui/PayoffDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro, formatInteger } from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { aktienAffiliate } from "./affiliate";
import {
  formatKennzahl,
  isKennzahlKey,
  kennzahlGruppen,
  kennzahlen,
  kennzahlenDerGruppe,
  tendenzText,
  type KennzahlDef,
  type KennzahlKey,
  type Tendenz,
} from "./kennzahlen";
import {
  calculateAktie,
  defaultInput,
  type AktienInput,
  type AktienResult,
} from "./logic";

/**
 * Der Zustand ist die Eingabe der Rechenlogik plus die Kennzahl, die groß
 * dasteht. Welche das ist, entscheidet der Besucher – oder die SEO-Variante,
 * über die er hereinkommt.
 */
interface State extends Record<string, unknown>, AktienInput {
  fokus: KennzahlKey;
}

const DEFAULTS: State = { ...defaultInput(), fokus: "kgv" };

/** Farbe der Payoff-Zahl nach Einordnung – ohne Einordnung neutrale Tinte. */
const tendenzTon: Record<Tendenz, PayoffTone> = {
  gut: "positive",
  neutral: "ink",
  schwach: "accent",
};

/**
 * Deutsches Zahlenformat lesen – mit Vorzeichen und mit Tausenderpunkten.
 *
 * Anders als bei den übrigen Rechnern sind negative Werte hier keine
 * Fehleingabe: Verlustjahre, negatives Eigenkapital und schrumpfende Gewinne
 * gehören zum Gegenstand. Und weil Zahlen aus einem Geschäftsbericht kopiert
 * werden, muss „4.800“ viertausendachthundert bedeuten und nicht 4,8.
 *
 * `null` heißt „noch keine lesbare Zahl“ – etwa während des Tippens, wenn erst
 * das Minuszeichen steht. Nur so lässt sich ein negativer Wert überhaupt
 * eingeben, ohne dass das erste Zeichen sofort verworfen wird.
 */
export function parseZahl(text: string): number | null {
  const roh = text.trim().replace(/[\s€%]/g, "");
  if (roh === "") return null;

  const normalisiert = roh.includes(",")
    ? roh.replace(/\./g, "").replace(",", ".")
    : /^-?\d{1,3}(\.\d{3})+$/.test(roh)
      ? roh.replace(/\./g, "")
      : roh;

  if (!/^-?\d*\.?\d*$/.test(normalisiert)) return null;
  const parsed = Number(normalisiert);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Wert aus URL oder Variante lesen; alles Unbrauchbare fällt auf `fallback`. */
function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = typeof value === "string" ? parseZahl(value) : Number(value);
  return parsed !== null && Number.isFinite(parsed) ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    fokus: isKennzahlKey(params?.fokus) ? params.fokus : DEFAULTS.fokus,
  };
}

export default function AktienkennzahlenTool({
  params,
}: {
  params?: ToolParams;
}) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const fokus = search.get("fokus");

      return {
        ...fallback,
        fokus: isKennzahlKey(fokus) ? fokus : fallback.fokus,
        kurs: toNumber(search.get("kurs"), fallback.kurs),
        aktienMio: toNumber(search.get("aktien"), fallback.aktienMio),
        umsatzMio: toNumber(search.get("umsatz"), fallback.umsatzMio),
        ebitdaMio: toNumber(search.get("ebitda"), fallback.ebitdaMio),
        ebitMio: toNumber(search.get("ebit"), fallback.ebitMio),
        gewinnMio: toNumber(search.get("gewinn"), fallback.gewinnMio),
        eigenkapitalMio: toNumber(search.get("ek"), fallback.eigenkapitalMio),
        bilanzsummeMio: toNumber(search.get("bilanz"), fallback.bilanzsummeMio),
        finanzschuldenMio: toNumber(
          search.get("schulden"),
          fallback.finanzschuldenMio,
        ),
        liquiditaetMio: toNumber(search.get("cash"), fallback.liquiditaetMio),
        umlaufvermoegenMio: toNumber(
          search.get("uv"),
          fallback.umlaufvermoegenMio,
        ),
        kurzfristigeVerbindlichkeitenMio: toNumber(
          search.get("kv"),
          fallback.kurzfristigeVerbindlichkeitenMio,
        ),
        zinsaufwandMio: toNumber(search.get("zins"), fallback.zinsaufwandMio),
        operativerCashflowMio: toNumber(
          search.get("ocf"),
          fallback.operativerCashflowMio,
        ),
        investitionenMio: toNumber(search.get("capex"), fallback.investitionenMio),
        dividendeJeAktie: toNumber(search.get("div"), fallback.dividendeJeAktie),
        gewinnwachstumPercent: toNumber(
          search.get("wachstum"),
          fallback.gewinnwachstumPercent,
        ),
        faireKgv: toNumber(search.get("fkgv"), fallback.faireKgv),
        renditeanspruchPercent: toNumber(
          search.get("anspruch"),
          fallback.renditeanspruchPercent,
        ),
        horizontJahre: toNumber(search.get("jahre"), fallback.horizontJahre),
      };
    },
    // Nur Abweichungen vom Default landen in der URL – bei zwanzig Feldern
    // wäre ein vollständiger Query-String nicht mehr teilbar.
    serialize: (next) => ({
      fokus: diff(next.fokus, DEFAULTS.fokus),
      kurs: diff(next.kurs, DEFAULTS.kurs),
      aktien: diff(next.aktienMio, DEFAULTS.aktienMio),
      umsatz: diff(next.umsatzMio, DEFAULTS.umsatzMio),
      ebitda: diff(next.ebitdaMio, DEFAULTS.ebitdaMio),
      ebit: diff(next.ebitMio, DEFAULTS.ebitMio),
      gewinn: diff(next.gewinnMio, DEFAULTS.gewinnMio),
      ek: diff(next.eigenkapitalMio, DEFAULTS.eigenkapitalMio),
      bilanz: diff(next.bilanzsummeMio, DEFAULTS.bilanzsummeMio),
      schulden: diff(next.finanzschuldenMio, DEFAULTS.finanzschuldenMio),
      cash: diff(next.liquiditaetMio, DEFAULTS.liquiditaetMio),
      uv: diff(next.umlaufvermoegenMio, DEFAULTS.umlaufvermoegenMio),
      kv: diff(
        next.kurzfristigeVerbindlichkeitenMio,
        DEFAULTS.kurzfristigeVerbindlichkeitenMio,
      ),
      zins: diff(next.zinsaufwandMio, DEFAULTS.zinsaufwandMio),
      ocf: diff(next.operativerCashflowMio, DEFAULTS.operativerCashflowMio),
      capex: diff(next.investitionenMio, DEFAULTS.investitionenMio),
      div: diff(next.dividendeJeAktie, DEFAULTS.dividendeJeAktie),
      wachstum: diff(next.gewinnwachstumPercent, DEFAULTS.gewinnwachstumPercent),
      fkgv: diff(next.faireKgv, DEFAULTS.faireKgv),
      anspruch: diff(
        next.renditeanspruchPercent,
        DEFAULTS.renditeanspruchPercent,
      ),
      jahre: diff(next.horizontJahre, DEFAULTS.horizontJahre),
    }),
  });

  const result = useMemo(() => calculateAktie(state), [state]);

  const fokusDef = kennzahlen[state.fokus];
  const fokusWert = fokusDef.select(result);

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Kurs und Aktien">
        <CardTitle>Kurs und Aktien</CardTitle>
        <p className="mt-1 text-[13px] text-muted">
          Die beiden Zahlen, aus denen der Börsenwert entsteht. Alle folgenden
          Angaben in Millionen Euro – so, wie sie im Geschäftsbericht stehen.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Aktueller Kurs" htmlFor="ak-kurs">
            <UnitInput
              id="ak-kurs"
              unit="€"
              value={state.kurs}
              onChange={(kurs) => update({ kurs })}
            />
          </Field>

          <Field
            label="Anzahl Aktien"
            htmlFor="ak-aktien"
            hint="Im Geschäftsbericht als „ausgegebene Aktien“ oder im Anhang zum Ergebnis je Aktie."
          >
            <UnitInput
              id="ak-aktien"
              unit="Mio. Stück"
              value={state.aktienMio}
              onChange={(aktienMio) => update({ aktienMio })}
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Gewinn- und Verlustrechnung">
        <CardTitle>Gewinn- und Verlustrechnung</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Umsatz" htmlFor="ak-umsatz">
            <UnitInput
              id="ak-umsatz"
              unit="Mio. €"
              value={state.umsatzMio}
              onChange={(umsatzMio) => update({ umsatzMio })}
            />
          </Field>

          <Field
            label="EBITDA"
            htmlFor="ak-ebitda"
            hint="Operatives Ergebnis vor Abschreibungen."
          >
            <UnitInput
              id="ak-ebitda"
              unit="Mio. €"
              value={state.ebitdaMio}
              onChange={(ebitdaMio) => update({ ebitdaMio })}
            />
          </Field>

          <Field
            label="EBIT"
            htmlFor="ak-ebit"
            hint="Operatives Ergebnis nach Abschreibungen, vor Zinsen und Steuern."
          >
            <UnitInput
              id="ak-ebit"
              unit="Mio. €"
              value={state.ebitMio}
              onChange={(ebitMio) => update({ ebitMio })}
            />
          </Field>

          <Field
            label="Jahresüberschuss"
            htmlFor="ak-gewinn"
            hint="Gewinn nach Steuern. Verluste mit Minus eintragen."
          >
            <UnitInput
              id="ak-gewinn"
              unit="Mio. €"
              value={state.gewinnMio}
              onChange={(gewinnMio) => update({ gewinnMio })}
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Bilanz">
        <CardTitle>Bilanz</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Eigenkapital" htmlFor="ak-ek">
            <UnitInput
              id="ak-ek"
              unit="Mio. €"
              value={state.eigenkapitalMio}
              onChange={(eigenkapitalMio) => update({ eigenkapitalMio })}
            />
          </Field>

          <Field label="Bilanzsumme" htmlFor="ak-bilanz">
            <UnitInput
              id="ak-bilanz"
              unit="Mio. €"
              value={state.bilanzsummeMio}
              onChange={(bilanzsummeMio) => update({ bilanzsummeMio })}
            />
          </Field>

          <Field
            label="Finanzschulden"
            htmlFor="ak-schulden"
            hint="Nur zinstragende Schulden: Bankdarlehen und Anleihen."
          >
            <UnitInput
              id="ak-schulden"
              unit="Mio. €"
              value={state.finanzschuldenMio}
              onChange={(finanzschuldenMio) => update({ finanzschuldenMio })}
            />
          </Field>

          <Field
            label="Liquide Mittel"
            htmlFor="ak-cash"
            hint="Kasse, Bankguthaben und kurzfristige Wertpapiere."
          >
            <UnitInput
              id="ak-cash"
              unit="Mio. €"
              value={state.liquiditaetMio}
              onChange={(liquiditaetMio) => update({ liquiditaetMio })}
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Cashflow und Dividende">
        <CardTitle>Cashflow und Dividende</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Operativer Cashflow"
            htmlFor="ak-ocf"
            hint="Aus der Kapitalflussrechnung, nicht aus der Bilanz."
          >
            <UnitInput
              id="ak-ocf"
              unit="Mio. €"
              value={state.operativerCashflowMio}
              onChange={(operativerCashflowMio) =>
                update({ operativerCashflowMio })
              }
            />
          </Field>

          <Field
            label="Investitionen"
            htmlFor="ak-capex"
            hint="Zugänge im Anlagevermögen (CapEx), positiv eintragen."
          >
            <UnitInput
              id="ak-capex"
              unit="Mio. €"
              value={state.investitionenMio}
              onChange={(investitionenMio) => update({ investitionenMio })}
            />
          </Field>

          <Field
            label="Dividende je Aktie"
            htmlFor="ak-div"
            hint="Die für das Geschäftsjahr vorgeschlagene Dividende. Keine Dividende: 0."
          >
            <UnitInput
              id="ak-div"
              unit="€"
              value={state.dividendeJeAktie}
              onChange={(dividendeJeAktie) => update({ dividendeJeAktie })}
            />
          </Field>
        </div>
      </Card>

      <Klapp
        title="Weitere Bilanzposten"
        hint="Für Liquiditätsgrad und Zinsdeckung"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Umlaufvermögen"
            htmlFor="ak-uv"
            hint="Vorräte, Forderungen und liquide Mittel zusammen."
          >
            <UnitInput
              id="ak-uv"
              unit="Mio. €"
              value={state.umlaufvermoegenMio}
              onChange={(umlaufvermoegenMio) => update({ umlaufvermoegenMio })}
            />
          </Field>

          <Field
            label="Kurzfristige Verbindlichkeiten"
            htmlFor="ak-kv"
            hint="Fällig innerhalb eines Jahres."
          >
            <UnitInput
              id="ak-kv"
              unit="Mio. €"
              value={state.kurzfristigeVerbindlichkeitenMio}
              onChange={(kurzfristigeVerbindlichkeitenMio) =>
                update({ kurzfristigeVerbindlichkeitenMio })
              }
            />
          </Field>

          <Field
            label="Zinsaufwand"
            htmlFor="ak-zins"
            hint="Zinsen und ähnliche Aufwendungen des Jahres."
          >
            <UnitInput
              id="ak-zins"
              unit="Mio. €"
              value={state.zinsaufwandMio}
              onChange={(zinsaufwandMio) => update({ zinsaufwandMio })}
            />
          </Field>
        </div>
      </Klapp>

      <Klapp
        title="Annahmen für Bewertung und Prognose"
        hint="Wachstum, faires KGV, Renditeanspruch, Horizont"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Gewinnwachstum pro Jahr"
            htmlFor="ak-wachstum"
            hint="Erwartung für die kommenden Jahre. Grundlage von PEG, Kursziel und erwarteter Rendite."
          >
            <UnitInput
              id="ak-wachstum"
              unit="%"
              value={state.gewinnwachstumPercent}
              onChange={(gewinnwachstumPercent) =>
                update({ gewinnwachstumPercent })
              }
            />
          </Field>

          <Field
            label="Faires KGV"
            htmlFor="ak-fkgv"
            hint="Welche Bewertung du dem Unternehmen zutraust – der Anker für fairen Wert und Kursziel."
          >
            <UnitInput
              id="ak-fkgv"
              unit="fach"
              value={state.faireKgv}
              onChange={(faireKgv) => update({ faireKgv })}
            />
          </Field>

          <Field
            label="Eigener Renditeanspruch"
            htmlFor="ak-anspruch"
            hint="Diskontsatz für das Dividendenmodell. Langfristig bringt ein breiter Aktienindex rund 7 Prozent."
          >
            <UnitInput
              id="ak-anspruch"
              unit="%"
              value={state.renditeanspruchPercent}
              onChange={(renditeanspruchPercent) =>
                update({ renditeanspruchPercent })
              }
            />
          </Field>

          <Field label="Anlagehorizont" htmlFor="ak-jahre">
            <Stepper
              id="ak-jahre"
              value={state.horizontJahre}
              min={1}
              max={30}
              onChange={(horizontJahre) => update({ horizontJahre })}
              suffix="Jahre"
              ariaLabel="Anlagehorizont in Jahren"
            />
          </Field>
        </div>
      </Klapp>

      <Card as="section" className="p-6" aria-label="Kennzahl im Fokus">
        <Field
          label="Kennzahl im Fokus"
          htmlFor="ak-fokus"
          hint="Steht groß im Ergebnis. Alle anderen Kennzahlen stehen darunter."
        >
          <Select
            id="ak-fokus"
            value={state.fokus}
            onChange={(event) => {
              const fokus = event.target.value;
              if (isKennzahlKey(fokus)) update({ fokus });
            }}
          >
            {kennzahlGruppen.map((gruppe) => (
              <optgroup key={gruppe.key} label={gruppe.titel}>
                {kennzahlenDerGruppe(gruppe.key).map((key) => (
                  <option key={key} value={key}>
                    {kennzahlen[key].label}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Aktien-Kennzahlen"
            text={`${fokusDef.label}: ${formatKennzahl(fokusDef.einheit, fokusWert)}`}
          />
        }
      >
        <Fokuszahl def={fokusDef} wert={fokusWert} result={result} />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Börsenwert"
          value={mio(result.marktkapitalisierungMio)}
          hint={`${formatEuro(state.kurs)} × ${formatDecimal(state.aktienMio)} Mio. Aktien`}
        />
        <Stat
          label="Unternehmenswert"
          value={mio(result.enterpriseValueMio)}
          hint="Börsenwert plus Nettoschulden"
        />
        <Stat
          label={
            result.nettofinanzschuldenMio < 0 ? "Netto-Liquidität" : "Nettoschulden"
          }
          value={mio(Math.abs(result.nettofinanzschuldenMio))}
          hint={
            result.nettoschuldenEbitda === null
              ? "Schulden minus liquide Mittel"
              : `${formatDecimal(result.nettoschuldenEbitda)}-faches EBITDA`
          }
        />
        <Stat
          label="Freier Cashflow"
          value={mio(result.freeCashflowMio)}
          hint={
            result.fcfRendite === null
              ? "operativer Cashflow minus Investitionen"
              : `${formatDecimal(result.fcfRendite)} % auf den Kurs`
          }
        />
      </dl>

      {kennzahlGruppen.map((gruppe) => (
        <section
          key={gruppe.key}
          aria-labelledby={`ak-gruppe-${gruppe.key}`}
          className="surface-soft p-6"
        >
          <h2
            id={`ak-gruppe-${gruppe.key}`}
            className="font-display text-lg font-semibold tracking-tight"
          >
            {gruppe.titel}
          </h2>
          <p className="mt-1 text-[13px] text-muted">{gruppe.hint}</p>

          <ul className="mt-4 flex flex-col">
            {kennzahlenDerGruppe(gruppe.key).map((key) => (
              <Kennzahlzeile
                key={key}
                def={kennzahlen[key]}
                wert={kennzahlen[key].select(result)}
                fokussiert={key === state.fokus}
              />
            ))}
          </ul>
        </section>
      ))}

      <section aria-labelledby="ak-fair" className="surface-soft p-6">
        <h2
          id="ak-fair"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Fairer Wert je Aktie
        </h2>
        <p className="mt-1 text-[13px] text-muted">
          Drei Verfahren, die von verschiedenen Seiten auf dasselbe Unternehmen
          schauen. Weichen sie stark voneinander ab, ist das die eigentliche
          Information.
        </p>

        <ul className="mt-4 flex flex-col gap-2 text-[15px]">
          <Posten
            label={`KGV-Modell (${formatDecimal(state.faireKgv)}-faches Ergebnis)`}
            value={result.fairerWertKgv}
          />
          <Posten label="Graham-Zahl (Gewinn und Substanz)" value={result.fairerWertGraham} />
          <Posten
            label="Dividendenmodell (Gordon)"
            value={result.fairerWertDividende}
          />
          <Posten label="Mittel der Verfahren" value={result.fairerWertSchnitt} stark />
          <Posten label="Aktueller Kurs" value={state.kurs} />
        </ul>

        <p className="mt-4 text-[15px]">
          {result.abweichungProzent === null ? (
            <>
              Mit diesen Angaben lässt sich kein fairer Wert bilden. Alle drei
              Verfahren brauchen einen Gewinn, eine Substanz oder eine Dividende,
              an die sie anknüpfen können.
            </>
          ) : (
            <>
              Der Kurs liegt{" "}
              <strong className="font-semibold">
                {formatDecimal(Math.abs(result.abweichungProzent))} Prozent{" "}
                {result.abweichungProzent >= 0 ? "unter" : "über"}
              </strong>{" "}
              dem Mittel der Verfahren. Die Spannweite reicht von{" "}
              {formatEuro(result.fairerWertMin ?? 0)} bis{" "}
              {formatEuro(result.fairerWertMax ?? 0)} je Aktie.
            </>
          )}
        </p>
        <p className="mt-3 text-[13px] text-muted">
          Jedes dieser Verfahren ist eine Annahme in Zahlenform, keine Prognose.
          Die Graham-Zahl fällt bei substanzarmen Geschäftsmodellen strukturell
          niedrig aus, das KGV-Modell hängt vollständig am eingetragenen fairen
          KGV, und das Dividendenmodell reagiert extrem auf den Abstand zwischen
          Renditeanspruch und Wachstum. Keine Anlageberatung.
        </p>
      </section>

      <section aria-labelledby="ak-erwartung" className="surface-soft p-6">
        <h2
          id="ak-erwartung"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Was daraus in {result.horizontJahre} Jahren wird
        </h2>
        <p className="mt-1 text-[13px] text-muted">
          Gewinn und Dividende wachsen mit{" "}
          {formatDecimal(state.gewinnwachstumPercent)} Prozent pro Jahr, am Ende
          gilt das faire KGV von {formatDecimal(state.faireKgv)}. Dividenden
          werden addiert, aber nicht wieder angelegt.
        </p>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Stat
            label="Gewinn je Aktie am Ende"
            value={formatKennzahl("euro", result.gewinnJeAktieEnde)}
            hint={`heute ${formatKennzahl("euro", result.gewinnJeAktie)}`}
          />
          <Stat
            label="Kurs bei fairem KGV"
            value={formatKennzahl("euro", result.kursErwartetEnde)}
            hint={`heute ${formatEuro(state.kurs)}`}
          />
          <Stat
            label="Dividenden zusammen"
            value={formatKennzahl("euro", result.dividendenSumme)}
            hint={`über ${result.horizontJahre} Jahre, je Aktie`}
          />
          <Stat
            label="Erwartete Rendite"
            value={
              result.erwarteteRenditeProJahr === null
                ? "–"
                : `${formatDecimal(result.erwarteteRenditeProJahr)} %`
            }
            hint="pro Jahr, inklusive Dividenden"
          />
        </dl>

        {result.jahre.length > 0 && (
          <details className="group mt-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-control bg-ink-soft px-4 py-3 text-[15px] font-semibold transition-colors duration-(--dur-fast) hover:bg-accent-soft">
              Jahr für Jahr ansehen
              <ChevronDown
                className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-[13px]">
                <caption className="sr-only">
                  Projektion von Gewinn, Dividende und Kurs je Aktie
                </caption>
                <thead>
                  <tr className="text-left text-muted">
                    <th scope="col" className="py-2 pr-3 font-semibold">
                      Jahr
                    </th>
                    <th scope="col" className="py-2 pr-3 text-right font-semibold">
                      Gewinn/Aktie
                    </th>
                    <th scope="col" className="py-2 pr-3 text-right font-semibold">
                      Dividende
                    </th>
                    <th scope="col" className="py-2 pr-3 text-right font-semibold">
                      Kurs
                    </th>
                    <th scope="col" className="py-2 text-right font-semibold">
                      Kurs + Dividenden
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
                        {formatEuro(zeile.gewinnJeAktie)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {formatEuro(zeile.dividende)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {formatEuro(zeile.kurs)}
                      </td>
                      <td className="py-2 text-right">
                        {formatEuro(zeile.gesamtwert)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="ak-hinweise" className="surface-soft p-6">
          <h2
            id="ak-hinweise"
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

      <AffiliateBlock slots={aktienAffiliate} result={result} />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Bausteine
 * ------------------------------------------------------------------------- */

/** Leerer String heißt: Schlüssel aus der URL entfernen. */
function diff(value: string | number, fallback: string | number): string {
  return value === fallback ? "" : String(value);
}

/** Millionenbetrag mit Einheit – Cent wären hier nur Rauschen. */
const mio = (wert: number) => `${formatInteger(wert)} Mio. €`;

/**
 * Die Payoff-Zahl: die fokussierte Kennzahl, ihre Einordnung und ein Satz
 * dazu, was sie bedeutet.
 *
 * Lässt sie sich nicht bilden, steht dort ein Gedankenstrich statt einer Null
 * – und der Grund darunter. Dafür kommt `PayoffDisplay` direkt zum Einsatz:
 * `NumberDisplay` zählt Zahlen hoch, und ein Gedankenstrich ist keine.
 */
function Fokuszahl({
  def,
  wert,
  result,
}: {
  def: KennzahlDef;
  wert: number | null;
  result: AktienResult;
}) {
  const tendenz = wert !== null && def.bewerten ? def.bewerten(wert) : null;
  const einordnung = tendenz ? tendenzText(def.skala, tendenz) : null;

  const hint = (
    <>
      {def.erklaerung}
      {einordnung && (
        <>
          {" "}
          Nach den üblichen Faustwerten ist das{" "}
          <strong className="font-semibold text-ink">{einordnung}</strong>.
        </>
      )}
    </>
  );

  if (wert === null) {
    return (
      <PayoffDisplay
        value="–"
        caption={def.label}
        tone="ink"
        announce={`${def.label} lässt sich mit diesen Angaben nicht bilden.`}
        hint={
          <>
            {def.erklaerung} Mit den eingetragenen Zahlen lässt sich diese
            Kennzahl nicht bilden – {grundFehlt(def, result)}
          </>
        }
      />
    );
  }

  return (
    <NumberDisplay
      value={wert}
      format={(n) => formatKennzahl(def.einheit, n)}
      caption={def.label}
      tone={tendenz ? tendenzTon[tendenz] : "ink"}
      announce={`${def.label}: ${formatKennzahl(def.einheit, wert)}${einordnung ? `, ${einordnung}` : ""}.`}
      hint={hint}
    />
  );
}

/**
 * Warum eine Kennzahl fehlt, in Nutzersprache.
 *
 * Ein Gedankenstrich ohne Erklärung liest sich wie ein Fehler der Seite. In
 * fast allen Fällen fehlt genau eine Voraussetzung: ein positiver Gewinn, ein
 * positives Eigenkapital, ein Kurs oder eine Wachstumsannahme.
 */
function grundFehlt(def: KennzahlDef, result: AktienResult): string {
  if (result.marktkapitalisierungMio === 0) {
    return "es fehlen Kurs oder Aktienanzahl.";
  }
  if (def.gruppe === "bewertung" && result.gewinnJeAktie === null) {
    return "ohne Aktienanzahl gibt es keine Angabe je Aktie.";
  }
  if (
    (def.label.includes("Gewinn") || def.label.includes("PEG")) &&
    (result.gewinnJeAktie === null || result.gewinnJeAktie <= 0)
  ) {
    return "sie setzt einen Gewinn voraus, und das Unternehmen weist keinen aus.";
  }
  return "eine der Bezugsgrößen ist null oder negativ. Die Erklärung dazu steht unter „Auffällig“.";
}

/** Eine Zeile im Kennzahlenblock: Name, Formel, Wert, Einordnung. */
function Kennzahlzeile({
  def,
  wert,
  fokussiert,
}: {
  def: KennzahlDef;
  wert: number | null;
  fokussiert: boolean;
}) {
  const tendenz = wert !== null && def.bewerten ? def.bewerten(wert) : null;

  return (
    <li
      className={`flex items-start justify-between gap-4 border-t border-line py-3 first:border-t-0 ${
        fokussiert ? "-mx-3 rounded-control bg-accent-soft px-3" : ""
      }`}
    >
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold">{def.label}</span>
        <span className="block text-[13px] text-muted">{def.formel}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-mono text-[15px] font-semibold tabular-nums">
          {formatKennzahl(def.einheit, wert)}
        </span>
        {tendenz && <Badge tendenz={tendenz} text={tendenzText(def.skala, tendenz)} />}
      </span>
    </li>
  );
}

/**
 * Die Einordnung als Pille. Es gibt bewusst kein Rot im Design – auffällige
 * Werte tragen die Akzentfarbe, die auch die Hinweise markiert.
 */
function Badge({ tendenz, text }: { tendenz: Tendenz; text: string }) {
  const styles: Record<Tendenz, string> = {
    gut: "bg-positive-soft text-positive",
    neutral: "bg-ink-soft text-muted",
    schwach: "bg-accent-soft text-accent",
  };

  return (
    <span
      className={`mt-1 inline-block rounded-pill px-2 py-0.5 text-[12px] font-semibold ${styles[tendenz]}`}
    >
      {text}
    </span>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg font-semibold tracking-tight">
      {children}
    </h2>
  );
}

/**
 * Eingaben, die nicht jeder braucht, bleiben eingeklappt. Zwanzig Felder
 * gleichzeitig zu zeigen würde abschrecken, obwohl die Voreinstellungen für
 * einen ersten Überblick schon reichen.
 */
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

/**
 * Zahleneingabe mit Einheit im Feld.
 *
 * Solange getippt wird, gilt der rohe Text; erst beim Verlassen des Feldes
 * gewinnt der Zustand die Darstellung zurück. Ohne diesen Zwischenschritt
 * ließe sich kein negativer Wert eingeben: Ein einzelnes Minuszeichen ist noch
 * keine Zahl und würde sofort verworfen.
 */
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
  const [roh, setRoh] = useState<string | null>(null);

  return (
    <div className="relative">
      <TextInput
        id={id}
        type="text"
        inputMode="decimal"
        value={roh ?? String(value).replace(".", ",")}
        onChange={(event) => {
          const text = event.target.value;
          setRoh(text);
          const parsed = parseZahl(text);
          if (parsed !== null) onChange(parsed);
        }}
        onBlur={() => setRoh(null)}
        className="pr-28 font-mono"
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

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
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

/** Eine Zeile der Aufstellung – Label links, Betrag rechts in Mono. */
function Posten({
  label,
  value,
  stark = false,
}: {
  label: string;
  value: number | null;
  stark?: boolean;
}) {
  return (
    <li
      className={`flex items-baseline justify-between gap-4 ${
        stark ? "border-t border-line pt-2 font-semibold" : ""
      }`}
    >
      <span className={stark ? "" : "text-muted"}>{label}</span>
      <span className="font-mono tabular-nums">
        {formatKennzahl("euro", value)}
      </span>
    </li>
  );
}
