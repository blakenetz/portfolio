import { ActionIcon, Tooltip } from "@mantine/core";
import { LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { IconHome } from "@tabler/icons-react";

import { getRepos } from "~/api/projects.server";
import Background from "~/components/background";
import Header from "~/components/header";
import Links from "~/components/links";
import Repos from "~/components/repos";
import styles from "~/styles/projects.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
  const repos = await getRepos(request);

  // error handled
  if (repos.every((r) => r.status === 400)) redirect("/");

  return repos;
}

export default function Projects() {
  const [personal, work] = useLoaderData<typeof loader>();
  const submit = useSubmit();

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

      <Repos data={personal.data} submit={submit} title="Personal projects" />
      <Repos
        data={work.data}
        submit={submit}
        title="Work projects"
        subtitle="The following are typically CI items, POC, etc. and are aren't suited for production"
      />

      <div className="burn">
        <Links />
      </div>
    </Background>
  );
}
