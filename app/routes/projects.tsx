import {
  Anchor,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { LinksFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconGitFork } from "@tabler/icons-react";

import { getRepos } from "~/api/projects.server";
import Background from "~/components/background";
import Language from "~/components/language";
import styles from "~/styles/projects.css";
import { format } from "~/utils/projects";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader() {
  const { status, data } = await getRepos();

  if (status !== 200) redirect("/");

  return data;
}

export default function Projects() {
  const repos = useLoaderData<typeof loader>();

  return (
    <Background>
      <Title>Github Repos</Title>
      <section className="repos">
        {repos.map((repo) => (
          <Paper
            key={repo.name}
            shadow="sm"
            withBorder
            className="outline gradient-background"
          >
            <Paper className="repo">
              <Flex>
                {repo.fork && (
                  <Tooltip label="This repo was forked">
                    <IconGitFork />
                  </Tooltip>
                )}
                <Title
                  order={4}
                  component="p"
                  dangerouslySetInnerHTML={{ __html: repo.name! }}
                />
              </Flex>
              {repo.description && (
                <Text dangerouslySetInnerHTML={{ __html: repo.description }} />
              )}
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href={repo.html_url}
              >
                View on Github
              </Anchor>
              <div className="meta">
                {repo.language && (
                  <>
                    <Language language={repo.language} />
                    <Divider orientation="vertical" />
                  </>
                )}

                <Text>{`Created ${format(repo.created_at!)}`}</Text>
                <Divider orientation="vertical" />
                <Text>{`Updated ${format(repo.updated_at!)}`}</Text>
              </div>
            </Paper>
          </Paper>
        ))}
      </section>
    </Background>
  );
}
