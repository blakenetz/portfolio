import { Attribute, Mdx } from "types/modules";

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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @see https://remix.run/docs/en/main/guides/mdx#example-blog-usage
 */
export function postFromModule(
  filename: string,
  module: Mdx
): Record<"slug" | "title" | "description", string> &
  Attribute & { render: Mdx["default"] } {
  const title = module.meta
    .find((m) => Object.keys(m).includes("title"))!
    .title.split("|")
    .pop()!
    .trim();
  const description = module.meta.find(
    (m) => m.name === "description"
  )!.content;

  const attributes = module.frontmatter.attributes.reduce((record, acc) => {
    Object.keys(record).forEach((key) => {
      const k = key as keyof Attribute;
      acc[k] = k === "date" ? formatDate(record[k]) : record[k];
    });
    return acc;
  }, {} as Attribute);

  return {
    slug: filename.replace(/\.mdx?$/, "").replace(blogPath, ""),
    title,
    description,
    render: module.default,
    ...attributes,
  };
}

export function validate<T>(
  val: string | null,
  arr: ReadonlyArray<T>
): T | null {
  const sort = val as T | null;
  if (sort && arr.includes(sort)) return sort;
  return null;
}

export function capitalize(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}
