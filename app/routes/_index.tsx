import { Flex, Text, Title } from "@mantine/core";
import { Link } from "@remix-run/react";

import { Button, Header, Links } from "~/components";
import commonStyles from "~/styles/common.module.css";
import styles from "~/styles/index.module.css";
import { cls } from "~/util";

export default function Index() {
  return (
    <div className={commonStyles.center}>
      <Header />

      <Flex className={cls(styles.middle, styles.column)}>
        <Title order={1}>Hello</Title>
        <Text>
          I&apos;m a full stack developer with experience building apps of all
          shapes and sizes. I&apos;ve spent a good chunk of my life contributing
          to products that have an environmental or social impact. The other
          parts include living out of a van, biking around the world, or just
          hangin&apos; with my pup :)
        </Text>
        <Text>Are you building something interesting?</Text>

        <Flex className={styles.column}>
          <Text component="a" href="mailto:blakenetzeband@gmail.com">
            Let&apos;s connect
          </Text>

          <Button component={Link} to="projects">
            Projects
          </Button>

          <Button component={Link} to="blog">
            Blog
          </Button>
        </Flex>
      </Flex>

      <Links />
    </div>
  );
}
