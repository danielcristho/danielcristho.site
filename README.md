# DANIELCRISTHO.SITE

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

```sh
pnpm create astro@latest -- --template danielcristho/danielcristho.site
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdanielcristho%2Fdanielcristho.site)

## ✨ Features

- Starlight-based website
- Giscus-powered comments
- Custom Gruvbox theme for dark mode
- Supports `.md` and `.mdx` content
- Shareable post

## This Project Built Using

- Astro v4
- Astro Starlight v0.13.0
- Starlight blog v0.4.0
- Starlight-Giscus v0.8.1
- Tailwind CSS

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```sh
.
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   ├── docs/        # Blog posts live here
│   │   └── config.ts 
│   ├── styles/
│   ├
│   └── env.d.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json

```

## Notes

- Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

- Images can be added to `src/assets/` and embedded in Markdown with a relative link.

- Static assets, like favicons, can be placed in the `public/` directory.

- Use `pnpm` as package manager.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

## 📄 License

MIT
Copyright (c) 2024-present

```sh
╭──🎁─╮  Houston:
│ ◠ ◡ ◠  Good luck out there, astronaut! 🚀
╰─────╯
```