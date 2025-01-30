import { MetaDescriptor } from "@remix-run/node";
import { Location } from "@remix-run/react";

export function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(" ").trim();
}

export const baseURL = "https://blakenetzeband.com";

export function getCanonicalLink(location: Location): MetaDescriptor {
  const url = new URL(location.pathname, baseURL);

  return {
    tagName: "link",
    rel: "canonical",
    href: url.toString(),
  };
}
