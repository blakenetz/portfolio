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

/**
 * Save as variable since glob uses this when generating keys
 */
export const blogPath = "./blog";

export function getPosts() {
  return import.meta.glob<Mdx>("./blog/*.mdx", {
    eager: true,
  });
}
