import type { Avatar } from "@/lib/types";

export type Pose = "asleep" | "sitting" | "standing" | "busy" | "out";

interface Props {
  avatar: Avatar;
  pose?: Pose;
  size?: number;
}

export const SKIN = ["#f6dcc8", "#e8b899", "#c98d63", "#a0673f", "#7a4a2b", "#4b2e1e"];
export const HAIR = ["#2b1b12", "#5a3a22", "#a2673a", "#d9b06a", "#8a8a8a", "#b23a5a"];
export const EYES = ["#3b2a20", "#6b4a2f", "#3f6f4a", "#3a5f9a", "#7a7a7a", "#8a5aa0"];

/**
 * Placeholder figure until the layered avatar arrives from the design canvas.
 * Colours already come from the profile so the customise panel works now.
 */
export default function AvatarFigure({ avatar, pose = "standing", size = 96 }: Props) {
  const skin = avatar.skin ?? SKIN[1];
  const hair = avatar.hair ?? HAIR[0];
  const eyes = avatar.eyes ?? EYES[0];
  const lying = pose === "asleep";
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden style={{ transform: lying ? "rotate(-90deg)" : undefined }}>
      <ellipse cx="48" cy="90" rx="22" ry="4" fill="currentColor" opacity=".12" />
      <rect x="34" y="46" width="28" height="36" rx="10" fill={pose === "out" ? "#6f8f6a" : "#c8643a"} />
      <circle cx="48" cy="30" r="16" fill={skin} />
      <path d="M32 28 C32 14 64 14 64 28 C60 22 36 22 32 28 Z" fill={hair} />
      <circle cx="42" cy="31" r="2" fill={eyes} />
      <circle cx="54" cy="31" r="2" fill={eyes} />
      <path d="M43 37 Q48 41 53 37" stroke={eyes} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {pose === "busy" && <circle cx="70" cy="60" r="6" fill="#d9a441" />}
      {pose === "sitting" && <rect x="30" y="76" width="36" height="6" rx="3" fill="#7b5ea7" opacity=".6" />}
    </svg>
  );
}

export function poseForPoints(points: number): Pose {
  if (points <= 0) return "asleep";
  if (points < 5) return "sitting";
  if (points < 15) return "standing";
  return "busy";
}
