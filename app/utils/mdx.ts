import { Mdx } from "types/modules";

export function parseMdxMeta(meta: Mdx["meta"]) {
  const title = meta
    .find((m) => Object.keys(m).includes("title"))!
    .title.split("|")
    .pop()!
    .trim();

  const description = meta.find((m) => m.name === "description")!.content;

  return { title, description };
}
