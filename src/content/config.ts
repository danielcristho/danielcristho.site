import { defineCollection, z, type SchemaContext } from "astro:content";
import { docsAndBlogSchema } from "starlight-blog/schema";

const extendedDocsAndBlogSchema = (context: SchemaContext) =>
	docsAndBlogSchema(context).extend({
		excerpt: z.string().optional(),
		type: z.string().optional(),
	});

export const collections = {
	docs: defineCollection({ schema: extendedDocsAndBlogSchema }),
};
