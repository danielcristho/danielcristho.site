import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightBlog from "starlight-blog";
import starlightCoolerCredit from "starlight-cooler-credit";
import starlightGiscus from "starlight-giscus";
import starlightImageZoom from "starlight-image-zoom";
import starlightLinksValidator from "starlight-links-validator";
import starlightThemeRapide from "starlight-theme-rapide";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import { visit } from "unist-util-visit";
import { BLOG_URL, X_URL, GITHUB_URL, LINKEDIN_URL } from "./src/contants";

import rehypeAutolinkHeadings from "./src/plugins/rehype/autolink-headings";
import rehypeGitHubBadgeLinks from "./src/plugins/rehype/github-badge-links";
import remarkReplaceArrows from "./src/plugins/remark/replace-arrows";
import expressiveCodeConfig from "./ec.config.mjs";

// Auto-optimize Cloudinary images in markdown
const rehypeCloudinaryOptimize = () => (tree) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "img" && node.properties?.src) {
      const src = node.properties.src;
      if (src.includes("res.cloudinary.com") && !src.includes("/upload/f_")) {
        node.properties.src = src.replace("/upload/", "/upload/f_auto,q_auto/");
      }
      node.properties.loading = "lazy";
      node.properties.decoding = "async";
    }
  });
};

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: BLOG_URL,
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  integrations: [
    starlight({
      title: "dc.",
      favicon: "/favicon.svg",
      lastUpdated: true,
      editLink: {
        baseUrl:
          "https://github.com/danielcristho/danielcristho.site/edit/main",
      },
      social: [
        { icon: "linkedin", label: "LinkedIn", href: `${LINKEDIN_URL}` },
        { icon: "github", label: "GitHub", href: `${GITHUB_URL}` },
        { icon: "x.com", label: "X", href: `${X_URL}` },
        { icon: "rss", label: "RSS", href: `${BLOG_URL}/rss.xml` },
      ],
      routeMiddleware: "./src/routeData.ts",
      expressiveCode: expressiveCodeConfig,
      plugins: [
        starlightLinksValidator({
          exclude: ["/blog", "/blog/tags/*", "/blog/authors/*"],
          errorOnRelativeLinks: false,
          errorOnInvalidHashes: false,
        }),
        starlightImageZoom(),
        starlightGiscus({
          repo: "danielcristho/danielcristho.site",
          repoId: "R_kgDOMo7Jhw",
          category: "General",
          categoryId: "DIC_kwDOMo7Jh84Cj76O",
          lazy: true,
        }),
        starlightBlog({
          pathname: "/blog",
          rss: true,
          authors: {
            danielcristho: {
              name: "Daniel Pepuho",
              url: "https://www.linkedin.com/in/daniel-pepuho",
              title: "IT Infra. Lost in the Cloud(s)",
              picture: "https://avatars.githubusercontent.com/u/69733783?s=200",
            },
          },
          metrics: {
            readingTime: true,
            words: "total",
          },
          recentPostCount: 10,
          postCount: 5,
        }),
        starlightCoolerCredit({
          credit: {
            title: "Credits",
            description: "View all credits of this blog →",
            href: `${BLOG_URL}/credits`,
          },
        }),
        starlightThemeRapide(),
      ],
      components: {
        TableOfContents: "./src/components/TableOfContents.astro",
        Header: "./src/components/Header.astro",
        Head: "./src/components/Head.astro",
        Footer: "./src/components/Footer.astro",
        SocialIcons: "./src/components/SocialIcons.astro",
        ContentPanel: "./src/components/starlight/ContentPanel.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        MarkdownContent: "./src/components/starlight/MarkdownContent.astro",
      },
      customCss: ["./src/styles/index.css"],
      markdown: {
        headingLinks: false,
      },
      pagination: false,
    }),
    tailwind({ applyBaseStyles: false }),
    compress(),
  ],
  markdown: {
    remarkPlugins: [remarkReplaceArrows],
    rehypePlugins: [
      rehypeHeadingIds,
      rehypeAutolinkHeadings,
      rehypeGitHubBadgeLinks,
      rehypeCloudinaryOptimize,
    ],
  },
  vite: {
    define: {
      "process.env.PUBLIC_UMAMI_URL": JSON.stringify(
        process.env.PUBLIC_UMAMI_URL
      ),
      "process.env.PUBLIC_UMAMI_WEBSITE_ID": JSON.stringify(
        process.env.PUBLIC_UMAMI_WEBSITE_ID
      ),
      "process.env.UMAMI_USERNAME": JSON.stringify(process.env.UMAMI_USERNAME),
      "process.env.UMAMI_PASSWORD": JSON.stringify(process.env.UMAMI_PASSWORD),
    },
  },
});
