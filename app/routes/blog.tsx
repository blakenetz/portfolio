import { LinksFunction } from "@remix-run/node";

import Header from "~/components/header";
import Root from "~/components/root";
import styles from "~/styles/projects.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Blog() {
  return (
    <Root>
      <Header burn />
    </Root>
  );
}
