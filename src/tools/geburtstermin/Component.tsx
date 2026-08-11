"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, Stepper, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { isValidIso } from "@/lib/date";
import { formatInteger, formatLongDate } from "@/lib/format";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { geburtsterminAffiliate } from "./affiliate";
import {
  calculateGeburtstermin,
  defaultInput,
  STANDARD_ZYKLUS_TAGE,
} from "./logic";

interface State extends Record<string, unknown> {
  letzteRegel: string;
  zykluslaengeTage: number;
  heute: string;
}

const DEFAULTS: State = { ...defaultInput() };

const TRIMESTER_LABEL: Record<1 | 2 | 3, string> = {
  1: "1. Trimester",
  2: "2. Trimester",
  3: "3. Trimester",
};

function initialState(params: ToolParams | undefined): State {
  return {
    letzteRegel: isValidIso(params?.regel)
      ? params.regel
      : DEFAULTS.letzteRegel,
    zykluslaengeTage: toNumber(params?.zyklus, DEFAULTS.zykluslaengeTage),
    // Kommt vom Server, damit der erste Client-Render dem SSR-HTML gleicht.
    heute: isValidIso(params?.heute) ? params.heute : DEFAULTS.heute,
  };
}

export default function GeburtsterminTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const regel = search.get("regel");
      return {
        ...fallback,
        letzteRegel: isValidIso(regel) ? regel : fallback.letzteRegel,
        zykluslaengeTage: toNumber(
          search.get("zyklus"),
          fallback.zykluslaengeTage,
        ),
      };
    },
    // `heute` steht bewusst nicht in der URL: es ist der Stichtag der
    // Rechnung, kein Eingabewert.
    serialize: (next) => ({
      regel: urlValue(next.letzteRegel, DEFAULTS.letzteRegel),
      zyklus: urlValue(next.zykluslaengeTage, DEFAULTS.zykluslaengeTage),
    }),
  });

  const result = useMemo(
    () =>
      calculateGeburtstermin({
        letzteRegel: state.letzteRegel,
        zykluslaengeTage: state.zykluslaengeTage,
        heute: state.heute,
      }),
    [state.letzteRegel, state.zykluslaengeTage, state.heute],
  );

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Erster Tag der letzten Periode"
            htmlFor="gt-regel"
            hint="Nicht der vermutete Tag der Empfängnis."
          >
            <TextInput
              id="gt-regel"
              type="date"
              value={state.letzteRegel}
              aria-invalid={!result.gueltig}
              onChange={(event) => update({ letzteRegel: event.target.value })}
              className="max-w-52 font-mono"
            />
          </Field>

          <Field
            label="Zykluslänge"
            htmlFor="gt-zyklus"
            hint={`Standard sind ${STANDARD_ZYKLUS_TAGE} Tage. Abweichungen verschieben den Termin entsprechend.`}
          >
            <Stepper
              id="gt-zyklus"
              value={state.zykluslaengeTage}
              min={21}
              max={35}
              onChange={(zykluslaengeTage) => update({ zykluslaengeTage })}
              suffix="Tage"
              ariaLabel="Zykluslänge in Tagen"
            />
          </Field>
        </div>
      </Card>

      {!result.gueltig ? (
        <Card className="p-7 text-center">
          <p className="font-display text-lg font-semibold">
            Trag den ersten Tag deiner letzten Periode ein.
          </p>
          <p className="mt-2 text-muted">
            Daraus ergeben sich Termin und Schwangerschaftswoche.
          </p>
        </Card>
      ) : (
        <>
          <ResultPanel
            footer={
              <ShareBar
                title="Geburtstermin-Rechner"
                text={`SSW ${result.ssw}+${result.sswTag} · errechneter Termin ${formatLongDate(result.errechneterTermin)}`}
              />
            }
          >
            <NumberDisplay
              value={result.ssw}
              format={formatInteger}
              suffix={`+${result.sswTag}`}
              caption="Schwangerschaftswoche"
              announce={`Schwangerschaftswoche ${result.ssw} plus ${result.sswTag} Tage. Errechneter Termin: ${formatLongDate(result.errechneterTermin)}.`}
              hint={
                <>
                  Errechneter Termin:{" "}
                  <strong className="font-semibold text-ink">
                    {formatLongDate(result.errechneterTermin)}
                  </strong>
                  . Nur rund 4 bis 5 Prozent der Geburten treffen diesen Tag
                  exakt – üblich ist ein Zeitraum von zwei Wochen davor bis zwei
                  Wochen danach.
                </>
              }
            />
          </ResultPanel>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Errechneter Termin"
              value={formatLongDate(result.errechneterTermin)}
              hint={TRIMESTER_LABEL[result.trimester]}
            />
            <Stat
              label="Üblicher Zeitraum"
              value={`${formatLongDate(result.fruehesterZeitraum)} – ${formatLongDate(result.spaetesterZeitraum)}`}
              hint="37. bis 42. Schwangerschaftswoche"
            />
            <Stat
              label="Tage bis zum Termin"
              value={
                result.tageBisTermin >= 0
                  ? `${formatInteger(result.tageBisTermin)}`
                  : `vor ${formatInteger(Math.abs(result.tageBisTermin))} Tagen`
              }
              hint={
                result.tageBisTermin >= 0 ? "ab heute" : "Termin verstrichen"
              }
            />
            <Stat label="Trimester" value={TRIMESTER_LABEL[result.trimester]} />
          </dl>

          {result.warnings.length > 0 && (
            <section aria-labelledby="gt-hinweise" className="surface-soft p-6">
              <h2
                id="gt-hinweise"
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

          <AffiliateBlock slots={geburtsterminAffiliate} result={result} />
        </>
      )}
    </div>
  );
}
