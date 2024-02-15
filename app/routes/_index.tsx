import type { LinksFunction } from "@remix-run/node";
import Welcome from "~/components/welcome";
import styles from "~/styles/welcome.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  return <Welcome />;
}
