import { Stack } from "@mantine/core";
import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Card } from "~/components";
import { getAllMdx } from "~/server/mdx";
import { getCanonicalLink } from "~/utils";

export const meta: MetaFunction = ({ location }) => {
  return [
    { title: "BN | Mdx" },
    { description: "My thoughts. some complete... others not... 😜" },
    getCanonicalLink(location),
  ];
};

export async function loader() {
  if (process.env.NODE_ENV !== "development") {
    throw new Response("Not Found", { status: 404 });
  }

  const posts = getAllMdx();

  return json(posts);
}

export default function Blog() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <Stack>
      {data.map((post) => (
        <Card key={post.title} post={post} />
      ))}
    </Stack>
  );
}
