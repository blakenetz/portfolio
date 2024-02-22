import { Octokit } from "octokit";

import { UserScope } from "./projects";

type Emojis = { [key: string]: string };

type UserName<T> = T extends "personal"
  ? string
  : T extends "work"
  ? string[]
  : never;

class Api {
  #emojis: Emojis | null;
  #octokit: Octokit;
  #usernames: { personal: UserName<"personal">; work: UserName<"work"> };

  constructor() {
    const octokit = new Octokit({
      auth: process.env.GITHUB_AUTH_TOKEN,
    });

    this.#octokit = octokit;
    this.#usernames = {
      personal: "blakenetz",
      work: ["blake-kc", "blake-spire", "blake-discover"],
    };
    this.#emojis = null;

    this.initialize();
  }

  private async initialize() {
    const { data } = await this.#octokit.request("GET /emojis");
    this.#emojis = data;
  }

  getEmoji(emoji: keyof Emojis) {
    if (this.#emojis) return this.#emojis[emoji];
    return null;
  }

  get octokit() {
    return this.#octokit;
  }

  getUsername<T extends UserScope>(scope: T): UserName<T> {
    return scope === "personal"
      ? (this.#usernames.personal as UserName<T>)
      : (this.#usernames.work as UserName<T>);
  }
}

const singleton = Object.freeze(new Api());
export default singleton;
