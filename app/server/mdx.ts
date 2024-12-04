import { Params } from "@remix-run/react";
import { Mdx, ModulePost } from "types/modules";

import { formatDate } from "~/utils";

export function getModulePosts() {
  return import.meta.glob<Mdx>("../blog/*.mdx", { eager: true });
}

/**
 * @see https://remix.run/docs/en/main/guides/mdx#example-blog-usage
 */
export function postFromModule(filename: string, module: Mdx): ModulePost {
  const title = module.frontmatter.meta
    .find((m) => Object.keys(m).includes("title"))!
    .title.split("|")
    .pop()!
    .trim();
  const description = module.frontmatter.meta.find(
    (m) => m.name === "description"
  )!.content;

  return {
    slug: filename.replace(/\.mdx?$/, "").replace("./blog", ""),
    title,
    description,
    render: module.default,
    ...module.frontmatter.attributes,
    date: formatDate(module.frontmatter.attributes.date),
  };
}

export function getMdx(params: Params<"file">) {
  const posts = getModulePosts();
  const post = Object.keys(posts).reduce<Mdx | null>((acc, key) => {
    if (params.file && key.includes(params.file)) {
      acc = posts[key];
    }
    return acc;
  }, null);

  return post ? { ok: true, data: post } : { ok: false, errorStatus: "mdx" };
}

export function getAllMdx() {
  const posts = getModulePosts();
  const filenames = Object.keys(posts);
  const data = filenames.map((file) => postFromModule(file, posts[file]));

  return { data, count: filenames.length };
}
