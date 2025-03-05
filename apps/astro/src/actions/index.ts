import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  sortGithubProjects: defineAction({
    input: z.object({
      sort: z.enum(["asc", "desc"]),
    }),
    handler: async ({ sort }) => sort,
  }),
};
