import fs from "node:fs/promises";

import { Binary } from "mongodb";
import { VFile } from "node_modules/vfile-matter/lib";
import path from "path";
import { Mdx } from "types/modules";

import DB from "~/server/db.singleton.server";
import { exists } from "~/utils";

import { extractVFile, formatMeta } from "./util";

interface __VFile extends VFile {
  data: {
    matter: Mdx["frontmatter"];
  };
}

const dir = path.resolve(".", "app/blog");

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

      const [base64, vFile] = await Promise.all([
        fs.readFile(resolved, "base64"),
        extractVFile(resolved),
      ]);

      const content = Binary.createFromBase64(base64);
      const meta = formatMeta(vFile.data.matter);

      await DB.findOrCreateOne<"posts">(
        "posts",
        { "meta.slug": meta.slug },
        { content, meta }
      );

      console.log(`File ${file} uploaded successfully`);
    }
  } catch (error) {
    console.log("Error uploading document: " + error);
    return;
  }

  console.log("Did you update the sitemap?");
}

await push().finally(() => process.exit());
