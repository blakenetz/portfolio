import { Octokit } from "octokit";

type Emojis = { [key: string]: string };

class Api {
  #emojis: Emojis | null;
  #octokit: Octokit;

  constructor() {
    const octokit = new Octokit({
      auth: process.env.GITHUB_AUTH_TOKEN,
    });

    this.#emojis = null;
    this.#octokit = octokit;

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
}

const singleton = Object.freeze(new Api());
export default singleton;
