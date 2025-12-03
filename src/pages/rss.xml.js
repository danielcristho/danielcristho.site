import rss from "@astrojs/rss";

/**
 * Loads all blog posts under:
 *   src/content/docs/blog/
 */
const modules = import.meta.glob('../../content/docs/blog/**/*.{md,mdx}', { eager: true });

function normalizePost(filePath, mod) {
  const fm = mod.frontmatter ?? mod;
  
  // Extract slug from filename if no slug provided
  const filename = filePath.split('/').pop();
  const rawSlug = filename.replace(/\.(md|mdx)$/, '');
  const slug = fm.slug ?? rawSlug;

  return {
    slug,
    title: fm.title ?? rawSlug,
    description: fm.description ?? fm.excerpt ?? "",
    pubDate: fm.pubDate ? new Date(fm.pubDate) : null,
  };
}

export async function GET({ site, request }) {
  const siteUrl = site ?? new URL(request.url).origin;

  const posts = Object.entries(modules).map(([path, mod]) =>
    normalizePost(path, mod)
  );

  // Sort from newest tO oldest
  posts.sort((a, b) => {
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return b.pubDate - a.pubDate;
  });

  return rss({
    title: "danielcristho.",
    description: "Articles & writings by Daniel Pepuho.",
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      link: `/docs/blog/${post.slug}/`,
      pubDate: post.pubDate ?? undefined,
    })),
  });
}