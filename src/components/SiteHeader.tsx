import Link from "next/link";
import { site } from "@/config/site";
import { SiteSearch } from "@/components/SiteSearch";

export function SiteHeader() {
  return (
    <header className="border-b border-line/80">
      {/* flex-wrap + order statt eines Mobile-Toggles: bei 375px sind Marke
          und Nav schon am Limit, ein Icon-Button bräuchte eigenen State und
          eine Expand-Ankündigung. So wächst der Header mobil zweizeilig, ab
          `sm` steht alles auf einer 64px-Zeile wie zuvor. */}
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-3 gap-y-2.5 px-5 py-3 sm:h-16 sm:flex-nowrap sm:gap-x-4 sm:py-0">
        {/* Kein aria-label: der zugängliche Name ist der sichtbare Wortmarken-
            Text. Ein abweichendes Label würde als Label/Inhalt-Konflikt gelten. */}
        <Link
          href="/"
          className="group order-1 flex items-center gap-2.5 rounded-control"
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

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:max-w-72 sm:flex-1">
          <SiteSearch />
        </div>

        <nav
          aria-label="Hauptnavigation"
          className="order-2 ml-auto flex items-center gap-1 sm:order-3 sm:ml-0"
        >
          <Link
            href="/rechner/"
            className="rounded-pill px-3 py-1.5 text-sm font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
          >
            Rechner finden
          </Link>
          <Link
            href="/#tools"
            className="hidden rounded-pill px-3 py-1.5 text-sm font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink sm:inline-block"
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
