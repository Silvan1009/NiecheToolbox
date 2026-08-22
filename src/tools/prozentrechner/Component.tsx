"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, UnitInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatAmount, formatRate } from "@/lib/format";
import { toNumber } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import {
  berechneAnteil,
  berechneGrundwert,
  berechneProzentsatz,
  berechneVeraenderung,
} from "./logic";

type Modus = "anteil" | "grundwert" | "satz" | "veraenderung";

interface State extends Record<string, unknown> {
  modus: Modus;
  anteilBasis: number;
  anteilProzent: number;
  grundwertWert: number;
  grundwertProzent: number;
  satzWert: number;
  satzBasis: number;
  veraenderungAlt: number;
  veraenderungNeu: number;
}

const MODI = [
  { value: "anteil", label: "Anteil" },
  { value: "grundwert", label: "Grundwert" },
  { value: "satz", label: "Prozentsatz" },
  { value: "veraenderung", label: "Veränderung" },
] as const satisfies readonly { value: Modus; label: string }[];

const isModus = (value: unknown): value is Modus =>
  typeof value === "string" && MODI.some((m) => m.value === value);

/** "+" für positive Werte ergänzen – bei einer Veränderung ist das Vorzeichen der Inhalt. */
function formatSigned(n: number): string {
  const formatted = formatRate(Math.abs(n));
  if (n > 0) return `+${formatted}`;
  if (n < 0) return `−${formatted}`;
  return formatted;
}

const DEFAULTS = {
  anteilBasis: 79.99,
  anteilProzent: 20,
  grundwertWert: 45,
  grundwertProzent: 15,
  satzWert: 45,
  satzBasis: 300,
  veraenderungAlt: 80,
  veraenderungNeu: 100,
};

function initialState(params: ToolParams | undefined): State {
  const modus = isModus(params?.modus) ? params.modus : "anteil";
  const x = params?.x;
  const y = params?.y;

  return {
    modus,
    anteilBasis:
      modus === "anteil"
        ? toNumber(x, DEFAULTS.anteilBasis)
        : DEFAULTS.anteilBasis,
    anteilProzent:
      modus === "anteil"
        ? toNumber(y, DEFAULTS.anteilProzent)
        : DEFAULTS.anteilProzent,
    grundwertWert:
      modus === "grundwert"
        ? toNumber(x, DEFAULTS.grundwertWert)
        : DEFAULTS.grundwertWert,
    grundwertProzent:
      modus === "grundwert"
        ? toNumber(y, DEFAULTS.grundwertProzent)
        : DEFAULTS.grundwertProzent,
    satzWert:
      modus === "satz" ? toNumber(x, DEFAULTS.satzWert) : DEFAULTS.satzWert,
    satzBasis:
      modus === "satz" ? toNumber(y, DEFAULTS.satzBasis) : DEFAULTS.satzBasis,
    veraenderungAlt:
      modus === "veraenderung"
        ? toNumber(x, DEFAULTS.veraenderungAlt)
        : DEFAULTS.veraenderungAlt,
    veraenderungNeu:
      modus === "veraenderung"
        ? toNumber(y, DEFAULTS.veraenderungNeu)
        : DEFAULTS.veraenderungNeu,
  };
}

/** Die aktuell im Modus sichtbaren zwei Eingaben – für URL-Serialisierung und -Parsing. */
function activePair(state: State): [number, number] {
  switch (state.modus) {
    case "anteil":
      return [state.anteilBasis, state.anteilProzent];
    case "grundwert":
      return [state.grundwertWert, state.grundwertProzent];
    case "satz":
      return [state.satzWert, state.satzBasis];
    case "veraenderung":
      return [state.veraenderungAlt, state.veraenderungNeu];
  }
}

function withActivePair(state: State, x: number, y: number): State {
  switch (state.modus) {
    case "anteil":
      return { ...state, anteilBasis: x, anteilProzent: y };
    case "grundwert":
      return { ...state, grundwertWert: x, grundwertProzent: y };
    case "satz":
      return { ...state, satzWert: x, satzBasis: y };
    case "veraenderung":
      return { ...state, veraenderungAlt: x, veraenderungNeu: y };
  }
}

export default function ProzentrechnerTool({
  params,
}: {
  params?: ToolParams;
}) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => {
      const modus = isModus(search.get("modus"))
        ? (search.get("modus") as Modus)
        : fallback.modus;
      const [fx, fy] = activePair(fallback);
      const x = toNumber(search.get("x"), fx);
      const y = toNumber(search.get("y"), fy);
      return withActivePair({ ...fallback, modus }, x, y);
    },
    serialize: (next) => {
      const [x, y] = activePair(next);
      return { modus: next.modus, x: String(x), y: String(y) };
    },
  });

  function setModus(modus: Modus) {
    update({ modus });
  }

  const anteil = useMemo(
    () =>
      berechneAnteil({
        basis: state.anteilBasis,
        prozent: state.anteilProzent,
      }),
    [state.anteilBasis, state.anteilProzent],
  );
  const grundwert = useMemo(
    () =>
      berechneGrundwert({
        wert: state.grundwertWert,
        prozent: state.grundwertProzent,
      }),
    [state.grundwertWert, state.grundwertProzent],
  );
  const satz = useMemo(
    () => berechneProzentsatz({ wert: state.satzWert, basis: state.satzBasis }),
    [state.satzWert, state.satzBasis],
  );
  const veraenderung = useMemo(
    () =>
      berechneVeraenderung({
        alt: state.veraenderungAlt,
        neu: state.veraenderungNeu,
      }),
    [state.veraenderungAlt, state.veraenderungNeu],
  );

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="flex flex-col gap-5">
          <SegmentedControl
            value={state.modus}
            options={MODI}
            onChange={setModus}
            ariaLabel="Prozentfrage wählen"
          />

          {state.modus === "anteil" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Ausgangswert"
                htmlFor="pr-anteil-basis"
                hint="Das Ganze, 100 %."
              >
                <UnitInput
                  id="pr-anteil-basis"
                  unit=""
                  value={state.anteilBasis}
                  onChange={(v) => update({ anteilBasis: v })}
                />
              </Field>
              <Field
                label="Prozentsatz"
                htmlFor="pr-anteil-prozent"
                hint="z. B. Rabatt oder Steuersatz."
              >
                <UnitInput
                  id="pr-anteil-prozent"
                  unit="%"
                  value={state.anteilProzent}
                  onChange={(v) => update({ anteilProzent: v })}
                />
              </Field>
            </div>
          )}

          {state.modus === "grundwert" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Bekannter Anteil"
                htmlFor="pr-grundwert-wert"
                hint="Der Teil, den du schon kennst."
              >
                <UnitInput
                  id="pr-grundwert-wert"
                  unit=""
                  value={state.grundwertWert}
                  onChange={(v) => update({ grundwertWert: v })}
                />
              </Field>
              <Field
                label="Prozentsatz"
                htmlFor="pr-grundwert-prozent"
                hint="Wie viel Prozent dieser Anteil ausmacht."
              >
                <UnitInput
                  id="pr-grundwert-prozent"
                  unit="%"
                  value={state.grundwertProzent}
                  onChange={(v) => update({ grundwertProzent: v })}
                />
              </Field>
            </div>
          )}

          {state.modus === "satz" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Anteil"
                htmlFor="pr-satz-wert"
                hint="Der Teil vom Ganzen."
              >
                <UnitInput
                  id="pr-satz-wert"
                  unit=""
                  value={state.satzWert}
                  onChange={(v) => update({ satzWert: v })}
                />
              </Field>
              <Field
                label="Ausgangswert"
                htmlFor="pr-satz-basis"
                hint="Das Ganze, 100 %."
              >
                <UnitInput
                  id="pr-satz-basis"
                  unit=""
                  value={state.satzBasis}
                  onChange={(v) => update({ satzBasis: v })}
                />
              </Field>
            </div>
          )}

          {state.modus === "veraenderung" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Alter Wert"
                htmlFor="pr-veraenderung-alt"
                hint="Der Bezugswert, auf den sich das Ergebnis bezieht."
              >
                <UnitInput
                  id="pr-veraenderung-alt"
                  unit=""
                  value={state.veraenderungAlt}
                  onChange={(v) => update({ veraenderungAlt: v })}
                />
              </Field>
              <Field label="Neuer Wert" htmlFor="pr-veraenderung-neu">
                <UnitInput
                  id="pr-veraenderung-neu"
                  unit=""
                  value={state.veraenderungNeu}
                  onChange={(v) => update({ veraenderungNeu: v })}
                />
              </Field>
            </div>
          )}
        </div>
      </Card>

      {state.modus === "anteil" && (
        <>
          <ResultPanel
            footer={
              <ShareBar
                title="Prozentrechnung teilen"
                text={`${formatAmount(anteil.anteil)} sind ${formatRate(anteil.prozent)} % von ${formatAmount(anteil.basis)}`}
              />
            }
          >
            <NumberDisplay
              value={anteil.anteil}
              format={formatAmount}
              caption={`${formatRate(anteil.prozent)} % von ${formatAmount(anteil.basis)}`}
              announce={`${formatAmount(anteil.anteil)}, das sind ${formatRate(anteil.prozent)} Prozent von ${formatAmount(anteil.basis)}.`}
              hint={
                <>
                  Nach Abzug bleiben{" "}
                  <strong className="font-semibold text-ink">
                    {formatAmount(anteil.nachAbzug)}
                  </strong>
                  , nach Zuschlag sind es{" "}
                  <strong className="font-semibold text-ink">
                    {formatAmount(anteil.nachZuschlag)}
                  </strong>
                  .
                </>
              }
            />
          </ResultPanel>
          <dl className="grid gap-4 sm:grid-cols-3">
            <Stat label="Ausgangswert" value={formatAmount(anteil.basis)} />
            <Stat
              label="Nach Abzug"
              value={formatAmount(anteil.nachAbzug)}
              hint="z. B. Preis nach Rabatt"
            />
            <Stat
              label="Nach Zuschlag"
              value={formatAmount(anteil.nachZuschlag)}
              hint="z. B. Preis nach Steuer"
            />
          </dl>
        </>
      )}

      {state.modus === "grundwert" && (
        <ResultPanel
          footer={
            <ShareBar
              title="Prozentrechnung teilen"
              text={
                grundwert.valid
                  ? `${formatAmount(grundwert.wert)} sind ${formatRate(grundwert.prozent)} % von ${formatAmount(grundwert.grundwert)}`
                  : undefined
              }
            />
          }
        >
          <NumberDisplay
            value={grundwert.grundwert}
            format={formatAmount}
            tone={grundwert.valid ? "positive" : "ink"}
            caption={grundwert.valid ? "Grundwert (100 %)" : "Nicht definiert"}
            announce={
              grundwert.valid
                ? `Grundwert: ${formatAmount(grundwert.grundwert)}.`
                : "Bei 0 Prozent lässt sich kein Grundwert bestimmen."
            }
            hint={
              grundwert.valid ? (
                <>
                  {formatAmount(grundwert.wert)} sind{" "}
                  {formatRate(grundwert.prozent)} % von{" "}
                  <strong className="font-semibold text-ink">
                    {formatAmount(grundwert.grundwert)}
                  </strong>
                  .
                </>
              ) : (
                "Bei 0 % lässt sich der Grundwert nicht bestimmen – jeder Anteil von 0 % ist 0, unabhängig vom Grundwert."
              )
            }
          />
        </ResultPanel>
      )}

      {state.modus === "satz" && (
        <ResultPanel
          footer={
            <ShareBar
              title="Prozentrechnung teilen"
              text={
                satz.valid
                  ? `${formatAmount(satz.wert)} sind ${formatRate(satz.prozentsatz)} % von ${formatAmount(satz.basis)}`
                  : undefined
              }
            />
          }
        >
          <NumberDisplay
            value={satz.prozentsatz}
            format={formatRate}
            suffix="%"
            tone={satz.valid ? "positive" : "ink"}
            caption={satz.valid ? undefined : "Nicht definiert"}
            announce={
              satz.valid
                ? `${formatRate(satz.prozentsatz)} Prozent.`
                : "Bei Ausgangswert 0 lässt sich kein Prozentsatz bestimmen."
            }
            hint={
              satz.valid ? (
                <>
                  <strong className="font-semibold text-ink">
                    {formatAmount(satz.wert)}
                  </strong>{" "}
                  sind {formatRate(satz.prozentsatz)} % von{" "}
                  {formatAmount(satz.basis)}.
                </>
              ) : (
                "Bei einem Ausgangswert von 0 ist kein Prozentsatz definiert."
              )
            }
          />
        </ResultPanel>
      )}

      {state.modus === "veraenderung" && (
        <>
          <ResultPanel
            footer={
              <ShareBar
                title="Prozentuale Veränderung teilen"
                text={
                  veraenderung.valid
                    ? `${formatSigned(veraenderung.prozent)} % von ${formatAmount(veraenderung.alt)} auf ${formatAmount(veraenderung.neu)}`
                    : undefined
                }
              />
            }
          >
            <NumberDisplay
              value={veraenderung.prozent}
              format={formatSigned}
              suffix="%"
              tone={veraenderung.valid ? "positive" : "ink"}
              caption={veraenderung.valid ? undefined : "Nicht definiert"}
              announce={
                veraenderung.valid
                  ? `${formatSigned(veraenderung.prozent)} Prozent, von ${formatAmount(veraenderung.alt)} auf ${formatAmount(veraenderung.neu)}.`
                  : "Bei einem Ausgangswert von 0 lässt sich keine prozentuale Veränderung bestimmen."
              }
              hint={
                veraenderung.valid ? (
                  veraenderung.richtung === "gleich" ? (
                    "Der Wert hat sich nicht verändert."
                  ) : (
                    <>
                      Der Wert ist von {formatAmount(veraenderung.alt)} auf{" "}
                      {formatAmount(veraenderung.neu)}{" "}
                      {veraenderung.richtung === "zunahme"
                        ? "gestiegen"
                        : "gesunken"}
                      .
                    </>
                  )
                ) : (
                  "Ein Ausgangswert von 0 hat keinen definierten Bezugspunkt für eine relative Veränderung."
                )
              }
            />
          </ResultPanel>
          <dl className="grid gap-4 sm:grid-cols-3">
            <Stat label="Alter Wert" value={formatAmount(veraenderung.alt)} />
            <Stat label="Neuer Wert" value={formatAmount(veraenderung.neu)} />
            <Stat
              label="Differenz"
              value={`${veraenderung.differenz > 0 ? "+" : veraenderung.differenz < 0 ? "−" : ""}${formatAmount(Math.abs(veraenderung.differenz))}`}
            />
          </dl>
        </>
      )}
    </div>
  );
}
