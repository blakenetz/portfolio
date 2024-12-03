import { fileURLToPath } from "node:url";

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

import { PostModel } from "~/server/db.singleton.server";
import { formatDate, kebobCase, parseMdxMeta } from "~/utils";

interface __VFile extends VFile {
  data: {
    matter: Mdx["frontmatter"];
  };
}

export function generateBaseMDxContent(fileName: string) {
  return `---
meta:
  - title: BN | Blog | ${fileName}
  - name: description
    content: ADD DESCRIPTION

attributes:
  date: ${formatDate(new Date().toISOString(), true)}
  source: medium | github
  url: ADD URL TO SOURCE HERE
---

# ${fileName}

Use standard mdx syntax. The exceptions being:

For singleline codeblocks, use
\`HELLO!\`

For multiline codeblocks, use
\`\`\`console
HELLO
AND
GOODBYE
\`\`\`

For notifications codeblocks, use
\`\`\`note
This multiline block
will have unique styles
\`\`\`

To hide copy button
\`\`\`language no-copy
This multiline block
will have unique styles
\`\`\`
`;
}

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.resolve(filename, "..");

function matterify() {
  return function (_tree: Node, file: VFile) {
    matter(file);
  };
}

export async function extractVFile(filePath: string) {
  const vFile = await read(filePath);

  return unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter)
    .use(matterify)
    .process(vFile) as Promise<__VFile>;
}

export function formatMeta(frontmatter: Mdx["frontmatter"]): PostModel["meta"] {
  const { attributes, meta } = frontmatter;
  const metaValues = parseMdxMeta(meta);
  const slug = kebobCase(metaValues.title);

  return {
    ...attributes,
    ...metaValues,
    date: new Date(attributes.date),
    slug,
  };
}
