import rss from '@astrojs/rss';

export function GET(context) {
  const posts = Object.values(postImportResult);
  return rss({
    title: 'Daniel Pepuho’s Blog',
    description: 'Personal Blog',
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => ({
      link: post.url,
      ...post.frontmatter,
    })),
  });
}