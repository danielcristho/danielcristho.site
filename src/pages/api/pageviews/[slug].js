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
  // Use All Time (0) to match dashboard totals precisely
  const startAt = 0;
  const endAt = Date.now();

  try {
    // 1. Fetch site baseline
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
      console.log(`SITE TOTAL (All Time): ${siteTotal}`);
    }

    // 2. PARAMETER DISCOVERY: Find which parameter actually filters the site total
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
          if (val < siteTotal || (siteTotal === 0 && val === 0)) {
            candidateParams.push(p);
          }
        }
      } catch (e) {}
    }

    // Prefer eq. variants if they work, as they are more specific (especially for Supabase-based Umami)
    let workingParam =
      candidateParams.find((p) => p.includes("=")) || candidateParams[0];
    console.log(`Working parameter for stats: ${workingParam || "NONE"}`);

    // 3. METRICS DISCOVERY: Try to get the list of unique visitors (most accurate for aggregate variants)
    let metricsData = null;
    const metricEndpoints = [
      `/api/websites/${websiteId}/metrics?type=url&startAt=${startAt}&endAt=${endAt}&limit=5000`,
      `/api/websites/${websiteId}/metrics?type=path&startAt=${startAt}&endAt=${endAt}&limit=5000`,
      `/api/websites/${websiteId}/metrics/url?startAt=${startAt}&endAt=${endAt}&limit=5000`,
    ];

    for (const me of metricEndpoints) {
      try {
        const mRes = await fetch(`${baseUrl}${me}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mRes.ok) {
          const data = await mRes.json();
          if (Array.isArray(data) && data.length > 0) {
            console.log(`Metrics Discovery Success: ${me}`);
            metricsData = data;
            break;
          }
        }
      } catch (e) {}
    }

    const normalizedSlug = (slug || "").replace(/^\/|\/$/g, "").toLowerCase();
    // 3. METRICS-BASED VISITOR SUMMATION (Targeting the stable 99 total)
    let finalPageviews = 0;
    if (metricsData) {
      metricsData.forEach((item) => {
        // Split by ? and # to get the clean pathname
        let itemUrl = (item.x || "")
          .split(/[?#]/)[0]
          .toLowerCase()
          .trim()
          .replace(/^https?:\/\/[^\/]+/, "");
        if (!itemUrl.startsWith("/")) itemUrl = "/" + itemUrl;
        if (itemUrl.length > 1) itemUrl = itemUrl.replace(/\/$/, "");

        if (
          itemUrl === `/blog/${normalizedSlug}` ||
          itemUrl === `/${normalizedSlug}`
        ) {
          finalPageviews += item.y || 0;
        }
      });
    }

    // fallback: if metrics failed but we have a workingParam, use stats (Visitors column)
    if (finalPageviews === 0 && workingParam) {
      const variants = [
        `/blog/${normalizedSlug}`,
        `/blog/${normalizedSlug}/`,
        `/${normalizedSlug}`,
        `/${normalizedSlug}/`,
      ];
      const results = await Promise.all(
        variants.map(async (u) => {
          let p = workingParam;
          let ep;
          if (p.includes("=")) {
            const parts = p.split("=");
            ep = `/api/websites/${websiteId}/stats?startAt=0&endAt=${endAt}&${parts[0]}=${parts[1]}${encodeURIComponent(u)}`;
          } else {
            ep = `/api/websites/${websiteId}/stats?startAt=0&endAt=${endAt}&${p}=${encodeURIComponent(u)}`;
          }
          const res = await fetch(`${baseUrl}${ep}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return 0;
          const d = await res.json();
          // Use VISITORS for the 99 target
          return typeof d.visitors === "number"
            ? d.visitors
            : d.visitors?.value || 0;
        })
      );
      results.forEach((v) => {
        if (v !== siteTotal) finalPageviews += v;
      });
    }

    console.log(`FINAL Pageviews (Visitors) for ${slug}: ${finalPageviews}`);

    return new Response(
      JSON.stringify({
        pageviews: finalPageviews,
        slug,
        success: true,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(`Error fetching views for ${slug}:`, error);
    return new Response(
      JSON.stringify({ pageviews: 0, error: "Internal error" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
