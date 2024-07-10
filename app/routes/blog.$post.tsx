import {
  Anchor,
  AnchorProps,
  Flex,
  Text,
  TextProps,
  Title,
  TitleProps,
} from "@mantine/core";
import { useParams } from "@remix-run/react";
import { MDXComponents } from "node_modules/@mdx-js/react/lib";

import Header from "~/components/header";
import styles from "~/styles/common.module.css";
import { blogPath, getPosts } from "~/util";

const posts = getPosts();

const components: MDXComponents = {
  a: (props: AnchorProps) => (
    <Anchor {...props} target="_blank" rel="noopener noreferrer" />
  ),
  p: (props: TextProps) => <Text {...props} />,
  h1: (props: TitleProps) => <Title {...props} order={2} component="h3" />,
  h2: (props: TitleProps) => <Title {...props} order={3} component="h4" />,
  h3: (props: TitleProps) => <Title {...props} order={4} component="h5" />,
};

export default function Post() {
  const params = useParams();
  const filename = `${blogPath}/${params.post}.mdx`;

  return (
    <>
      <Header />
      <Flex className={styles.column}>
        {posts[filename] &&
          posts[filename].default({
            components,
          })}
      </Flex>
    </>
  );
}
