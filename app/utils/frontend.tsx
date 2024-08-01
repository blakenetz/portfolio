export function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(" ").trim();
}
