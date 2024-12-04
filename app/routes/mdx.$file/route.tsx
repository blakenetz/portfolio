import {
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Button, Reader } from "~/components";
import { getMdx, getModulePosts } from "~/server/mdx.server";
import { getCanonicalLink } from "~/utils";

const mdxFiles = getModulePosts();

export const meta: MetaFunction<LoaderFunction> = ({ data, location }) => {
  const canonicalLink = getCanonicalLink(location);

  return [...data.frontmatter.meta, canonicalLink];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const result = getMdx(params);

  if (result.ok === false) {
    return redirect(`/mdx?status=${result.errorStatus}`);
  }

  const filename = `../blog/${params.file}.mdx`;

  return json({ filename });
}

export default function Post() {
  const { filename } = useLoaderData<typeof loader>();
  const post = mdxFiles[filename];

  return (
    <>
      <Reader>{post && post.default()}</Reader>

      <Button component={Link} to="/mdx">
        Take me back
      </Button>
    </>
  );
}
