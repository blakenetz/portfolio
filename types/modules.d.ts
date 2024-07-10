import { MetaDescriptor } from "@remix-run/node";
import { RouteModule } from "@remix-run/react/dist/routeModules";

/** @see https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286 */
type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

export interface Mdx {
  default: RouteModule.default;
  attributes: {
    meta: UnionToIntersection<MetaDescriptor>[];
    handle: Record<string, string>;
    headers: Headers;
  };
  filename: string;
}

declare module "*.mdx" {
  let mdx: Mdx;
  export default Mdx;
}

declare module "*.md" {
  let mdx: Mdx;
  export default Mdx;
}
