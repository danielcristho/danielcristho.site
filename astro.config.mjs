import { defineConfig } from "astro/config";
import starlightBlog from "starlight-blog";
import starlight from "@astrojs/starlight";
import partytown from "@astrojs/partytown";
import compress from "astro-compress";
import robotsTxt from "astro-robots-txt";
import { BLOG_URL } from "./src/contants";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
    site: BLOG_URL,
    integrations: [
        starlightBlog({
            authors: {
                danielcristho: {
                    name: "Daniel Pepuho",
                    title: "",
                    url: "https://danielcristho.site",
                },
            },
        }),
        starlight({
            lastUpdated: true,
            title: "danielcristho.",
            editLink: {
                baseUrl:
                    "https://github.com/danielcristho/astrdocs/edit/main",
            },
            customCss: ["./src/styles/custom.css"],
            components: {
                MarkdownContent: "starlight-blog/overrides/MarkdownContent.astro",
                Sidebar: "starlight-blog/overrides/Sidebar.astro",
                ThemeSelect: "starlight-blog/overrides/ThemeSelect.astro",
                TableOfContents: "./src/components/TableOfContents.astro",
                Header: "./src/components/Header.astro",
                Head: "./src/components/Head.astro",
            },
            social: {
                linkedin: "https://www.linkedin.com/in/daniel-pepuho/",
                github: "https://github.com/danielcristho",
                "x.com": "https://twitter.com/chrstdan"
            },
            head: [
                {
                    tag: "script",
                    attrs: {
                        src: "https://www.googletagmanager.com/gtag/js?id=G-EWP344X6RY",
                        type: "text/partytown",
                        async: true,
                    },
                },
                {
                    tag: "script",
                    type: "text/partytown",
                    content: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-EWP344X6RY');
					`,
                },
            ],
        }),
        compress(),
        robotsTxt(),
        partytown({
            config: {
                forward: ["dataLayer.push"],
            },
        }),
        tailwind(),
    ],
});