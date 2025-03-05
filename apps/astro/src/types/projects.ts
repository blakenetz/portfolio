import type { Endpoints } from "@octokit/types";

export const sorts = ["updated", "created"] as const;
export type Sort = (typeof sorts)[number];

export const scopes = ["work", "personal"] as const;
export type UserScope = (typeof scopes)[number];

// Octokit types
export type OctoResponse = Endpoints["GET /users/{username}/repos"]["response"];
export type OctoData = OctoResponse["data"];
export type EmojiData = Endpoints["GET /emojis"]["response"]["data"];
export type OctoOptions =
  Endpoints["GET /users/{username}/repos"]["parameters"];

// Project types
export type RepoKeys =
  | "name"
  | "description"
  | "html_url"
  | "created_at"
  | "updated_at"
  | "language"
  | "fork";

export type RepoData = (Pick<OctoData[number], RepoKeys> & {
  user?: OctoData[number]["owner"]["login"];
})[];
export type RepoResponse = { data: RepoData; status: number };

export function getParam(scope: UserScope) {
  return [scope, "sort"].join("-");
}

export type ProjectItem = {
  title: string;
  timeFrame: [number, number] | number;
  role?: string;
  description: string;
  employer?: string;
  techStack?: string[];
  link?: string;
  image: Promise<typeof import("*.png")>;
};
