import { Flex } from "@mantine/core";
import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

import { Button } from "~/components";
import { authenticator } from "~/server/authenticator.server";
import { getPost, postComment } from "~/server/blog.server";
import { PostModel } from "~/server/db.singleton.server";
import commonStyles from "~/styles/common.module.css";
import { cls } from "~/utils";

import Comments from "./comments";
import components from "./components";
import styles from "./post.module.css";
import Share from "./share";
import Source from "./source";

export const meta: MetaFunction<LoaderFunction> = ({ data, location }) => {
  const { meta } = data as PostModel;

  return [
    { ...meta, title: ["BN", "Blog", meta.title].join(" | ") },
    /** @see https://www.linkedin.com/help/linkedin/answer/a521928/making-your-website-shareable-on-linkedin?lang=en */
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    {
      property: "og:url",
      content: "https://blakenetzeband.com" + location.pathname,
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const results = await getPost(request, params);
  const user = await authenticator.isAuthenticated(request);
  const url = new URL(request.url);
  const shareUrl = url.origin + url.pathname;

  if (results.ok === false) {
    return redirect(`/blog?status=${results.errorStatus}`);
  }

  return json({
    user,
    comments: results.comments,
    commentsTotal: results.commentsTotal,
    meta: results.post.meta,
    component: results.post.content.toString(),
    shareUrl,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const results = await postComment(request, params);

  return json(results);
}

export default function Post() {
  const { user, meta, component, comments, commentsTotal, shareUrl } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Source meta={meta} />

      <Flex className={cls(commonStyles.column, styles.reader)}>
        <Markdown
          components={components}
          remarkPlugins={[remarkFrontmatter, remarkMdxFrontmatter]}
        >
          {component}
        </Markdown>
      </Flex>

      <Share url={shareUrl} meta={meta} />

      <Comments user={user} comments={comments} commentsTotal={commentsTotal} />

      <Button component={Link} to="/blog">
        Take me back
      </Button>
    </>
  );
}
