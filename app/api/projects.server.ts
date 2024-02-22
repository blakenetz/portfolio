import { formatDistanceToNow, isThisYear } from "date-fns";

import Api from "~/api/singleton.server";

import {
  Data,
  DataPoints,
  Sort,
  sorts,
  UserScope as UserScope,
} from "./projects";

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

function parseData(responseData: Data): Pick<Data[number], DataPoints>[] {
  return responseData.map((data) => ({
    name: parseEmojis(data.name)!,
    description: parseEmojis(data.description),
    html_url: data.html_url,
    created_at: formatDate(data.created_at!),
    updated_at: formatDate(data.updated_at!),
    language: data.language,
    fork: data.fork,
  }));
}

async function getRepoForUser(username: string, sort: Sort) {
  const response = await Api.octokit.request("GET /users/{username}/repos", {
    username,
    sort,
    per_page: 5,
  });

  if (response.status !== 200) {
    return { ...response, data: [] };
  }

  return {
    ...response,
    data: parseData(response.data),
  };
}

async function getRepoByScope(scope: UserScope, sort: Sort) {
  if (scope === "personal") {
    const username = Api.getUsername("personal");
    return getRepoForUser(username, sort);
  }

  return Promise.all(
    Api.getUsername("work").map((username) => getRepoForUser(username, sort))
  );
}

export async function getRepos(request: Request) {
  const sort = extractUrlParams(request.url);

  return getRepoByScope("personal", sort);
}
