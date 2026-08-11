import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Cross-Link-Karte zwischen einem Weg und einem Tool – in beide Richtungen
 * verwendet: auf den Quell-Tool-Seiten (hin zum Weg) und im Urteil eines
 * Wegs (zurück zu seinen Quell-Tools).
 *
 * Wiederverwendet die Optik von RelatedTools.tsx (`related-tool-*`-Klassen
 * in globals.css) statt eigener Regeln – es ist derselbe Karten-Typ: Icon,
 * Titel, ein Satz, Pfeil.
 */
export function WegCallout({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  /** Kleiner Hinweis über dem Titel, z. B. "Teil des Hauskauf-Wegs". */
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group surface-soft related-tool-link">
      <span className="related-tool-icon">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="block field-hint">{eyebrow}</span>
        <span className="block font-semibold">{title}</span>
        <span className="block field-hint">{description}</span>
      </span>
      <ArrowRight className="related-tool-arrow" aria-hidden="true" />
    </Link>
  );
}
