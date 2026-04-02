export const prerender = false;

let authToken = null;
let tokenExpiry = 0;

async function getUmamiAuthToken() {
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  const umamiApiUrl =
    process.env.PUBLIC_UMAMI_URL || import.meta.env.PUBLIC_UMAMI_URL;
  const username = process.env.UMAMI_USERNAME || import.meta.env.UMAMI_USERNAME;
  const password = process.env.UMAMI_PASSWORD || import.meta.env.UMAMI_PASSWORD;

  if (!umamiApiUrl || !username || !password) return null;

  const baseUrl = umamiApiUrl.replace(/\/(login)?$/, "");

  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.token) return null;

    authToken = data.token;
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
    return authToken;
  } catch (_error) {
    return null;
  }
}

export async function GET({ params, request }) {
  const { slug } = params;
  console.log(`PAGEVIEWS REQUEST for slug: ${slug}`);

  if (!slug) {
    return new Response(
      JSON.stringify({ pageviews: 0, error: "Missing slug" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const websiteId =
    process.env.PUBLIC_UMAMI_WEBSITE_ID ||
    import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
  const umamiApiUrl =
    process.env.PUBLIC_UMAMI_URL || import.meta.env.PUBLIC_UMAMI_URL;

  if (!websiteId || !umamiApiUrl) {
    console.error("Umami config missing in env");
    return new Response(
      JSON.stringify({ pageviews: 0, error: "Missing config" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const token = await getUmamiAuthToken();
  if (!token) {
    console.error("Umami auth failed");
    return new Response(
      JSON.stringify({ pageviews: 0, error: "Auth failed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Normalize baseUrl: remove any /api/login or /api/ if present at the end
  const baseUrl = umamiApiUrl.replace(/\/(api\/)?(login)?\/?$/, "");
  const startAt = 1000;
  const endAt = Date.now();
  let debugInfo = {};

  try {
    const normalizedSlug = (slug || "").replace(/^\/|\/$/g, "").toLowerCase();
    const targets = [`/blog/${normalizedSlug}`, `/${normalizedSlug}`];

    // Do parallel Fetch
    const [metricsRes, statsResults] = await Promise.all([
      fetch(
        `${baseUrl}/api/websites/${websiteId}/metrics?type=path&startAt=${startAt}&endAt=${endAt}&limit=5000`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((r) => (r.ok ? r.json() : [])),

      Promise.all(
        targets.map(async (u) => {
          const url = `${baseUrl}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&path=eq.${encodeURIComponent(u)}`;
          const r = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!r.ok) return 0;
          const d = await r.json();
          return typeof d.visitors === "number"
            ? d.visitors
            : d.visitors?.value || 0;
        })
      ),
    ]);

    let finalPageviews = 0;

    if (Array.isArray(metricsRes) && metricsRes.length > 0) {
      metricsRes.forEach((item) => {
        let path = (item.x || "").toLowerCase().trim().split(/[?#]/)[0];
        path = path.replace(/^https?:\/\/[^\/]+/, "");
        if (!path.startsWith("/")) path = "/" + path;
        path = path.replace(/\/$/, "") || "/";

        if (
          path === `/blog/${normalizedSlug}` ||
          path === `/${normalizedSlug}`
        ) {
          finalPageviews += item.y || 0;
        }
      });
    }

    if (finalPageviews === 0) {
      statsResults.forEach((v) => {
        finalPageviews += v;
      });
    }

    return new Response(
      JSON.stringify({
        pageviews: finalPageviews,
        slug,
        success: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error fetching views for ${slug}:`, error);
    return new Response(
      JSON.stringify({
        pageviews: 0,
        error: error.message,
        hint: "Check Vercel logs and Umami credentials",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
