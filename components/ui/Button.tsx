import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-moss-500 text-white active:bg-moss-700",
  quiet: "bg-card border border-line text-ink active:bg-moss-100",
};

export default function Button({ variant = "primary", className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`h-12 rounded-xl px-5 text-base font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
    />
  );
}
