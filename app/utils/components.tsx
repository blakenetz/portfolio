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
import { HTMLAttributes } from "react";
import { Components } from "react-markdown";

import { CodeBlock } from "~/components";

// generic html props
type HTMLProps = HTMLAttributes<HTMLElement>;

export const components: Components = {
  a: (props: AnchorProps) => (
    <Anchor {...props} target="_blank" rel="noopener noreferrer" />
  ),
  p: (props: HTMLProps) => <Text {...props} />,
  h1: (props: HTMLProps) => (
    <Title {...props} order={2} component="h1" mb="md" />
  ),
  h2: (props: HTMLProps) => (
    <Title {...props} order={3} component="h2" mt="sm" />
  ),
  h3: (props: HTMLProps) => (
    <Title {...props} order={4} component="h3" mt="sm" />
  ),
  h4: (props: HTMLProps) => (
    <Title {...props} order={5} component="h4" mt="sm" />
  ),
  code: (props) => <CodeBlock {...props} />,
  img: (props: HTMLProps) => <Image {...props} />,
  blockquote: (props: HTMLProps) => <Blockquote {...props} p="md" />,
  ul: (props: HTMLProps) => <List {...props} withPadding type="unordered" />,
  ol: (props: HTMLProps) => <List {...props} withPadding type="ordered" />,
  li: (props: HTMLProps) => <ListItem {...props} />,
};
