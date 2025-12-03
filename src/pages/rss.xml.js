import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET({ site }) {
  // Ambil semua konten di collection "docs"
  const allDocs = await getCollection("docs");

  const posts = allDocs.filter((entry) =>
    entry.id.startsWith("blog/")
  );

  // Sort by newest first
  posts.sort((a, b) => {
    const da = new Date(a.data.date);
    const db = new Date(b.data.date);
    return db - da;
  });

  return rss({
    title: "danielcristho.",
    description: "Articles & writings by Daniel Pepuho.",
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? post.data.excerpt ?? "",
      pubDate: new Date(post.data.date),
      link: `/docs/blog/${post.slug}/`,
    })),
  });
}
