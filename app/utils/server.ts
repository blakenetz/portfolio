import fs from "node:fs/promises";

import { Location as RemixLocation } from "@remix-run/react";
import crypto from "crypto";

export const status = {
  octokit: "octokit-fail",
  unknown: "unknown",
  ok: "ok",
} as const;
export type Status = (typeof status)[keyof typeof status];

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
