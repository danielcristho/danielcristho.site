import { defineConfig } from "astro/config";
import starlightBlog from "starlight-blog";
import starlight from "@astrojs/starlight";
import partytown from "@astrojs/partytown";
import compress from "astro-compress";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { BLOG_URL } from "./src/contants";

export default defineConfig({
    site: BLOG_URL,
    integrations: [
    tailwind(),

    starlightBlog({
        authors: {
            danielcristho: {
            name: "Daniel Pepuho",
            url: "https://github.com/danielcristho",
            },
        },
        metrics: {
            readingTime: true,
            words: "total",
        },
    }),

    starlight({
        favicon: "/favicon.svg",
        lastUpdated: true,
        title: "danielcristho.",
        editLink: {
            baseUrl:
            "https://github.com/danielcristho/danielcristho.site/edit/main",
        },
        customCss: [
            "./src/styles/custom.css",
            "./src/styles/gruvbox.css",
        ],
        components: {
            Sidebar: "starlight-blog/overrides/Sidebar.astro",
            TableOfContents: "./src/components/TableOfContents.astro",
            Header: "./src/components/Header.astro",
            Head: "./src/components/Head.astro",
            Footer: "./src/components/Footer.astro",
            SocialIcons: "./src/components/SocialIcons.astro",
            ThemeSelect: "./src/components/starlight/ThemeSelect.astro",
            // MarkdownContent: "./src/components/starlight//MarkdownContent.astro",
        },
        social: {
            linkedin: "https://www.linkedin.com/in/daniel-pepuho",
            github: "https://github.com/danielcristho",
            "x.com": "https://twitter.com/chrstdan",
            rss: `${BLOG_URL}/rss.xml`,
        },
        }),

    compress(),
    robotsTxt(),
    sitemap(),
    partytown({
        config: {
        forward: ["dataLayer.push"],
            },
        }),
    ],
});
