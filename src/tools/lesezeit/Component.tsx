"use client";

import { useMemo } from "react";
import { AffiliateBlock } from "@/components/AffiliateBlock";
import { Card } from "@/components/ui/Card";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { NumberDisplay } from "@/components/ui/NumberDisplay";
import { Stat } from "@/components/ui/Readout";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { ShareBar } from "@/components/ui/ShareBar";
import { formatDecimal, formatInteger } from "@/lib/format";
import { toCount } from "@/lib/parse";
import { useUrlState } from "@/lib/useUrlState";
import type { ToolParams } from "@/tools/types";
import { lesezeitAffiliate } from "./affiliate";
import {
  calculateReadingTime,
  formatDuration,
  getPace,
  paceOptions,
  type ReadingPace,
} from "./logic";

interface State extends Record<string, unknown> {
  text: string;
  /** Wortzahl für den Fall, dass kein Text eingegeben ist (geteilte Links). */
  words: number;
  pace: ReadingPace;
}

const isPace = (value: unknown): value is ReadingPace =>
  paceOptions.some((option) => option.id === value);

function initialState(params: ToolParams | undefined): State {
  return {
    text: "",
    words: toCount(params?.woerter, 0),
    pace: isPace(params?.tempo) ? params.tempo : "normal",
  };
}

export default function LesezeitTool({ params }: { params?: ToolParams }) {
  const [state, update] = useUrlState<State>({
    initialState: initialState(params),
    parse: (search, fallback) => ({
      text: fallback.text,
      words: toCount(search.get("woerter"), fallback.words),
      pace: isPace(search.get("tempo"))
        ? (search.get("tempo") as ReadingPace)
        : fallback.pace,
    }),
    // Der Text selbst landet bewusst NICHT in der URL – nur die Wortzahl.
    // So bleibt ein geteilter Link kurz und verrät den Inhalt nicht.
    serialize: (next) => ({
      woerter: String(
        next.text.trim().length > 0
          ? calculateReadingTime({ text: next.text, pace: next.pace }).words
          : next.words,
      ),
      tempo: next.pace,
    }),
  });

  const result = useMemo(
    () =>
      calculateReadingTime({
        text: state.text,
        words: state.words,
        pace: state.pace,
      }),
    [state.text, state.words, state.pace],
  );

  const hasText = state.text.trim().length > 0;
  const pace = getPace(state.pace);
  const empty = result.words === 0;

  return (
    <div className="flex flex-col gap-8">
      <Card as="section" className="p-6" aria-label="Eingaben">
        <Field
          label="Dein Text"
          htmlFor="lz-text"
          hint="Der Text bleibt in deinem Browser – er wird nirgendwo hochgeladen und steht auch nicht im geteilten Link."
        >
          <TextArea
            id="lz-text"
            value={state.text}
            placeholder="Text hier einfügen …"
            onChange={(event) => update({ text: event.target.value })}
          />
        </Field>

        <div className="mt-5">
          <Field
            label="Oder direkt die Wortzahl"
            htmlFor="lz-words"
            hint={
              hasText
                ? "Wird ignoriert, solange oben Text steht."
                : "Praktisch, wenn du die Wortzahl schon kennst."
            }
          >
            <TextInput
              id="lz-words"
              type="text"
              inputMode="numeric"
              value={state.words === 0 ? "" : String(state.words)}
              placeholder="0"
              disabled={hasText}
              onChange={(event) =>
                update({ words: toCount(event.target.value, 0) })
              }
              className="max-w-40 font-mono disabled:opacity-50"
            />
          </Field>
        </div>

        <fieldset className="mt-6">
          <legend className="text-[13px] font-semibold tracking-wide text-muted uppercase">
            Wie liest du?
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {paceOptions.map((option) => {
              const active = state.pace === option.id;
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer flex-col gap-0.5 rounded-control p-3.5 text-left transition-shadow duration-(--dur-fast) ${
                    active
                      ? "bg-accent-soft shadow-[inset_0_0_0_1px_var(--accent)]"
                      : "bg-surface shadow-[var(--elev-inset)] hover:bg-ink-soft"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="lz-pace"
                      value={option.id}
                      checked={active}
                      onChange={() => update({ pace: option.id })}
                      className="size-4 accent-[var(--accent)]"
                    />
                    <span className="text-[15px] font-semibold">
                      {option.label}
                    </span>
                    <span className="font-mono text-[13px] text-muted">
                      {option.wpm} W/min
                    </span>
                  </span>
                  <span className="pl-6 text-[13px] text-muted">
                    {option.hint}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Card>

      {empty ? (
        <Card className="p-7 text-center">
          <p className="font-display text-lg font-semibold">
            Füge einen Text ein, um die Lesezeit zu sehen.
          </p>
          <p className="mt-2 text-muted">
            Oder gib die Wortzahl direkt ein, wenn du sie schon kennst.
          </p>
        </Card>
      ) : (
        <ResultPanel
          footer={
            <ShareBar
              title="Lesezeit"
              text={`${formatInteger(result.words)} Wörter, ${formatDuration(result.readingSeconds)} Lesezeit`}
            />
          }
        >
          <NumberDisplay
            value={
              result.readingSeconds < 60
                ? result.readingSeconds
                : result.readingSeconds / 60
            }
            format={(value) => formatInteger(Math.max(1, Math.round(value)))}
            suffix={
              result.readingSeconds < 60
                ? "Sekunden Lesezeit"
                : Math.round(result.readingSeconds / 60) === 1
                  ? "Minute Lesezeit"
                  : "Minuten Lesezeit"
            }
            caption={`${formatInteger(result.words)} Wörter bei ${pace.wpm} Wörtern pro Minute`}
            announce={`${formatDuration(result.readingSeconds)} Lesezeit für ${formatInteger(result.words)} Wörter.`}
            hint={
              <>
                Zum Lesen brauchst du{" "}
                <strong className="font-semibold text-ink">
                  {formatDuration(result.readingSeconds)}
                </strong>
                . Laut vorgelesen sind es{" "}
                <strong className="font-semibold text-ink">
                  {formatDuration(result.speakingSeconds)}
                </strong>
                .
              </>
            }
          />
        </ResultPanel>
      )}

      {!empty && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Wörter" value={formatInteger(result.words)} />
          <Stat
            label="Zeichen"
            value={hasText ? formatInteger(result.characters) : "–"}
            hint={
              hasText
                ? `${formatInteger(result.charactersNoSpaces)} ohne Leerzeichen`
                : "nur mit Text"
            }
          />
          <Stat
            label="Sätze"
            value={hasText ? formatInteger(result.sentences) : "–"}
            hint={
              hasText && result.sentences > 0
                ? `${formatDecimal(result.words / result.sentences)} Wörter pro Satz`
                : "nur mit Text"
            }
          />
          <Stat
            label="Vorlesen"
            value={formatDuration(result.speakingSeconds)}
            hint="bei 130 Wörtern pro Minute"
          />
        </dl>
      )}

      <AffiliateBlock slots={lesezeitAffiliate} result={result} />
    </div>
  );
}
