import type { Endpoints } from "@octokit/types";

export const sorts = ["updated", "created"] as const;
export type Sort = (typeof sorts)[number];
export type UserScope = "work" | "personal";
export type RepoData =
  Endpoints["GET /users/{username}/repos"]["response"]["data"];
export type RepoKeys =
  | "name"
  | "description"
  | "html_url"
  | "created_at"
  | "updated_at"
  | "language"
  | "fork";
export type RepoResponse = {
  data: Pick<RepoData[number], RepoKeys>[];
  status: number;
};
