import { Status } from "~/utils";

export const authMode = ["new", "existing"] as const;
export type AuthMode = (typeof authMode)[number];

export type AuthFetcher = {
  ok: boolean;
  error?: string;
  status?: Status;
  field?: keyof typeof authErrors;
};

export const authProviders = ["github", "google"] as const;
export type AuthProvider = (typeof authProviders)[number];

export const authErrors = {
  notFound: "User not Found",
  badPassword: "Incorrect username or password",
  email: "Email already exists, please try signing in...",
  username: "Username taken",
  unknown: "Something here is amiss. Please try a different method",
};

export type AuthError = keyof typeof authErrors;
