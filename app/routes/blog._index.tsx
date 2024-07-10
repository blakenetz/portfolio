import { Anchor, List, ListItem } from "@mantine/core";
import { json, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Mdx } from "types/modules";

import Header from "~/components/header";
import { getPosts } from "~/util";

const posts = getPosts();

export const meta: MetaFunction = () => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
];

/**
 * @see https://remix.run/docs/en/main/guides/mdx#example-blog-usage
 */
function postFromModule(
  filename: string,
  module: Mdx
): Record<"slug" | "title" | "description", string> {
  const title = module.meta.find((m) =>
    Object.keys(m).includes("title")
  )!.title;
  const description = module.meta.find(
    (m) => m.name === "description"
  )!.content;

  return {
    slug: filename.replace(/\.mdx?$/, ""),
    title,
    description,
  };
}

export async function loader() {
  return json(
    Object.keys(posts).map((filename) =>
      postFromModule(filename, posts[filename])
    )
  );
}

export default function Blog() {
  const posts = useLoaderData<typeof loader>();

  return (
    <>
      <Header />
      <List>
        {posts.map((post) => (
          <ListItem key={post.slug}>
            <Anchor component={Link} to={`${post.slug}`}>
              {post.title}
            </Anchor>
            {post.description ? <p>{post.description}</p> : null}
          </ListItem>
        ))}
      </List>
    </>
  );
}
