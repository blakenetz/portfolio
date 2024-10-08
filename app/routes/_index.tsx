import { Anchor, Flex, Text, Title } from "@mantine/core";
import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Button } from "~/components";
import commonStyles from "~/styles/common.module.css";
import styles from "~/styles/index.module.css";
import { cls, getCanonicalLink } from "~/utils";

export const meta: MetaFunction = ({ location }) => {
  return [getCanonicalLink(location)];
};

export default function Index() {
  return (
    <Flex className={cls(commonStyles.column, styles.main)}>
      <div className={commonStyles.burn}>
        <Title order={1} component="p">
          Hello!
        </Title>
      </div>
      <Text className={styles.heavy}>
        I&apos;m a full stack developer with experience building apps of all
        shapes and sizes. I&apos;ve spent a good chunk of my life contributing
        to products that have an environmental or social impact. The other parts
        include living out of a van, biking around the world, or just
        hangin&apos; with my pup :)
      </Text>
      <Text className={styles.heavy}>
        Are you building something interesting?{" "}
        <Anchor href="mailto:blakenetzeband@gmail.com" className={styles.heavy}>
          Let&apos;s connect
        </Anchor>
      </Text>

      <Flex className={commonStyles.column}>
        <Button component={Link} to="projects">
          Projects
        </Button>

        <Button component={Link} to="blog">
          Blog
        </Button>
      </Flex>
    </Flex>
  );
}
