import { MetaDescriptor } from "@remix-run/node";
import type { MDXProps } from "mdx/types";
import React from "react";

/** @see https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286 */
type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

export type MDXComponent = (
  props?: React.PropsWithChildren<MDXProps>
) => React.JSX.Element;

export type Attribute = {
  date: string;
  url?: string;
  source?: "github" | "medium";
};

export interface Mdx {
  frontmatter: {
    meta: UnionToIntersection<MetaDescriptor>[];
    headers: Headers;
    attributes: Attribute;
  };
  meta: UnionToIntersection<MetaDescriptor>[];
  headers: Headers;
  default: MDXComponent;
}

export type ModulePost = Record<"slug" | "title" | "description", string> &
  Attribute & { render: Mdx["default"] };

declare module "*.mdx" {
  let mdx: Mdx;
  export const meta: Mdx.meta;
  export const headers: Mdx.headers;
  export const frontmatter: Mdx.frontmatter;
  let MDXComponent: MDXComponent;
  export default MDXComponent;
}

declare module "*.md" {
  let mdx: Mdx;
  export const meta: Mdx.meta;
  export const headers: Mdx.headers;
  export const frontmatter: Mdx.frontmatter;
  let MDXComponent: MDXComponent;
  export default MDXComponent;
}
