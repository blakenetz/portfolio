import { Anchor, Flex, Text } from "@mantine/core";
import { json, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { IconBrandMedium } from "@tabler/icons-react";
import { Attribute, Mdx } from "types/modules";

import { Card } from "~/components";
import { blogPath, getPosts } from "~/util";

import styles from "./blog.module.css";

export const meta: MetaFunction = () => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
];

const posts = getPosts();

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @see https://remix.run/docs/en/main/guides/mdx#example-blog-usage
 */
function postFromModule(
  filename: string,
  module: Mdx
): Record<"slug" | "title" | "description" | keyof Attribute, string> {
  const title = module.meta
    .find((m) => Object.keys(m).includes("title"))!
    .title.split("|")
    .pop()!
    .trim();
  const description = module.meta.find(
    (m) => m.name === "description"
  )!.content;

  const attributes = module.frontmatter.attributes.reduce((record, acc) => {
    Object.keys(record).forEach((key) => {
      const k = key as keyof Attribute;
      acc[k] = k === "date" ? formatDate(record[k]) : record[k];
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

  return (
    <Flex className={styles.posts}>
      {posts.map((post) => (
        <Card key={post.slug}>
          <Anchor
            component={Link}
            to={`.${post.slug}`}
            className={styles.title}
          >
            {post.title}
          </Anchor>
          <Text>{post.description}</Text>
          {post.source === "medium" ? (
            <Anchor href={post.url} className={styles.anchor}>
              <IconBrandMedium /> View on Medium
            </Anchor>
          ) : null}
          <Text className={styles.text}>{`Published ${post.date}`}</Text>
        </Card>
      ))}
    </Flex>
  );
}
