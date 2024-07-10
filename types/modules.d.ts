import { MetaDescriptor } from "@remix-run/node";

/** @see https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286 */
type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

export interface Mdx {
  attributes: {
    meta: UnionToIntersection<MetaDescriptor>[];
    handle: Record<string, string>;
    headers: Headers;
  };
  filename: string;
}

declare module "*.mdx" {
  let mdx: Mdx;
  export const attributes: mdx.attributes;
  export const filename: mdx.filename;
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}

declare module "*.md" {
  let mdx: Mdx;
  export const attributes: mdx.attributes;
  export const filename: mdx.filename;
  let MDXComponent: (props) => JSX.Element;
  export default Mdx;
}
