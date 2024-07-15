import {
  Alert,
  Anchor,
  AnchorProps,
  Blockquote,
  Flex,
  Image,
  List,
  ListItem,
  Text,
  Title,
} from "@mantine/core";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { MDXComponents } from "node_modules/@mdx-js/react/lib";
import { HTMLAttributes } from "react";

import { Button } from "~/components";
import commonStyles from "~/styles/common.module.css";
import { blogPath, cls, getPosts, postFromModule } from "~/util";

import CodeBlock from "./codeBlock";
import styles from "./post.module.css";

// generic html props
type HTMLProps = HTMLAttributes<HTMLElement>;

const components: MDXComponents = {
  a: (props: AnchorProps) => (
    <Anchor {...props} target="_blank" rel="noopener noreferrer" />
  ),
  p: (props: HTMLProps) => <Text {...props} />,
  h1: (props: HTMLProps) => <Title {...props} order={2} />,
  h2: (props: HTMLProps) => <Title {...props} order={3} />,
  h3: (props: HTMLProps) => <Title {...props} order={4} />,
  h4: (props: HTMLProps) => <Title {...props} order={5} />,
  code: CodeBlock,
  img: (props: HTMLProps) => <Image {...props} />,
  blockquote: (props: HTMLProps) => <Blockquote {...props} p="md" />,
  ul: (props: HTMLProps) => <List {...props} withPadding type="unordered" />,
  ol: (props: HTMLProps) => <List {...props} withPadding type="ordered" />,
  li: ListItem,
};

const posts = getPosts();

export const meta: MetaFunction = ({ location }) => {
  const module = posts[`.${location.pathname}.mdx`];

  return module.meta;
};

export const loader: LoaderFunction = ({ params }) => {
  const filename = `${blogPath}/${params.post}.mdx`;

  const { render: _render, ...attributes } = postFromModule(
    filename,
    posts[filename]
  );

  return json({ key: filename, attributes });
};

export default function Post() {
  const { key, attributes } = useLoaderData<typeof loader>();
  const post = posts[key];

  return (
    <>
      <Flex className={cls(commonStyles.column, styles.reader)}>
        {attributes.source === "medium" && (
          <Alert
            color="pink"
            icon={<IconInfoCircle />}
            className={cls(styles.alert, styles.medium)}
          >
            This post was originally published on{" "}
            <Anchor
              href={attributes.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Medium
            </Anchor>
          </Alert>
        )}
        {post && post.default({ components })}
      </Flex>
      <Button component={Link} to="/">
        Take me home
      </Button>
    </>
  );
}
