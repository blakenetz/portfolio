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
) => JSX.Element;
export type Attribute = Record<"date" | "source" | "url", string>;

export interface Mdx {
  frontmatter: {
    meta: UnionToIntersection<MetaDescriptor>[];
    headers: Headers;
    attributes: Attribute[];
  };
  meta: UnionToIntersection<MetaDescriptor>[];
  headers: Headers;
  default: MDXComponent;
}

declare module "*.mdx" {
  let mdx: Mdx;
  export const meta: mdx.meta;
  export const headers: mdx.headers;
  export const frontmatter: mdx.frontmatter;
  let MDXComponent: MDXComponent;
  export default MDXComponent;
}

declare module "*.md" {
  let mdx: Mdx;
  export const meta: mdx.meta;
  export const headers: mdx.headers;
  export const frontmatter: mdx.frontmatter;
  let MDXComponent: MDXComponent;
  export default MDXComponent;
}
