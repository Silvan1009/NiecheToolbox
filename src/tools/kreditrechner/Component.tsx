"use client";

import { useMemo, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card, Disclosure } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Stepper,
  TextInput,
} from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { kreditAffiliate } from "./affiliate";
import {
  calculateKredit,
  defaultInput,
  monateText,
  type KreditInput,
  type KreditModus,
} from "./logic";

/** Der Zustand ist genau die Eingabe der Rechenlogik – keine zweite Wahrheit. */
interface State extends Record<string, unknown>, KreditInput {}

const DEFAULTS: State = { ...defaultInput() };

const MODUS_OPTIONS = [
  { value: "rate-aus-laufzeit", label: "Laufzeit vorgeben" },
  { value: "laufzeit-aus-rate", label: "Rate vorgeben" },
] as const satisfies readonly { value: KreditModus; label: string }[];

const isModus = (value: unknown): value is KreditModus =>
  value === "rate-aus-laufzeit" || value === "laufzeit-aus-rate";

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
    modus: isModus(params?.modus) ? params.modus : DEFAULTS.modus,
    kreditbetrag: toNumber(params?.betrag, DEFAULTS.kreditbetrag),
    sollzinsPercent: toNumber(params?.zins, DEFAULTS.sollzinsPercent),
    laufzeitJahre: toNumber(params?.jahre, DEFAULTS.laufzeitJahre),
    wunschrateMonat: toNumber(params?.rate, DEFAULTS.wunschrateMonat),
    sondertilgungJahr: toNumber(params?.sonder, DEFAULTS.sondertilgungJahr),
    bearbeitungsgebuehrPercent: toNumber(
      params?.gebuehr,
      DEFAULTS.bearbeitungsgebuehrPercent,
    ),
    restschuldversicherung: toNumber(
      params?.rsv,
      DEFAULTS.restschuldversicherung,
    ),
    zinsbindungJahre: toNumber(params?.bindung, DEFAULTS.zinsbindungJahre),
  };
}

export default function KreditrechnerTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const modus = search.get("modus");

      return {
        ...fallback,
        modus: isModus(modus) ? modus : fallback.modus,
        kreditbetrag: toNumber(search.get("betrag"), fallback.kreditbetrag),
        sollzinsPercent: toNumber(search.get("zins"), fallback.sollzinsPercent),
        laufzeitJahre: toNumber(search.get("jahre"), fallback.laufzeitJahre),
        wunschrateMonat: toNumber(search.get("rate"), fallback.wunschrateMonat),
        sondertilgungJahr: toNumber(
          search.get("sonder"),
          fallback.sondertilgungJahr,
        ),
        bearbeitungsgebuehrPercent: toNumber(
          search.get("gebuehr"),
          fallback.bearbeitungsgebuehrPercent,
        ),
        restschuldversicherung: toNumber(
          search.get("rsv"),
          fallback.restschuldversicherung,
        ),
        zinsbindungJahre: toNumber(
          search.get("bindung"),
          fallback.zinsbindungJahre,
        ),
      };
    },
    // Nur Abweichungen vom Default landen in der URL – so bleibt der Link teilbar.
    serialize: (next) => ({
      modus: urlValue(next.modus, DEFAULTS.modus),
      betrag: urlValue(next.kreditbetrag, DEFAULTS.kreditbetrag),
      zins: urlValue(next.sollzinsPercent, DEFAULTS.sollzinsPercent),
      jahre: urlValue(next.laufzeitJahre, DEFAULTS.laufzeitJahre),
      rate: urlValue(next.wunschrateMonat, DEFAULTS.wunschrateMonat),
      sonder: urlValue(next.sondertilgungJahr, DEFAULTS.sondertilgungJahr),
      gebuehr: urlValue(
        next.bearbeitungsgebuehrPercent,
        DEFAULTS.bearbeitungsgebuehrPercent,
      ),
      rsv: urlValue(next.restschuldversicherung, DEFAULTS.restschuldversicherung),
      bindung: urlValue(next.zinsbindungJahre, DEFAULTS.zinsbindungJahre),
    }),
  });

  const result = useMemo(() => calculateKredit(state), [state]);

  const istRatenmodus = state.modus === "laufzeit-aus-rate";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Was gibst du vor?">
        <Field
          label="Was gibst du vor?"
          htmlFor="kr-modus"
          hint={
            istRatenmodus
              ? "Du nennst die Rate, die du dauerhaft tragen kannst – der Rechner sucht die Laufzeit."
              : "Du nennst die Laufzeit – der Rechner errechnet die Rate."
          }
        >
          <SegmentedControl
            value={state.modus}
            options={MODUS_OPTIONS}
            onChange={(modus) => update({ modus })}
            ariaLabel="Rechenrichtung"
          />
        </Field>
      </Card>

      <Card as="section" className="p-6" aria-label="Kredit">
        <CardTitle>Kredit</CardTitle>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Kreditbetrag" htmlFor="kr-betrag">
            <UnitInput
              id="kr-betrag"
              unit="€"
              value={state.kreditbetrag}
              onChange={(kreditbetrag) => update({ kreditbetrag })}
            />
          </Field>

          <Field
            label="Sollzins pro Jahr"
            htmlFor="kr-zins"
            hint="Der Zinssatz aus dem Angebot, nicht der Effektivzins."
          >
            <UnitInput
              id="kr-zins"
              unit="%"
              value={state.sollzinsPercent}
              onChange={(sollzinsPercent) => update({ sollzinsPercent })}
            />
          </Field>

          {istRatenmodus ? (
            <Field
              label="Wunschrate im Monat"
              htmlFor="kr-rate"
              hint="Muss über den Monatszinsen liegen, sonst wird nichts getilgt."
            >
              <UnitInput
                id="kr-rate"
                unit="€"
                value={state.wunschrateMonat}
                onChange={(wunschrateMonat) => update({ wunschrateMonat })}
              />
            </Field>
          ) : (
            <Field label="Laufzeit" htmlFor="kr-jahre">
              <Stepper
                id="kr-jahre"
                value={state.laufzeitJahre}
                min={1}
                max={40}
                onChange={(laufzeitJahre) => update({ laufzeitJahre })}
                suffix="Jahre"
                ariaLabel="Laufzeit in Jahren"
              />
            </Field>
          )}

          <Field
            label="Sondertilgung im Jahr"
            htmlFor="kr-sonder"
            hint="Zusätzliche Zahlung am Jahresende. Ohne: 0."
          >
            <UnitInput
              id="kr-sonder"
              unit="€"
              value={state.sondertilgungJahr}
              onChange={(sondertilgungJahr) => update({ sondertilgungJahr })}
            />
          </Field>
        </div>
      </Card>

      <Disclosure
        title="Nebenkosten und Zinsbindung"
        hint="Die Posten, die aus einem günstigen Sollzins einen teuren Kredit machen."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Bearbeitungsgebühr"
            htmlFor="kr-gebuehr"
            hint="Oder Disagio – mindert die Auszahlung, verzinst wird der volle Betrag."
          >
            <UnitInput
              id="kr-gebuehr"
              unit="%"
              value={state.bearbeitungsgebuehrPercent}
              onChange={(bearbeitungsgebuehrPercent) =>
                update({ bearbeitungsgebuehrPercent })
              }
            />
          </Field>

          <Field
            label="Restschuldversicherung"
            htmlFor="kr-rsv"
            hint="Einmalprämie, mitfinanziert. Treibt den Effektivzins am stärksten."
          >
            <UnitInput
              id="kr-rsv"
              unit="€"
              value={state.restschuldversicherung}
              onChange={(restschuldversicherung) =>
                update({ restschuldversicherung })
              }
            />
          </Field>

          <Field
            label="Zinsbindung"
            htmlFor="kr-bindung"
            hint="Für Baufinanzierungen. 0 heißt: Zins gilt für die ganze Laufzeit."
          >
            <Stepper
              id="kr-bindung"
              value={state.zinsbindungJahre}
              min={0}
              max={40}
              onChange={(zinsbindungJahre) => update({ zinsbindungJahre })}
              suffix="Jahre"
              ariaLabel="Zinsbindung in Jahren"
            />
          </Field>
        </div>
      </Disclosure>

      <ResultPanel
        footer={
          <ShareBar
            title="Kredit-Rechner"
            text={`${formatEuro(result.monatsrate)} im Monat für ${formatEuro(result.darlehen)} über ${monateText(result.laufzeitMonate)}`}
          />
        }
      >
        <NumberDisplay
          value={result.monatsrate}
          format={formatEuro}
          suffix="pro Monat"
          caption="Monatsrate"
          tone={result.tilgtNicht ? "ink" : "positive"}
          announce={`${formatEuro(result.monatsrate)} pro Monat über ${monateText(result.laufzeitMonate)}.`}
          hint={
            result.tilgtNicht ? (
              <>
                Diese Rate tilgt den Kredit nicht in einer sinnvollen Zeit – sie
                deckt kaum mehr als die Zinsen.
              </>
            ) : (
              <>
                Über{" "}
                <strong className="font-semibold text-ink">
                  {monateText(result.laufzeitMonate)}
                </strong>
                . Insgesamt zahlst du{" "}
                <strong className="font-semibold text-ink">
                  {formatEuro(result.gesamtaufwand)}
                </strong>{" "}
                zurück, davon {formatEuro(result.gesamtzinsen)} Zinsen.
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Effektiver Jahreszins"
          value={
            result.effektiverJahreszins === null
              ? "–"
              : `${formatDecimal(result.effektiverJahreszins)} %`
          }
          hint={`Sollzins ${formatDecimal(state.sollzinsPercent)} %`}
        />
        <Stat
          label="Gesamtzinsen"
          value={formatEuro(result.gesamtzinsen)}
          hint={
            result.zinsanteilProzent === null
              ? "keine Zinsen"
              : `${formatDecimal(result.zinsanteilProzent)} % aller Zahlungen`
          }
        />
        <Stat
          label="Laufzeit"
          value={monateText(result.laufzeitMonate)}
          hint={`${result.laufzeitMonate} Raten`}
        />
        <Stat
          label={
            result.restschuldNachZinsbindung === null
              ? "Auszahlung"
              : `Restschuld nach ${result.zinsbindungJahre} Jahren`
          }
          value={formatEuro(
            result.restschuldNachZinsbindung ?? result.auszahlung,
          )}
          hint={
            result.restschuldNachZinsbindung === null
              ? "was auf dem Konto ankommt"
              : "muss anschlussfinanziert werden"
          }
        />
      </dl>

      <section aria-labelledby="kr-kosten" className="surface-soft p-6">
        <h2
          id="kr-kosten"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Was der Kredit kostet
        </h2>
        <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <Posten label="Kreditbetrag" value={state.kreditbetrag} />
          <Posten label="Bearbeitungsgebühr" value={-result.gebuehren} />
          <Posten label="Auszahlung" value={result.auszahlung} stark />
          <Posten
            label="Restschuldversicherung (mitfinanziert)"
            value={state.restschuldversicherung}
          />
          <Posten label="Zinsen über die Laufzeit" value={result.gesamtzinsen} />
          <Posten label="Summe aller Zahlungen" value={result.gesamtaufwand} stark />
          <Posten label="Kosten des Kredits" value={result.kreditkosten} stark />
        </ul>
      </section>

      {result.sondertilgungVerkuerzungMonate > 0 && (
        <section aria-labelledby="kr-sonder-wirkung" className="surface-soft p-6">
          <h2
            id="kr-sonder-wirkung"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Was die Sondertilgung bringt
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Stat
              label="Gesparte Zinsen"
              value={formatEuro(result.sondertilgungZinsersparnis)}
              hint={`bei ${formatEuro(state.sondertilgungJahr)} im Jahr`}
            />
            <Stat
              label="Kürzere Laufzeit"
              value={monateText(result.sondertilgungVerkuerzungMonate)}
              hint="früher schuldenfrei"
            />
          </dl>
        </section>
      )}

      <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors duration-(--dur-fast) hover:bg-ink-soft">
          <span className="font-display text-lg font-semibold tracking-tight">
            Tilgungsplan
          </span>
          <ChevronDown
            className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[13px] text-muted">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Jahr
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Zinsen
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Tilgung
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold">
                  Sondertilgung
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Restschuld
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {result.jahre.map((zeile) => (
                <tr key={zeile.jahr} className="border-b border-line/60">
                  <th scope="row" className="py-2 pr-4 text-left font-sans">
                    {zeile.jahr}
                  </th>
                  <td className="py-2 pr-4 text-right">
                    {formatEuro(zeile.zins)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {formatEuro(zeile.tilgung)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {formatEuro(zeile.sondertilgung)}
                  </td>
                  <td className="py-2 text-right">
                    {formatEuro(zeile.restschuld)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {result.warnings.length > 0 && (
        <section aria-labelledby="kr-hinweise" className="surface-soft p-6">
          <h2
            id="kr-hinweise"
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

      <AffiliateBlock slots={kreditAffiliate} result={result} />
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
 * Die Null wird ausdrücklich normalisiert: Abzugsposten kommen hier negiert
 * an, und `-0` schreibt `Intl` als "-0,00 €". Ein Minus vor einer Null, die
 * keine ist, sieht nach einem Rechenfehler aus. `-0 === 0` ist wahr, der
 * Vergleich fängt also genau diesen Fall.
 */
function Posten({
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
