import { Octokit } from "octokit";
import path from "path";
import type { Storage } from "unstorage";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

import { EmojiData, OctoResponse, Sort, UserScope } from "./projects";

type UserName<T> = T extends "personal"
  ? string
  : T extends "work"
  ? string[]
  : never;

type StorageItem<T> = T extends "GET /users/{username}/repos"
  ? OctoResponse
  : T extends "GET /emojis"
  ? EmojiData
  : never;

const endpoints = ["GET /users/{username}/repos", "GET /emojis"] as const;
type Endpoint = (typeof endpoints)[number];

type ReposItem = StorageItem<(typeof endpoints)[0]>;
type EmojisItem = StorageItem<(typeof endpoints)[1]>;

class Api {
  #emojis: EmojiData | null;
  #octokit: Octokit;
  #usernames: { personal: UserName<"personal">; work: UserName<"work"> };
  #storage: Storage<StorageItem<Endpoint>>;

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
    const key = "emojis";
    // try cache first
    const value = await this.#storage.getItem<EmojisItem>(key);
    if (value) return value;

    const { data } = await this.#octokit.request(endpoints[1]);
    this.#emojis = data;
    this.#storage.setItem<EmojisItem>(key, data);
  }

  getEmoji(emoji: keyof EmojiData) {
    if (this.#emojis) return this.#emojis[emoji];
    return null;
  }

  getUsername<T extends UserScope>(scope: T): UserName<T> {
    return scope === "personal"
      ? (this.#usernames.personal as UserName<T>)
      : (this.#usernames.work as UserName<T>);
  }

  async request(username: string, sort: Sort) {
    const opts = { username, sort, per_page: 6 };

    if (process.env.NODE_ENV === "development") {
      const key = [username, sort].join(":");

      // fetch from storage
      const value = await this.#storage.getItem<ReposItem>(key);
      console.log("successfully fetched from cache: ", key);
      if (value) return value;

      // fetch from octokit
      const response = await this.#octokit.request(endpoints[0], opts);
      this.#storage.setItem<ReposItem>(key, response);
      return response;
    }

    return this.#octokit.request(endpoints[0], opts);
  }
}

const singleton = Object.freeze(new Api());
export default singleton;
