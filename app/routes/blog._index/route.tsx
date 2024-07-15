import { Anchor, Flex, Text } from "@mantine/core";
import { json, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { IconBrandMedium } from "@tabler/icons-react";

import { Card } from "~/components";
import { getPosts, postFromModule } from "~/util";

import styles from "./blog.module.css";

export const meta: MetaFunction = () => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
];

const posts = getPosts();

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
