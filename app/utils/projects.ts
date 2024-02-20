const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function format(date: string) {
  return formatter.format(new Date(date));
}

const reg = /(:[\w\-+]+:)/g;

export function parseEmojis(
  text: string | null,
  emojis: Record<string, string>
) {
  if (!text) return null;

  return text.replace(reg, (match) => {
    const name = match.replace(/:/g, "");
    const emoji = emojis[name];
    if (!emoji) return "";

    return `<img src="${emoji}" class="emoji" alt="${name}" aria-hidden="true" />`;
  });
}
