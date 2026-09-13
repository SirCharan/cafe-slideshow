import { staticFile } from "remotion";

// Self-hosted TTFs in public/fonts (no network during `remotion render`).
export const FONT_FAMILIES = {
  fraunces: '"Fraunces", "Avenir Next", Georgia, serif',
  inter: '"Inter", "Avenir Next", "Helvetica Neue", Arial, sans-serif',
  kalam: '"Kalam", "Inter", "Avenir Next", sans-serif',
  mono: '"JetBrains Mono", Menlo, monospace',
};

const FACES: Array<[family: string, file: string, weight: number]> = [
  ...[300, 400, 500, 600, 700, 800, 900].map((w) => ["Fraunces", `Fraunces-${w}.ttf`, w] as [string, string, number]),
  ...[400, 500, 600, 700, 800].map((w) => ["Inter", `Inter-${w}.ttf`, w] as [string, string, number]),
  ...[400, 700].map((w) => ["Kalam", `Kalam-${w}.ttf`, w] as [string, string, number]),
  ...[400, 500, 600, 700].map((w) => ["JetBrains Mono", `JetBrainsMono-${w}.ttf`, w] as [string, string, number]),
];

export const fontFaceCss = (): string =>
  FACES.map(
    ([family, file, weight]) =>
      `@font-face{font-family:"${family}";src:url(${staticFile(`fonts/${file}`)}) format("truetype");font-weight:${weight};font-style:normal;font-display:block;}`,
  ).join("\n");

let injected = false;
/** Inject @font-face rules once (works in the Remotion renderer and in the Next Player). */
export const ensureFonts = (): void => {
  if (injected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.setAttribute("data-cafe-fonts", "1");
  style.textContent = fontFaceCss();
  document.head.appendChild(style);
  injected = true;
};

/** Font files the renderer must wait for, for use with delayRender/continueRender. */
export const fontLoadPromise = (): Promise<unknown> =>
  typeof document === "undefined" || !("fonts" in document)
    ? Promise.resolve()
    : Promise.all(FACES.map(([family, , weight]) => document.fonts.load(`${weight} 20px "${family}"`)));
