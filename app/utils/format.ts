import { formatDistanceToNow, isThisYear } from "date-fns";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(value: string | Date, skipCommon = false) {
  const date = new Date(value);

  if (!skipCommon && isThisYear(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return formatter.format(date);
}

export function capitalize(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function kebobCase(val: string) {
  return val.replace(/\s/, "-").toLowerCase();
}
