import { h } from "hastscript";
import { visit } from "unist-util-visit";

const specialCases = [
  {
    href: "https://stackblitz.com/**",
    icon: "https://avatars.githubusercontent.com/u/28635252?v=4",
  },
  {
    href: "https://starlight.astro.build",
    icon: "/starlight.png",
  },
];

// Helpers
const normalize = (url: string) => {
  try {
    const u = new URL(url);
    return u.origin + u.pathname.replace(/\/+$/, "");
  } catch {
    return url.replace(/\/+$/, "");
  }
};

const toRegex = (pattern: string) => {
  pattern = pattern.replace(/\*\*/g, "<<<GLOBSTAR>>>");
  pattern = pattern.replace(/\*/g, "<<<STAR>>>");
  pattern = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
  pattern = pattern
    .replace(/<<<GLOBSTAR>>>/g, ".*")
    .replace(/<<<STAR>>>/g, "[^/]+");
  return new RegExp("^" + pattern + "$");
};

const normalizedCases = specialCases.map((s) => ({
  ...s,
  regex: toRegex(normalize(s.href)),
}));

const getNodeText = (node: any): string => {
  if (!node.children) return "";
  return node.children
    .filter((c: any) => c.type === "text")
    .map((c: any) => c.value)
    .join("")
    .trim();
};

export default function rehypeGitHubBadgeLinks() {
  return (tree: any, file: any) => {
    const frontmatter = file.data?.astro?.frontmatter ?? {};
    if (frontmatter.badgeLinks === false) return;

    visit(tree, "element", (node) => {
      if (node.tagName !== "a" || typeof node.properties?.href !== "string") {
        return;
      }

      const href = node.properties.href;
      const normalizedHref = normalize(href);
      const text = normalize(getNodeText(node));
      const special = normalizedCases.find((s) => s.regex.test(normalizedHref));

      if (special) {
        node.properties.className = (node.properties.className || []).concat(
          "gh-badge"
        );

        const iconImg = h("img", {
          src: special.icon,
          alt: "icon",
        });

        node.children.unshift(iconImg);
        return;
      }

      const ghMatch = href.match(
        /^https:\/\/github\.com\/([^/]+)(?:\/([^/]+))?\/?$/
      );

      if (!ghMatch) return;

      const org = ghMatch[1];
      const repo = ghMatch[2] || null;

      if (text.toLowerCase() === "github") {
        node.properties.className = (node.properties.className || []).concat(
          "gh-badge"
        );

        node.children.unshift(
          h("img", {
            src: "https://avatars.githubusercontent.com/u/9919?v=4",
            alt: "GitHub",
          })
        );
        return;
      }

      if (repo && text === normalize(repo)) {
        node.properties.className = (node.properties.className || []).concat(
          "gh-badge"
        );

        node.children.unshift(
          h("img", {
            src: `https://github.com/${org}.png`,
            alt: org,
          })
        );
        return;
      }

      node.properties.className = (node.properties.className || []).concat(
        "gh-badge"
      );

      node.children.unshift(
        h("img", {
          src: `https://github.com/${org}.png`,
          alt: org,
        })
      );

      return;
    });
  };
}
