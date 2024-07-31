import { Octokit } from "octokit";

import Cache from "./cache.server";
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

class ProjectsApi {
  #emojis: EmojiData | null;
  #octokit: Octokit;
  #usernames: { personal: UserName<"personal">; work: UserName<"work"> };
  #cache: Cache<Key, CacheItem<Endpoint>>;

  constructor() {
    // create API drivers/storage
    this.#octokit = new Octokit({
      auth: process.env.GITHUB_AUTH_TOKEN,
    });
    this.#cache = new Cache<Key, CacheItem<Endpoint>>();

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
    const value = await this.#cache.fetchFromCache<EmojisItem>(key);
    if (value) return value;

    const { data } = await this.#octokit.request(endpoints[1]);
    this.#emojis = data;
    this.#cache.storeInCache<EmojisItem>(key, data);
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

  async request(username: string, sort: Sort): Promise<OctoResponse> {
    const opts: OctoOptions = {
      username,
      sort,
      per_page: 6,
    };

    const key = [username, sort].join(":") as Key;

    // fetch from storage
    const value = await this.#cache.fetchFromCache<ReposItem>(key);
    if (value) return value;

    // fetch from octokit
    const response = await this.#octokit.request(endpoints[0], opts);
    this.#cache.storeInCache<ReposItem>(key, response);
    return response;
  }
}

const singleton = Object.freeze(new ProjectsApi());
export default singleton;
