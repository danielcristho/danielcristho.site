import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { blogSchema } from "starlight-blog/schema";

const triviaCard = z.object({ q: z.string(), a: z.string() });

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: (context) =>
        blogSchema(context).extend({
          trivia: triviaCard.or(z.array(triviaCard)).nullish(),
        }),
    }),
  }),
};
