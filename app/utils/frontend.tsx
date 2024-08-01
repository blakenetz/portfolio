import { compile } from "@mdx-js/mdx";

export function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(" ").trim();
}

export async function createMDXComponent(mdx: string) {
  const code = await compile(mdx, { outputFormat: "function-body" });
  const results = eval(code.value.toString());
  console.log(results);
  return results;
}
