import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";

import { Button } from "~/components";
import { getRepos } from "~/server/projects.server";
import { getCanonicalLink, status } from "~/utils";

import styles from "./projects.module.css";
import Repos from "./repos";

export const meta: MetaFunction = ({ location }) => {
  return [
    getCanonicalLink(location),
    { title: "BN | Projects" },
    { description: "My personal and work Github repositories" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const repos = await getRepos(request);

  // nothing to show :( redirect
  if (repos.every((r) => r.status === 400)) {
    return redirect(`/?status=${status.octokit}`);
  }

  return repos;
}

export default function Projects() {
  const [personal, work] = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <>
      <Form
        className={styles.body}
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

      <Button component={Link} to="/">
        Take me home
      </Button>
    </>
  );
}
