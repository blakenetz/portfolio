import {
  Anchor,
  Divider,
  Flex,
  Paper,
  SegmentedControl,
  SegmentedControlProps,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useSearchParams } from "@remix-run/react";
import { IconGitFork, IconUserCircle } from "@tabler/icons-react";
import { useCallback, useState } from "react";

import { getParam, RepoData, Sort, sorts, UserScope } from "~/api/projects";
import Language from "~/components/language";
import styles from "~/styles/repos.module.css";

function validate(val: string | null): Sort | null {
  const sort = val as Sort | null;
  if (sort && sorts.includes(sort)) return sort;
  return null;
}

function capitalize(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

interface ReposProps {
  data: RepoData;
  name: UserScope;
  subtitle?: string;
}

export default function Repos({ data, name, subtitle }: ReposProps) {
  const param = getParam(name);
  const [searchParams] = useSearchParams();

  const initialValue = validate(searchParams.get(param));

  const [value, setValue] = useState(initialValue ?? "updated");

  const handleChange = useCallback<
    NonNullable<SegmentedControlProps["onChange"]>
  >((val) => {
    const valid = validate(val);
    if (valid) setValue(valid);
  }, []);

  return (
    <section className={styles.repos}>
      <div className={["burn", styles.title].join(" ")}>
        <Title order={3}>{`${capitalize(name)} Projects`}</Title>
        {subtitle && <Text>{subtitle}</Text>}
      </div>

      <div className={styles.grid}>
        {data.map((repo) => (
          <Paper
            key={repo.name}
            shadow="sm"
            withBorder
            className={styles.outline}
          >
            <Paper className={styles.repo}>
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
                        <IconUserCircle size="md" />
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
            </Paper>
          </Paper>
        ))}
      </div>

      <Flex className={styles.end}>
        <Text>Sort by last</Text>
        <SegmentedControl
          value={value}
          onChange={handleChange}
          data={[
            { label: "Updated", value: "updated" },
            { label: "Created", value: "created" },
          ]}
          size="xs"
          name={param}
        />
      </Flex>
    </section>
  );
}
