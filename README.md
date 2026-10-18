# DANIELCRISTHO.SITE

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

My personal website and blog where I write about DevOps, server-side, and infrastructure stuff. Built with Astro and Starlight.

```sh
pnpm create astro@latest -- --template danielcristho/danielcristho.site
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdanielcristho%2Fdanielcristho.site)

## What's included

- Blog with MDX support
- Comments via Giscus
- Analytics with Umami self hosted
- Share buttons for posts
- Basic SEO stuff

## Built with

- Astro v5 + Starlight
- Starlight Blog v0.25.2
- Tailwind CSS (not fully)
- Neon DB (PostgreSQL serverless) + Prisma
- Umami Analytics
- Giscus Comments

## Analytics API

| Endpoint                | Method | What it does                        |
| :---------------------- | :----- | :---------------------------------- |
| `/api/visitors`         | GET    | Current visitors count              |
| `/api/pageviews/[slug]` | GET    | Page views for a post               |
| `/api/reads/[slug]`     | GET    | Read completions for a post         |
| `/api/reads/[slug]`     | POST   | Track when someone finishes reading |

## Project structure

```sh
.
├── patches/                # pnpm patch for starlight-blog (lazy blog covers)
├── public/
│   ├── diagrams/           # Hand drawn SVG diagrams used in posts
│   ├── fonts/              # Self hosted woff2 subsets
│   └── logo/               # Clover mark, used as favicon and header logo
├── src/
│   ├── components/
│   │   ├── FloatingImages.astro    # Hero photos
│   │   ├── Footer.astro            # Footer, back to top, shooting stars
│   │   ├── Giscus.astro            # Comment system
│   │   ├── Head.astro              # HTML head, analytics, font preloads
│   │   ├── Header.astro            # Nav bar
│   │   ├── Logo.astro              # Inlines public/logo/favicon.svg, animates it
│   │   ├── PageViews.astro         # Page view counter
│   │   ├── ShareButtons.astro      # Social share buttons
│   │   ├── SocialIcons.astro       # Social media icons
│   │   ├── SubscribeLinks.astro    # Feed and newsletter links
│   │   ├── TableOfContents.astro   # TOC component
│   │   ├── TilGraph.astro          # Tag graph and constellation mode
│   │   ├── TilList.astro           # TIL note list
│   │   ├── TilTopics.astro         # TIL topic filter
│   │   ├── TilTrivia.astro         # TIL flip cards
│   │   └── starlight/              # Starlight overrides
│   │       ├── ContentPanel.astro      # Main content wrapper
│   │       ├── MarkdownContent.astro   # Content with social features
│   │       ├── PageTitle.astro         # Title with analytics
│   │       ├── Pagination.astro        # Prev and next links
│   │       └── Sidebar.astro           # Custom sidebar
│   ├── content/
│   │   └── docs/
│   │       ├── blog/       # Blog posts (.mdx)
│   │       └── til/        # TIL notes, one folder per topic
│   ├── pages/
│   │   ├── api/            # Analytics endpoints
│   │   │   ├── debug-umami.js      # Debug endpoint (dev only)
│   │   │   ├── pageviews/[slug].js # Page views per post
│   │   │   └── reads/[slug].js     # Read tracking
│   │   ├── rss.xml.js      # Feed
│   │   └── til/anki.csv.ts # Trivia export for Anki
│   ├── plugins/            # remark and rehype plugins
│   ├── styles/             # CSS, injected per route by routeData.ts
│   ├── utils/
│   │   ├── constellations.ts   # Star patterns and their names
│   │   ├── til.ts              # TIL topics and trivia helpers
│   │   └── umami-auth.ts       # Umami API authentication
│   ├── content.config.ts   # Content collections and frontmatter schema
│   └── routeData.ts        # Per route CSS and TIL pagination
├── astro.config.mjs        # Astro configuration
├── pnpm-workspace.yaml     # Holds patchedDependencies
└── package.json
```

## Commands

| Command              | Action                               |
| :------------------- | :----------------------------------- |
| `pnpm install`       | Install dependencies                 |
| `pnpm run dev`       | Start dev server at `localhost:4321` |
| `pnpm run build`     | Build for production                 |
| `pnpm run preview`   | Preview production build             |
| `pnpm run astro ...` | Run Astro CLI commands               |

## Setup

### Quick start

1. Clone this repo
2. Copy `.env.example` to `.env`
3. Run `pnpm install`
4. Start with `pnpm run dev`

### Analytics setup (self hosted)

If you want the analytics features, you'll need to set up Umami:

1. Fork the [Umami repo](https://github.com/umami-software/umami)

2. **Choose a database provider** (Neon recommended):

3. Deploy your forked Umami to Vercel with these env vars:
   - `DATABASE_URL` - Your database connection string (see examples below)
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Vercel app URL

4. Add your website in the Umami dashboard

5. Update your `.env` file:

```env
# Umami Analytics
PUBLIC_UMAMI_URL=https://your-umami.vercel.app
PUBLIC_UMAMI_WEBSITE_ID=your-website-id
UMAMI_USERNAME=admin
UMAMI_PASSWORD=your-umami-password

# Database Connection Examples:

# Neon DB
DATABASE_URL="postgresql://username:password@ep-xxx.<your best region>.<your provider>.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connection_limit=1"

or

# Supabase
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20&connect_timeout=60"
```

**Why Neon?** Better connection pooling and fewer deployment issues compared to Supabase.

### Deployment

Deploy to Vercel or any static host. The analytics only work in production builds, not during development.

**Note: There's another option for website analytics. If you don't want to host by yourself, you can use [Umami Cloud](https://umami.is/pricing)**

## Adding blog posts

Create `.mdx` files in `src/content/docs/blog/` with frontmatter:

```yaml
---
title: "Your post title"
date: 2024-01-01
excerpt: "Short description"
tags: ["kubernetes", "docker"]
authors: ["danielcristho"]
---
```

## Common issues

**Analytics not working**: Make sure you're testing on a production build, not the dev server. Analytics are disabled in development.

**Vercel deployment fails**:

- For Neon: Check connection string format and SSL parameters
- For Supabase: Use Connection Pooling URL (port 6543), not direct connection
- Try redeploying after updating DATABASE_URL

**Database connection errors**: Neon DB generally has fewer connection issues than Supabase for Vercel deployments.

## 🙏 Acknowledgments

- [Astro Starlight](https://starlight.astro.build) - The docs framework this site is built on, and the source of every component override here
- [Starlight Blog](https://starlight-blog-docs.vercel.app) - The plugin that turns Starlight into a blog, with the post list, tags, authors and feed
- [trueberryless](https://github.com/trueberryless/trueberryless.org) - Some of the layout, styles and components here come from their Starlight setup
- [antfu](https://antfu.me) - Some of the look and style here follow their site
- Astro Community - For the plugins I use.

## License

MIT Copyright (c) 2024-present

```sh
╭──🎁─╮  Houston:
│ ◠ ◡ ◠  Good luck out there, astronaut! 🚀
╰─────╯
```

See the analytics here: [Umami](https://umami-beige-one.vercel.app/share/J6EoRF5wjWHBFXBL)
