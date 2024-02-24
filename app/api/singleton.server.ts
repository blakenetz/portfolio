import { LRUCache } from "lru-cache";
import { Octokit } from "octokit";

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

type CacheItem<E = Endpoint> = E extends "GET /users/{username}/repos"
  ? OctoResponse
  : E extends "GET /emojis"
  ? EmojiData
  : never;

const endpoints = ["GET /users/{username}/repos", "GET /emojis"] as const;
type Endpoint = (typeof endpoints)[number];

type ReposItem = CacheItem<(typeof endpoints)[0]>;
type EmojisItem = CacheItem<(typeof endpoints)[1]>;

const keys = [
  "emojis",
  "blakenetz:created",
  "blakenetz:updated",
  "blake-kc:created",
  "blake-kc:updated",
  "blake-spire:created",
  "blake-spire:updated",
  "blake-discover:created",
  "blake-discover:updated",
] as const;
type Key = (typeof keys)[number];

class Api {
  #emojis: EmojiData | null;
  #octokit: Octokit;
  #usernames: { personal: UserName<"personal">; work: UserName<"work"> };
  #cache: LRUCache<Key, CacheItem>;

  constructor() {
    // create API drivers/storage
    this.#octokit = new Octokit({
      auth: process.env.GITHUB_AUTH_TOKEN,
    });
    this.#cache = new LRUCache({ ttl: 1000 * 60 * 60, max: 100 });

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
    const value = this.fetchFromCache<EmojisItem>(key);
    if (value) return value;

    const { data } = await this.#octokit.request(endpoints[1]);
    this.#emojis = data;
    this.storeInCache<EmojisItem>(key, data);
  }

  fetchFromCache<T extends CacheItem>(key: Key): T {
    const value = this.#cache.get(key) as T;
    if (value) {
      console.log("🪐 successfully fetched from cache: ", key);
    }
    return value;
  }

  storeInCache<T extends CacheItem>(key: Key, value: T) {
    return this.#cache.set(key, value);
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
    };

    const key = [username, sort].join(":") as Key;

    // fetch from storage
    const value = this.fetchFromCache<ReposItem>(key);
    if (value) return value;

    // fetch from octokit
    const response = await this.#octokit.request(endpoints[0], opts);
    this.storeInCache<ReposItem>(key, response);
    return response;
  }
}

const singleton = Object.freeze(new Api());
export default singleton;
