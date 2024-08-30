import { Flex } from "@mantine/core";
import {
	ActionFunctionArgs,
	json,
	LoaderFunctionArgs,
	MetaFunction,
	redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { Mdx } from "types/modules";

import { Button } from "~/components";
import { authenticator } from "~/server/authenticator.server";
import { getPost, postComment } from "~/server/blog.server";
import commonStyles from "~/styles/common.module.css";
import { cls } from "~/utils";

import Comments from "./comments";
import components from "./components";
import styles from "./post.module.css";
import Share from "./share";
import Source from "./source";

const posts = import.meta.glob<Mdx>("/app/blog/*.mdx", {
	eager: true,
});

export const meta: MetaFunction = ({ location }) => {
	const module = posts[`/app${location.pathname}.mdx`];

	return module?.meta;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
	const results = await getPost(request, params);
	const user = await authenticator.isAuthenticated(request);

	if (results.ok === false) {
		return redirect(`/blog?status=${results.errorStatus}`);
	}

	return json({
		user,
		comments: results.comments,
		commentsTotal: results.commentsTotal,
		meta: results.post.meta,
		component: results.post.content.toString(),
	});
}

export async function action({ request, params }: ActionFunctionArgs) {
	const results = await postComment(request, params);

	return json(results);
}

export default function Post() {
	const { user, meta, component, comments, commentsTotal } =
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

			<Share />

			<Comments user={user} comments={comments} commentsTotal={commentsTotal} />

			<Button component={Link} to="/blog">
				Take me back
			</Button>
		</>
	);
}
