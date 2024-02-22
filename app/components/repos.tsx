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
import { Form, SubmitFunction, useSearchParams } from "@remix-run/react";
import { IconGitFork } from "@tabler/icons-react";
import { useCallback, useState } from "react";

import { RepoData, Sort, sorts } from "~/api/projects";
import Language from "~/components/language";
import styles from "~/styles/repos.module.css";

function validate(val: string | null): Sort | null {
  const sort = val as Sort | null;
  if (sort && sorts.includes(sort)) return sort;
  return null;
}

interface ReposProps {
  data: RepoData;
  submit: SubmitFunction;
  title: string;
  subtitle?: string;
}

export default function Repos({ data, submit, title, subtitle }: ReposProps) {
  const [searchParams] = useSearchParams();

  const initialValue = validate(searchParams.get("sort"));

  const [value, setValue] = useState(initialValue ?? "updated");

  const handleChange = useCallback<
    NonNullable<SegmentedControlProps["onChange"]>
  >((val) => {
    const valid = validate(val);
    if (valid) setValue(valid);
  }, []);

  return (
    <section className="flex">
      <div className={["burn", styles.title].join(" ")}>
        <Title order={3}>{title}</Title>
        {subtitle && <Text>{subtitle}</Text>}
      </div>

      <div className="flex">
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
                  className={styles.description}
                />
              )}
              <Anchor
                target="_blank"
                rel="noopener noreferrer"
                href={repo.html_url}
              >
                View on Github
              </Anchor>
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
        <Form onChange={(e) => submit(e.currentTarget)} method="GET">
          <SegmentedControl
            value={value}
            onChange={handleChange}
            data={[
              { label: "Updated", value: "updated" },
              { label: "Created", value: "created" },
            ]}
            size="xs"
            name="sort"
          />
        </Form>
      </Flex>
    </section>
  );
}
