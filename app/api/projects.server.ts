import { formatDistanceToNow, isThisYear } from "date-fns";

import Api from "~/api/singleton.server";

import {
  OctoData,
  OctoResponse,
  RepoData,
  RepoResponse,
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

function sortData(responseData: OctoData, sort: Sort) {
  const key: keyof RepoData[number] =
    sort === "created" ? "created_at" : "updated_at";

  return responseData.sort(
    (a, b) => new Date(a[key]!).valueOf() - new Date(b[key]!).valueOf()
  );
}

function parseData(responseData: OctoData): RepoData {
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

async function getRepoForUser(
  username: string,
  sort: Sort
): Promise<Pick<OctoResponse, "data" | "status">> {
  const { status, data } = await Api.request(username, sort);

  if (status < 200 || status > 300) {
    return { status, data: [] };
  }

  return {
    status: 200,
    data,
  };
}

async function getRepoByScope(
  scope: UserScope,
  sort: Sort
): Promise<RepoResponse> {
  if (scope === "personal") {
    const username = Api.getUsername("personal");
    const response = await getRepoForUser(username, sort);

    return {
      status: response.status,
      data: parseData(response.data),
    };
  }

  const repos = await Promise.all(
    Api.getUsername("work").map((username) => getRepoForUser(username, sort))
  );

  const data = sortData(
    repos.flatMap(({ data }) => data),
    sort
  );

  const status = repos.every((r) => r.status % 200 < 100)
    ? 200
    : repos.every((r) => r.status % 400 < 100)
    ? 400
    : 206;

  return {
    status: status,
    data: parseData(data),
  };
}

export async function getRepos(request: Request) {
  const sort = extractUrlParams(request.url);

  return Promise.all([
    getRepoByScope("personal", sort),
    getRepoByScope("work", sort),
  ]);
}
