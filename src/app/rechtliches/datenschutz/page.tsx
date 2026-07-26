import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal/LegalPage";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";
import { affiliate, ads, analytics, legal, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Wie ${site.name} mit Daten umgeht: Berechnungen im Browser, cookiefreie Statistik, Werbung nur nach Einwilligung.`,
  alternates: { canonical: "/rechtliches/datenschutz" },
};

export default function DatenschutzPage() {
  const { operator } = legal;

  return (
    <LegalPage title="Datenschutzerklärung" updated="Juli 2026">
      <Section heading="Das Wichtigste in drei Sätzen">
        <p>
          Alle Rechner arbeiten vollständig in deinem Browser – deine Eingaben
          werden nicht an uns übertragen und nicht gespeichert. Die
          Reichweitenmessung läuft ohne Cookies und ohne Wiedererkennung.
          Werbung wird erst geladen, wenn du ausdrücklich zustimmst; ohne
          Zustimmung funktioniert alles genauso, nur ohne Anzeigen.
        </p>
      </Section>

      <Section heading="Verantwortlicher">
        <address className="not-italic">
          {operator.name}
          <br />
          {operator.street}
          <br />
          {operator.zip} {operator.city}
          <br />
          {operator.country}
          <br />
          E-Mail:{" "}
          <a
            href={`mailto:${operator.email}`}
            className="underline decoration-line underline-offset-2 hover:text-ink"
          >
            {operator.email}
          </a>
        </address>
      </Section>

      <Section heading="Deine Eingaben in den Rechnern">
        <p>
          Bundesland, Jahr, Beträge, Texte, Datumsangaben: Alles, was du in einen
          Rechner eingibst, wird ausschließlich lokal in deinem Browser
          verarbeitet. Es findet keine Übertragung an einen Server statt, es gibt
          keine Speicherung und keine Auswertung. Wenn du einen Ergebnis-Link
          teilst, stehen die Eingabewerte in der Adresszeile dieses Links – du
          entscheidest, mit wem du ihn teilst. Beim Lesezeit-Rechner wandert
          bewusst nur die Wortzahl in den Link, nie der Text selbst.
        </p>
      </Section>

      <Section heading="Server-Logfiles beim Hosting">
        <p>
          Beim Aufruf der Seite übermittelt dein Browser technisch notwendige
          Daten, die der Hosting-Anbieter in Logfiles verarbeitet: IP-Adresse,
          Datum und Uhrzeit, aufgerufene Adresse, Referrer, Browsertyp und
          Betriebssystem. Diese Verarbeitung ist zum Betrieb und zur Sicherheit
          der Website erforderlich; Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
          DSGVO (berechtigtes Interesse an einem stabilen, sicheren Betrieb). Die
          Daten werden nicht mit anderen Quellen zusammengeführt.
        </p>
        <p className="text-[15px]">
          <strong className="font-semibold text-ink">Zu ergänzen:</strong> Name
          und Sitz des Hosting-Anbieters sowie – bei Anbietern außerhalb der EU –
          die Grundlage des Datentransfers (in der Regel
          Standardvertragsklauseln). Gegebenenfalls ist ein Vertrag über
          Auftragsverarbeitung nach Art. 28 DSGVO abzuschließen.
        </p>
      </Section>

      <Section heading="Einwilligung für Werbung (Consent)">
        <p>
          Bevor Werbung geladen wird, fragen wir dich. Die Einwilligung erheben
          wir über eine zertifizierte Consent-Management-Plattform: Google
          Funding Choices, ein Dienst der Google Ireland Limited. Sie ist nach
          dem Transparency &amp; Consent Framework (TCF) v2.2 des IAB Europe
          zertifiziert. Deine Entscheidung wird als sogenannter TC-String auf
          deinem Endgerät abgelegt, damit wir sie nachweisen und beim nächsten
          Besuch berücksichtigen können. Rechtsgrundlage für das Speichern ist
          § 25 Abs. 1 TDDDG in Verbindung mit Art. 6 Abs. 1 lit. a DSGVO.
        </p>
        <p>
          Lehnst du ab oder entscheidest du nichts, wird kein Werbe-Skript
          geladen – auch dann nicht, wenn die Plattform selbst nicht erreichbar
          ist. Du kannst deine Entscheidung jederzeit ändern:
        </p>
        <p>
          <ConsentSettingsButton className="font-semibold text-accent" />
        </p>
        <p className="text-[15px]">
          <strong className="font-semibold text-ink">Zu ergänzen:</strong> die
          konkreten Bezeichnungen der von der Plattform gesetzten Einträge und
          ihre Speicherdauer. Diese Angaben erst nach der Freischaltung aus den
          Entwicklerwerkzeugen des Browsers übernehmen – geratene Schlüsselnamen
          wären hier schlechter als eine offen benannte Lücke.
        </p>
      </Section>

      <Section heading="Google AdSense">
        <p>
          Nach deiner Einwilligung binden wir Google AdSense ein, einen Dienst
          der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
          Irland. Dabei werden Cookies oder vergleichbare Kennungen gesetzt, deine
          IP-Adresse an Google übermittelt und Daten für die Auswahl und Messung
          von Anzeigen verarbeitet – auch in den USA. Rechtsgrundlage ist deine
          Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO; für die Übermittlung in
          Drittländer stützt sich Google auf das EU-US Data Privacy Framework und
          Standardvertragsklauseln. Ohne Einwilligung wird das Skript nicht
          geladen. Wir setzen Google Consent Mode v2 ein und übermitteln deine
          Entscheidung an Google.
        </p>
        <p>
          Die eingesetzte Consent-Management-Plattform (Google Funding Choices)
          stammt vom selben Anbieter. Welche Anbieter im Einzelnen um deine
          Einwilligung bitten, kannst du im Einwilligungsdialog nachlesen; die
          Liste folgt der Global Vendor List des IAB Europe. Näheres zur
          Datenverarbeitung bei Google steht in dessen{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener"
            className="underline decoration-line underline-offset-2 hover:text-ink"
          >
            Datenschutzerklärung
          </a>
          .
        </p>
        <p>
          Für die Auswahl und Messung von Anzeigen nutzt Google zusätzlich die
          Schnittstellen der Privacy Sandbox des Chrome-Browsers – etwa die
          Topics-API, mit der dein Browser grobe Interessenkategorien lokal
          ermittelt, sowie Schnittstellen zur Erfolgsmessung. Auch diese
          Verarbeitung findet nur nach deiner Einwilligung statt. Widersprechen
          kannst du zusätzlich in den Einstellungen deines Browsers.
        </p>
        {!ads.enabled && (
          <p className="text-[15px]">
            <strong className="font-semibold text-ink">Hinweis:</strong> Werbung
            ist derzeit nicht aktiviert; dieser Abschnitt gilt ab Freischaltung.
          </p>
        )}
      </Section>

      <Section heading="Reichweitenmessung">
        {analytics.provider === "none" ? (
          <p>
            Derzeit ist keine Reichweitenmessung aktiv. Sobald eine cookiefreie
            Lösung eingebunden wird, steht sie an dieser Stelle mit Anbieter und
            Rechtsgrundlage.
          </p>
        ) : (
          <p>
            Wir messen die Nutzung mit{" "}
            {analytics.provider === "umami" ? "Umami" : "Plausible Analytics"} –
            ohne Cookies, ohne geräteübergreifende Wiedererkennung und ohne
            Profilbildung. Erfasst werden aggregierte Angaben wie aufgerufene
            Seite, Referrer, Gerätekategorie und Land. IP-Adressen werden nicht
            gespeichert. Weil dabei keine Informationen auf deinem Endgerät
            abgelegt oder ausgelesen werden, ist keine Einwilligung nach § 25
            TDDDG erforderlich; Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an einer datensparsamen Nutzungsstatistik).
          </p>
        )}
      </Section>

      <Section heading="Schriftarten">
        <p>
          Die verwendeten Schriften werden zusammen mit der Seite von unserem
          eigenen Server ausgeliefert. Es besteht keine Verbindung zu Google
          Fonts, und es werden keine Daten an Dritte übertragen.
        </p>
      </Section>

      {affiliate.enabled && (
        <Section heading="Provisions-Links (Affiliate)">
          <p>
            Unter Ergebnissen zeigen wir gelegentlich Empfehlungen, die zu
            Partnerangeboten führen. Diese Links sind mit „
            {affiliate.disclosureLabel}“ gekennzeichnet. Erst wenn du einen
            solchen Link anklickst, verlässt du diese Seite; der Partner kann dann
            eine Kennung setzen, um eine mögliche Buchung zuzuordnen. Für die
            Datenverarbeitung ab dem Klick gilt die Datenschutzerklärung des
            Partners. Auf dieser Seite werden dafür keine Daten erhoben und keine
            Kennungen gesetzt.
          </p>
        </Section>
      )}

      <Section heading="Deine Rechte">
        <p>
          Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
          Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf
          Grundlage berechtigter Interessen (Art. 21). Eine erteilte Einwilligung
          kannst du jederzeit ohne Angabe von Gründen widerrufen – die
          Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt davon unberührt.
        </p>
        <p>
          Für Anfragen genügt eine E-Mail an{" "}
          <a
            href={`mailto:${operator.email}`}
            className="underline decoration-line underline-offset-2 hover:text-ink"
          >
            {operator.email}
          </a>
          . Außerdem steht dir ein Beschwerderecht bei einer
          Datenschutz-Aufsichtsbehörde zu, in der Regel bei der Behörde deines
          Wohnsitzlandes.
        </p>
      </Section>
    </LegalPage>
  );
}
