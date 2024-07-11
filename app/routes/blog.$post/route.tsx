import {
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
import { useParams } from "@remix-run/react";
import { MDXComponents } from "node_modules/@mdx-js/react/lib";
import { HTMLAttributes } from "react";

import styles from "~/styles/common.module.css";
import { blogPath, getPosts } from "~/util";

import CodeBlock from "./codeBlock";

// generic html props
type HTMLProps = HTMLAttributes<HTMLElement>;

const posts = getPosts();

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

export default function Post() {
  const params = useParams();
  const filename = `${blogPath}/${params.post}.mdx`;

  return (
    <Flex className={styles.column}>
      {posts[filename] && posts[filename].default({ components })}
    </Flex>
  );
}
