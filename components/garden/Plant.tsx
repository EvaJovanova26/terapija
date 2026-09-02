import type { PlantDef } from "@/lib/garden-logic";
import { SHAPES } from "./PlantShapes";

interface Props {
  plant: PlantDef;
  groundY: number;
  sceneWidth: number;
}

/** Places a plant on the ground line at its scene position. */
export default function Plant({ plant, groundY, sceneWidth }: Props) {
  const x = (plant.x / 100) * sceneWidth;
  return (
    <g transform={`translate(${x} ${groundY})`}>
      <title>{plant.name}</title>
      {SHAPES[plant.kind]}
    </g>
  );
}
