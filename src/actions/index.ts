import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getRepoByScope } from "~/lib/projects.server";
import type { Sort, UserScope } from "~/types/projects";

export const server = {
  sortGithubProjects: defineAction({
    input: z.object({
      sort: z.string().optional().default("created"),
      name: z.string().optional(),
    }),
    handler: async ({ sort, name }) => {
      const { data } = await getRepoByScope(name as UserScope, sort as Sort);

      return data;
    },
  }),
};
