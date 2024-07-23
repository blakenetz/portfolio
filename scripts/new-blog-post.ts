import fs from "fs";
import path from "path";

import { generateBaseMDxContent } from "./util";

const [fileName] = process.argv.slice(2);

if (!fileName) {
  throw new Error("Please pass a filename");
}

const file = {
  complete: fileName.includes(".mdx") ? fileName : fileName + ".mdx",
  name: fileName.split(".")[0],
};

const dir = path.resolve("app/blog", file.complete);

fs.writeFileSync(dir, generateBaseMDxContent(file.name));
