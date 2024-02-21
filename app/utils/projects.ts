import Api from "~/api/singleton.server";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function format(value: string) {
  const date = new Date(value);
  return formatter.format(date);
}

const reg = /(:[\w\-+]+:)/g;

export function parseEmojis(text: string | null) {
  if (!text) return null;

  return text.replace(reg, (match) => {
    const name = match.replace(/:/g, "");
    const emoji = Api.getEmoji(name);

    if (!emoji) return "";

    return `<img src="${emoji}" class="emoji" alt="${name}" aria-hidden="true" />`;
  });
}
