import type { LinksFunction } from "@remix-run/node";
import styles from "~/styles/welcome.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Welcome() {
  return <h1>font what now</h1>;
}
