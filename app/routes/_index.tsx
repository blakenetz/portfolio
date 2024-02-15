import type { LinksFunction, MetaFunction } from "@remix-run/node";
import Welcome from "~/components/welcome";

export default function Index() {
  return <Welcome />;
}
