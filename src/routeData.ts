import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { getCollection } from "astro:content";
import fs from "fs";
import path from "path";
import tilCss from "./styles/til-page.css?raw";
import tilNoteCss from "./styles/til-note.css?raw";

export const onRequest = defineRouteMiddleware(async (context) => {
  const routeId = ["blog", ""].includes(context.locals.starlightRoute.id)
    ? "blog/deep-thoughts"
    : context.locals.starlightRoute.id;
  const publicDir = path.join(process.cwd(), "public");
  const extensions = [".png", ".jpg", ".webp"];
  const foundExt = extensions.find((ext) =>
    fs.existsSync(path.join(publicDir, `${routeId}${ext}`))
  );
  // Build the final URL
  const ogImageUrl = new URL(`/${routeId}${foundExt ?? ".jpg"}`, context.site);

  const { head, entry } = context.locals.starlightRoute;

  const tilId = context.locals.starlightRoute.id;
  if (tilId.startsWith("til")) {
    head.push({ tag: "style", content: tilCss });
  }
  if (tilId.startsWith("til/")) {
    head.push({ tag: "style", content: tilNoteCss });

    const notes = (
      await getCollection(
        "docs",
        ({ id, data }) => id.startsWith("til/") && id !== "til" && !data.draft
      )
    ).sort(
      (a, b) =>
        new Date(b.data.date ?? 0).getTime() -
        new Date(a.data.date ?? 0).getTime()
    );
    type PageLink = NonNullable<
      typeof context.locals.starlightRoute.pagination.prev
    >;
    const at = (i: number): PageLink | undefined => {
      const note = notes[i];
      return note
        ? {
            type: "link",
            label: note.data.title,
            href: `/${note.id}`,
            isCurrent: false,
            badge: undefined,
            attrs: {},
          }
        : undefined;
    };
    const here = notes.findIndex((note) => note.id === tilId);
    context.locals.starlightRoute.pagination = {
      prev: at(here - 1),
      next: at(here + 1),
    };
  }

  // Common meta tags
  const metaTags = [
    { property: "twitter:domain", content: context.site?.hostname },
    {
      property: "twitter:url",
      content: `${context.site?.href}${entry.id}`,
    },
    { name: "twitter:title", content: entry.data.title },
    { name: "twitter:description", content: entry.data.description },
  ];

  if (foundExt) {
    metaTags.push(
      { property: "og:image", content: ogImageUrl.href },
      { name: "twitter:image", content: ogImageUrl.href }
    );
  }

  metaTags.forEach((meta) => {
    head.push({ tag: "meta", attrs: meta });
  });
});
