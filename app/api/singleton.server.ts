import { Octokit } from "octokit";
import path from "path";
import type { Storage } from "unstorage";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

import { OctoResponse, Sort, UserScope } from "./projects";

type Emojis = { [key: string]: string };

type UserName<T> = T extends "personal"
  ? string
  : T extends "work"
  ? string[]
  : never;

const endpoint = "GET /users/{username}/repos";

class Api {
  #emojis: Emojis | null;
  #octokit: Octokit;
  #usernames: { personal: UserName<"personal">; work: UserName<"work"> };
  #storage: Storage<OctoResponse>;

  constructor() {
    // create API drivers/storage
    this.#octokit = new Octokit({
      auth: process.env.GITHUB_AUTH_TOKEN,
    });
    this.#storage = createStorage({
      driver: fsDriver({ base: path.resolve(".", ".cache") }),
    });

    // data used in request calls
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

  getUsername<T extends UserScope>(scope: T): UserName<T> {
    return scope === "personal"
      ? (this.#usernames.personal as UserName<T>)
      : (this.#usernames.work as UserName<T>);
  }

  async request(username: string, sort: Sort) {
    const opts = { username, sort, per_page: 5 };

    if (process.env.NODE_ENV === "development") {
      const key = [username, sort].join(":");

      // fetch from storage
      const value = await this.#storage.getItem(key);
      console.log("successfully fetched from cache: ", key);
      if (value) return value;

      // fetch from octokit
      const response = await this.#octokit.request(endpoint, opts);
      this.#storage.setItem(key, response);
      return response;
    }

    return this.#octokit.request(endpoint, opts);
  }
}

const singleton = Object.freeze(new Api());
export default singleton;
