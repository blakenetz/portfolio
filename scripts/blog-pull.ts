import fs from "node:fs/promises";

import path from "path";

import DB from "~/server/db.singleton.server";
import { kebobCase } from "~/util";

const dir = path.resolve(".", "app/blog");

(async () => {
  console.log("Pulling blog posts...");
  const files = await DB.findAll("posts");
  for await (const file of files) {
    const content = file.content.buffer;
    const fileName = kebobCase(file.meta.title) + ".mdx";
    const resolvedPath = path.resolve(dir, fileName);

    console.log("Writing: ", fileName);
    await fs.writeFile(resolvedPath, content);
  }

  process.exit();
})();
