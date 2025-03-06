import type { Color } from "~/types";
import theme from "tailwindcss/defaultTheme";

export function getCssVariable(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function cssValueToInt(value: string) {
  return parseInt(value.replace(/[^0-9]/g, ""));
}

export const white = getCssVariable("--color-white");
export const black = getCssVariable("--color-black");
const checkerboardSize = getCssVariable("--spacing-checkerboard-size");
export const spacing = parseInt(checkerboardSize) / 2;

/**
 * lg breakpoint adds padding and checkerboard graphics
 * @see {@link file://./../components/Background.astro}
 * @see {@link file://./canvas.client.ts}
 * */
const containerMax = cssValueToInt(theme.screens.lg);
const base = cssValueToInt(getComputedStyle(document.documentElement).fontSize);
export const mobileBreakpoint = containerMax * base;

export function getLanguageColor(language: string) {
  let color: Color = "aquamarine";
  switch (language) {
    case "TypeScript":
    case "JavaScript":
      color = "dodger-blue";
      break;
    case "Just":
      color = "rich-black";
      break;
    case "CSS":
    case "HTML":
      color = "sunglow";
      break;
    case "Ruby":
      color = "rose";
  }

  return getCssVariable(`--color-${color}`);
}
