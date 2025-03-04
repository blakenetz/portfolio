export function getCssVariable(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

export const white = getCssVariable("--color-white");
export const black = getCssVariable("--color-black");
const checkerboardSize = getCssVariable("--spacing-checkerboard-size");
export const spacing = parseInt(checkerboardSize) / 2;
