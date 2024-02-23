import { Flex } from "@mantine/core";
import { LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { ScrollRestoration, useLoaderData, useSubmit } from "@remix-run/react";

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
    <>
      <ScrollRestoration />

      <Background>
        <div className="burn">
          <Header />
        </div>

        <Flex className="body">
          <Repos name="personal" data={personal.data} submit={submit} />
          <Repos
            name="work"
            data={work.data}
            submit={submit}
            subtitle="The following are typically CI items, POC, etc. and are aren't suited for production"
          />
        </Flex>

        <div className="burn">
          <Links />
        </div>
      </Background>
    </>
  );
}
