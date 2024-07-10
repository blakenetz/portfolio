import { json, LinksFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import Header from "~/components/header";
import styles from "~/styles/projects.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
export const meta: MetaFunction = () => [
  { title: "BN | Blog" },
  { description: "My thoughts. some complete... others not... 😜" },
];

import { Anchor, List, ListItem } from "@mantine/core";
import { Mdx } from "types/modules";

import * as posts from "~/blog";

function postFromModule(
  module: Mdx
): Record<"slug" | "title" | "description", string> {
  const title = module.attributes.meta.find((m) =>
    Object.keys(m).includes("title")
  )!.title;
  const description = module.attributes.meta.find(
    (m) => m.name === "description"
  )!.content;

  return {
    slug: module.filename.replace(/\.mdx?$/, ""),
    title,
    description,
  };
}

export async function loader() {
  return json(Object.values(posts).map(postFromModule));
}

export default function Blog() {
  const posts = useLoaderData<typeof loader>();

  return (
    <>
      <Header burn />
      <List>
        {posts.map((post) => (
          <ListItem key={post.slug}>
            <Anchor component={Link} to={post.slug}>
              {post.title}
            </Anchor>
            {post.description ? <p>{post.description}</p> : null}
          </ListItem>
        ))}
      </List>
    </>
  );
}
