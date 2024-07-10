import { Button, Flex, Notification, Text, Title } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";

import Header from "~/components/header";
import Links from "~/components/links";
import Root from "~/components/root";
import styles from "~/styles/index.css";
import layoutStyles from "~/styles/layout.module.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = async ({ request }) => {
  const status = new URL(request.url).searchParams.get("status") ?? "ok";

  return json({ status });
};

export default function Index() {
  const { status } = useLoaderData<typeof loader>();
  const [hide, setHide] = useToggle();

  return (
    <Root className="index">
      <div className={layoutStyles.center}>
        <Header />

        <Flex className="middle column">
          <Title order={1}>Hello</Title>
          <Text>
            I&apos;m a full stack developer with experience building apps of all
            shapes and sizes. I&apos;ve spent a good chunk of my life
            contributing to products that have an environmental or social
            impact. The other parts include living out of a van, biking around
            the world, or just hangin&apos; with my pup :)
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
        {status === "octokit-fail" && hide !== true && (
          <Notification title="Sorry!" onClose={setHide} color="red">
            We seemed to hit a snag fetching data from Github.
          </Notification>
        )}

        <Links />
      </div>
    </Root>
  );
}
