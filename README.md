# DANIELCRISTHO.SITE

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

My personal website and blog where I write about DevOps, Kubernetes, and infrastructure stuff. Built with Astro and Starlight.

```sh
pnpm create astro@latest -- --template danielcristho/danielcristho.site
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdanielcristho%2Fdanielcristho.site)

## What's included

- Blog with MDX support
- Comments via Giscus
- Analytics with Umami
- Share buttons for posts
- Basic SEO stuff

## Built with

- Astro v4 + Starlight
- Starlight Blog v0.4.0
- Tailwind CSS
- Supabase + Prisma
- Umami Analytics
- Giscus Comments

## Analytics API

| Endpoint                | Method | What it does                         |
| :---------------------- | :----- | :----------------------------------- |
| `/api/visitors`         | GET    | Current visitors count               |
| `/api/pageviews/[slug]` | GET    | Page views for a post                |
| `/api/reads/[slug]`     | GET    | Read completions for a post          |
| `/api/reads/[slug]`     | POST   | Track when someone finishes reading  |

## Project structure

```sh
.
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   ├── FloatingImages.astro    # Image animations
│   │   ├── Footer.astro            # Site footer
│   │   ├── Giscus.astro            # Comment system
│   │   ├── Head.astro              # HTML head with analytics
│   │   ├── Header.astro            # Site header
│   │   ├── PageViews.astro         # Page view counter
│   │   ├── PublicStats.astro       # Public analytics dashboard
│   │   ├── RealtimeVisitors.astro  # Live visitor count (optional component)
│   │   ├── ShareButtons.astro      # Social share buttons
│   │   ├── SocialIcons.astro       # Social media icons
│   │   ├── TableOfContents.astro   # TOC component
│   │   ├── TotalReads.astro        # Read completion tracker
│   │   └── starlight/              # Starlight overrides
│   │       ├── ContentPanel.astro      # Main content wrapper
│   │       ├── MarkdownContent.astro   # Content with social features
│   │       ├── PageTitle.astro         # Title with analytics
│   │       ├── Sidebar.astro           # Custom sidebar
│   │       └── ThemeSelect.astro       # Dark mode toggle
│   ├── content/
│   │   └── docs/blog/      # Blog posts (.mdx)
│   ├── pages/
│   │   └── api/            # API endpoints
│   │       ├── debug.ts            # Debug endpoint (dev only)
│   │       ├── visitors.ts         # Current visitors
│   │       ├── pageviews/[slug].ts # Page views per post
│   │       └── reads/[slug].ts     # Read tracking
│   ├── styles/             # CSS files
│   │   ├── custom.css      # Custom styles
│   │   └── gruvbox.css     # Dark theme
│   └── utils/              # Helper functions
│       └── umami-auth.ts   # Umami API authentication
├── astro.config.mjs        # Astro configuration
└── package.json
```

## Commands

| Command                 | Action                                      |
| :---------------------- | :------------------------------------------ |
| `pnpm install`          | Install dependencies                        |
| `pnpm run dev`          | Start dev server at `localhost:4321`        |
| `pnpm run build`        | Build for production                        |
| `pnpm run preview`      | Preview production build                    |
| `pnpm run astro ...`    | Run Astro CLI commands                      |

## Setup

### Quick start

1. Clone this repo
2. Copy `.env.example` to `.env`
3. Run `pnpm install`
4. Start with `pnpm run dev`

### Analytics setup (optional)

If you want the analytics features, you'll need to set up Umami:

1. Fork the [Umami repo](https://github.com/umami-software/umami)
2. Create a Supabase project (Choose the best region)
3. Deploy your forked Umami to Vercel with these env vars:
   - `DATABASE_URL` - Use the **Connection Pooling** URL from Supabase (not direct connection)
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
```

**Important**: Use Supabase's Connection Pooling URL (port 6543), not the direct connection. This prevents deployment errors.

### Deployment

Deploy to Vercel or any static host. The analytics only work in production builds, not during development.

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

**Vercel deployment fails**: Check that you're using Supabase's Connection Pooling URL, not the direct connection URL.

## License

MIT Copyright (c) 2024-present

```sh
╭──🎁─╮  Houston:
│ ◠ ◡ ◠  Good luck out there, astronaut! 🚀
╰─────╯
```
