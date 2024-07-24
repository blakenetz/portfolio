import crypto from "crypto";
import { formatDistanceToNow, isThisYear } from "date-fns";
import { Mdx } from "types/modules";

export function cls(...args: (string | undefined)[]) {
  return args.join(" ").trim();
}

export const status = {
  octokit: "octokit-fail",
  unknown: "unknown",
  ok: "ok",
} as const;
export type Status = (typeof status)[keyof typeof status];

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(value: string | Date, skipCommon = false) {
  const date = new Date(value);

  if (!skipCommon && isThisYear(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return formatter.format(date);
}

export function parseMdxMeta(meta: Mdx["meta"]) {
  const title = meta
    .find((m) => Object.keys(m).includes("title"))!
    .title.split("|")
    .pop()!
    .trim();

  const description = meta.find((m) => m.name === "description")!.content;

  return { title, description };
}

export function validate<T>(
  val: string | null,
  arr: ReadonlyArray<T>
): T | null {
  const sort = val as T | null;
  if (sort && arr.includes(sort)) return sort;
  return null;
}

export function validateString<T extends string>(val: unknown): T {
  if (val && typeof val === "string" && val.length) return val as T;

  throw new Error(
    `Invalid value: ${val}. Expected a string with a length > 0. Received type: ${typeof val}`
  );
}

export function capitalize(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function kebobCase(val: string) {
  return val.replace(/\s/, "-").toLowerCase();
}

export function hashPassword(password: string) {
  return crypto
    .pbkdf2Sync(password, process.env.AUTH_HASH!, 1000, 64, `sha512`)
    .toString(`hex`);
}
