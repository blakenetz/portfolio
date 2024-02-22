import type { Endpoints } from "@octokit/types";

export const sorts = ["updated", "created"] as const;
export type Sort = (typeof sorts)[number];
export type UserScope = "work" | "personal";
export type Data = Endpoints["GET /users/{username}/repos"]["response"]["data"];
export type DataPoints =
  | "name"
  | "description"
  | "html_url"
  | "created_at"
  | "updated_at"
  | "language"
  | "fork";
