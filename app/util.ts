import { formatDistanceToNow, isThisYear } from "date-fns";
import { Attribute, Mdx } from "types/modules";

export type Post = Record<"slug" | "title" | "description", string> &
  Attribute & { render: Mdx["default"] };

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

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(value: string, skipCommon = false) {
  const date = new Date(value);

  if (!skipCommon && isThisYear(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return formatter.format(date);
}

/**
 * @see https://remix.run/docs/en/main/guides/mdx#example-blog-usage
 */
export function postFromModule(filename: string, module: Mdx): Post {
  const slug = filename.replace(/\.mdx?$/, "").replace(blogPath, "");

  const title = module.meta
    .find((m) => Object.keys(m).includes("title"))!
    .title.split("|")
    .pop()!
    .trim();

  const description = module.meta.find(
    (m) => m.name === "description"
  )!.content;

  const { date, ...attributes } = module.frontmatter.attributes;

  return {
    slug,
    title,
    description,
    render: module.default,
    ...attributes,
    date: formatDate(date),
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
