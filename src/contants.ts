export const BLOG_TITLE = "";
export const BLOG_DESCRIPTION = "";
export const BLOG_URL = "https://danielcristho.site";

// Analytics Configuration
export const ANALYTICS = {
  UMAMI_URL: import.meta.env.PUBLIC_UMAMI_URL,
  WEBSITE_ID: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID,
  ENABLED: import.meta.env.PROD && import.meta.env.PUBLIC_UMAMI_WEBSITE_ID,
} as const;