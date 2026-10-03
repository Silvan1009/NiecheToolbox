import type { ReactNode } from "react";

/** Ein Wert, der aus einem früheren Schritt übernommen wurde, mit Sprung zurück zum Ändern. */
export function WegCarriedValue({
  onChange,
  children,
}: {
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <p className="mt-1.5 field-hint">
      {children}{" "}
      <button
        type="button"
        onClick={onChange}
        className="text-link"
      >
        Ändern
      </button>
    </p>
  );
}
