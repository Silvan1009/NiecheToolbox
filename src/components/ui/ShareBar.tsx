"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "./Button";

/** Web-Share-API-Verfügbarkeit lesen, ohne Hydrate-Konflikt und ohne Effekt. */
const noopSubscribe = () => () => {};
const hasShareApi = () =>
  typeof navigator !== "undefined" && "share" in navigator;
const noShareApi = () => false;

/**
 * Ergebnis teilen. Der Link enthält die Query-Params des aktuellen Zustands,
 * ist also reproduzierbar – und selbst wieder indexierbar.
 */
export function ShareBar({ title, text }: { title: string; text?: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(noopSubscribe, hasShareApi, noShareApi);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const currentUrl = () => window.location.href;

  const copy = async () => {
    const url = currentUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard verweigert (kein HTTPS, alte Browser): Link zum Markieren zeigen.
      window.prompt("Link kopieren:", url);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, text, url: currentUrl() });
    } catch {
      /* Nutzer hat abgebrochen – kein Fehlerzustand. */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="quiet" size="sm" onClick={copy}>
        {copied ? (
          <Check className="size-4 text-positive" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
        {copied ? "Link kopiert" : "Link kopieren"}
      </Button>

      {canShare && (
        <Button variant="ghost" size="sm" onClick={share}>
          <Share2 className="size-4" aria-hidden="true" />
          Teilen
        </Button>
      )}
    </div>
  );
}
