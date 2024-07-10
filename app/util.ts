export function cls(...args: (string | undefined)[]) {
  return args.join(" ").trim();
}

export const status = {
  octokit: "octokit-fail",
  unknown: "unknown",
  ok: "ok",
} as const;
export type Status = (typeof status)[keyof typeof status];
