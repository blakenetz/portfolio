import { Button, Flex, Text, Title } from "@mantine/core";
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import Background from "~/components/background";
import styles from "~/styles/index.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  return (
    <Background index>
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
        </Flex>
      </Flex>
    </Background>
  );
}
