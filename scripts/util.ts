import { formatDate } from "~/utils";

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

export const meta = frontmatter.meta;
export const headers = frontmatter.headers;
export const attributes = frontmatter.attributes;

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
`;
}
