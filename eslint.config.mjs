import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/",
      ".astro/",
      ".vercel/",
      "node_modules/",
      "src/env.d.ts",
      "src/pages/test-analytics.astro",
    ],
  },
  // Node.js files (api/ directory and config files)
  {
    files: ["api/**/*.js", "*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
        fetch: "readonly",
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
  // TypeScript source files
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.es2022,
        fetch: "readonly",
        Response: "readonly",
        Request: "readonly",
        RequestInit: "readonly",
        console: "readonly",
        URL: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  // Astro files
  {
    files: ["src/**/*.astro"],
    ...astroPlugin.configs.recommended[0],
    languageOptions: {
      ...astroPlugin.configs.recommended[0]?.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
];
