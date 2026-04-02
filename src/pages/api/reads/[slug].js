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

  const baseUrl = umamiApiUrl.replace(/\/(api\/)?(login)?\/?$/, "");
  const loginUrl = `${baseUrl}/api/auth/login`;

  try {
    const response = await fetch(loginUrl, {
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
  } catch (error) {
    return null;
  }
}

async function makeUmamiRequest(endpoint, options = {}) {
  const token = await getUmamiAuthToken();
  if (!token) return null;

  const umamiApiUrl =
    process.env.PUBLIC_UMAMI_URL || import.meta.env.PUBLIC_UMAMI_URL;
  const baseUrl = umamiApiUrl.replace(/\/(api\/)?(login)?\/?$/, "");
  const fullUrl = `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    return await fetch(fullUrl, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function GET({ params }) {
  const { slug } = params;
  const websiteId =
    process.env.PUBLIC_UMAMI_WEBSITE_ID ||
    import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
  const startAt = 1000;
  const endAt = Date.now();

  if (!websiteId || !slug) {
    return new Response(JSON.stringify({ reads: 0 }), { status: 200 });
  }

  try {
    // Attempt to fetch metrics for events
    const metricEndpoints = [
      `/api/websites/${websiteId}/metrics?type=url&event=read_completed&startAt=${startAt}&endAt=${endAt}&limit=5000`,
      `/api/websites/${websiteId}/metrics?type=path&event=read_completed&startAt=${startAt}&endAt=${endAt}&limit=5000`,
    ];

    let metrics = null;
    for (const ep of metricEndpoints) {
      const res = await makeUmamiRequest(ep);
      if (res && res.ok) {
        const d = await res.json();
        if (Array.isArray(d) && d.length > 0) {
          metrics = d;
          break;
        }
      }
    }

    let totalReads = 0;
    const normalizedSlug = slug.replace(/^\/|\/$/g, "").toLowerCase();

    if (metrics) {
      metrics.forEach((item) => {
        let path = (item.x || "").toLowerCase().trim();
        path = path.split(/[?#]/)[0];
        path = path.replace(/^https?:\/\/[^\/]+/, "");
        if (!path.startsWith("/")) path = "/" + path;
        path = path.replace(/\/$/, "");

        if (
          path === `/blog/${normalizedSlug}` ||
          path === `/${normalizedSlug}`
        ) {
          totalReads += item.y || 0;
        }
      });
    }

    return new Response(JSON.stringify({ reads: totalReads, slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ reads: 0 }), { status: 200 });
  }
}

export async function POST({ params }) {
  const { slug } = params;
  const websiteId =
    process.env.PUBLIC_UMAMI_WEBSITE_ID ||
    import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;

  if (!websiteId || !slug) {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }

  try {
    const response = await makeUmamiRequest(
      `/api/websites/${websiteId}/events`,
      {
        method: "POST",
        body: JSON.stringify({
          url: `/blog/${slug}`,
          event: "read_completed",
          timestamp: Date.now(),
        }),
      }
    );

    if (!response || !response.ok) {
      return new Response(JSON.stringify({ success: false }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
