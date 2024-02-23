import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";

import styles from "~/styles/root.css";

export const meta: MetaFunction = () => [
  { title: "BLAKE NETZEBAND" },
  {
    name: "description",
    content: "Hi! I'm Blake and this is my chunk of the internet",
  },
  // search engine, etc
  { name: "referrer", content: "origin-when-crossorigin" },
  { name: "robots", content: "index, follow" },
  { name: "googlebot", content: "index, follow" },
  // general
  { name: "subject", content: "portfolio" },
  { name: "rating", content: "General" },
];

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
  // fonts
  {
    href: "https://fonts.googleapis.com/css?family=Poiret+One|Monoton|Rajdhani:400,700",
    rel: "stylesheet",
    fetchpriority: "high",
  },
  //  about
  {
    rel: "license",
    href: "https://github.com/blakeface/portfolio/blob/master/LICENSE",
  },
  { rel: "me", href: "https://www.blakenetzeband.com", type: "text/html" },
  { rel: "me", href: "mailto:blake.netzeband@gmail.com" },
  { rel: "index", href: "https://www.blakenetzeband.com" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Outlet />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}
