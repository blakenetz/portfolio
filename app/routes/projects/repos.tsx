import { Anchor, Divider, Flex, Text, Title, Tooltip } from "@mantine/core";
import { useSearchParams } from "@remix-run/react";
import { IconGitFork, IconUserCircle } from "@tabler/icons-react";

import { getParam, RepoData, sorts, UserScope } from "~/server/projects";
import { Card, SortControl } from "~/components";
import commonStyles from "~/styles/common.module.css";
import { capitalize, validate } from "~/utils";

import Language from "./language";
import styles from "./repos.module.css";

interface ReposProps {
  /**
   * API response data
   */
  data: RepoData;
  /**
   * name of input el
   */
  name: UserScope;
  /**
   * Additional information
   */
  subtitle?: string;
}

export default function Repos({ data, name, subtitle }: ReposProps) {
  const param = getParam(name);
  const [searchParams] = useSearchParams();

  const initialValue = validate(searchParams.get(param), sorts) ?? "updated";

  return (
    <section className={styles.repos}>
      <div className={commonStyles.burn}>
        <Title order={2}>{`${capitalize(name)} Projects`}</Title>
      </div>
      {subtitle && <Text>{subtitle}</Text>}

      <div className={styles.grid}>
        {data.map((repo) => (
          <Card key={repo.name}>
            <Flex>
              {repo.fork && (
                <Tooltip label="This repo was forked" withArrow>
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
                className={styles.description}
              />
            )}
            <div className={styles.meta}>
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href={repo.html_url}
                className={styles.anchor}
              >
                View on Github
              </Anchor>
              {repo.user && (
                <>
                  <Divider orientation="vertical" />
                  <Anchor
                    className={[styles.flex, styles.anchor].join(" ")}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://github.com/${repo.user}`}
                  >
                    <Flex className={["burn", styles.icon].join(" ")}>
                      <IconUserCircle />
                    </Flex>

                    {repo.user}
                  </Anchor>
                </>
              )}
            </div>
            <div className={styles.meta}>
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
          </Card>
        ))}
      </div>

      <SortControl
        title="Sort by last"
        name={param}
        values={sorts}
        initialValue={initialValue}
      />
    </section>
  );
}
