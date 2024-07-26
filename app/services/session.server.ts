import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

export type SessionData = {
  username: string;
  "user-id": string;
  [sessionKey: string]: string;
};
type SessionFlashData = { error: string };

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "session",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [process.env.AUTH_COOKIE_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
