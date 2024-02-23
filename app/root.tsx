import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  CSSVariablesResolver,
  MantineProvider,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";

import styles from "~/styles/root.css";

import ColorSchemeContext from "./styles/colorSchemeContext";

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

const resolver: CSSVariablesResolver = (theme) => {
  const { colors } = theme;
  const saturated = [
    colors.yellow,
    colors.grape,
    colors.teal,
    colors.pink,
    colors.cyan,
  ]
    .map((tuple) => tuple[3])
    .join(",");
  const desaturated = [
    colors.gray[7],
    colors.gray[6],
    colors.gray[9],
    colors.gray[6],
    colors.gray[9],
  ].join(",");

  return {
    variables: {
      "--bg-gradient": theme.other.ada
        ? `linear-gradient(160deg, ${desaturated})`
        : `linear-gradient(160deg, ${saturated})`,
    },
    light: {},
    dark: {},
  };
};

export default function App() {
  const [ada, setAda] = useToggle();

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
        <ColorSchemeContext.Provider value={{ ada, toggle: setAda }}>
          <MantineProvider
            theme={{ other: { ada } }}
            cssVariablesResolver={resolver}
          >
            <Outlet />
            <Scripts />
            <LiveReload />
          </MantineProvider>
        </ColorSchemeContext.Provider>
      </body>
    </html>
  );
}
