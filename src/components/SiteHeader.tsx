import Link from "next/link";
import { site } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line/80">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5">
        {/* Kein aria-label: der zugängliche Name ist der sichtbare Wortmarken-
            Text. Ein abweichendes Label würde als Label/Inhalt-Konflikt gelten. */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-control"
        >
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-[10px] bg-accent font-display text-[15px] font-bold text-white shadow-soft transition-colors duration-(--dur-fast) group-hover:bg-accent-600"
          >
            {site.name.charAt(0)}
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Hauptnavigation" className="flex items-center gap-1">
          <Link
            href="/#tools"
            className="rounded-pill px-3 py-1.5 text-sm font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
          >
            Alle Rechner
          </Link>
          <Link
            href="/ueber/"
            className="rounded-pill px-3 py-1.5 text-sm font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
          >
            Über uns
          </Link>
        </nav>
      </div>
    </header>
  );
}
