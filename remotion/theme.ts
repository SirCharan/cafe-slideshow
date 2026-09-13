import type { Theme, ThemeName } from "./types";
import { FONT_FAMILIES } from "./fonts";
import { PALETTE } from "./board/types";

// v2: one style — whiteboard explainer. Both theme names resolve to it so old URLs keep working.
export const whiteboard: Theme = {
  name: "whiteboard",
  paper: PALETTE.paper,
  paper2: "#EBE6DC",
  ink: PALETTE.ink,
  inkSoft: "#2A2A2A",
  accent: PALETTE.accent,
  accentSoft: "#D4784A",
  accent2: PALETTE.green,
  mute: "#6B6560",
  line: "rgba(20, 20, 20, 0.08)",
  fontBody: FONT_FAMILIES.inter,
  fontDisplay: FONT_FAMILIES.kalam,
  fontMono: FONT_FAMILIES.mono,
  radius: 6,
  strokeStyle: "marker",
};

export const ledger: Theme = whiteboard;
export const themes: Record<ThemeName, Theme> = { ledger: whiteboard, whiteboard };
export const getTheme = (_name: ThemeName): Theme => whiteboard;
