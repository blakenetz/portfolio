import fs from "node:fs/promises";

import path from "path";

import DB from "~/server/db.singleton.server";
import { exists, kebobCase } from "~/utils";

const dir = path.resolve(".", "app/blog");

export default async function pull() {
  const dirExists = await exists(dir);
  if (!dirExists) await fs.mkdir(dir);

  console.log("Pulling blog posts...");
  const files = await DB.findAll("posts");
  for await (const file of files) {
    const content = file.content.buffer;
    const fileName = kebobCase(file.meta.title) + ".mdx";
    const resolvedPath = path.resolve(dir, fileName);

    const skip = await exists(resolvedPath);

    if (skip) {
      console.log("Skipping. File exists: ", fileName);
    } else {
      console.log("Writing: ", fileName);
      await fs.writeFile(resolvedPath, content);
    }
  }
}

await pull().finally(() => process.exit());
