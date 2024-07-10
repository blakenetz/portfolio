import { Anchor, Flex, Text, Title } from "@mantine/core";
import { Link } from "@remix-run/react";

import { Button, Header, Links } from "~/components";
import commonStyles from "~/styles/common.module.css";

export default function Index() {
  return (
    <div className={commonStyles.center}>
      <Header />

      <Flex className={commonStyles.column}>
        <div className={commonStyles.burn}>
          <Title order={1}>Hello!</Title>
        </div>
        <Text>
          I&apos;m a full stack developer with experience building apps of all
          shapes and sizes. I&apos;ve spent a good chunk of my life contributing
          to products that have an environmental or social impact. The other
          parts include living out of a van, biking around the world, or just
          hangin&apos; with my pup :)
        </Text>
        <Text>Are you building something interesting?</Text>

        <Flex className={commonStyles.column}>
          <div className={commonStyles.burn}>
            <Anchor href="mailto:blakenetzeband@gmail.com">
              Let&apos;s connect
            </Anchor>
          </div>

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
