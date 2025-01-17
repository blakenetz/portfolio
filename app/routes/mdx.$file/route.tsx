import {
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Button, markdownComponents, Reader } from "~/components";
import { getMdx, getModulePosts } from "~/server/mdx";
import { getCanonicalLink } from "~/utils";

const mdxFiles = getModulePosts();

export const meta: MetaFunction<LoaderFunction> = ({ data, location }) => {
  const canonicalLink = getCanonicalLink(location);

  return [...data.meta, canonicalLink];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (process.env.NODE_ENV !== "development") {
    throw new Response("Not Found", { status: 404 });
  }

  const result = getMdx(params);

  if (result.ok === false) {
    return redirect(`/mdx?status=${result.errorStatus}`);
  }

  const filename = `../blog/${params.file}.mdx`;

  return json({ filename, meta: mdxFiles[filename].frontmatter.meta });
}

export default function Post() {
  const { filename } = useLoaderData<typeof loader>();
  const post = mdxFiles[filename];

  return (
    <>
      <Reader>
        {post && post.default({ components: markdownComponents })}
      </Reader>

      <Button component={Link} to="/mdx">
        Take me back
      </Button>
    </>
  );
}
