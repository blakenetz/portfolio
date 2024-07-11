import { Anchor, Text } from "@mantine/core";
import { json, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Attribute, Mdx } from "types/modules";

import { Card } from "~/components";
import styles from "~/styles/blog.module.css";
import { blogPath, getPosts } from "~/util";

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
): Record<"slug" | "title" | "description" | keyof Attribute, string> {
  const title = module.meta.find((m) =>
    Object.keys(m).includes("title")
  )!.title;
  const description = module.meta.find(
    (m) => m.name === "description"
  )!.content;

  const attributes = module.frontmatter.attributes.reduce((record, acc) => {
    Object.keys(record).forEach((key) => {
      const k = key as keyof Attribute;
      acc[k] = record[k];
    });
    return acc;
  }, {} as Attribute);

  return {
    slug: filename.replace(/\.mdx?$/, "").replace(blogPath, ""),
    title,
    description,
    ...attributes,
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

  console.log(posts);

  return (
    <>
      {posts.map((post) => (
        <Card key={post.slug}>
          <Anchor
            component={Link}
            to={`.${post.slug}`}
            className={styles.title}
          >
            {post.title}
          </Anchor>
          {post.description ? <Text>{post.description}</Text> : null}
        </Card>
      ))}
    </>
  );
}
