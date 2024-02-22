import {
  Anchor,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconGitFork } from "@tabler/icons-react";

import { RepoData } from "~/api/projects";
import Language from "~/components/language";

export default function Repos({ data }: { data: RepoData }) {
  return (
    <div className="flex">
      {data.map((repo) => (
        <Paper key={repo.name} shadow="sm" withBorder className="outline">
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
              <Text
                dangerouslySetInnerHTML={{ __html: repo.description }}
                className="description"
              />
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

              <Text>{`Created ${repo.created_at}`}</Text>
              <Divider orientation="vertical" />
              <Text>{`Updated ${repo.updated_at}`}</Text>
            </div>
          </Paper>
        </Paper>
      ))}
    </div>
  );
}
