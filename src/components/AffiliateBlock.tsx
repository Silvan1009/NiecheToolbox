"use client";

import { ArrowUpRight } from "lucide-react";
import { affiliate, affiliateHref } from "@/config/site";
import type { AffiliateSlot } from "@/tools/types";

/**
 * Kontextuelle Empfehlung unter dem Ergebnis.
 *
 * Erscheint nur, wenn `when(result)` zutrifft – also wenn das Ergebnis die
 * Empfehlung inhaltlich rechtfertigt. Höchstens eine Empfehlung, klar als
 * Werbung gekennzeichnet.
 */
export function AffiliateBlock({
  slots,
  result,
}: {
  slots?: AffiliateSlot[];
  result: unknown;
}) {
  if (!affiliate.enabled || !slots?.length) return null;

  const slot = slots.find((entry) => !entry.when || entry.when(result));
  if (!slot) return null;

  return (
    <aside className="rounded-card bg-accent-soft p-5 shadow-[inset_0_0_0_1px_var(--accent-ring)]">
      <p className="text-[11px] font-semibold tracking-wide text-accent uppercase">
        {affiliate.disclosureLabel}
      </p>
      {/* h2, nicht h3: die Überschriftenebene folgt der Struktur, nicht der
          Schriftgröße – sonst entsteht eine Lücke unter der h1. */}
      <h2 className="mt-1.5 font-display text-base font-semibold text-ink">
        {slot.headline}
      </h2>
      {slot.body && <p className="mt-1 text-sm text-muted">{slot.body}</p>}

      <a
        href={affiliateHref(slot.partner)}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="mt-4 inline-flex items-center gap-1.5 rounded-control bg-surface px-4 py-2.5 text-sm font-semibold text-accent shadow-soft transition-colors duration-(--dur-fast) hover:bg-white hover:text-accent-600"
      >
        {slot.label}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>

      <p className="mt-3 text-[12px] text-muted">{affiliate.disclosureText}</p>
    </aside>
  );
}
