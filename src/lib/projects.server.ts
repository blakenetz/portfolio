import type {
  OctoData,
  OctoResponse,
  RepoData,
  RepoResponse,
  Sort,
  UserScope,
} from "~/types/projects";

import Api from "./projects.api";
import { formatDate } from "./utils";
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

function sortData(responseData: OctoData, sort: Sort) {
  const key: keyof RepoData[number] =
    sort === "created" ? "created_at" : "updated_at";

  return responseData.sort(
    (a, b) => new Date(b[key]!).valueOf() - new Date(a[key]!).valueOf(),
  );
}

function parseData(responseData: OctoData, includeUser?: boolean): RepoData {
  return responseData.map((data) => ({
    name: parseEmojis(data.name)!,
    description: parseEmojis(data.description),
    html_url: data.html_url,
    created_at: formatDate(data.created_at!),
    updated_at: formatDate(data.updated_at!),
    language: data.language,
    fork: data.fork,
    ...(includeUser && { user: data.owner.login }),
  }));
}

async function getRepoForUser(
  username: string,
  sort: Sort,
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

export async function getRepoByScope(
  scope: UserScope,
  sort: Sort = "updated",
): Promise<RepoResponse> {
  if (scope === "personal") {
    const username = Api.getUsername("personal");
    const response = await getRepoForUser(username, sort);

    return {
      status: response.status,
      data: parseData(response.data),
    };
  }

  // work scope
  const repos = await Promise.all(
    Api.getUsername("work").map((username) => getRepoForUser(username, sort)),
  );

  // expecting 12 results
  const data = sortData(
    repos.flatMap(({ data }) => data),
    sort,
  ).slice(0, 12);

  const status = repos.every((r) => r.status % 200 < 100)
    ? 200
    : repos.every((r) => r.status % 400 < 100)
      ? 400
      : 206;

  return {
    status: status,
    data: parseData(data, true),
  };
}

export async function getRepos() {
  return Promise.all([getRepoByScope("personal"), getRepoByScope("work")]);
}
