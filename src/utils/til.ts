import { getCollection } from "astro:content";

const labels: Record<string, string> = {
  iac: "IaC",
  "aws-solution-architect": "AWS Solutions Architect",
  cicd: "CI/CD",
};

export function tilTopic(id: string): string | undefined {
  const [, dir, ...rest] = id.split("/");
  if (!dir || rest.length === 0) return undefined;
  return (
    labels[dir] ??
    dir.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export const topicSlug = (label: string) =>
  label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

/** Every TIL note that carries a trivia card. */
export async function tilCards() {
  const notes = await getCollection(
    "docs",
    ({ id, data }) => id.startsWith("til/") && !!data.trivia && !data.draft
  );
  return notes.flatMap((note) =>
    [note.data.trivia!].flat().map((card) => ({
      ...card,
      topic: tilTopic(note.id) ?? "Misc",
      title: note.data.title,
      url: `/${note.id}`,
    }))
  );
}

export const triviaHtml = (s: string) =>
  s
    .replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!)
    .replace(/`([^`]+)`/g, "<code>$1</code>");
