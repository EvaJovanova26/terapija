import type { CSSProperties } from "react";

interface Props {
  id: string;
  /** viewBox width/height of the symbol. */
  vb: [number, number];
  width: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  opacity?: number;
}

/** Inline use of a sprite symbol at a given pixel size. */
export default function Sym({ id, vb, width, height, className, style, opacity }: Props) {
  const h = height ?? Math.round((width * vb[1]) / vb[0]);
  return (
    <svg width={width} height={h} viewBox={`0 0 ${vb[0]} ${vb[1]}`} className={className} style={{ ...style, opacity }} aria-hidden>
      <use href={`#${id}`} />
    </svg>
  );
}

export const VB = {
  plant: [64, 80] as [number, number],
  object: [64, 48] as [number, number],
  flower: [48, 64] as [number, number],
  icon: [24, 24] as [number, number],
  small: [32, 24] as [number, number],
  square: [32, 32] as [number, number],
  mushrooms: [64, 32] as [number, number],
  garland: [240, 40] as [number, number],
  sprig: [48, 28] as [number, number],
  cloud: [64, 28] as [number, number],
};
