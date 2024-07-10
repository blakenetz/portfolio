import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  CSSVariablesResolver,
  MantineProvider,
  Title,
} from "@mantine/core";
import { useLocalStorage, useToggle } from "@mantine/hooks";
import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import React from "react";

import Notification from "~/components/notification";
import styles from "~/styles/root.css";
import { Status, status as errorStatus, status } from "~/util";

import Root from "./components/root";
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

export const headers: HeadersFunction = () => ({
  // cache for 1 hour
  "Cache-Control": `public, s-maxage=${60 * 60}`,
});

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

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (process.env.NODE_ENV === "development") {
    console.error("aw shit!", error);
  }

  React.useEffect(() => {
    navigate(`/?status=${status.unknown}`);
  });

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
        <MantineProvider cssVariablesResolver={resolver}>
          <Root>
            <Title order={4} component="h1">
              Crap. We hit an issue.
            </Title>
            <Title order={5} component="h2">
              Redirecting...
            </Title>
            <Scripts />
          </Root>
        </MantineProvider>
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const status =
    (new URL(request.url).searchParams.get("status") as Status) ??
    errorStatus.ok;

  return json({ status });
};

export default function App() {
  const { status } = useLoaderData<typeof loader>();
  const [hide, setHide] = useToggle();

  const [ada, setAda] = useLocalStorage({
    key: "ada",
    defaultValue: false,
  });

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
            theme={{ other: { ada }, primaryColor: "indigo" }}
            cssVariablesResolver={resolver}
          >
            <Root>
              <Outlet />
              <Scripts />
              <LiveReload />
            </Root>
            <Notification hide={hide} handleClose={setHide} status={status} />
          </MantineProvider>
        </ColorSchemeContext.Provider>
      </body>
    </html>
  );
}
