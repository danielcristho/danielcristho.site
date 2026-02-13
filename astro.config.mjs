import { defineConfig } from "astro/config";
import starlightBlog from "starlight-blog";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { BLOG_URL, X_URL, GITHUB_URL, LINKEDIN_URL } from "./src/contants";

export default defineConfig({
    site: BLOG_URL,
    integrations: [
    tailwind(),

    starlight({
        favicon: "/favicon.svg",
        lastUpdated: true,
        title: "dc.",
        editLink: {
            baseUrl:
            "https://github.com/danielcristho/danielcristho.site/edit/main",
        },
        customCss: [
            "./src/styles/custom.css",
            "./src/styles/hero-title.css",
        ],
        plugins: [
            starlightBlog({
                pathname: '/blog',
                rss: true,
                authors: {
                    danielcristho: {
                        name: "Daniel Pepuho",
                        url: "https://www.linkedin.com/in/daniel-pepuho",
                        title: 'IT Infra. Lost in the Cloud(s)',
                        picture: 'https://avatars.githubusercontent.com/u/69733783?s=200',
                    },
                },
                metrics: {
                    readingTime: true,
                    words: "total",
                },
                recentPostCount: 15,
                postCount: 10,
            }),
        ],
        components: {
            TableOfContents: "./src/components/TableOfContents.astro",
            Header: "./src/components/Header.astro",
            Head: "./src/components/Head.astro",
            Footer: "./src/components/Footer.astro",
            SocialIcons: "./src/components/SocialIcons.astro",
            ContentPanel: "./src/components/starlight/ContentPanel.astro",
            PageTitle: "./src/components/starlight/PageTitle.astro",
        },
        social: [
            { icon: 'linkedin', label: 'LinkedIn', href: `${LINKEDIN_URL}` },
            { icon: 'github', label: 'GitHub', href: `${GITHUB_URL}` },
            { icon: 'x.com', label: 'X', href: `${X_URL}` },
            { icon: 'rss', label: 'RSS', href: `${BLOG_URL}/rss.xml` },
        ],
    }),
    ],
    vite: {
        define: {
            'process.env.PUBLIC_UMAMI_URL': JSON.stringify(process.env.PUBLIC_UMAMI_URL),
            'process.env.PUBLIC_UMAMI_WEBSITE_ID': JSON.stringify(process.env.PUBLIC_UMAMI_WEBSITE_ID),
            'process.env.UMAMI_USERNAME': JSON.stringify(process.env.UMAMI_USERNAME),
            'process.env.UMAMI_PASSWORD': JSON.stringify(process.env.UMAMI_PASSWORD),
        }
    }
});