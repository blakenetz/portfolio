import { Anchor, AnchorProps } from "@mantine/core";
import { MDXProvider } from "@mdx-js/react";
import { useParams } from "@remix-run/react";
import { Mdx } from "types/modules";

const posts = import.meta.glob<Mdx>("../blog/*.mdx", {
  eager: true,
});
import Header from "~/components/header";

export default function Post() {
  const params = useParams();
  const filename = `../blog/${params.post}.mdx`;

  console.log(posts, params.post, posts[filename]);

  return (
    <MDXProvider
      components={{
        a: (props: AnchorProps) => (
          <Anchor {...props} rel="noopener noreferrer" />
        ),
      }}
    >
      <Header />
      {posts[filename] && posts[filename].default()}
    </MDXProvider>
  );
}
