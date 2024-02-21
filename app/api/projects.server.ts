import Api from "~/api/singleton.server";
import { parseEmojis } from "~/utils/projects";

export async function getRepos() {
  const response = await Api.octokit.request("GET /users/{username}/repos", {
    username: "blakenetz",
    sort: "updated",
    per_page: 5,
  });

  if (response.status !== 200) {
    return { ...response, data: [] };
  }

  return {
    ...response,
    data: response.data.map((data) => ({
      name: parseEmojis(data.name),
      description: parseEmojis(data.description),
      html_url: data.html_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      language: data.language,
      fork: data.fork,
    })),
  };
}
