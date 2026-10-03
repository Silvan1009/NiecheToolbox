"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { TextInput } from "@/components/ui/Field";
import { filterEntries } from "@/lib/search";
import { searchIndex } from "@/lib/searchIndex";

/**
 * Live-Suche im Header, auf jeder Seite verfügbar.
 *
 * Importiert bewusst nur `@/lib/search` und `@/lib/searchIndex` – keine
 * Registry, keine Tool-Components. Siehe den Kommentar in searchIndex.ts.
 */
export function SiteSearch() {
  const router = useRouter();
  const listboxId = useId();
  const inputId = useId();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => filterEntries(searchIndex, query), [query]);
  const open = results.length > 0;

  // Schließen bei Klick/Touch außerhalb – pointerdown statt click, damit ein
  // mousedown auf einer Option nicht erst per blur das Panel wegreißt, bevor
  // der eigentliche Klick auf den Link ankommt.
  const [forceClosed, setForceClosed] = useState(false);

  function closePanel() {
    setForceClosed(true);
  }

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setActiveIndex(-1);
        closePanel();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    setForceClosed(false);
  }

  const isOpen = open && !forceClosed;

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setForceClosed(false);
        setActiveIndex(0);
        return;
      }
      setActiveIndex((current) => (current + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setForceClosed(false);
        setActiveIndex(results.length - 1);
        return;
      }
      setActiveIndex(
        (current) => (current - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Enter") {
      if (isOpen && activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        const href = results[activeIndex].href;
        closePanel();
        setActiveIndex(-1);
        router.push(href);
      }
      return;
    }

    if (event.key === "Escape") {
      if (isOpen) {
        closePanel();
        return;
      }
      if (query !== "") {
        setQuery("");
      }
      return;
    }

    if (event.key === "Tab") {
      closePanel();
    }
  }

  // React's onBlur is delegated via the native `focusout` event (which
  // bubbles), so this fires once for the whole container instead of once
  // per descendant losing focus.
  function handleFocusOut(event: React.FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) return;
    closePanel();
    setActiveIndex(-1);
  }

  const activeOptionId =
    activeIndex >= 0 && results[activeIndex]
      ? `${listboxId}-opt-${activeIndex}`
      : undefined;

  const statusText =
    query.trim() === ""
      ? ""
      : results.length === 0
        ? "Keine Treffer"
        : `${results.length} Treffer`;

  return (
    <div ref={containerRef} className="relative" onBlur={handleFocusOut}>
      <label htmlFor={inputId} className="sr-only">
        Rechner suchen
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
      />
      <TextInput
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        autoComplete="off"
        spellCheck={false}
        placeholder="Rechner suchen …"
        className="pl-9"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setForceClosed(false)}
      />

      <ul
        id={listboxId}
        role="listbox"
        aria-label="Suchergebnisse"
        hidden={!isOpen}
        className="surface-soft absolute inset-x-0 top-full z-40 mt-2 max-h-[min(70vh,26rem)] overflow-y-auto p-1.5"
      >
        {results.map((entry, index) => (
          <li key={entry.href} role="presentation">
            <Link
              prefetch={false}
              href={entry.href}
              role="option"
              id={`${listboxId}-opt-${index}`}
              aria-selected={index === activeIndex}
              tabIndex={-1}
              className="block rounded-control px-3 py-2 transition-colors duration-(--dur-fast) hover:bg-ink-soft aria-selected:bg-ink-soft"
              onClick={() => {
                closePanel();
                setActiveIndex(-1);
              }}
            >
              {entry.parentName && (
                <span className="block text-[11px] font-semibold tracking-wide text-muted uppercase">
                  {entry.parentName}
                </span>
              )}
              <span className="block text-[15px] font-medium text-ink">
                {entry.name}
              </span>
              <span className="block text-[13px] text-muted">{entry.hint}</span>
            </Link>
          </li>
        ))}
      </ul>

      {query.trim() !== "" && results.length === 0 && (
        <div className="surface-soft absolute inset-x-0 top-full z-40 mt-2 px-3 py-2 text-[13px] text-muted">
          Keine Treffer.
        </div>
      )}

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusText}
      </div>
    </div>
  );
}
