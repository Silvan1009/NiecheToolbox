"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import {
  Field,
  SegmentedControl,
  Select,
  TextInput,
  Toggle,
} from "@/components/ui/Field";
import { PayoffDisplay } from "@/components/ui/PayoffDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { addDays, isValidIso, todayIso } from "@/lib/date";
import {
  formatDate,
  formatInteger,
  formatWeekdayLong,
  plural,
} from "@/lib/format";
import { useUrlState } from "@/lib/useUrlState";
import { isRegionCode, regions, type RegionCode } from "@/lib/regionen";
import type { ToolParams } from "@/tools/types";
import { kuendigungsfristAffiliate } from "./affiliate";
import {
  calculateNotice,
  contractLabels,
  fristLabel,
  partiesFor,
  partyLabels,
  type ContractKind,
  type Direction,
  type NoticeResult,
  type Party,
} from "./logic";

interface State extends Record<string, unknown> {
  contract: ContractKind;
  party: Party;
  direction: Direction;
  zugang: string;
  wunschende: string;
  since: string;
  region: RegionCode;
  probezeit: boolean;
}

const CONTRACTS = [
  { value: "wohnung", label: "Wohnung" },
  { value: "arbeit", label: "Arbeitsvertrag" },
] as const satisfies readonly { value: ContractKind; label: string }[];

const DIRECTIONS = [
  { value: "vorwaerts", label: "Ich kündige an einem Tag" },
  { value: "rueckwaerts", label: "Ich will zu einem Termin raus" },
] as const satisfies readonly { value: Direction; label: string }[];

const isContract = (value: unknown): value is ContractKind =>
  value === "wohnung" || value === "arbeit";

const isDirection = (value: unknown): value is Direction =>
  value === "vorwaerts" || value === "rueckwaerts";

const isParty = (value: unknown): value is Party =>
  typeof value === "string" && value in partyLabels;

function toIsoOr(value: unknown, fallback: string): string {
  return isValidIso(value) ? value : fallback;
}

function initialState(params: ToolParams | undefined): State {
  const today = toIsoOr(params?.zugang, todayIso());
  const contract = isContract(params?.art) ? params.art : "wohnung";
  const party = isParty(params?.seite) ? params.seite : partiesFor[contract][0];

  return {
    contract,
    // Eine Partei, die nicht zur Vertragsart passt, würde stillschweigend
    // falsch rechnen – deshalb hier abfangen statt später korrigieren.
    party: partiesFor[contract].includes(party)
      ? party
      : partiesFor[contract][0],
    direction: isDirection(params?.richtung) ? params.richtung : "vorwaerts",
    zugang: today,
    wunschende: toIsoOr(params?.ende, addDays(today, 120)),
    since: toIsoOr(params?.beginn, addDays(today, -1095)),
    region: isRegionCode(params?.bl) ? params.bl : "nw",
    probezeit: params?.probe === "1",
  };
}

export default function KuendigungsfristTool({
  params,
}: {
  params?: ToolParams;
}) {
  const fallback = initialState(params);

  const [state, update] = useUrlState<State>({
    initialState: fallback,
    parse: (search, previous) => {
      const contract = isContract(search.get("art"))
        ? (search.get("art") as ContractKind)
        : previous.contract;
      const party = isParty(search.get("seite"))
        ? (search.get("seite") as Party)
        : previous.party;

      return {
        contract,
        party: partiesFor[contract].includes(party)
          ? party
          : partiesFor[contract][0],
        direction: isDirection(search.get("richtung"))
          ? (search.get("richtung") as Direction)
          : previous.direction,
        zugang: toIsoOr(search.get("zugang"), previous.zugang),
        wunschende: toIsoOr(search.get("ende"), previous.wunschende),
        since: toIsoOr(search.get("beginn"), previous.since),
        region: isRegionCode(search.get("bl"))
          ? (search.get("bl") as RegionCode)
          : previous.region,
        probezeit: search.get("probe") === "1",
      };
    },
    serialize: (next) => ({
      art: next.contract,
      seite: next.party,
      richtung: next.direction,
      zugang: next.zugang,
      ende: next.wunschende,
      beginn: next.since,
      bl: next.region,
      probe: next.probezeit ? "1" : "0",
    }),
  });

  const result = useMemo(
    () =>
      calculateNotice({
        contract: state.contract,
        party: state.party,
        direction: state.direction,
        zugang: state.zugang,
        wunschende: state.wunschende,
        since: state.since,
        region: state.region,
        probezeit: state.contract === "arbeit" && state.probezeit,
      }),
    [
      state.contract,
      state.party,
      state.direction,
      state.zugang,
      state.wunschende,
      state.since,
      state.region,
      state.probezeit,
    ],
  );

  const backwards = state.direction === "rueckwaerts";
  const headlineDate = backwards ? result.zugang : result.end;

  function switchContract(contract: ContractKind) {
    update({ contract, party: partiesFor[contract][0] });
  }

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <div className="flex flex-col gap-5">
          <Field label="Was wird gekündigt?" htmlFor="kf-art">
            <SegmentedControl
              value={state.contract}
              options={CONTRACTS}
              onChange={switchContract}
              ariaLabel="Vertragsart"
            />
          </Field>

          <Field label="Was willst du wissen?" htmlFor="kf-richtung">
            <SegmentedControl
              value={state.direction}
              options={DIRECTIONS}
              onChange={(direction) => update({ direction })}
              ariaLabel="Rechenrichtung"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Wer kündigt?" htmlFor="kf-seite">
              <Select
                id="kf-seite"
                value={state.party}
                onChange={(event) =>
                  update({ party: event.target.value as Party })
                }
              >
                {partiesFor[state.contract].map((party) => (
                  <option key={party} value={party}>
                    {partyLabels[party]}
                  </option>
                ))}
              </Select>
            </Field>

            {backwards ? (
              <Field
                label="Vertrag soll enden am"
                htmlFor="kf-ende"
                hint="Der Rechner nennt den letzten Tag für den Zugang."
              >
                <TextInput
                  id="kf-ende"
                  type="date"
                  value={state.wunschende}
                  onChange={(event) =>
                    update({
                      wunschende: toIsoOr(event.target.value, state.wunschende),
                    })
                  }
                  className="font-mono"
                />
              </Field>
            ) : (
              <Field
                label="Kündigung geht zu am"
                htmlFor="kf-zugang"
                hint="Der Tag, an dem sie beim Empfänger ankommt – nicht das Absenden."
              >
                <TextInput
                  id="kf-zugang"
                  type="date"
                  value={state.zugang}
                  onChange={(event) =>
                    update({
                      zugang: toIsoOr(event.target.value, state.zugang),
                    })
                  }
                  className="font-mono"
                />
              </Field>
            )}

            <Field
              label={
                state.contract === "wohnung"
                  ? "Mietverhältnis seit"
                  : "Beschäftigt seit"
              }
              htmlFor="kf-beginn"
              hint={
                state.contract === "wohnung"
                  ? "Bestimmt die Frist, wenn der Vermieter kündigt."
                  : "Bestimmt die Frist, wenn der Arbeitgeber kündigt."
              }
            >
              <TextInput
                id="kf-beginn"
                type="date"
                value={state.since}
                onChange={(event) =>
                  update({ since: toIsoOr(event.target.value, state.since) })
                }
                className="font-mono"
              />
            </Field>

            {state.contract === "wohnung" && (
              <Field
                label="Bundesland"
                htmlFor="kf-bl"
                hint="Entscheidet, welche Feiertage bei den Werktagen wegfallen."
              >
                <Select
                  id="kf-bl"
                  value={state.region}
                  onChange={(event) =>
                    update({ region: event.target.value as RegionCode })
                  }
                >
                  {regions.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
          </div>

          {state.contract === "arbeit" && (
            <Toggle
              checked={state.probezeit}
              onChange={(probezeit) => update({ probezeit })}
              label="Kündigung fällt in die Probezeit"
              hint="Dann gilt eine Frist von zwei Wochen zu jedem beliebigen Tag."
            />
          )}
        </div>
      </Card>

      <ResultPanel
        footer={
          <ShareBar
            title="Kündigungsfrist"
            text={`${contractLabels[state.contract]}: Ende am ${formatDate(result.end)}`}
          />
        }
      >
        <PayoffDisplay
          value={formatDate(headlineDate)}
          suffix={formatWeekdayLong(headlineDate)}
          caption={
            backwards
              ? "Kündigung muss zugehen bis"
              : "Letzter Tag des Vertrags"
          }
          announce={
            backwards
              ? `Die Kündigung muss spätestens am ${formatDate(result.zugang)} zugehen. Der Vertrag endet dann am ${formatDate(result.end)}.`
              : `Der Vertrag endet am ${formatDate(result.end)}, das sind ${formatInteger(result.daysOfNotice)} Tage.`
          }
          hint={
            backwards ? (
              <>
                Geht die Kündigung an diesem Tag zu, endet der Vertrag am{" "}
                <strong className="font-semibold text-ink">
                  {formatDate(result.end)}
                </strong>
                {result.endsEarlierThanWanted && (
                  <>
                    {" "}
                    – also früher als gewünscht, weil{" "}
                    {formatDate(state.wunschende)} kein zulässiger Endtermin ist
                  </>
                )}
                .
              </>
            ) : (
              <>
                Das sind{" "}
                <strong className="font-semibold text-ink">
                  {formatInteger(result.daysOfNotice)} Tage
                </strong>{" "}
                ab dem Zugang – gesetzliche Frist: {fristLabel(result.frist)}.
              </>
            )
          }
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Gesetzliche Frist"
          value={fristLabel(result.frist)}
          hint={terminHint(result)}
        />
        <Stat
          label="Zeit bis zum Ende"
          value={`${formatInteger(result.daysOfNotice)} ${plural(result.daysOfNotice, "Tag", "Tage")}`}
          hint="ab dem Zugang gerechnet"
        />
        <Stat
          label={
            state.contract === "wohnung" ? "Wohndauer" : "Betriebszugehörigkeit"
          }
          value={`${formatInteger(result.years)} ${plural(result.years, "Jahr", "Jahre")}`}
          hint={
            result.frist.termin === "monatsende" || state.party === "vermieter"
              ? "bestimmt die Länge der Frist"
              : "wirkt sich auf diese Frist nicht aus"
          }
        />
      </dl>

      <section aria-labelledby="kf-weg" className="surface-soft p-6">
        <h2
          id="kf-weg"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Wie das zusammenkommt
        </h2>
        <ol className="mt-4 flex flex-col gap-3">
          {explain(result, state).map((step, index) => (
            <li key={step} className="flex gap-3 text-[15px]">
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-pill bg-accent-soft font-mono text-[13px] font-semibold text-accent"
              >
                {index + 1}
              </span>
              <span className="text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="kf-hinweise" className="surface-soft p-6">
          <h2
            id="kf-hinweise"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Darauf noch achten
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

      <AffiliateBlock slots={kuendigungsfristAffiliate} result={result} />
    </div>
  );
}

/** Kurzform des zulässigen Endtermins – ergänzt die Fristlänge. */
function terminHint(result: NoticeResult): string {
  switch (result.frist.termin) {
    case "beliebig":
      return "zu jedem beliebigen Tag";
    case "halbmonat":
      return "zum 15. oder zum Monatsende";
    case "monatsende":
      return "zum Monatsende";
    case "karenz":
      return "zum Monatsende, mit Karenzzeit";
  }
}

/**
 * Der Rechenweg in Klartext. Bewusst hier und nicht in der Logik: die Logik
 * liefert Fakten, die Formulierung gehört in die Oberfläche.
 */
function explain(result: NoticeResult, state: State): string[] {
  const steps: string[] = [];
  const zugang = `${formatWeekdayLong(result.zugang)}, ${formatDate(result.zugang)}`;

  if (state.direction === "rueckwaerts") {
    steps.push(
      `Gesucht ist der späteste Zugang, mit dem der Vertrag noch bis zum ${formatDate(state.wunschende)} endet.`,
    );
  }

  steps.push(
    state.direction === "rueckwaerts"
      ? `Die Kündigung muss am ${zugang} beim Empfänger sein. Maßgeblich ist der Zugang, nicht der Poststempel.`
      : `Die Kündigung geht am ${zugang} zu. Maßgeblich ist der Zugang, nicht der Poststempel.`,
  );

  switch (result.frist.termin) {
    case "beliebig":
      steps.push(
        `In der Probezeit gilt eine Frist von ${fristLabel(result.frist)} ohne festen Endtermin.`,
      );
      break;

    case "halbmonat": {
      const earliest = addDays(result.zugang, result.frist.value * 7);
      steps.push(
        `Die gesetzliche Frist beträgt ${fristLabel(result.frist)}. Sie läuft am ${formatDate(earliest)} ab.`,
      );
      steps.push(
        `Enden darf der Vertrag nur zum 15. oder zum Monatsletzten – der nächste dieser Termine ist der ${formatDate(result.end)}.`,
      );
      break;
    }

    case "monatsende":
      steps.push(
        `Nach ${formatInteger(result.years)} ${plural(result.years, "Jahr", "Jahren")} Betriebszugehörigkeit beträgt die Frist ${fristLabel(result.frist)} zum Monatsende.`,
      );
      steps.push(
        `Damit endet das Arbeitsverhältnis am ${formatDate(result.end)}.`,
      );
      break;

    case "karenz": {
      const deadline = result.karenzDeadline
        ? formatDate(result.karenzDeadline)
        : "";
      steps.push(
        result.withinKarenz
          ? `Der dritte Werktag des Monats war der ${deadline}. Die Kündigung war rechtzeitig, deshalb zählt der laufende Monat als erster Fristmonat mit.`
          : `Der dritte Werktag des Monats war der ${deadline}. Die Kündigung kam danach, deshalb zählt die Frist erst ab dem nächsten Monat.`,
      );
      steps.push(
        `${fristLabel(result.frist)} zum Monatsende ergeben den ${formatDate(result.end)}.`,
      );
      break;
    }
  }

  return steps;
}
