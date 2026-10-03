import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/legal/LegalPage";
import { ToolCard } from "@/components/ToolCard";
import { WegCard } from "@/components/WegCard";
import { lastModified, lastModifiedKey } from "@/lib/lastModified";
import {
  absoluteUrl,
  jsonLdGraph,
  pageMetadata,
  siteNodes,
  staticOgImagePath,
  toolPath,
  webPageNode,
} from "@/lib/seo";
import { publicTools } from "@/tools/registry";
import { publicWege } from "@/wege/registry";

const TITLE = `${site.name} – Kostenlose Online-Rechner für den Alltag`;

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: site.description,
  path: "/",
  image: staticOgImagePath("start"),
  imageAlt: `${site.name} – ${site.tagline}`,
});

export default function HomePage() {
  const tools = publicTools();
  const wege = publicWege();

  return (
    <div className="mx-auto w-full max-w-5xl px-5">
      <section className="py-16 text-center sm:py-24">
        <h1 className="mx-auto max-w-2xl font-display text-[clamp(2rem,7vw,3.25rem)] font-bold tracking-tight">
          Kleine Rechner, die eine Frage wirklich beantworten.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Keine Anmeldung, keine Tabelle, kein Download. Werte eintragen,
          Ergebnis ablesen, Link teilen. Alles rechnet direkt in deinem Browser.
        </p>
      </section>

      {wege.length > 0 && (
        <section
          id="wege"
          aria-labelledby="wege-heading"
          className="scroll-mt-8 pb-8"
        >
          <h2
            id="wege-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Wege
          </h2>
          <p className="mt-1.5 max-w-xl text-muted">
            Mehrere Rechner zu einem Urteil kombiniert, statt einer isolierten
            Zahl.
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wege.map((weg) => (
              <li key={weg.slug} className="flex">
                <WegCard weg={weg} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        id="tools"
        aria-labelledby="tools-heading"
        className="scroll-mt-8"
      >
        <h2
          id="tools-heading"
          className="font-display text-xl font-semibold tracking-tight"
        >
          Alle Rechner
        </h2>

        {tools.length === 0 ? (
          <p className="mt-4 text-muted">Bald geht es hier los.</p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <li key={tool.slug} className="flex">
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="tool-column mt-4 pb-16">
        {/* data-prose: scripts/content-audit.ts misst genau diesen Bereich. */}
        <section data-prose className="flex flex-col gap-8">
          <Section heading="Wie die Rechner funktionieren">
            <p>
              Jeder Rechner auf dieser Seite ist eine reine Formel, keine
              Schätzung und keine Anfrage an ein Sprachmodell. Du trägst Werte
              ein, im selben Moment rechnet eine Funktion im Browser das
              Ergebnis aus – ohne Serverumweg, ohne Konto, ohne dass die Zahlen
              irgendwo ankommen außer bei dir. Deshalb reagiert das Ergebnis
              beim Tippen und nicht erst nach einem Klick auf „Berechnen“, und
              deshalb funktionieren die Rechner auch offline weiter, sobald die
              Seite einmal geladen ist.
            </p>
            <p>
              Das hat eine Kehrseite: Ein Rechner ist immer so gut wie das
              Modell dahinter. Wo eine Frage einen echten Ermessensspielraum hat
              – etwa bei einer Kündigungsfrist mit tarifvertraglicher
              Sonderregel oder einer Steuerlast mit individuellen Freibeträgen –
              bildet der Rechner den Regelfall ab und sagt das auch dazu. Die
              Grenzen jedes Modells stehen im Abschnitt „So funktioniert’s“ auf
              der jeweiligen Tool-Seite.
            </p>
          </Section>

          <Section heading="Woher die Zahlen kommen">
            <p>
              Feiertage – die Grundlage für Brückentage-, Arbeitstage- und
              Kündigungsfristen-Rechner – kommen nicht aus einer im Netz
              gesuchten Liste, sondern werden berechnet: Das Osterdatum ergibt
              sich aus der Gauß-Osterformel, alle beweglichen Feiertage hängen
              rechnerisch daran, die festen stehen in einer nach Bundesland
              gepflegten Tabelle. Damit stimmen die Termine auch für Jahre, die
              weit in der Zukunft liegen, und ein regelmäßiger Abgleich gegen
              eine zweite Quelle deckt auf, wenn sich eine Rechtsänderung nicht
              mehr in der Rechnung widerspiegelt.
            </p>
            <p>
              Steuer- und Sozialabgabenwerte – Grundfreibetrag,
              Beitragsbemessungsgrenzen, Beitragssätze zu Kranken-, Pflege- und
              Rentenversicherung – tragen ein Stand-Datum und gelten für das
              damit bezeichnete Jahr. Ändert sich ein Wert zum Jahreswechsel,
              wird er hier nachgezogen, nicht stillschweigend fortgeschrieben.
            </p>
          </Section>

          <Section heading="Was die Rechner nicht sind">
            <p>
              Jedes Ergebnis ist rechnerische Orientierung, keine Rechts-,
              Steuer-, Finanz- oder medizinische Beratung. Bei arbeits-, miet-
              und sozialrechtlichen Fragen entscheidet am Ende der Einzelfall,
              und regionale oder individuelle Sonderregelungen sind nicht in
              jedem Rechner abgebildet. Wer eine verbindliche Auskunft braucht,
              sollte sie bei einer Steuerberatung, einer Rechtsberatung oder –
              je nach Rechner – bei Arbeitgeber, Krankenkasse oder
              Rentenversicherung einholen.
            </p>
            <p>
              Mehr zu Betreiber, Finanzierung über Werbung und Empfehlungen
              sowie zum Prüfverfahren hinter den Rechnern steht auf der{" "}
              <Link
                prefetch={false}
                href="/ueber/"
                className="text-link"
              >
                Über-uns-Seite
              </Link>
              .
            </p>
          </Section>

          <Section heading="Was einen Rechner hier auszeichnet">
            <p>
              Die Auswahl der Rechner folgt einer einfachen Regel: Ein Thema
              kommt dazu, wenn eine Alltagsfrage sich in einem Satz stellen
              lässt und keine befriedigende, kostenlose Antwort dafür existiert
              – entweder, weil vorhandene Rechner zu grob rechnen, zu viele
              Werbeklicks brauchen oder ein Konto verlangen, bevor sie ein
              Ergebnis zeigen. Brückentage, Kaufnebenkosten je Bundesland oder
              die Fünftelregelung bei einer Abfindung sind typische Beispiele:
              Fragen, die selten, aber dann sehr konkret gestellt werden.
            </p>
            <p>
              Werbung und Empfehlungslinks finanzieren die Seite, ändern aber
              nichts an der Rechenlogik selbst: Ein Kreditrechner empfiehlt
              keinen bestimmten Kredit, ein Versicherungsvergleich keine
              bestimmte Police. Wo ein Rechner auf ein Angebot verweist, steht
              das an der jeweiligen Stelle als Werbung gekennzeichnet und
              getrennt vom Ergebnis darüber – wer nur rechnen will, kann jeden
              Hinweis ignorieren, ohne dass sich das Ergebnis dadurch ändert.
            </p>
          </Section>

          <Section heading="Für wen die Seite gedacht ist">
            <p>
              Die Rechner richten sich an alle, die eine konkrete Zahl brauchen,
              nicht an eine Fachöffentlichkeit: an Angestellte, die eine
              Gehaltserhöhung einordnen wollen, an Paare, die vor einem
              Immobilienkauf stehen, an Eltern, die Elterngeld und Kindergeld
              zusammenrechnen, und an alle, die einfach wissen wollen, wie viele
              Brückentage das nächste Jahr hergibt. Fachbegriffe wie
              „Vorabpauschale“ oder „Beitragsbemessungsgrenze“ tauchen dort auf,
              wo sie zur Frage gehören – erklärt im Fließtext, nicht
              vorausgesetzt.
            </p>
            <p>
              Jeder Rechner funktioniert auf dem Smartphone genauso wie am
              Rechner, ohne App und ohne Installation: Ein Link genügt, und die
              Eingaben stehen darin, sodass ein einmal ausgefülltes Ergebnis
              sich direkt weiterschicken lässt – an eine Partnerin, einen
              Steuerberater oder einfach als Gedankenstütze für später.
            </p>
          </Section>

          <Section heading="Wie ein Rechner entsteht und aktuell bleibt">
            <p>
              Ein neuer Rechner beginnt mit der Rechenlogik als eigenständigem,
              automatisiert getesteten Baustein – erst danach kommt die
              Eingabemaske dazu. Dieser Aufbau erzwingt, dass jede Formel für
              sich nachvollziehbar bleibt: Ein Rechenfehler zeigt sich im Test,
              bevor er auf der Seite landet, und lässt sich an genau der Formel
              beheben, ohne die Eingabefelder anzufassen. Bei gesetzlich
              geregelten Werten – Steuersätzen, Beitragsbemessungsgrenzen,
              Kindergeldbeträgen – trägt die zugrunde liegende Tabelle ein
              Stand-Datum, damit sichtbar bleibt, für welches Jahr eine Zahl
              gilt.
            </p>
            <p>
              Ändert sich ein Gesetz oder ein Grenzwert zum Jahreswechsel, wird
              die betroffene Tabelle nachgezogen und nicht stillschweigend
              fortgeschrieben – ein Rechner, der zwei Jahre alte Werte ausgibt,
              ist schlechter als gar keiner. Wer eine veraltete Zahl oder einen
              Rechenfehler findet, kann das über die Kontaktseite melden; solche
              Hinweise fließen direkt in die jeweilige Tabelle oder Formel ein.
            </p>
          </Section>

          <Section heading="Rechner, die zusammengehören">
            <p>
              Manche Fragen lassen sich nicht mit einem einzigen Rechner
              beantworten, sondern erst, wenn mehrere Ergebnisse zusammenkommen:
              Was eine Gehaltserhöhung netto bringt, hängt vom
              Brutto-Netto-Rechner ab und davon, was sich aus der Differenz über
              Jahre ansparen lässt. Ob sich ein Auto leisten lässt, hängt von
              Kreditrate, laufenden Kosten und Versicherung gemeinsam ab, nicht
              von einer dieser Zahlen allein. Für solche zusammengesetzten
              Fragen gibt es die Wege weiter oben auf dieser Seite – sie
              verketten mehrere Rechner zu einem einzigen Urteil, statt mehrere
              Ergebnisse von Hand zusammenzählen zu müssen.
            </p>
          </Section>
        </section>
      </div>

      <JsonLd
        data={jsonLdGraph([
          ...siteNodes(),
          webPageNode({
            type: "CollectionPage",
            name: TITLE,
            description: site.description,
            path: "/",
            image: staticOgImagePath("start"),
            dateModified: lastModified(lastModifiedKey.page("start")),
          }),
          {
            "@type": "ItemList",
            name: `Alle Rechner auf ${site.name}`,
            numberOfItems: tools.length,
            itemListElement: tools.map((tool, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: tool.name,
              description: tool.tagline,
              url: absoluteUrl(toolPath(tool.slug)),
            })),
          },
        ])}
      />
    </div>
  );
}
