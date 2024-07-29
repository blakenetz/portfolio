export const authMode = ["new", "existing"] as const;
export type AuthMode = (typeof authMode)[number];

export type AuthFetcher = { ok: boolean; error?: string };

export const authProviders = ["github", "google"] as const;
export type AuthProvider = (typeof authProviders)[number];
