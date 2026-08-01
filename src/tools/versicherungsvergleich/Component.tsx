"use client";

import { useMemo, type ReactNode } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, SegmentedControl, Select, Stepper, TextInput, Toggle } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatEuro } from "@/lib/format";
import { urlValue } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { versicherungsvergleichAffiliate } from "./affiliate";
import {
  buRisikogruppeLabels,
  calculateBu,
  calculateHaftpflicht,
  calculateKfz,
  defaultBuInput,
  defaultHaftpflichtInput,
  defaultKfzInput,
  haftpflichtPersonenkreisLabels,
  kfzAlterLabels,
  kfzDeckungLabels,
  kfzFahrzeugLabels,
  kfzKmLabels,
  kfzRegionLabels,
  kfzSfLabels,
  type BuInput,
  type BuRisikogruppe,
  type Einordnung,
  type HaftpflichtInput,
  type HaftpflichtPersonenkreis,
  type KfzAlter,
  type KfzDeckung,
  type KfzFahrleistung,
  type KfzFahrzeug,
  type KfzInput,
  type KfzRegion,
  type KfzSfKlasse,
  type SchaetzungResult,
  type VersicherungsArt,
} from "./logic";

interface State extends Record<string, unknown> {
  art: VersicherungsArt;
  kfz: KfzInput;
  haftpflicht: HaftpflichtInput;
  bu: BuInput;
}

const DEFAULTS: State = {
  art: "kfz",
  kfz: defaultKfzInput(),
  haftpflicht: defaultHaftpflichtInput(),
  bu: defaultBuInput(),
};

const ART_OPTIONS = [
  { value: "kfz", label: "Kfz-Versicherung" },
  { value: "haftpflicht", label: "Privathaftpflicht" },
  { value: "bu", label: "Berufsunfähigkeit" },
] as const satisfies readonly { value: VersicherungsArt; label: string }[];

const KFZ_DECKUNG_OPTIONS = (Object.keys(kfzDeckungLabels) as KfzDeckung[]).map((value) => ({
  value,
  label: kfzDeckungLabels[value],
}));

const HAFTPFLICHT_KREIS_OPTIONS = (
  Object.keys(haftpflichtPersonenkreisLabels) as HaftpflichtPersonenkreis[]
).map((value) => ({ value, label: haftpflichtPersonenkreisLabels[value] }));

const isArt = (value: unknown): value is VersicherungsArt =>
  value === "kfz" || value === "haftpflicht" || value === "bu";
const isDeckung = (value: unknown): value is KfzDeckung =>
  typeof value === "string" && value in kfzDeckungLabels;
const isSfKlasse = (value: unknown): value is KfzSfKlasse =>
  typeof value === "string" && value in kfzSfLabels;
const isRegion = (value: unknown): value is KfzRegion =>
  typeof value === "string" && value in kfzRegionLabels;
const isFahrzeug = (value: unknown): value is KfzFahrzeug =>
  typeof value === "string" && value in kfzFahrzeugLabels;
const isAlter = (value: unknown): value is KfzAlter =>
  typeof value === "string" && value in kfzAlterLabels;
const isKm = (value: unknown): value is KfzFahrleistung =>
  typeof value === "string" && value in kfzKmLabels;
const isKreis = (value: unknown): value is HaftpflichtPersonenkreis =>
  typeof value === "string" && value in haftpflichtPersonenkreisLabels;
const isRisikogruppe = (value: unknown): value is BuRisikogruppe =>
  typeof value === "string" && value in buRisikogruppeLabels;

function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "1" || value === 1 || value === "true";
}

function readKfz(source: ToolParams | URLSearchParams, fallback: KfzInput): KfzInput {
  const get = (key: string) =>
    source instanceof URLSearchParams ? source.get(key) : (source[key] ?? null);
  return {
    deckung: isDeckung(get("kfz_deckung")) ? (get("kfz_deckung") as KfzDeckung) : fallback.deckung,
    sfKlasse: isSfKlasse(get("kfz_sf")) ? (get("kfz_sf") as KfzSfKlasse) : fallback.sfKlasse,
    region: isRegion(get("kfz_region")) ? (get("kfz_region") as KfzRegion) : fallback.region,
    fahrzeug: isFahrzeug(get("kfz_fahrzeug"))
      ? (get("kfz_fahrzeug") as KfzFahrzeug)
      : fallback.fahrzeug,
    fahrerAlter: isAlter(get("kfz_alter"))
      ? (get("kfz_alter") as KfzAlter)
      : fallback.fahrerAlter,
    kmProJahr: isKm(get("kfz_km")) ? (get("kfz_km") as KfzFahrleistung) : fallback.kmProJahr,
    eigenerBeitragJahr: toNumber(get("kfz_beitrag"), fallback.eigenerBeitragJahr),
  };
}

function readHaftpflicht(
  source: ToolParams | URLSearchParams,
  fallback: HaftpflichtInput,
): HaftpflichtInput {
  const get = (key: string) =>
    source instanceof URLSearchParams ? source.get(key) : (source[key] ?? null);
  return {
    personenkreis: isKreis(get("hp_kreis"))
      ? (get("hp_kreis") as HaftpflichtPersonenkreis)
      : fallback.personenkreis,
    mitSelbstbeteiligung: toBool(get("hp_sb"), fallback.mitSelbstbeteiligung),
    eigenerBeitragJahr: toNumber(get("hp_beitrag"), fallback.eigenerBeitragJahr),
  };
}

function readBu(source: ToolParams | URLSearchParams, fallback: BuInput): BuInput {
  const get = (key: string) =>
    source instanceof URLSearchParams ? source.get(key) : (source[key] ?? null);
  return {
    alterBeiEintritt: toNumber(get("bu_alter"), fallback.alterBeiEintritt),
    buRenteMonat: toNumber(get("bu_rente"), fallback.buRenteMonat),
    risikogruppe: isRisikogruppe(get("bu_risiko"))
      ? (get("bu_risiko") as BuRisikogruppe)
      : fallback.risikogruppe,
    eigenerBeitragMonat: toNumber(get("bu_beitrag"), fallback.eigenerBeitragMonat),
  };
}

function initialState(params: ToolParams | undefined): State {
  const source = params ?? {};
  return {
    art: isArt(source.art) ? source.art : DEFAULTS.art,
    kfz: readKfz(source, DEFAULTS.kfz),
    haftpflicht: readHaftpflicht(source, DEFAULTS.haftpflicht),
    bu: readBu(source, DEFAULTS.bu),
  };
}

export default function VersicherungsvergleichTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      art: isArt(search.get("art")) ? (search.get("art") as VersicherungsArt) : fallback.art,
      kfz: readKfz(search, fallback.kfz),
      haftpflicht: readHaftpflicht(search, fallback.haftpflicht),
      bu: readBu(search, fallback.bu),
    }),
    serialize: (next) => ({
      art: urlValue(next.art, DEFAULTS.art),
      kfz_deckung: urlValue(next.kfz.deckung, DEFAULTS.kfz.deckung),
      kfz_sf: urlValue(next.kfz.sfKlasse, DEFAULTS.kfz.sfKlasse),
      kfz_region: urlValue(next.kfz.region, DEFAULTS.kfz.region),
      kfz_fahrzeug: urlValue(next.kfz.fahrzeug, DEFAULTS.kfz.fahrzeug),
      kfz_alter: urlValue(next.kfz.fahrerAlter, DEFAULTS.kfz.fahrerAlter),
      kfz_km: urlValue(next.kfz.kmProJahr, DEFAULTS.kfz.kmProJahr),
      kfz_beitrag: urlValue(next.kfz.eigenerBeitragJahr, DEFAULTS.kfz.eigenerBeitragJahr),
      hp_kreis: urlValue(next.haftpflicht.personenkreis, DEFAULTS.haftpflicht.personenkreis),
      hp_sb: next.haftpflicht.mitSelbstbeteiligung === DEFAULTS.haftpflicht.mitSelbstbeteiligung
        ? ""
        : next.haftpflicht.mitSelbstbeteiligung
          ? "1"
          : "0",
      hp_beitrag: urlValue(
        next.haftpflicht.eigenerBeitragJahr,
        DEFAULTS.haftpflicht.eigenerBeitragJahr,
      ),
      bu_alter: urlValue(next.bu.alterBeiEintritt, DEFAULTS.bu.alterBeiEintritt),
      bu_rente: urlValue(next.bu.buRenteMonat, DEFAULTS.bu.buRenteMonat),
      bu_risiko: urlValue(next.bu.risikogruppe, DEFAULTS.bu.risikogruppe),
      bu_beitrag: urlValue(next.bu.eigenerBeitragMonat, DEFAULTS.bu.eigenerBeitragMonat),
    }),
  });

  const updateKfz = (patch: Partial<KfzInput>) => update({ kfz: { ...state.kfz, ...patch } });
  const updateHaftpflicht = (patch: Partial<HaftpflichtInput>) =>
    update({ haftpflicht: { ...state.haftpflicht, ...patch } });
  const updateBu = (patch: Partial<BuInput>) => update({ bu: { ...state.bu, ...patch } });

  const result = useMemo<SchaetzungResult>(() => {
    if (state.art === "haftpflicht") return calculateHaftpflicht(state.haftpflicht);
    if (state.art === "bu") return calculateBu(state.bu);
    return calculateKfz(state.kfz);
  }, [state]);

  const suffix = result.zeitraum === "monat" ? "pro Monat" : "pro Jahr";

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Art der Versicherung">
        <Field label="Art der Versicherung" htmlFor="vv-art">
          <SegmentedControl
            value={state.art}
            options={ART_OPTIONS}
            onChange={(art) => update({ art })}
            ariaLabel="Versicherungsart"
          />
        </Field>
      </Card>

      {state.art === "kfz" && (
        <Card as="section" className="p-6" aria-label="Angaben zur Kfz-Versicherung">
          <CardTitle>Fahrzeug &amp; Profil</CardTitle>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="Deckung" htmlFor="vv-kfz-deckung">
              <Select
                id="vv-kfz-deckung"
                value={state.kfz.deckung}
                onChange={(event) => updateKfz({ deckung: event.target.value as KfzDeckung })}
              >
                {KFZ_DECKUNG_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Schadenfreiheitsklasse"
              htmlFor="vv-kfz-sf"
              hint="Der stärkste Hebel bei der Kfz-Prämie."
            >
              <Select
                id="vv-kfz-sf"
                value={state.kfz.sfKlasse}
                onChange={(event) => updateKfz({ sfKlasse: event.target.value as KfzSfKlasse })}
              >
                {(Object.keys(kfzSfLabels) as KfzSfKlasse[]).map((value) => (
                  <option key={value} value={value}>
                    {kfzSfLabels[value]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Region" htmlFor="vv-kfz-region">
              <Select
                id="vv-kfz-region"
                value={state.kfz.region}
                onChange={(event) => updateKfz({ region: event.target.value as KfzRegion })}
              >
                {(Object.keys(kfzRegionLabels) as KfzRegion[]).map((value) => (
                  <option key={value} value={value}>
                    {kfzRegionLabels[value]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Fahrzeug" htmlFor="vv-kfz-fahrzeug">
              <Select
                id="vv-kfz-fahrzeug"
                value={state.kfz.fahrzeug}
                onChange={(event) => updateKfz({ fahrzeug: event.target.value as KfzFahrzeug })}
              >
                {(Object.keys(kfzFahrzeugLabels) as KfzFahrzeug[]).map((value) => (
                  <option key={value} value={value}>
                    {kfzFahrzeugLabels[value]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Alter der fahrenden Person" htmlFor="vv-kfz-alter">
              <Select
                id="vv-kfz-alter"
                value={state.kfz.fahrerAlter}
                onChange={(event) => updateKfz({ fahrerAlter: event.target.value as KfzAlter })}
              >
                {(Object.keys(kfzAlterLabels) as KfzAlter[]).map((value) => (
                  <option key={value} value={value}>
                    {kfzAlterLabels[value]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Fahrleistung" htmlFor="vv-kfz-km">
              <Select
                id="vv-kfz-km"
                value={state.kfz.kmProJahr}
                onChange={(event) => updateKfz({ kmProJahr: event.target.value as KfzFahrleistung })}
              >
                {(Object.keys(kfzKmLabels) as KfzFahrleistung[]).map((value) => (
                  <option key={value} value={value}>
                    {kfzKmLabels[value]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-5">
            <Field
              label="Deine aktuelle Prämie (optional)"
              htmlFor="vv-kfz-beitrag"
              hint="Zum Vergleich mit der geschätzten Spanne."
            >
              <UnitInput
                id="vv-kfz-beitrag"
                unit="€/Jahr"
                value={state.kfz.eigenerBeitragJahr}
                onChange={(eigenerBeitragJahr) => updateKfz({ eigenerBeitragJahr })}
              />
            </Field>
          </div>
        </Card>
      )}

      {state.art === "haftpflicht" && (
        <Card as="section" className="p-6" aria-label="Angaben zur Privathaftpflicht">
          <CardTitle>Haushalt</CardTitle>
          <div className="mt-4 flex flex-col gap-5">
            <Field label="Personenkreis" htmlFor="vv-hp-kreis">
              <SegmentedControl
                value={state.haftpflicht.personenkreis}
                options={HAFTPFLICHT_KREIS_OPTIONS}
                onChange={(personenkreis) => updateHaftpflicht({ personenkreis })}
                ariaLabel="Personenkreis"
              />
            </Field>

            <Toggle
              checked={state.haftpflicht.mitSelbstbeteiligung}
              onChange={(mitSelbstbeteiligung) => updateHaftpflicht({ mitSelbstbeteiligung })}
              label="Selbstbeteiligung vereinbart"
              hint="150–250 € Selbstbehalt senken die Prämie meist um rund 10 %."
            />

            <Field
              label="Deine aktuelle Prämie (optional)"
              htmlFor="vv-hp-beitrag"
              hint="Zum Vergleich mit der geschätzten Spanne."
            >
              <UnitInput
                id="vv-hp-beitrag"
                unit="€/Jahr"
                value={state.haftpflicht.eigenerBeitragJahr}
                onChange={(eigenerBeitragJahr) => updateHaftpflicht({ eigenerBeitragJahr })}
              />
            </Field>
          </div>
        </Card>
      )}

      {state.art === "bu" && (
        <Card as="section" className="p-6" aria-label="Angaben zur Berufsunfähigkeit">
          <CardTitle>Absicherung &amp; Beruf</CardTitle>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="Alter bei Eintritt" htmlFor="vv-bu-alter">
              <Stepper
                id="vv-bu-alter"
                value={state.bu.alterBeiEintritt}
                min={18}
                max={60}
                onChange={(alterBeiEintritt) => updateBu({ alterBeiEintritt })}
                suffix="Jahre"
                ariaLabel="Alter bei Eintritt"
              />
            </Field>

            <Field
              label="Gewünschte BU-Rente"
              htmlFor="vv-bu-rente"
              hint="Sollte die bisherigen laufenden Kosten decken."
            >
              <UnitInput
                id="vv-bu-rente"
                unit="€/Monat"
                value={state.bu.buRenteMonat}
                onChange={(buRenteMonat) => updateBu({ buRenteMonat })}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Risikogruppe des Berufs" htmlFor="vv-bu-risiko">
                <Select
                  id="vv-bu-risiko"
                  value={state.bu.risikogruppe}
                  onChange={(event) =>
                    updateBu({ risikogruppe: event.target.value as BuRisikogruppe })
                  }
                >
                  {(Object.keys(buRisikogruppeLabels) as BuRisikogruppe[]).map((value) => (
                    <option key={value} value={value}>
                      {buRisikogruppeLabels[value]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>

          <div className="mt-5">
            <Field
              label="Dein aktueller Beitrag (optional)"
              htmlFor="vv-bu-beitrag"
              hint="Zum Vergleich mit der geschätzten Spanne."
            >
              <UnitInput
                id="vv-bu-beitrag"
                unit="€/Monat"
                value={state.bu.eigenerBeitragMonat}
                onChange={(eigenerBeitragMonat) => updateBu({ eigenerBeitragMonat })}
              />
            </Field>
          </div>
        </Card>
      )}

      <ResultPanel
        footer={
          <ShareBar
            title="Versicherungs-Vergleichsrechner"
            text={`${formatEuro(result.richtwert)} ${suffix} als Richtwert`}
          />
        }
      >
        <NumberDisplay
          value={result.richtwert}
          format={formatEuro}
          suffix={suffix}
          caption="Geschätzter Richtwert"
          announce={`${formatEuro(result.richtwert)} ${suffix}, typische Spanne ${formatEuro(result.spanneMin)} bis ${formatEuro(result.spanneMax)}.`}
          hint={<Einordnungshinweis result={result} suffix={suffix} />}
        />
      </ResultPanel>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Typische Spanne"
          value={`${formatEuro(result.spanneMin)} – ${formatEuro(result.spanneMax)}`}
          hint={suffix}
        />
        <Stat
          label="Deine Prämie"
          value={result.eigenerBeitrag === null ? "–" : formatEuro(result.eigenerBeitrag)}
          hint={
            result.eigenerBeitrag === null
              ? "noch nicht eingetragen"
              : einordnungLabel(result.einordnung)
          }
        />
      </dl>

      <section aria-labelledby="vv-faktoren" className="surface-soft p-6">
        <h2
          id="vv-faktoren"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Woraus sich die Schätzung zusammensetzt
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {result.faktoren.map((faktor) => (
            <li
              key={faktor.label}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-3 first:border-0 first:pt-0"
            >
              <span className="text-[15px]">
                {faktor.label}
                <span className="ml-2 text-[13px] text-muted">{faktor.wert}</span>
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {faktor.effekt}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {result.warnings.length > 0 && (
        <section aria-labelledby="vv-hinweise" className="surface-soft p-6">
          <h2
            id="vv-hinweise"
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

      <AffiliateBlock slots={versicherungsvergleichAffiliate} result={result} />
    </div>
  );
}

function einordnungLabel(einordnung: Einordnung | null): string {
  switch (einordnung) {
    case "guenstig":
      return "günstiger als typisch";
    case "im-rahmen":
      return "im typischen Rahmen";
    case "erhoeht":
      return "über dem Durchschnitt";
    case "deutlich-erhoeht":
      return "deutlich über dem Durchschnitt";
    default:
      return "";
  }
}

function Einordnungshinweis({
  result,
  suffix,
}: {
  result: SchaetzungResult;
  suffix: string;
}) {
  if (result.eigenerBeitrag === null) {
    return (
      <>
        Typische Spanne für dieses Profil:{" "}
        <strong className="font-semibold text-ink">
          {formatEuro(result.spanneMin)} – {formatEuro(result.spanneMax)}
        </strong>{" "}
        {suffix}.
      </>
    );
  }

  return (
    <>
      Deine Prämie von{" "}
      <strong className="font-semibold text-ink">{formatEuro(result.eigenerBeitrag)}</strong>{" "}
      liegt {einordnungLabel(result.einordnung)} – typisch sind{" "}
      {formatEuro(result.spanneMin)} bis {formatEuro(result.spanneMax)} {suffix}.
    </>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-lg font-semibold tracking-tight">{children}</h2>
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
        value={value === 0 ? "" : String(value).replace(".", ",")}
        placeholder="0"
        onChange={(event) => onChange(toNumber(event.target.value, 0))}
        className="pr-20 font-mono"
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

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
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
