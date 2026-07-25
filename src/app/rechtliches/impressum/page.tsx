import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal/LegalPage";
import { legal, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung nach § 5 DDG für ${site.name}.`,
  alternates: { canonical: "/rechtliches/impressum" },
};

export default function ImpressumPage() {
  const { operator } = legal;

  return (
    <LegalPage title="Impressum" updated="Juli 2026">
      <Section heading="Angaben gemäß § 5 DDG">
        <address className="not-italic">
          {operator.company && (
            <>
              {operator.company}
              <br />
            </>
          )}
          {operator.name}
          <br />
          {operator.street}
          <br />
          {operator.zip} {operator.city}
          <br />
          {operator.country}
        </address>
      </Section>

      <Section heading="Kontakt">
        <p>
          E-Mail:{" "}
          <a
            href={`mailto:${operator.email}`}
            className="underline decoration-line underline-offset-2 hover:text-ink"
          >
            {operator.email}
          </a>
          {operator.phone && (
            <>
              <br />
              Telefon: {operator.phone}
            </>
          )}
        </p>
      </Section>

      {operator.vatId && (
        <Section heading="Umsatzsteuer-Identifikationsnummer">
          <p>{operator.vatId}</p>
        </Section>
      )}

      <Section heading="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>
          {operator.name}, {operator.street}, {operator.zip} {operator.city}
        </p>
      </Section>

      <Section heading="Haftung für Inhalte">
        <p>
          Die Rechner auf {site.name} liefern rechnerische Orientierung. Trotz
          sorgfältiger Prüfung der Berechnungslogik lässt sich nicht garantieren,
          dass jedes Ergebnis auf jeden Einzelfall passt – insbesondere nicht bei
          Feiertagsregelungen einzelner Gemeinden oder bei arbeits- und
          sozialrechtlichen Fragen. Die Ergebnisse sind keine Rechts-, Steuer-
          oder Finanzberatung. Für Entscheidungen auf Basis der Ergebnisse wird
          keine Haftung übernommen.
        </p>
        <p>
          Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach
          den allgemeinen Gesetzen verantwortlich, jedoch nicht verpflichtet,
          übermittelte oder gespeicherte fremde Informationen zu überwachen.
        </p>
      </Section>

      <Section heading="Haftung für Links">
        <p>
          Diese Seite enthält Links zu externen Websites, darunter
          Provisions-Links (Affiliate-Links). Für die Inhalte verlinkter Seiten
          sind ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der
          Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Eine
          permanente inhaltliche Kontrolle ist ohne konkrete Anhaltspunkte einer
          Rechtsverletzung nicht zumutbar; bei Bekanntwerden von Rechts&shy;ver&shy;letzungen
          werden solche Links unverzüglich entfernt.
        </p>
      </Section>

      <Section heading="Urheberrecht">
        <p>
          Die auf dieser Website erstellten Inhalte und Werke unterliegen dem
          deutschen Urheberrecht. Vervielfältigung, Bearbeitung und Verbreitung
          außerhalb der gesetzlich erlaubten Fälle bedürfen der schriftlichen
          Zustimmung. Downloads und Kopien dieser Seite sind für den privaten,
          nicht kommerziellen Gebrauch gestattet.
        </p>
      </Section>

      <Section heading="Streitschlichtung">
        <p>
          Wir sind nicht verpflichtet und nicht bereit, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </Section>
    </LegalPage>
  );
}
