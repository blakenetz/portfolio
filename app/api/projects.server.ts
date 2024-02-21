import { formatDistanceToNow, isThisYear } from "date-fns";

import Api from "~/api/singleton.server";

import { Sort, sorts } from "./projects";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);

  if (isThisYear(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return formatter.format(date);
}

const reg = /(:[\w\-+]+:)/g;

function parseEmojis(text: string | null) {
  if (!text) return null;

  return text.replace(reg, (match) => {
    const name = match.replace(/:/g, "");
    const emoji = Api.getEmoji(name);

    if (!emoji) return "";

    return `<img src="${emoji}" class="emoji" alt="${name}" aria-hidden="true" />`;
  });
}

function extractUrlParams(url: string): Sort {
  const { searchParams } = new URL(url);
  const sort = searchParams.get("sort") as Sort | null;
  if (sort && sorts.includes(sort)) return sort;

  return "updated";
}

export async function getRepos(request: Request) {
  const sort = extractUrlParams(request.url);

  const response = await Api.octokit.request("GET /users/{username}/repos", {
    username: "blakenetz",
    per_page: 5,
    sort,
  });

  if (response.status !== 200) {
    return { ...response, data: [] };
  }

  return {
    ...response,
    data: response.data.map((data) => ({
      name: parseEmojis(data.name),
      description: parseEmojis(data.description),
      html_url: data.html_url,
      created_at: formatDate(data.created_at!),
      updated_at: formatDate(data.updated_at!),
      language: data.language,
      fork: data.fork,
    })),
  };
}
