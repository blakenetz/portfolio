import fs from "node:fs/promises";

import { Binary } from "mongodb";
import { Node } from "node_modules/unified/lib";
import { VFile } from "node_modules/vfile-matter/lib";
import path from "path";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { read } from "to-vfile";
import { Mdx } from "types/modules";
import { unified } from "unified";
import { matter } from "vfile-matter";

import DB from "~/server/db.singleton.server";
import { exists, kebobCase, parseMdxMeta } from "~/utils";

interface __VFile extends VFile {
  data: {
    matter: Mdx["frontmatter"];
  };
}

const dir = path.resolve(".", "app/blog");

function matterify() {
  return function (_tree: Node, file: VFile) {
    matter(file);
  };
}

export default async function push() {
  const dirExists = await exists(dir);
  if (!dirExists) {
    console.log("No posts to sync...");
    process.exit();
  }

  console.log("Uploading blog posts...");
  try {
    const files = await fs.readdir(dir);

    for await (const file of files) {
      const resolved = path.resolve(dir, file);
      const base64 = await fs.readFile(resolved, "base64");
      const vFile = await read(resolved);
      const results = (await unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkFrontmatter)
        .use(matterify)
        .process(vFile)) as __VFile;

      const binary = Binary.createFromBase64(base64);
      const { attributes, meta } = results.data.matter;
      const metaValues = parseMdxMeta(meta);
      const slug = kebobCase(metaValues.title);

      await DB.findOrCreateOne<"posts">(
        "posts",
        { "meta.slug": slug },
        {
          content: binary,
          meta: {
            ...attributes,
            ...metaValues,
            date: new Date(attributes.date),
            slug,
          },
        }
      );

      console.log(`File ${file} uploaded successfully`);
    }
  } catch (error) {
    console.log("Error uploading document: " + error);
    return;
  }
}

await push().finally(() => process.exit());
