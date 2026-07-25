import { ButtonLink } from "@/components/ui/Button";
import { ToolCard } from "@/components/ToolCard";
import { publicTools } from "@/tools/registry";

export const metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const tools = publicTools().slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-20">
      <div className="tool-column text-center">
        <p className="font-mono text-5xl font-semibold text-accent">404</p>
        <h1 className="mt-4 font-display text-[clamp(1.5rem,5vw,2.25rem)] font-bold tracking-tight">
          Diese Seite gibt es nicht.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-muted">
          Vielleicht hat sich die Adresse geändert. Alle Rechner findest du auf
          der Startseite.
        </p>
        <div className="mt-7 flex justify-center">
          <ButtonLink href="/">Zur Startseite</ButtonLink>
        </div>
      </div>

      {tools.length > 0 && (
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.slug} className="flex">
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
