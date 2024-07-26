export function validate<T>(
  val: string | null,
  arr: ReadonlyArray<T>
): T | null {
  const sort = val as T | null;
  if (sort && arr.includes(sort)) return sort;
  return null;
}

export function validateString<T extends string>(val: unknown): T {
  if (val && typeof val === "string" && val.length) return val as T;

  throw new Error(
    `Invalid value: ${val}. Expected a string with a length > 0. Received type: ${typeof val}`
  );
}
