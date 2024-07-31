import {
  Anchor,
  AnchorProps,
  Blockquote,
  Image,
  List,
  ListItem,
  Text,
  Title,
} from "@mantine/core";
import { MDXComponents } from "node_modules/@mdx-js/react/lib";
import { HTMLAttributes } from "react";

import CodeBlock from "./codeBlock";

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
export default components;
