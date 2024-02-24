import type { RequestHeaders } from "@octokit/types";
import { Octokit } from "octokit";
import path from "path";
import type { Storage } from "unstorage";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

import {
  EmojiData,
  OctoOptions,
  OctoResponse,
  Sort,
  UserScope,
} from "./projects";

type UserName<T> = T extends "personal"
  ? string
  : T extends "work"
  ? string[]
  : never;

type StorageItem<E> = E extends "GET /users/{username}/repos"
  ? OctoResponse
  : E extends "GET /emojis"
  ? EmojiData
  : never;

const endpoints = ["GET /users/{username}/repos", "GET /emojis"] as const;
type Endpoint = (typeof endpoints)[number];

type ReposItem = StorageItem<(typeof endpoints)[0]>;
type EmojisItem = StorageItem<(typeof endpoints)[1]>;

// cache for 1 hour
const headers: RequestHeaders = {
  "Cache-Control": `public, s-maxage=${60 * 60}`,
};

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
    const value = await this.fetchFromCache<EmojisItem>(key);
    if (value) return value;

    const { data } = await this.#octokit.request(endpoints[1], { headers });
    this.#emojis = data;
    this.storeInCache<EmojisItem>(key, data);
  }

  async fetchFromCache<T extends StorageItem<Endpoint>>(key: string) {
    const value = await this.#storage.getItem<T>(key);
    if (value) {
      console.log("🪐 successfully fetched from cache: ", key);
    }
    return value;
  }

  async storeInCache<T extends StorageItem<Endpoint>>(key: string, value: T) {
    this.#storage.setItem<T>(key, value);
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
    const opts: OctoOptions = {
      username,
      sort,
      per_page: 6,
      headers,
    };

    if (process.env.NODE_ENV === "development") {
      const key = [username, sort].join(":");

      // fetch from storage
      const value = await this.fetchFromCache<ReposItem>(key);
      if (value) return value;

      // fetch from octokit
      const response = await this.#octokit.request(endpoints[0], opts);
      this.storeInCache<ReposItem>(key, response);
      return response;
    }

    return this.#octokit.request(endpoints[0], opts);
  }
}

const singleton = Object.freeze(new Api());
export default singleton;
