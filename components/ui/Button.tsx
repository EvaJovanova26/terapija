import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-pink-500 text-white active:bg-pink-700",
  quiet: "bg-card border border-line text-ink active:bg-pink-100",
};

export default function Button({ variant = "primary", className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`h-13 rounded-[17px] px-5 text-base font-bold transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
    />
  );
}
