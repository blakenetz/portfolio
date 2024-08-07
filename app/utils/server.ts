import fs from "node:fs/promises";

import { Location as RemixLocation } from "@remix-run/react";
import crypto from "crypto";

export const status = {
  octokit: "octokit-fail",
  unknown: "unknown",
  ok: "ok",
  post: "post",
  mdx: "mdx",
  provider: "provider",
  github: "github",
  google: "google",
  authSuccess: "authSuccess",
} as const;
export type Status = (typeof status)[keyof typeof status];

export const messages = new Map<Status, string | null>([
  ["octokit-fail", "We seemed to hit a snag fetching data from Github."],
  ["ok", null],
  ["unknown", "Something has gone horrible wrong, so we sent you home."],
  ["post", "Unable to find post. If found, let me know :)"],
  ["mdx", "The blog post is temporarily held up. Try again later"],
  ["provider", "The social provider shut us down :("],
  ["github", "Unable to connect with Github"],
  ["google", "Unable to connect with Google"],
  ["authSuccess", "Successfully logged in!"],
]);

export function hashPassword(password: string) {
  return crypto
    .pbkdf2Sync(password, process.env.AUTH_HASH!, 1000, 64, `sha512`)
    .toString(`hex`);
}

export async function exists(filePath: string) {
  return fs
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

export function getSearchString(
  location: RemixLocation,
  values: Record<string, string | number>
) {
  const params = new URLSearchParams(location.search);
  Object.keys(values).forEach((k) => params.set(k, values[k] + ""));

  return params.toString();
}
