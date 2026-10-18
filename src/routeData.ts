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

  // Directory of your public assets
  const publicDir = path.join(process.cwd(), "public");

  // Possible image extensions
  const extensions = [".png", ".jpg", ".webp"];

  // Find the first matching image file
  const foundExt = extensions.find((ext) =>
    fs.existsSync(path.join(publicDir, `${routeId}${ext}`))
  );

  // Build the final URL
  const ogImageUrl = new URL(
    `/${routeId}${foundExt ?? ".jpg"}`, // default fallback
    context.site
  );

  const { head, entry } = context.locals.starlightRoute;

  // TIL pages: reading column everywhere, paper stock on the notes only
  const tilId = context.locals.starlightRoute.id;
  if (tilId.startsWith("til")) {
    head.push({ tag: "style", content: tilCss });
  }
  if (tilId.startsWith("til/")) {
    head.push({ tag: "style", content: tilNoteCss });

    // Starlight's own pagination is off site-wide and TIL notes never enter the
    // sidebar, so hand it the same date order the /til list reads in. Prev is
    // the note above in that list, next the one below.
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
    // Starlight does not export the link type, so borrow it from the route
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

  // Only emit og:image/twitter:image if a matching image file is found
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
