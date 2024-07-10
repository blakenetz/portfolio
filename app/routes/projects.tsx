import { Button } from "@mantine/core";
import { LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";

import { getRepos } from "~/api/projects.server";
import Header from "~/components/header";
import Links from "~/components/links";
import Repos from "~/components/repos";
import Root from "~/components/root";
import styles from "~/styles/projects.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ request }: LoaderFunctionArgs) {
  const repos = await getRepos(request);

  // nothing to show :( redirect
  if (repos.every((r) => r.status === 400)) {
    return redirect("/?status=octokit-fail");
  }

  return repos;
}

export default function Projects() {
  const [personal, work] = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <Root>
      <Header burn />

      <Form
        className="body"
        onChange={(e) => submit(e.currentTarget)}
        method="GET"
      >
        <Repos name="personal" data={personal.data} />
        <Repos
          name="work"
          data={work.data}
          subtitle="The following are typically CI items, POC, etc. and are aren't suited for production"
        />
      </Form>

      <div className="burn button">
        <Button component={Link} to="/" variant="filled" className="home">
          Take me home
        </Button>
      </div>

      <div className="burn">
        <Links />
      </div>
    </Root>
  );
}
