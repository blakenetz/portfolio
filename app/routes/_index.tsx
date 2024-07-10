import { Button, Flex, Text, Title } from "@mantine/core";
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import Header from "~/components/header";
import Links from "~/components/links";
import styles from "~/styles/index.css";
import layoutStyles from "~/styles/layout.module.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  return (
    <div className={layoutStyles.center}>
      <Header />

      <Flex className="middle column">
        <Title order={1}>Hello</Title>
        <Text>
          I&apos;m a full stack developer with experience building apps of all
          shapes and sizes. I&apos;ve spent a good chunk of my life contributing
          to products that have an environmental or social impact. The other
          parts include living out of a van, biking around the world, or just
          hangin&apos; with my pup :)
        </Text>
        <Text>Are you building something interesting?</Text>

        <Flex className="column">
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
