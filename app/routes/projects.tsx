import { Anchor, Paper, Text, Title } from "@mantine/core";
import { LinksFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { Octokit } from "octokit";

import Background from "~/components/background";
import styles from "~/styles/projects.css";
import { format, parseEmojis } from "~/utils/projects";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN,
  });
  const { data: emojis } = await octokit.request("GET /emojis", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const response = await octokit.request("GET /users/{username}/repos", {
    username: "blakenetz",
    sort: "updated",
    per_page: 5,
  });

  if (response.status !== 200) {
    redirect("/");
  }

  return response.data.map((data) => ({
    name: parseEmojis(data.name, emojis),
    description: parseEmojis(data.description, emojis),
    html_url: data.html_url,
    created_at: data.created_at,
    updated_at: data.updated_at,
    language: data.language,
  }));
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
              <Title
                order={4}
                component="p"
                dangerouslySetInnerHTML={{ __html: repo.name! }}
              />
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
              <Text>{`Created: ${format(repo.created_at!)}`}</Text>
              <Text>{`Updated: ${format(repo.updated_at!)}`}</Text>
            </Paper>
          </Paper>
        ))}
      </section>
    </Background>
  );
}
