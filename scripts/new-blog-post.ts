import fs from "fs";
import path from "path";

import { formatDate } from "~/util";

const [fileName] = process.argv.slice(2);

if (!fileName) {
  throw new Error("Please pass a filename");
}

const file = {
  complete: fileName.includes(".mdx") ? fileName : fileName + ".mdx",
  name: fileName.split(".")[0],
};

const dir = path.resolve("app/blog", file.complete);
const content = `---
meta:
  - title: BN | Blog | ${file.name}
  - name: description
    content: ADD DESCRIPTION

attributes:
  - date: ${formatDate(new Date().toISOString())}
  - source: medium | github
  - url: ADD URL TO SOURCE HERE
---

export const meta = frontmatter.meta;
export const headers = frontmatter.headers;
export const attributes = frontmatter.attributes;

# ${file.name}
`;

fs.writeFileSync(dir, content);
