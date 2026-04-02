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
  // Use a very old timestamp instead of 0 for better compatibility
  const startAt = 1000;
  const endAt = Date.now();
  let debugInfo = {};

  try {
    // Fetch site baseline
    const siteTotalUrl = `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
    const siteResponse = await fetch(`${baseUrl}${siteTotalUrl}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let siteTotal = 0;
    if (siteResponse.ok) {
      const siteData = await siteResponse.json();
      siteTotal =
        typeof siteData.pageviews === "number"
          ? siteData.pageviews
          : siteData.pageviews?.value || 0;
      debugInfo.siteTotal = siteTotal;
    }

    // PARAMETER DISCOVERY
    const testUrl = "/non-existent-canary-" + Date.now();
    const paramNames = ["url", "path", "pathname", "url=eq.", "path=eq."];
    let candidateParams = [];
    for (const p of paramNames) {
      try {
        let endpoint;
        if (p.includes("=")) {
          const parts = p.split("=");
          endpoint = `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&${parts[0]}=${parts[1]}${encodeURIComponent(testUrl)}`;
        } else {
          endpoint = `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&${p}=${encodeURIComponent(testUrl)}`;
        }
        const res = await fetch(`${baseUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const val =
            typeof data.pageviews === "number"
              ? data.pageviews
              : data.pageviews?.value || 0;
          if (val < siteTotal || (siteTotal === 0 && val === 0))
            candidateParams.push(p);
        }
      } catch (e) {}
    }
    let workingParam =
      candidateParams.find((p) => p.includes("=")) || candidateParams[0];
    debugInfo.workingParam = workingParam;

    // METRICS DISCOVERY
    let metricsData = null;
    const metricEndpoints = [
      `/api/websites/${websiteId}/metrics?type=url&startAt=${startAt}&endAt=${endAt}&limit=5000`,
      `/api/websites/${websiteId}/metrics?type=path&startAt=${startAt}&endAt=${endAt}&limit=5000`,
    ];

    for (const me of metricEndpoints) {
      try {
        const mRes = await fetch(`${baseUrl}${me}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mRes.ok) {
          const data = await mRes.json();
          if (Array.isArray(data) && data.length > 0) {
            metricsData = data;
            debugInfo.metricsFound = data.length;
            break;
          }
        }
      } catch (e) {}
    }

    const normalizedSlug = (slug || "").replace(/^\/|\/$/g, "").toLowerCase();
    let finalPageviews = 0;

    if (metricsData) {
      metricsData.forEach((item) => {
        let path = (item.x || "").toLowerCase().trim();
        path = path.split(/[?#]/)[0];
        path = path.replace(/^https?:\/\/[^\/]+/, "");
        if (!path.startsWith("/")) path = "/" + path;
        path = path.replace(/\/$/, "");
        if (path === "") path = "/";

        if (
          path === `/blog/${normalizedSlug}` ||
          path === `/${normalizedSlug}`
        ) {
          finalPageviews += item.y || 0;
        }
      });
    }

    if (finalPageviews === 0 && workingParam) {
      const variants = [`/blog/${normalizedSlug}`, `/${normalizedSlug}`];
      const results = await Promise.all(
        variants.map(async (u) => {
          let ep = workingParam.includes("=")
            ? `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&${workingParam.split("=")[0]}=${workingParam.split("=")[1]}${encodeURIComponent(u)}`
            : `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&${workingParam}=${encodeURIComponent(u)}`;
          const res = await fetch(`${baseUrl}${ep}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return 0;
          const d = await res.json();
          return typeof d.visitors === "number"
            ? d.visitors
            : d.visitors?.value || 0;
        })
      );
      results.forEach((v) => {
        if (v !== siteTotal) finalPageviews += v;
      });
    }

    return new Response(
      JSON.stringify({
        pageviews: finalPageviews,
        slug,
        success: true,
        meta: debugInfo,
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
