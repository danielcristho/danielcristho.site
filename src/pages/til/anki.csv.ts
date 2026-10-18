import type { APIRoute } from "astro";
import { tilCards, topicSlug, triviaHtml } from "../../utils/til";

/* ponytail: quote every field instead of working out which ones need it —
   commas, quotes and newlines in the prose are then all covered by one rule. */
const cell = (s: string) => `"${s.replace(/"/g, '""')}"`;

export const GET: APIRoute = async ({ site }) => {
  const cards = await tilCards();

  const rows = cards.map((card) =>
    [
      triviaHtml(card.q),
      `${triviaHtml(card.a)}<br><br>from <a href="${new URL(card.url, site)}">${card.title}</a>`,
      topicSlug(card.topic),
    ]
      .map(cell)
      .join(",")
  );

  // Anki reads these directives on import: target deck, field separator, and
  // which column holds tags. Needs Anki 2.1.55+.
  const head = [
    "#separator:Comma",
    "#html:true",
    "#deck:TIL",
    "#columns:Front,Back,Tags",
    "#tags column:3",
  ];

  return new Response([...head, ...rows].join("\n") + "\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
};
