import { Flex } from "@mantine/core";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Mdx } from "types/modules";

import { Button } from "~/components";
import { authenticator } from "~/server/authenticator.server";
import { getPost, postComment } from "~/server/blog.server";
import commonStyles from "~/styles/common.module.css";
import { cls } from "~/utils";

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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const post = await getPost(request, params);
  const user = await authenticator.isAuthenticated(request);

  if (post.ok === false) return redirect(`/blog?status=${post.errorStatus}`);

  const { ok: _ok, ...data } = post;

  return json({
    data,
    user,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const comments = await postComment(request, params);

  return json({ ok: true, data: comments });
}

export default function Post() {
  const { data, user } = useLoaderData<typeof loader>();
  const pathName = `/app/blog/${data.meta.slug}.mdx`;
  const post = posts[pathName];

  return (
    <>
      <Flex className={cls(commonStyles.column, styles.reader)}>
        <Source source={data.meta.source} url={data.meta.url} />
        {post && post.default({ components })}
      </Flex>

      <Comments
        user={user}
        comments={data.comments}
        commentsTotal={data.commentsTotal}
      />

      <Button component={Link} to="/blog">
        Take me back
      </Button>
    </>
  );
}
