import { Mdx } from "types/modules";

import { getPosts, postFromModule, validate } from "~/util";

export const inputName = "sort";
export const sorts = ["asc", "desc"] as const;

function sortPosts(
  posts: { [filename: string]: Mdx },
  direction: "asc" | "desc" | null
): { filename: string; mdx: Mdx }[] {
  return Object.keys(posts)
    .map((filename) => ({ filename, mdx: posts[filename] }))
    .sort((a, b) => {
      const firstDate = new Date(a.mdx.frontmatter.attributes.date);
      const secondDate = new Date(b.mdx.frontmatter.attributes.date);
      if (direction === "asc") {
        return firstDate > secondDate ? 1 : -1;
      }
      return secondDate > firstDate ? 1 : -1;
    });
}

export function fetchPosts(request: Request) {
  const { searchParams } = new URL(request.url);
  const param = searchParams.get(inputName);
  const direction = validate(param, sorts);

  // sort before formatting in `postFromModule`
  const posts = getPosts();
  const sorted = sortPosts(posts, direction);

  return sorted.map(({ filename, mdx }) => postFromModule(filename, mdx));
}
