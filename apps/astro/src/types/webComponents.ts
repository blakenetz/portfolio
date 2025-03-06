import type { RepoData } from "~/types/projects";

export interface SnackbarElement extends HTMLElement {
  show: (timeout?: number) => void;
  hide: () => void;
}
export interface GitHubProjectsGridItem extends HTMLElement {
  update: (repo: RepoData[number]) => void;
}
