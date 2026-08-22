"use client";

import { useMemo } from "react";
import { WegSourceTools } from "@/components/WegSourceTools";
import { WegStep } from "@/components/WegStep";
import { WegSteps, type WegStepDef } from "@/components/WegSteps";
import { Disclosure } from "@/components/ui/Card";
import { Field, Stepper, UnitInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import type { PayoffTone } from "@/components/ui/PayoffDisplay";
import { AmountRow, Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatEuro } from "@/lib/format";
import { toNumber, urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import { useWegStepper } from "@/lib/useWegStepper";
import { STEUERJAHR } from "@/lib/steuerdaten";
import type { ToolParams } from "@/tools/types";
import { calculateRentenabschlag } from "@/tools/rentenabschlag/logic";
import { calculateRentenluecke } from "@/tools/rentenluecke/logic";
import { ruhestand } from "./manifest";
import { bewerteRuhestand } from "./urteil";

interface State extends Record<string, unknown> {
  aktuellesAlter: number;
  renteneintrittsalterJahre: number;
  renteneintrittsalterMonate: number;
  erwarteteRegelrente: number;
  lebenserwartung: number;

  nettoEinkommen: number;
  versorgungsniveauPercent: number;
  vorhandenesVermoegen: number;
  monatlicheSparrate: number;
  renditeAnsparphasePercent: number;
  renditeRentenphasePercent: number;
  inflationPercent: number;
}

const DEFAULTS: State = {
  aktuellesAlter: 40,
  renteneintrittsalterJahre: 63,
  renteneintrittsalterMonate: 0,
  erwarteteRegelrente: 1700,
  lebenserwartung: 85,

  nettoEinkommen: 3200,
  versorgungsniveauPercent: 80,
  vorhandenesVermoegen: 20000,
  monatlicheSparrate: 250,
  renditeAnsparphasePercent: 6,
  renditeRentenphasePercent: 3,
  inflationPercent: 2,
};

const STEPS = [
  { step: 1, id: "ru-eintritt", label: "1 · Renteneintritt" },
  { step: 2, id: "ru-vorsorge", label: "2 · Wunscheinkommen & Ersparnisse" },
  { step: 3, id: "ru-urteil", label: "3 · Urteil" },
] as const satisfies readonly WegStepDef[];

function initialState(params: ToolParams | undefined): State {
  return {
    ...DEFAULTS,
    aktuellesAlter: toNumber(params?.alter, DEFAULTS.aktuellesAlter),
    renteneintrittsalterJahre: toNumber(
      params?.renteJahre,
      DEFAULTS.renteneintrittsalterJahre,
    ),
    erwarteteRegelrente: toNumber(
      params?.regelrente,
      DEFAULTS.erwarteteRegelrente,
    ),
  };
}

const urteilTon: Record<"gedeckt" | "fehlbetrag", PayoffTone> = {
  gedeckt: "positive",
  // Kein eigener "danger"-Ton im Design-System – "accent" ist die Aufmerksamkeitsfarbe.
  fehlbetrag: "accent",
};

export default function RuhestandWeg({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      ...fallback,
      aktuellesAlter: toNumber(search.get("alter"), fallback.aktuellesAlter),
      renteneintrittsalterJahre: toNumber(
        search.get("renteJahre"),
        fallback.renteneintrittsalterJahre,
      ),
      renteneintrittsalterMonate: toNumber(
        search.get("renteMonate"),
        fallback.renteneintrittsalterMonate,
      ),
      erwarteteRegelrente: toNumber(
        search.get("regelrente"),
        fallback.erwarteteRegelrente,
      ),
      lebenserwartung: toNumber(search.get("leben"), fallback.lebenserwartung),
      nettoEinkommen: toNumber(search.get("netto"), fallback.nettoEinkommen),
      versorgungsniveauPercent: toNumber(
        search.get("niveau"),
        fallback.versorgungsniveauPercent,
      ),
      vorhandenesVermoegen: toNumber(
        search.get("vermoegen"),
        fallback.vorhandenesVermoegen,
      ),
      monatlicheSparrate: toNumber(
        search.get("sparrate"),
        fallback.monatlicheSparrate,
      ),
      renditeAnsparphasePercent: toNumber(
        search.get("renditean"),
        fallback.renditeAnsparphasePercent,
      ),
      renditeRentenphasePercent: toNumber(
        search.get("renditeren"),
        fallback.renditeRentenphasePercent,
      ),
      inflationPercent: toNumber(
        search.get("inflation"),
        fallback.inflationPercent,
      ),
    }),
    serialize: (next) => ({
      alter: urlValue(next.aktuellesAlter, DEFAULTS.aktuellesAlter),
      renteJahre: urlValue(
        next.renteneintrittsalterJahre,
        DEFAULTS.renteneintrittsalterJahre,
      ),
      renteMonate: urlValue(
        next.renteneintrittsalterMonate,
        DEFAULTS.renteneintrittsalterMonate,
      ),
      regelrente: urlValue(
        next.erwarteteRegelrente,
        DEFAULTS.erwarteteRegelrente,
      ),
      leben: urlValue(next.lebenserwartung, DEFAULTS.lebenserwartung),
      netto: urlValue(next.nettoEinkommen, DEFAULTS.nettoEinkommen),
      niveau: urlValue(
        next.versorgungsniveauPercent,
        DEFAULTS.versorgungsniveauPercent,
      ),
      vermoegen: urlValue(
        next.vorhandenesVermoegen,
        DEFAULTS.vorhandenesVermoegen,
      ),
      sparrate: urlValue(next.monatlicheSparrate, DEFAULTS.monatlicheSparrate),
      renditean: urlValue(
        next.renditeAnsparphasePercent,
        DEFAULTS.renditeAnsparphasePercent,
      ),
      renditeren: urlValue(
        next.renditeRentenphasePercent,
        DEFAULTS.renditeRentenphasePercent,
      ),
      inflation: urlValue(next.inflationPercent, DEFAULTS.inflationPercent),
    }),
  });

  const stepper = useWegStepper(STEPS.length);

  // Kein new Date() – STEUERJAHR ist die Referenz, mit der die ganze Seite
  // rechnet, und hält den statischen Export deterministisch.
  const geburtsjahr = STEUERJAHR - state.aktuellesAlter;

  const abschlagInput = useMemo(
    () => ({
      geburtsjahr,
      geplantesAlterJahre: state.renteneintrittsalterJahre,
      geplantesAlterMonate: state.renteneintrittsalterMonate,
      erwarteteRegelrente: state.erwarteteRegelrente,
      lebenserwartung: state.lebenserwartung,
    }),
    [
      geburtsjahr,
      state.renteneintrittsalterJahre,
      state.renteneintrittsalterMonate,
      state.erwarteteRegelrente,
      state.lebenserwartung,
    ],
  );
  const abschlag = useMemo(
    () => calculateRentenabschlag(abschlagInput),
    [abschlagInput],
  );

  // Ein Jahr früher, sonst gleiche Angaben – die Differenz ist der Effekt
  // genau dieses einen zusätzlichen Jahres.
  const proJahrFrueherLebenslang = useMemo(() => {
    const einJahrSpaeter = calculateRentenabschlag({
      ...abschlagInput,
      geplantesAlterJahre: abschlagInput.geplantesAlterJahre + 1,
    });
    return einJahrSpaeter.kumulierterEffekt - abschlag.kumulierterEffekt;
  }, [abschlagInput, abschlag.kumulierterEffekt]);

  const luecke = useMemo(
    () =>
      calculateRentenluecke({
        aktuellesAlter: state.aktuellesAlter,
        renteneintrittsalter: state.renteneintrittsalterJahre,
        lebenserwartung: state.lebenserwartung,
        einkommenModus: "prozent",
        nettoEinkommen: state.nettoEinkommen,
        versorgungsniveauPercent: state.versorgungsniveauPercent,
        gewuenschtesEinkommenFest: 0,
        gesetzlicheRente: abschlag.renteMitAnpassung,
        weitereRenten: 0,
        vorhandenesVermoegen: state.vorhandenesVermoegen,
        monatlicheSparrate: state.monatlicheSparrate,
        renditeAnsparphasePercent: state.renditeAnsparphasePercent,
        renditeRentenphasePercent: state.renditeRentenphasePercent,
        inflationPercent: state.inflationPercent,
      }),
    [state, abschlag.renteMitAnpassung],
  );

  const urteil = useMemo(
    () =>
      bewerteRuhestand({
        kapitalbedarf: luecke.kapitalbedarf,
        projiziertesKapital: luecke.projiziertesKapital,
      }),
    [luecke],
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
        id="ru-eintritt"
        ariaLabel="Renteneintritt"
        title="Wann soll die Rente beginnen?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zu Wunscheinkommen & Ersparnisse"
        onContinue={() => stepper.goTo(2, "ru-vorsorge")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            label="Aktuelles Alter"
            htmlFor="ru-alter"
            hint={`Ergibt Geburtsjahr ${geburtsjahr}.`}
          >
            <Stepper
              id="ru-alter"
              value={state.aktuellesAlter}
              min={16}
              max={80}
              onChange={(aktuellesAlter) => update({ aktuellesAlter })}
              ariaLabel="Aktuelles Alter in Jahren"
            />
          </Field>

          <Field label="Geplanter Renteneintritt" htmlFor="ru-rente-jahre">
            <div className="flex gap-3">
              <Stepper
                id="ru-rente-jahre"
                value={state.renteneintrittsalterJahre}
                min={60}
                max={75}
                onChange={(renteneintrittsalterJahre) =>
                  update({ renteneintrittsalterJahre })
                }
                suffix="Jahre"
                ariaLabel="Geplantes Renteneintrittsalter in Jahren"
              />
              <Stepper
                id="ru-rente-monate"
                value={state.renteneintrittsalterMonate}
                min={0}
                max={11}
                onChange={(renteneintrittsalterMonate) =>
                  update({ renteneintrittsalterMonate })
                }
                suffix="Monate"
                ariaLabel="Geplantes Renteneintrittsalter, zusätzliche Monate"
              />
            </div>
          </Field>

          <Field
            label="Erwartete Regelrente"
            htmlFor="ru-regelrente"
            hint="Aus der Renteninformation, bei Renteneintritt zur Regelaltersgrenze."
          >
            <UnitInput
              id="ru-regelrente"
              unit="€"
              value={state.erwarteteRegelrente}
              onChange={(erwarteteRegelrente) =>
                update({ erwarteteRegelrente })
              }
            />
          </Field>

          <Field label="Lebenserwartung" htmlFor="ru-leben">
            <Stepper
              id="ru-leben"
              value={state.lebenserwartung}
              min={65}
              max={110}
              onChange={(lebenserwartung) => update({ lebenserwartung })}
              suffix="Jahre"
              ariaLabel="Angenommene Lebenserwartung in Jahren"
            />
          </Field>
        </div>
      </WegStep>

      <WegStep
        step={2}
        id="ru-vorsorge"
        ariaLabel="Wunscheinkommen und Ersparnisse"
        title="Was soll im Ruhestand ankommen – und was ist schon da?"
        revealedUpTo={stepper.revealedUpTo}
        continueLabel="Weiter zum Urteil"
        onContinue={() => stepper.goTo(3, "ru-urteil")}
      >
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Heutiges Nettoeinkommen" htmlFor="ru-netto">
            <UnitInput
              id="ru-netto"
              unit="€"
              value={state.nettoEinkommen}
              onChange={(nettoEinkommen) => update({ nettoEinkommen })}
            />
          </Field>

          <Field
            label="Gewünschtes Versorgungsniveau"
            htmlFor="ru-niveau"
            hint="Anteil des heutigen Nettos, den die Rente ersetzen soll."
          >
            <UnitInput
              id="ru-niveau"
              unit="%"
              value={state.versorgungsniveauPercent}
              onChange={(versorgungsniveauPercent) =>
                update({ versorgungsniveauPercent })
              }
            />
          </Field>

          <Field label="Vorhandenes Vermögen" htmlFor="ru-vermoegen">
            <UnitInput
              id="ru-vermoegen"
              unit="€"
              value={state.vorhandenesVermoegen}
              onChange={(vorhandenesVermoegen) =>
                update({ vorhandenesVermoegen })
              }
            />
          </Field>

          <Field label="Monatliche Sparrate" htmlFor="ru-sparrate">
            <UnitInput
              id="ru-sparrate"
              unit="€"
              value={state.monatlicheSparrate}
              onChange={(monatlicheSparrate) => update({ monatlicheSparrate })}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Disclosure
            title="Rendite und Inflation"
            hint="Standardwerte passen für die meisten Fälle."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Rendite Ansparphase"
                htmlFor="ru-rendite-an"
                hint="Vor Renteneintritt."
              >
                <UnitInput
                  id="ru-rendite-an"
                  unit="%"
                  value={state.renditeAnsparphasePercent}
                  onChange={(renditeAnsparphasePercent) =>
                    update({ renditeAnsparphasePercent })
                  }
                />
              </Field>

              <Field
                label="Rendite Rentenphase"
                htmlFor="ru-rendite-ren"
                hint="Meist niedriger, sicherer angelegt."
              >
                <UnitInput
                  id="ru-rendite-ren"
                  unit="%"
                  value={state.renditeRentenphasePercent}
                  onChange={(renditeRentenphasePercent) =>
                    update({ renditeRentenphasePercent })
                  }
                />
              </Field>

              <Field label="Inflation" htmlFor="ru-inflation">
                <UnitInput
                  id="ru-inflation"
                  unit="%"
                  value={state.inflationPercent}
                  onChange={(inflationPercent) => update({ inflationPercent })}
                />
              </Field>
            </div>
          </Disclosure>
        </div>
      </WegStep>

      {stepper.revealedUpTo >= 3 && (
        <div id="ru-urteil" className="scroll-mt-8 flex flex-col gap-8">
          <ResultPanel
            footer={
              <ShareBar
                title="Check: Ruhestand"
                text={`${formatEuro(Math.abs(urteil.differenz))} ${urteil.gedeckt ? "Überschuss" : "Fehlbetrag"} zum Renteneintritt`}
              />
            }
          >
            <NumberDisplay
              value={urteil.differenz}
              format={(value) => formatEuro(Math.abs(value))}
              suffix={urteil.gedeckt ? "€ Überschuss" : "€ Fehlbetrag"}
              caption="Kapital zum Renteneintritt"
              tone={urteilTon[urteil.gedeckt ? "gedeckt" : "fehlbetrag"]}
              announce={`${formatEuro(Math.abs(urteil.differenz))} ${urteil.gedeckt ? "Überschuss" : "Fehlbetrag"}.`}
              hint={
                <>
                  Projiziertes Kapital{" "}
                  <strong className="font-semibold text-ink">
                    {formatEuro(urteil.projiziertesKapital)}
                  </strong>{" "}
                  gegen einen Kapitalbedarf von{" "}
                  <strong className="font-semibold text-ink">
                    {formatEuro(urteil.kapitalbedarf)}
                  </strong>
                  .
                </>
              }
            />
          </ResultPanel>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Rente nach Abschlag"
              value={formatEuro(abschlag.renteMitAnpassung)}
              hint={
                abschlag.abschlagProzent > 0
                  ? `${formatDecimal(abschlag.abschlagProzent)} % Abschlag`
                  : abschlag.zuschlagProzent > 0
                    ? `${formatDecimal(abschlag.zuschlagProzent)} % Zuschlag`
                    : "kein Abschlag"
              }
            />
            <Stat
              label="Monatliche Lücke"
              value={formatEuro(luecke.monatlicheLuecke)}
              hint="zum Wunscheinkommen"
            />
            <Stat
              label="Kapitalbedarf"
              value={formatEuro(luecke.kapitalbedarf)}
              hint={`für ${luecke.jahreRentenbezug} Jahre Rentenbezug`}
            />
            <Stat
              label="Ein Jahr früher kostet"
              value={formatEuro(Math.abs(proJahrFrueherLebenslang))}
              hint="lebenslang, zusätzlich"
            />
          </dl>

          <section
            aria-labelledby="ru-aufstellung"
            className="surface-soft p-6"
          >
            <h2
              id="ru-aufstellung"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Projiziertes Kapital gegen Kapitalbedarf
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              <AmountRow
                label="Projiziertes Kapital"
                value={urteil.projiziertesKapital}
              />
              <AmountRow label="Kapitalbedarf" value={-urteil.kapitalbedarf} />
              <AmountRow label="Differenz" value={urteil.differenz} stark />
            </ul>
          </section>

          {(abschlag.warnings.length > 0 || luecke.warnings.length > 0) && (
            <section aria-labelledby="ru-hinweise" className="surface-soft p-6">
              <h2
                id="ru-hinweise"
                className="font-display text-lg font-semibold tracking-tight"
              >
                Auffällig
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5 text-[15px] text-muted">
                {[...abschlag.warnings, ...luecke.warnings].map((warning) => (
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

          <WegSourceTools tools={ruhestand.sourceTools} />
        </div>
      )}
    </div>
  );
}
