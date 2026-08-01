"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card, Disclosure } from "@/components/ui/Card";
import { Field, Stepper, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { isValidIso, todayIso } from "@/lib/date";
import { toEuro } from "@/lib/finanzmath";
import { formatEuro, plural } from "@/lib/format";
import { urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { urlaubsbudgetAffiliate } from "./affiliate";
import {
  calculateUrlaub,
  defaultInput,
  monateBis,
  type UrlaubInput,
} from "./logic";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, UrlaubInput {}

const DEFAULTS: State = { ...defaultInput() };

/**
 * Deutsches Dezimalkomma erlauben; alles Unbrauchbare fällt auf `fallback`.
 *
 * Der fehlende Wert muss ausdrücklich abgefangen werden: `URLSearchParams.get`
 * liefert `null`, wenn ein Schlüssel nicht in der URL steht, und `Number(null)`
 * ist 0 – ohne diese Prüfung würde ein geteilter Link jedes nicht enthaltene
 * Feld auf null setzen.
 */
function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    erwachsene: toNumber(params?.erw, DEFAULTS.erwachsene),
    kinder: toNumber(params?.kind, DEFAULTS.kinder),
    kindFaktorPercent: toNumber(params?.kf, DEFAULTS.kindFaktorPercent),
    naechte: toNumber(params?.naechte, DEFAULTS.naechte),
    anreiseGesamt: toNumber(params?.anreise, DEFAULTS.anreiseGesamt),
    anreiseProPerson: toNumber(params?.anreisepp, DEFAULTS.anreiseProPerson),
    unterkunftProNacht: toNumber(params?.nacht, DEFAULTS.unterkunftProNacht),
    verpflegungProPersonTag: toNumber(
      params?.essen,
      DEFAULTS.verpflegungProPersonTag,
    ),
    aktivitaetenProPersonTag: toNumber(
      params?.aktiv,
      DEFAULTS.aktivitaetenProPersonTag,
    ),
    transportVorOrtGesamt: toNumber(
      params?.transport,
      DEFAULTS.transportVorOrtGesamt,
    ),
    versicherungGesamt: toNumber(params?.vers, DEFAULTS.versicherungGesamt),
    pufferPercent: toNumber(params?.puffer, DEFAULTS.pufferPercent),
    ruecklageVorhanden: toNumber(
      params?.ruecklage,
      DEFAULTS.ruecklageVorhanden,
    ),
    monateBisAbreise: toNumber(params?.monate, DEFAULTS.monateBisAbreise),
  };
}

export default function UrlaubsbudgetTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      ...fallback,
      erwachsene: toNumber(search.get("erw"), fallback.erwachsene),
      kinder: toNumber(search.get("kind"), fallback.kinder),
      kindFaktorPercent: toNumber(search.get("kf"), fallback.kindFaktorPercent),
      naechte: toNumber(search.get("naechte"), fallback.naechte),
      anreiseGesamt: toNumber(search.get("anreise"), fallback.anreiseGesamt),
      anreiseProPerson: toNumber(
        search.get("anreisepp"),
        fallback.anreiseProPerson,
      ),
      unterkunftProNacht: toNumber(
        search.get("nacht"),
        fallback.unterkunftProNacht,
      ),
      verpflegungProPersonTag: toNumber(
        search.get("essen"),
        fallback.verpflegungProPersonTag,
      ),
      aktivitaetenProPersonTag: toNumber(
        search.get("aktiv"),
        fallback.aktivitaetenProPersonTag,
      ),
      transportVorOrtGesamt: toNumber(
        search.get("transport"),
        fallback.transportVorOrtGesamt,
      ),
      versicherungGesamt: toNumber(search.get("vers"), fallback.versicherungGesamt),
      pufferPercent: toNumber(search.get("puffer"), fallback.pufferPercent),
      ruecklageVorhanden: toNumber(
        search.get("ruecklage"),
        fallback.ruecklageVorhanden,
      ),
      monateBisAbreise: toNumber(search.get("monate"), fallback.monateBisAbreise),
    }),
    // Nur Abweichungen vom Default landen in der URL – sonst wäre der Link bei
    // vierzehn Feldern nicht mehr teilbar.
    serialize: (next) => ({
      erw: urlValue(next.erwachsene, DEFAULTS.erwachsene),
      kind: urlValue(next.kinder, DEFAULTS.kinder),
      kf: urlValue(next.kindFaktorPercent, DEFAULTS.kindFaktorPercent),
      naechte: urlValue(next.naechte, DEFAULTS.naechte),
      anreise: urlValue(next.anreiseGesamt, DEFAULTS.anreiseGesamt),
      anreisepp: urlValue(next.anreiseProPerson, DEFAULTS.anreiseProPerson),
      nacht: urlValue(next.unterkunftProNacht, DEFAULTS.unterkunftProNacht),
      essen: urlValue(next.verpflegungProPersonTag, DEFAULTS.verpflegungProPersonTag),
      aktiv: urlValue(
        next.aktivitaetenProPersonTag,
        DEFAULTS.aktivitaetenProPersonTag,
      ),
      transport: urlValue(
        next.transportVorOrtGesamt,
        DEFAULTS.transportVorOrtGesamt,
      ),
      vers: urlValue(next.versicherungGesamt, DEFAULTS.versicherungGesamt),
      puffer: urlValue(next.pufferPercent, DEFAULTS.pufferPercent),
      ruecklage: urlValue(next.ruecklageVorhanden, DEFAULTS.ruecklageVorhanden),
      monate: urlValue(next.monateBisAbreise, DEFAULTS.monateBisAbreise),
    }),
  });

  const result = useMemo(() => calculateUrlaub(state), [state]);

  /*
   * Das Abreisedatum ist ein Komfortfeld, kein Modellwert: Es rechnet einmal
   * in Monate um und ist danach ohne Bedeutung. Deshalb bleibt es lokal und
   * landet nicht in der URL – dort steht die Monatszahl, die das Ergebnis
   * tatsächlich bestimmt.
   */
  const heute = typeof params?.heute === "string" ? params.heute : todayIso();
  const [abreise, setAbreise] = useState("");

  const waehleAbreise = (datum: string) => {
    setAbreise(datum);
    if (isValidIso(datum)) {
      update({ monateBisAbreise: monateBis(heute, datum) });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Die Reise">
        <CardTitle>Die Reise</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Field label="Erwachsene" htmlFor="ub-erw">
            <Stepper
              id="ub-erw"
              value={state.erwachsene}
              min={0}
              max={20}
              onChange={(erwachsene) => update({ erwachsene })}
              ariaLabel="Anzahl Erwachsene"
            />
          </Field>

          <Field label="Kinder" htmlFor="ub-kind">
            <Stepper
              id="ub-kind"
              value={state.kinder}
              min={0}
              max={20}
              onChange={(kinder) => update({ kinder })}
              ariaLabel="Anzahl Kinder"
            />
          </Field>

          <Field
            label="Übernachtungen"
            htmlFor="ub-naechte"
            hint={`${result.tage} ${plural(result.tage, "Tag", "Tage")} vor Ort`}
          >
            <Stepper
              id="ub-naechte"
              value={state.naechte}
              min={0}
              max={365}
              onChange={(naechte) => update({ naechte })}
              suffix={plural(state.naechte, "Nacht", "Nächte")}
              ariaLabel="Anzahl Übernachtungen"
            />
          </Field>
        </div>
      </Card>

      <Card as="section" className="p-6" aria-label="Was kostet was">
        <CardTitle>Was kostet was</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Anreise pro Person"
            htmlFor="ub-anreisepp"
            hint="Flug oder Bahn. Kinder zählen hier voll."
          >
            <UnitInput
              id="ub-anreisepp"
              unit="€"
              value={state.anreiseProPerson}
              onChange={(anreiseProPerson) => update({ anreiseProPerson })}
            />
          </Field>

          <Field
            label="Anreise pauschal"
            htmlFor="ub-anreise"
            hint="Sprit, Maut, Fähre – einmal für alle zusammen."
          >
            <UnitInput
              id="ub-anreise"
              unit="€"
              value={state.anreiseGesamt}
              onChange={(anreiseGesamt) => update({ anreiseGesamt })}
            />
          </Field>

          <Field
            label="Unterkunft pro Nacht"
            htmlFor="ub-nacht"
            hint="Der Zimmerpreis, nicht der Preis je Person."
          >
            <UnitInput
              id="ub-nacht"
              unit="€"
              value={state.unterkunftProNacht}
              onChange={(unterkunftProNacht) => update({ unterkunftProNacht })}
            />
          </Field>

          <Field
            label="Verpflegung pro Person und Tag"
            htmlFor="ub-essen"
            hint="Frühstück, Mittag, Abendessen zusammen."
          >
            <UnitInput
              id="ub-essen"
              unit="€"
              value={state.verpflegungProPersonTag}
              onChange={(verpflegungProPersonTag) =>
                update({ verpflegungProPersonTag })
              }
            />
          </Field>

          <Field
            label="Aktivitäten pro Person und Tag"
            htmlFor="ub-aktiv"
            hint="Eintritte, Ausflüge, Leihgebühren."
          >
            <UnitInput
              id="ub-aktiv"
              unit="€"
              value={state.aktivitaetenProPersonTag}
              onChange={(aktivitaetenProPersonTag) =>
                update({ aktivitaetenProPersonTag })
              }
            />
          </Field>

          <Field
            label="Transport vor Ort"
            htmlFor="ub-transport"
            hint="Mietwagen, Nahverkehr, Transfer – für die ganze Reise."
          >
            <UnitInput
              id="ub-transport"
              unit="€"
              value={state.transportVorOrtGesamt}
              onChange={(transportVorOrtGesamt) =>
                update({ transportVorOrtGesamt })
              }
            />
          </Field>
        </div>
      </Card>

      <Disclosure
        title="Feineinstellung"
        hint="Kind-Faktor, Puffer und Versicherung – die Stellschrauben hinter der Summe."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Kinder zählen mit"
            htmlFor="ub-kf"
            hint="Anteil bei Verpflegung und Aktivitäten. Bei Anreise zählen sie immer voll."
          >
            <Stepper
              id="ub-kf"
              value={state.kindFaktorPercent}
              min={0}
              max={100}
              step={10}
              onChange={(kindFaktorPercent) => update({ kindFaktorPercent })}
              suffix="%"
              ariaLabel="Kind-Faktor in Prozent"
            />
          </Field>

          <Field
            label="Puffer"
            htmlFor="ub-puffer"
            hint="Aufschlag auf alle Posten. Unter fünf Prozent wird es eng."
          >
            <Stepper
              id="ub-puffer"
              value={state.pufferPercent}
              min={0}
              max={50}
              step={5}
              onChange={(pufferPercent) => update({ pufferPercent })}
              suffix="%"
              ariaLabel="Puffer in Prozent"
            />
          </Field>

          <Field label="Reiseversicherung" htmlFor="ub-vers">
            <UnitInput
              id="ub-vers"
              unit="€"
              value={state.versicherungGesamt}
              onChange={(versicherungGesamt) => update({ versicherungGesamt })}
            />
          </Field>
        </div>
      </Disclosure>

      <Card as="section" className="p-6" aria-label="Urlaubskasse">
        <CardTitle>Urlaubskasse</CardTitle>
        <p className="mt-2 text-[15px] text-muted">
          Was schon da ist und wie viel Zeit bleibt – daraus wird die monatliche
          Sparrate.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <Field label="Schon zurückgelegt" htmlFor="ub-ruecklage">
            <UnitInput
              id="ub-ruecklage"
              unit="€"
              value={state.ruecklageVorhanden}
              onChange={(ruecklageVorhanden) => update({ ruecklageVorhanden })}
            />
          </Field>

          <Field label="Monate bis zur Abreise" htmlFor="ub-monate">
            <Stepper
              id="ub-monate"
              value={state.monateBisAbreise}
              min={0}
              max={36}
              onChange={(monateBisAbreise) => update({ monateBisAbreise })}
              suffix={plural(state.monateBisAbreise, "Monat", "Monate")}
              ariaLabel="Monate bis zur Abreise"
            />
          </Field>

          <Field
            label="Oder: Abreisedatum"
            htmlFor="ub-abreise"
            hint="Rechnet die Monate aus – geteilt wird trotzdem die Monatszahl."
          >
            <TextInput
              id="ub-abreise"
              type="date"
              value={abreise}
              min={heute}
              onChange={(event) => waehleAbreise(event.target.value)}
            />
          </Field>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Urlaubsbudget-Planer"
            text={`${formatEuro(toEuro(result.gesamtC))} für ${result.personen} ${plural(result.personen, "Person", "Personen")} und ${state.naechte} ${plural(state.naechte, "Nacht", "Nächte")}`}
          />
        }
      >
        <NumberDisplay
          value={toEuro(result.gesamtC)}
          format={formatEuro}
          caption="Urlaubsbudget"
          announce={`${formatEuro(toEuro(result.gesamtC))} insgesamt, ${formatEuro(toEuro(result.proPersonC))} pro Person.`}
          hint={
            result.sparrateC === null ? (
              <>
                Das sind{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(toEuro(result.proPersonC))}
                </strong>{" "}
                pro Person. Trag ein, wie viel Zeit bis zur Abreise bleibt, dann
                kommt die Sparrate dazu.
              </>
            ) : (
              <>
                Dafür brauchst du{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(toEuro(result.sparrateC))}
                </strong>{" "}
                im Monat – {state.monateBisAbreise}{" "}
                {plural(state.monateBisAbreise, "Monat", "Monate")} lang.
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Pro Person"
          value={formatEuro(toEuro(result.proPersonC))}
          hint={`${result.personen} ${plural(result.personen, "Reisende", "Reisende")}`}
        />
        <Stat
          label="Pro Tag"
          value={formatEuro(toEuro(result.proTagC))}
          hint={`über ${result.tage} ${plural(result.tage, "Tag", "Tage")}`}
        />
        <Stat
          label="Tagesbudget vor Ort"
          value={formatEuro(toEuro(result.tagesbudgetVorOrtC))}
          hint="ohne Anreise und Unterkunft"
        />
        <Stat
          label="Noch offen"
          value={formatEuro(toEuro(result.offenC))}
          hint={
            state.ruecklageVorhanden > 0
              ? `${formatEuro(state.ruecklageVorhanden)} schon da`
              : "noch nichts zurückgelegt"
          }
        />
      </dl>

      <section aria-labelledby="ub-aufstellung" className="surface-soft p-6">
        <h2
          id="ub-aufstellung"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Woraus sich das Budget zusammensetzt
        </h2>
        {result.posten.length === 0 ? (
          <p className="mt-4 text-[15px] text-muted">
            Noch keine Kosten eingetragen.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
            {result.posten.map((posten) => (
              <PostenZeile
                key={posten.label}
                label={posten.label}
                value={toEuro(posten.betragC)}
              />
            ))}
            <PostenZeile
              label="Zwischensumme"
              value={toEuro(result.zwischensummeC)}
              stark
            />
            {result.pufferC > 0 && (
              <PostenZeile
                label={`Puffer (${state.pufferPercent} %)`}
                value={toEuro(result.pufferC)}
              />
            )}
            <PostenZeile
              label="Urlaubsbudget"
              value={toEuro(result.gesamtC)}
              stark
            />
          </ul>
        )}
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="ub-hinweise" className="surface-soft p-6">
          <h2
            id="ub-hinweise"
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

      <AffiliateBlock slots={urlaubsbudgetAffiliate} result={result} />
    </div>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg font-semibold tracking-tight">
      {children}
    </h2>
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

/**
 * Eine Zeile der Aufstellung – Label links, Betrag rechts in Mono.
 *
 * Die Null wird ausdrücklich normalisiert: `-0` schreibt `Intl` als
 * "-0,00 €", und ein Minus vor einer Null, die keine ist, sieht nach einem
 * Rechenfehler aus.
 */
function PostenZeile({
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
      <span className="font-mono tabular-nums">
        {formatEuro(value === 0 ? 0 : value)}
      </span>
    </li>
  );
}
