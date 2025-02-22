import { formatDistanceToNow, isThisYear } from "date-fns";

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

export function capitalize(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function kebobCase(val: string) {
  return val.replace(/\s/g, "-").toLowerCase();
}

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
