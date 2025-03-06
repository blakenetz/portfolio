import { LRUCache } from "lru-cache";
import path from "node:path";
import { createStorage, type Storage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

const isDev = process.env.NODE_ENV === "development";

export default class Cache<Key extends string, Item extends object> {
  /**
   * 2 caches for 2 reasons:
   *
   * 1. This is an exploratory project, so wanted to analyze different caching solutions
   * 2. Unstorage was easier to inspect in dev enviros since all items are stored in the `.cache` dir
   */
  #cache: LRUCache<Key, Item>;
  #devStorage: Storage<Item>;

  constructor() {
    this.#cache = new LRUCache({ ttl: 1000 * 60 * 60, max: 100 });
    this.#devStorage = createStorage({
      driver: fsDriver({ base: path.resolve(".", ".cache") }),
    });
  }

  async fetchFromCache<T extends Item>(key: Key): Promise<T | null> {
    const value = isDev
      ? await this.#devStorage.getItem<T>(key)
      : (this.#cache.get(key) as T);

    if (value) {
      console.log(
        `🛰️ Successfully fetched from ${isDev ? "dev " : ""}cache: `,
        key,
      );
    }

    return value;
  }

  storeInCache<T extends Item>(key: Key, value: T) {
    return isDev
      ? this.#devStorage.setItem<T>(key, value)
      : this.#cache.set(key, value);
  }
}
