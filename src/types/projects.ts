import type { Endpoints } from "@octokit/types";

export type Sort = "updated" | "created";
export type UserScope = "work" | "personal";

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
