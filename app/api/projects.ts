import type { Endpoints } from "@octokit/types";

export const sorts = ["updated", "created"] as const;
export type Sort = (typeof sorts)[number];

export type UserScope = "work" | "personal";

// Octokit types
export type OctoResponse = Endpoints["GET /users/{username}/repos"]["response"];
export type OctoData = OctoResponse["data"];
export type EmojiData = Endpoints["GET /emojis"]["response"]["data"];

// Project types
export type RepoKeys =
  | "name"
  | "description"
  | "html_url"
  | "created_at"
  | "updated_at"
  | "language"
  | "fork";
export type RepoData = Pick<OctoData[number], RepoKeys>[];
export type RepoResponse = { data: RepoData; status: number };
