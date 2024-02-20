import { Anchor, Button, Text, Title } from "@mantine/core";
import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { IconBrandGithubFilled, IconBrandLinkedin } from "@tabler/icons-react";

import Background from "~/components/background";
import styles from "~/styles/index.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  return (
    <Background>
      <div className="center">
        <div className="content column top">
          <Title order={4} component="p">
            Blake Netzeband
          </Title>
          <Title order={4} component="p">
            Full Stack Developer
          </Title>
        </div>

        <div className="content column middle">
          <Title order={1}>Hello</Title>
          <Text>
            I&apos;m a full stack developer with experience building apps of all
            shapes and sizes. I&apos;ve spent a good chunk of my life
            contributing to products that have an environmental or social
            impact. The other parts include living out of a van, biking around
            the world, or just hangin&apos; with my pup :)
          </Text>
          <Text>Are you building something interesting?</Text>

          <div className="content column">
            <Text component="a" href="mailto:blakenetzeband@gmail.com">
              Let&apos;s connect
            </Text>
            <Button component={Link} to="projects">
              Projects
            </Button>
          </div>
        </div>

        <div className="content bottom">
          <Anchor
            href="https://github.com/blakenetz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGithubFilled aria-label="Github" />
          </Anchor>
          <Anchor
            href="https://github.com/blakenetz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandLinkedin aria-label="LinkedIn" />
          </Anchor>
          <Anchor href="mailto:blakenetzeband@gmail.com">
            blakenetzeband@gmail.com
          </Anchor>
        </div>
      </div>
    </Background>
  );
}
