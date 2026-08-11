import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "quiet" | "ghost";
type Size = "md" | "sm";

const base = "btn-base";

const variants: Record<Variant, string> = {
  // Gefüllt, leichter Verlauf, weiche Tiefe – nie eine harte Umrisslinie.
  primary:
    "bg-linear-to-b from-accent to-accent-600 text-white shadow-soft hover:from-accent-600 hover:to-accent-600 hover:shadow-lift",
  quiet:
    "bg-surface text-ink shadow-[var(--elev-soft),var(--elev-inset)] hover:bg-ink-soft",
  ghost: "text-muted hover:bg-ink-soft hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  sm: "h-9 px-3.5 text-sm",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      type={props.type ?? "button"}
      className={`${buttonClasses(variant, size)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <Link className={`${buttonClasses(variant, size)} ${className}`} {...props}>
      {children}
    </Link>
  );
}
