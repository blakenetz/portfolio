export const colors = [
  "rose",
  "dodger-blue",
  "aquamarine",
  "pumpkin",
  "papaya-whip",
  "sunglow",
  "rich-black",
] as const;

export type Color = (typeof colors)[number];
