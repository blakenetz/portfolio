export function getCssVariable(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

/**
 * @see {@link file://./../styles/global.css} for color variables
 */
export const colors = [
  "aquamarine",
  "dodger-blue",
  "sunglow",
  "pumpkin",
  "rose",
];
export const white = getCssVariable("--color-white");
export const black = getCssVariable("--color-black");
const checkerboardSize = getCssVariable("--spacing-checkerboard-size");
export const spacing = parseInt(checkerboardSize) / 2;
