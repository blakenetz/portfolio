import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  sortGithubProjects: defineAction({
    input: z.object({ direction: z.string() }),
    handler: async ({ direction }) => {
      console.log("inside handler", direction);
      return direction;
    },
  }),
};
