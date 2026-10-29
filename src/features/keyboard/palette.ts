import type { ThemeName } from "@/store/useThemeStore";

/**
 * Colors of the light sources the glass reflects and refracts.
 * The glass itself is clear — all the color comes from these,
 * which is what gives the keycaps that prism / oil-slick look.
 */
export interface ScenePalette {
  /** Large soft light on one side */
  warm: string;
  /** Large soft light on the other side */
  cool: string;
  /** Thin strip highlights that streak across the facets */
  streakA: string;
  streakB: string;
  /** Glow of the switch stems under the caps */
  stem: string;
  /** Soft halo under the board */
  halo: string;
}

export const SCENE_PALETTES: Record<ThemeName, ScenePalette> = {
  navy: {
    warm: "#ff3b2f",
    cool: "#2f6bff",
    streakA: "#ff2fb4",
    streakB: "#3fe0ff",
    stem: "#4d7dff",
    halo: "#1b2a6b",
  },
  pink: {
    warm: "#ff2f8e",
    cool: "#7a3bff",
    streakA: "#ff8a3d",
    streakB: "#3fa9ff",
    stem: "#ff4fa3",
    halo: "#5a1440",
  },
};
