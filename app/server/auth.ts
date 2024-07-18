export const authMode = ["new", "existing"] as const;
export type AuthMode = (typeof authMode)[number];
