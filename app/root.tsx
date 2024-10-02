import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  CSSVariablesResolver,
  MantineProvider,
  Title,
} from "@mantine/core";
import { useLocalStorage, useToggle } from "@mantine/hooks";
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { Button, Layout, Notification } from "~/components";
import styles from "~/styles/root.css?url";
import { Status, status as httpStatus } from "~/utils";

import ColorSchemeContext from "./styles/colorSchemeContext";

export const meta: MetaFunction = () => [
  { title: "BLAKE NETZEBAND" },
  {
    name: "description",
    content: "Hi! I'm Blake and this is my chunk of the internet",
  },
];

export const links: LinksFunction = () => [
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
    href: "https://github.com/blakenetz/portfolio/blob/master/LICENSE",
  },
  { rel: "me", href: "https://blakenetzeband.com", type: "text/html" },
  { rel: "me", href: "mailto:blake.netzeband@gmail.com" },
  { rel: "index", href: "https://blakenetzeband.com" },
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

  if (process.env.NODE_ENV === "development") {
    console.error("aw shit!", error);
  }

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
          <Layout>
            <Title order={4} component="h1">
              Crap. We hit an issue.
            </Title>
            <Button component={Link} to="/">
              Send me home!
            </Button>
            <Scripts />
          </Layout>
        </MantineProvider>
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const status =
    (new URL(request.url).searchParams.get("status") as Status) ??
    httpStatus.ok;

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
        {/* search engine, etc */}
        <meta name="referrer" content="origin-when-crossorigin" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        {/*  general */}
        <meta name="subject" content="portfolio" />
        <meta name="rating" content="General" />
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
            <Layout>
              <Outlet />
              <Scripts />
            </Layout>
            <Notification hide={hide} handleClose={setHide} status={status} />
          </MantineProvider>
        </ColorSchemeContext.Provider>
      </body>
    </html>
  );
}
