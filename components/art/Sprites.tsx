import Gradients from "./Gradients";
import PlantsA from "./PlantsA";
import PlantsB from "./PlantsB";
import Objects from "./Objects";
import Flowers from "./Flowers";
import Decor from "./Decor";

/** Hidden sprite sheet rendered once in the layout so any page can <use href="#…" />. */
export default function Sprites() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }} aria-hidden="true">
      <Gradients />
      <PlantsA />
      <PlantsB />
      <Objects />
      <Flowers />
      <Decor />
    </svg>
  );
}
