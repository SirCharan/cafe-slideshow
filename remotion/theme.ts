import type { Theme, ThemeName } from "./types";
import { FONT_FAMILIES } from "./fonts";

// Brand tokens: ~/Downloads/Not-a-Startup-Brand-Kit/04-tokens/tokens.css (light-first, locked 2026-07-22)
export const ledger: Theme = {
  name: "ledger",
  paper: "#F5F1EA",
  paper2: "#EBE6DC",
  ink: "#141414",
  inkSoft: "#2A2A2A",
  accent: "#C45C26",
  accentSoft: "#D4784A",
  accent2: "#2B5DA8",
  mute: "#6B6560",
  line: "rgba(20, 20, 20, 0.08)",
  fontBody: FONT_FAMILIES.inter,
  fontDisplay: FONT_FAMILIES.fraunces,
  fontMono: FONT_FAMILIES.mono,
  radius: 10,
  strokeStyle: "clean",
};

export const whiteboard: Theme = {
  name: "whiteboard",
  paper: "#FBFBF7",
  paper2: "#F1F0EA",
  ink: "#1B1B1B",
  inkSoft: "#333333",
  accent: "#C45C26",
  accentSoft: "#D4784A",
  accent2: "#2B5DA8",
  mute: "#6F6B66",
  line: "rgba(27, 27, 27, 0.10)",
  fontBody: FONT_FAMILIES.inter,
  fontDisplay: FONT_FAMILIES.kalam,
  fontMono: FONT_FAMILIES.mono,
  radius: 6,
  strokeStyle: "marker",
};

export const themes: Record<ThemeName, Theme> = { ledger, whiteboard };
export const getTheme = (name: ThemeName): Theme => themes[name] ?? ledger;
