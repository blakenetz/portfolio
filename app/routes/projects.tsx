import {
  ActionIcon,
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
import { LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { IconGitFork, IconHome } from "@tabler/icons-react";
import { useCallback, useState } from "react";

import { Sort, sorts } from "~/api/projects";
import { getRepos } from "~/api/projects.server";
import Background from "~/components/background";
import Header from "~/components/header";
import Language from "~/components/language";
import Links from "~/components/links";
import styles from "~/styles/projects.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
  const repos = await getRepos(request);
  console.log(repos);

  if (repos.every((r) => r.status === 400)) redirect("/");

  return repos;
}

function validate(val: string | null): Sort | null {
  const next = val as Sort | null;
  if (next && sorts.includes(next)) return next;
  return null;
}

export default function Projects() {
  const [personal, _work] = useLoaderData<typeof loader>();
  const submit = useSubmit();
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
    <Background>
      <div className="burn">
        <Header />
      </div>

      <Tooltip label="Go home">
        <ActionIcon
          component={Link}
          to="/"
          aria-label="Go home"
          variant="gradient"
          className="home"
          gradient={{ from: "grape", to: "cyan", deg: 160 }}
        >
          <IconHome />
        </ActionIcon>
      </Tooltip>

      <section className="flex">
        <div className="burn">
          <Title>GitHub Projects</Title>
        </div>
        <div className="flex">
          {personal.data.map((repo) => (
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

        <Flex className="end">
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

      <div className="burn">
        <Links />
      </div>
    </Background>
  );
}
