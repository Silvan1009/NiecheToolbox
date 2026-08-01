"use client";

import { useMemo } from "react";
import { Plus, X } from "lucide-react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Select,
  TextInput,
  Toggle,
  UnitInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { toEuro } from "@/lib/finanzmath";
import { formatDate, formatEuro, plural } from "@/lib/format";
import { isValidIso } from "@/lib/date";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import { regions, type RegionCode } from "@/lib/regionen";
import type { ToolParams } from "@/tools/types";
import { kindergeldAffiliate } from "./affiliate";
import {
  calculateKindergeld,
  decodeKinder,
  defaultInput,
  encodeKinder,
  type KindergeldInput,
  type KindInput,
  type Veranlagung,
} from "./logic";
import { statusLabels, type KindStatus } from "./saetze";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, KindergeldInput {}

const DEFAULTS: State = { ...defaultInput() };

const VERANLAGUNG_OPTIONS = [
  { value: "zusammen", label: "Zusammen veranlagt" },
  { value: "einzeln", label: "Einzeln veranlagt" },
] as const satisfies readonly { value: Veranlagung; label: string }[];

const isVeranlagung = (value: unknown): value is Veranlagung =>
  value === "einzeln" || value === "zusammen";

const isStatus = (value: unknown): value is KindStatus =>
  value === "regulaer" || value === "ausbildung" || value === "arbeitsuchend";

const isRegion = (value: unknown): value is RegionCode =>
  typeof value === "string" && regions.some((r) => r.code === value);

function toBool(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "1" || value === 1 || value === "true";
}

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    // Das Datum kommt vom Server, damit der erste Client-Render dem SSR-HTML
    // gleicht.
    heute: isValidIso(params?.heute) ? params.heute : DEFAULTS.heute,
    kinder: decodeKinder(params?.kinder, DEFAULTS.kinder),
    jahr: toNumber(params?.jahr, DEFAULTS.jahr),
    zvE: toNumber(params?.zve, DEFAULTS.zvE),
    veranlagung: isVeranlagung(params?.ver) ? params.ver : DEFAULTS.veranlagung,
    kirchensteuer: toBool(params?.kist, DEFAULTS.kirchensteuer),
    region: isRegion(params?.land) ? params.land : DEFAULTS.region,
  };
}

export default function KindergeldTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const ver = search.get("ver");
      const land = search.get("land");

      return {
        ...fallback,
        kinder: decodeKinder(search.get("kinder"), fallback.kinder),
        jahr: toNumber(search.get("jahr"), fallback.jahr),
        zvE: toNumber(search.get("zve"), fallback.zvE),
        veranlagung: isVeranlagung(ver) ? ver : fallback.veranlagung,
        kirchensteuer: toBool(search.get("kist"), fallback.kirchensteuer),
        region: isRegion(land) ? land : fallback.region,
      };
    },
    // `heute` steht bewusst nicht in der URL: es ist kein Eingabewert, sondern
    // der Stichtag der Rechnung.
    serialize: (next) => ({
      kinder:
        encodeKinder(next.kinder) === encodeKinder(DEFAULTS.kinder)
          ? ""
          : encodeKinder(next.kinder),
      jahr: urlValue(next.jahr, DEFAULTS.jahr),
      zve: urlValue(next.zvE, DEFAULTS.zvE),
      ver: urlValue(next.veranlagung, DEFAULTS.veranlagung),
      kist:
        next.kirchensteuer === DEFAULTS.kirchensteuer
          ? ""
          : next.kirchensteuer
            ? "1"
            : "0",
      land: urlValue(next.region, DEFAULTS.region),
    }),
  });

  const result = useMemo(() => calculateKindergeld(state), [state]);

  const setzeKind = (index: number, patch: Partial<KindInput>) =>
    update({
      kinder: state.kinder.map((kind, i) =>
        i === index ? { ...kind, ...patch } : kind,
      ),
    });

  const kindHinzufuegen = () => {
    const jahr = Number(state.heute.slice(0, 4));
    update({
      kinder: [
        ...state.kinder,
        { geburtsdatum: `${jahr}-01-01`, status: "regulaer" as KindStatus },
      ],
    });
  };

  const kindEntfernen = (index: number) =>
    update({ kinder: state.kinder.filter((_, i) => i !== index) });

  const freibetragGewinnt = result.guenstiger === "freibetrag";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Kinder">
        <CardTitle>Kinder</CardTitle>
        <p className="mt-2 text-[15px] text-muted">
          Das Geburtsdatum bestimmt, wie lange der Anspruch noch läuft. Nach dem
          18. Geburtstag zählt, was das Kind macht.
        </p>

        <ul className="mt-4 flex flex-col gap-4">
          {state.kinder.map((kind, index) => (
            <li
              key={`${index}-${kind.geburtsdatum}`}
              className="grid gap-4 rounded-control bg-ink-soft p-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end"
            >
              <Field label="Geburtsdatum" htmlFor={`kg-datum-${index}`}>
                <TextInput
                  id={`kg-datum-${index}`}
                  type="date"
                  value={kind.geburtsdatum}
                  onChange={(event) =>
                    setzeKind(index, { geburtsdatum: event.target.value })
                  }
                />
              </Field>

              <Field label="Status" htmlFor={`kg-status-${index}`}>
                <Select
                  id={`kg-status-${index}`}
                  value={kind.status}
                  onChange={(event) => {
                    const naechster = event.target.value;
                    if (isStatus(naechster)) setzeKind(index, { status: naechster });
                  }}
                >
                  {(Object.keys(statusLabels) as KindStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {statusLabels[key]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Button
                variant="quiet"
                onClick={() => kindEntfernen(index)}
                aria-label={`Kind ${index + 1} entfernen`}
                className="justify-self-start sm:justify-self-auto"
              >
                <X className="size-4" aria-hidden="true" />
                Entfernen
              </Button>
            </li>
          ))}
        </ul>

        <Button variant="quiet" onClick={kindHinzufuegen} className="mt-4">
          <Plus className="size-4" aria-hidden="true" />
          Kind hinzufügen
        </Button>
      </Card>

      <Card as="section" className="p-6" aria-label="Einkommen">
        <CardTitle>Einkommen für die Günstigerprüfung</CardTitle>
        <p className="mt-2 text-[15px] text-muted">
          Das Finanzamt prüft von selbst, ob der Kinderfreibetrag mehr bringt als
          das Kindergeld. Diese Angaben braucht es dafür.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Zu versteuerndes Einkommen"
            htmlFor="kg-zve"
            hint="Nicht das Brutto – die Zahl steht im letzten Steuerbescheid."
          >
            <UnitInput
              id="kg-zve"
              unit="€ / Jahr"
              value={state.zvE}
              onChange={(zvE) => update({ zvE })}
            />
          </Field>

          <Field label="Veranlagung" htmlFor="kg-ver">
            <SegmentedControl
              value={state.veranlagung}
              options={VERANLAGUNG_OPTIONS}
              onChange={(veranlagung) => update({ veranlagung })}
              ariaLabel="Veranlagungsart"
            />
          </Field>

          <div className="sm:col-span-2">
            <Toggle
              checked={state.kirchensteuer}
              onChange={(kirchensteuer) => update({ kirchensteuer })}
              label="Kirchensteuer zahlen"
              hint="Der Kinderfreibetrag senkt auch sie – unabhängig vom Ausgang der Günstigerprüfung."
            />
          </div>

          {state.kirchensteuer && (
            <Field
              label="Bundesland"
              htmlFor="kg-land"
              hint="Bayern und Baden-Württemberg erheben 8 Prozent, alle übrigen 9."
            >
              <Select
                id="kg-land"
                value={state.region}
                onChange={(event) => {
                  const naechstes = event.target.value;
                  if (isRegion(naechstes)) update({ region: naechstes });
                }}
              >
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field
            label="Steuerjahr"
            htmlFor="kg-jahr"
            hint={`Kindergeldsatz ${state.jahr}: ${formatEuro(result.satz)} je Kind und Monat.`}
          >
            <UnitInput
              id="kg-jahr"
              unit=""
              value={state.jahr}
              onChange={(jahr) => update({ jahr })}
            />
          </Field>
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Kindergeld-Rechner"
            text={`${formatEuro(toEuro(result.monatlichC))} Kindergeld im Monat für ${result.anzahlBerechtigt} ${plural(result.anzahlBerechtigt, "Kind", "Kinder")}`}
          />
        }
      >
        <NumberDisplay
          value={toEuro(result.monatlichC)}
          format={formatEuro}
          suffix="im Monat"
          caption="Kindergeld"
          announce={`${formatEuro(toEuro(result.monatlichC))} Kindergeld im Monat, ${formatEuro(toEuro(result.jahrC))} im Jahr.`}
          hint={
            result.anzahlBerechtigt === 0 ? (
              <>Für kein erfasstes Kind besteht derzeit ein Anspruch.</>
            ) : (
              <>
                Das sind{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(toEuro(result.jahrC))}
                </strong>{" "}
                im Jahr für {result.anzahlBerechtigt}{" "}
                {plural(result.anzahlBerechtigt, "Kind", "Kinder")} – und bis zum
                Ende aller Ansprüche noch{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(toEuro(result.restanspruchGesamtC))}
                </strong>
                .
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Im Jahr"
          value={formatEuro(toEuro(result.jahrC))}
          hint={`${formatEuro(result.satz)} je Kind und Monat`}
        />
        <Stat
          label="Restanspruch"
          value={formatEuro(toEuro(result.restanspruchGesamtC))}
          hint="bis zum Ende aller Ansprüche"
        />
        <Stat
          label="Günstiger ist"
          value={freibetragGewinnt ? "Freibetrag" : "Kindergeld"}
          hint={`um ${formatEuro(toEuro(result.vorteilC))} im Jahr`}
        />
        <Stat
          label="Gesamtentlastung"
          value={formatEuro(toEuro(result.gesamtentlastungC))}
          hint="im Jahr, mit Soli und Kirchensteuer"
        />
      </dl>

      <section aria-labelledby="kg-pruefung" className="surface-soft p-6">
        <h2
          id="kg-pruefung"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Günstigerprüfung
        </h2>
        <p className="mt-2 text-[15px] text-muted">
          {freibetragGewinnt
            ? "Der Kinderfreibetrag bringt mehr als das Kindergeld. Das Finanzamt setzt ihn an und rechnet das gezahlte Kindergeld gegen."
            : "Das Kindergeld bringt mehr als der Kinderfreibetrag. Es bleibt dabei – der Freibetrag senkt aber trotzdem Soli und Kirchensteuer."}
        </p>
        <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <PostenZeile
            label="Einkommensteuer ohne Kinderfreibetrag"
            value={toEuro(result.steuerOhneC)}
          />
          <PostenZeile
            label={`Einkommensteuer mit Freibetrag (${formatEuro(toEuro(result.freibetragGesamtC))})`}
            value={toEuro(result.steuerMitC)}
          />
          <PostenZeile
            label="Steuervorteil durch den Freibetrag"
            value={toEuro(result.steuervorteilC)}
            stark
          />
          <PostenZeile
            label={
              state.veranlagung === "zusammen"
                ? "Kindergeld im Jahr, dagegengerechnet"
                : "Halbes Kindergeld im Jahr, dagegengerechnet"
            }
            value={toEuro(result.kindergeldVergleichC)}
          />
          <PostenZeile
            label="Ersparnis beim Solidaritätszuschlag"
            value={toEuro(result.soliEntlastungC)}
          />
          {state.kirchensteuer && (
            <PostenZeile
              label="Ersparnis bei der Kirchensteuer"
              value={toEuro(result.kirchensteuerEntlastungC)}
            />
          )}
          <PostenZeile
            label="Entlastung im Jahr insgesamt"
            value={toEuro(result.gesamtentlastungC)}
            stark
          />
        </ul>
      </section>

      {result.kinder.length > 0 && (
        <section aria-labelledby="kg-kinder" className="surface-soft p-6">
          <h2
            id="kg-kinder"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Anspruch je Kind
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[13px] text-muted">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Geboren
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-semibold">
                    Alter
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-semibold">
                    Anspruch bis
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-semibold">
                    Monate
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Restanspruch
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {result.kinder.map((kind, index) => (
                  <tr
                    key={`${index}-${kind.geburtsdatum}`}
                    className={`border-b border-line/60 ${
                      kind.anspruchAktuell ? "" : "text-muted"
                    }`}
                  >
                    <th scope="row" className="py-2 pr-4 text-left font-sans">
                      {formatDate(kind.geburtsdatum)}
                    </th>
                    <td className="py-2 pr-4 text-right">{kind.alter}</td>
                    <td className="py-2 pr-4 text-right">
                      {formatDate(kind.anspruchBis)}
                    </td>
                    <td className="py-2 pr-4 text-right">{kind.restmonate}</td>
                    <td className="py-2 text-right">
                      {formatEuro(toEuro(kind.restanspruchC))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {result.warnings.length > 0 && (
        <section aria-labelledby="kg-hinweise" className="surface-soft p-6">
          <h2
            id="kg-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Wichtig dazu
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

      <AffiliateBlock slots={kindergeldAffiliate} result={result} />
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
