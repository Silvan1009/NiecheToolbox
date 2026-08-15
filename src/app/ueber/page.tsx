import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/legal/LegalPage";
import { absoluteUrl, breadcrumbNode, jsonLdGraph } from "@/lib/seo";
import { legal, site } from "@/config/site";
import { publicTools } from "@/tools/registry";

/**
 * Über uns und Kontakt.
 *
 * Rechtlich deckt das Impressum die Anbieterkennzeichnung bereits ab – diese
 * Seite existiert für Leser und für die AdSense-Prüfung: Google erwartet auf
 * einer Publisher-Seite erkennbar, wer dahintersteht, wofür die Seite da ist
 * und wie man den Betreiber erreicht. Ein Impressum allein wird von Prüfern
 * außerhalb Deutschlands regelmäßig nicht als "About/Contact" gelesen.
 */
export const metadata: Metadata = {
  title: "Über uns & Kontakt",
  description: `Wer hinter ${site.name} steht, wie die Rechner entstehen, wie sie geprüft werden und wie du uns erreichst.`,
  alternates: { canonical: "/ueber/" },
};

export default function UeberPage() {
  const { operator } = legal;
  const toolCount = publicTools().length;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div className="tool-column">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight">
          Über {site.name}
        </h1>
        <p className="mt-3 text-lg text-muted">
          {site.tagline} Gemacht von einer Person, die es leid war, für jede
          kleine Frage eine Tabelle aufzumachen.
        </p>

        {/* data-prose: scripts/content-audit.ts misst genau diesen Bereich. */}
        <section data-prose className="mt-10 flex flex-col gap-8">
          <Section heading="Worum es hier geht">
            <p>
              {site.name} ist eine Sammlung von derzeit {toolCount} kleinen
              Rechnern für Fragen, die im Alltag tatsächlich aufkommen: Wie
              viele Brückentage bringt mir mein Urlaub im nächsten Jahr? Bis
              wann muss die Kündigung raus? Wie viel kostet der alte Kühlschrank
              im Jahr? Wie viel Teig passt in die andere Backform? Jede dieser
              Fragen lässt sich in einem Satz stellen und in einer Zahl
              beantworten – genau das macht diese Seite, und sonst nichts.
            </p>
            <p>
              Kein Konto, kein Newsletter, kein Download, keine Bezahlschranke.
              Jeder Rechner ist ohne Umweg erreichbar und liefert das Ergebnis
              beim Tippen, nicht erst nach einem Klick auf „Berechnen“.
            </p>
          </Section>

          <Section heading="Wer dahintersteht">
            <p>
              Betrieben wird die Seite von {operator.name} aus {operator.city}.
              Das ist kein Redaktionsteam und keine Firma, sondern eine
              Einzelperson – die vollständige Anbieterkennzeichnung steht im{" "}
              <Link
                href="/rechtliches/impressum/"
                className="underline decoration-line underline-offset-2 hover:text-ink"
              >
                Impressum
              </Link>
              .
            </p>
          </Section>

          <Section heading="Wie die Rechner entstehen und geprüft werden">
            <p>
              Hinter jedem Rechner steht eine Rechenfunktion, die von der
              Oberfläche getrennt ist und mit automatisierten Tests abgesichert
              wird. Für jede Zahl, die jemand von dieser Seite mitnimmt, liegen
              Beispielwerte und Grenzfälle als Test vor – Schaltjahre,
              Monatsenden, Beträge, die sich nicht glatt teilen lassen.
            </p>
            <p>
              Feiertage kommen aus einer einzigen, nach Bundesländern gepflegten
              Quelle, die auch Brückentage, Arbeitstage und die Werktagsfristen
              im Kündigungsrechner speist. Bewegliche Feiertage werden aus dem
              Osterdatum berechnet, nicht aus einer Liste abgetippt. Ein
              gesonderter Test schlägt an, wenn eine Regelung nicht mehr zum
              gerechneten Ergebnis passt.
            </p>
            <p>
              Trotzdem gilt: Die Ergebnisse sind rechnerische Orientierung. Bei
              arbeits-, miet- und sozialrechtlichen Fragen entscheidet am Ende
              der Einzelfall, und regionale Sonderregelungen sind nicht immer
              abgebildet. Rechts-, Steuer-, Finanz- oder medizinische Beratung
              ist das ausdrücklich nicht.
            </p>
          </Section>

          <Section heading="Womit die Seite finanziert wird">
            <p>
              Die Nutzung ist kostenlos. Getragen werden soll die Seite durch
              Werbung und durch Empfehlungen, für die wir bei einem Kauf eine
              Provision erhalten können. Provisions-Links sind an Ort und Stelle
              als Werbung gekennzeichnet; für dich ändert sich der Preis dadurch
              nicht. Was empfohlen wird, hat keinen Einfluss darauf, was ein
              Rechner ausrechnet – die Rechenlogik kennt keine Partner.
            </p>
            <p>
              Werbung wird erst nach ausdrücklicher Einwilligung geladen. Wie
              das im Detail funktioniert und welche Daten dabei anfallen, steht
              in der{" "}
              <Link
                href="/rechtliches/datenschutz/"
                className="underline decoration-line underline-offset-2 hover:text-ink"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </Section>

          <Section heading="Kontakt">
            <p>
              Fehler gefunden, ein Ergebnis passt nicht, ein Rechner fehlt? Eine
              Mail genügt – Rückmeldungen zu falschen Zahlen haben Vorrang vor
              allem anderen.
            </p>
            <p>
              E-Mail:{" "}
              <a
                href={`mailto:${operator.email}`}
                className="underline decoration-line underline-offset-2 hover:text-ink"
              >
                {operator.email}
              </a>
              <br />
              Post: {operator.name}, {operator.street}, {operator.zip}{" "}
              {operator.city}, {operator.country}
            </p>
          </Section>
        </section>
      </div>

      <JsonLd
        data={jsonLdGraph([
          {
            "@type": "AboutPage",
            name: `Über ${site.name}`,
            url: absoluteUrl("/ueber/"),
            inLanguage: "de-DE",
            publisher: {
              "@type": "Organization",
              name: site.name,
              url: site.url,
              email: operator.email,
              founder: { "@type": "Person", name: operator.name },
              address: {
                "@type": "PostalAddress",
                streetAddress: operator.street,
                postalCode: operator.zip,
                addressLocality: operator.city,
                addressCountry: "DE",
              },
            },
          },
          breadcrumbNode([
            { name: site.name, path: "/" },
            { name: "Über uns", path: "/ueber/" },
          ]),
        ])}
      />
    </div>
  );
}
