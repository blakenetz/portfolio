import { Flex } from "@mantine/core";
import { MDXProvider } from "@mdx-js/react";
import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Mdx } from "types/modules";

import { Button } from "~/components";
import { getPost } from "~/server/blog.server";
import commonStyles from "~/styles/common.module.css";
import { cls, status } from "~/util";

import Comments from "./comments";
import components from "./components";
import styles from "./post.module.css";
import Source from "./source";

const posts = import.meta.glob<Mdx>("/app/blog/*.mdx", {
  eager: true,
});

export const meta: MetaFunction = ({ location }) => {
  const module = posts[`/app${location.pathname}.mdx`];

  return module.meta;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPost(params);

  if (post.ok === false) return redirect(`/blog?status=${status.unknown}`);

  return json(post);
}

export default function Post() {
  const { meta } = useLoaderData<typeof loader>();
  const pathName = `/app/blog/${meta.slug}.mdx`;
  const post = posts[pathName];
  // console.log(post, meta, posts);

  return (
    <MDXProvider components={components}>
      <Flex className={cls(commonStyles.column, styles.reader)}>
        <Source source={meta?.source} url={meta?.url} />
        {post && post.default({ components })}
      </Flex>

      <Comments />

      <Button component={Link} to="/blog">
        Take me back
      </Button>
    </MDXProvider>
  );
}
