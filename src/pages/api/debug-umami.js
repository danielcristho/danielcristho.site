// Debug Umami API endpoints for Astro v6
export const prerender = false;

let authToken = null;
let tokenExpiry = 0;

async function getUmamiAuthToken() {
  console.log("Starting Umami authentication...");
  if (authToken && Date.now() < tokenExpiry) {
    console.log("Using cached Umami token.");
    return authToken;
  }

  try {
    const umamiApiUrl = import.meta.env.PUBLIC_UMAMI_URL;
    const username = import.meta.env.UMAMI_USERNAME;
    const password = import.meta.env.UMAMI_PASSWORD;

    console.log("Umami Config Check:", {
      url: umamiApiUrl,
      hasUser: !!username,
      hasPass: !!password,
    });

    if (!umamiApiUrl || !username || !password) {
      console.error("Missing Umami configuration in .env");
      return null;
    }

    const baseUrl = umamiApiUrl.replace(/\/(login)?$/, "");
    const loginUrl = `${baseUrl}/api/auth/login`;

    console.log(`Authenticating at: ${loginUrl}`);

    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log(`Login response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login failed:", errorText);
      return null;
    }

    const data = await response.json();
    if (!data.token) {
      console.error("No token in login response");
      return null;
    }

    authToken = data.token;
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

    console.log("Umami authentication successful!");
    return authToken;
  } catch (error) {
    console.error("Umami authentication error:", error);
    return null;
  }
}

async function makeUmamiRequest(endpoint, options = {}) {
  const token = await getUmamiAuthToken();
  if (!token) {
    console.error("Request failed: No auth token");
    return null;
  }

  const umamiApiUrl = import.meta.env.PUBLIC_UMAMI_URL;
  // Normalize baseUrl: remove any /api/login or /api/ if present at the end
  const baseUrl = umamiApiUrl.replace(/\/(api\/)?(login)?\/?$/, "");
  const fullUrl = `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  console.log(`FETCHING: ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    console.log(`STATUS [${response.status}] for ${endpoint}`);
    return response;
  } catch (error) {
    console.error(`FETCH ERROR for ${fullUrl}:`, error);
    return null;
  }
}

export async function GET({ request }) {
  const enableDebug = import.meta.env.ENABLE_DEBUG;
  console.log("DEBUG ENDPOINT ACCESSED. ENABLE_DEBUG:", enableDebug);

  if (enableDebug !== "true" && enableDebug !== true) {
    return new Response(JSON.stringify({ error: "Debug endpoint disabled" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
    console.log("Target Website ID:", websiteId);

    const endDate = new Date();
    // Use All Time (0) to match dashboard totals precisely
    const startAtTs = 0;
    const endAtTs = endDate.getTime();

    const results = {};

    // 1. Basic Stats
    const statsResponse = await makeUmamiRequest(
      `/api/websites/${websiteId}/stats?startAt=${startAtTs}&endAt=${endAtTs}`
    );
    if (statsResponse && statsResponse.ok) {
      results["baseline_stats"] = await statsResponse.json();
    }

    // 2. Active Visitors
    const activeResponse = await makeUmamiRequest(
      `/api/websites/${websiteId}/active`
    );
    if (activeResponse && activeResponse.ok) {
      results["active_visitors"] = await activeResponse.json();
    }

    // 3. TOP PAGES (Metric Discovery - Column Test)
    const metricColumns = ["views", "pageviews", "hits", "count", "visitors"];
    results["column_test_results"] = {};

    for (const col of metricColumns) {
      const url = `/api/websites/${websiteId}/metrics?type=path&startAt=${startAtTs}&endAt=${endAtTs}&limit=100&column=${col}`;
      const res = await makeUmamiRequest(url);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const target = data.find(
            (p) => p.x === "/blog/caddy-log-comprehensive"
          );
          results["column_test_results"][col] = {
            sample_path: target ? target.x : "NOT FOUND",
            sample_y: target ? target.y : 0,
            endpoint: url,
          };
        }
      }
    }

    // 4. TOP PAGES (Metric Discovery - Path Variant)
    const metricFormats = [
      `/api/websites/${websiteId}/metrics?type=url&startAt=${startAtTs}&endAt=${endAtTs}&limit=5000&column=views`,
      `/api/websites/${websiteId}/metrics?type=path&startAt=${startAtTs}&endAt=${endAtTs}&limit=5000&column=views`,
      `/api/websites/${websiteId}/metrics/url?startAt=${startAtTs}&endAt=${endAtTs}&limit=5000&column=views`,
    ];

    results["top_pages_discovery"] = [];
    for (const endpoint of metricFormats) {
      const res = await makeUmamiRequest(endpoint);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          results["working_metric_endpoint"] = endpoint;

          // Aggregated metrics for easy debugging
          const merged = {};
          data.forEach((item) => {
            // Split by ? and # to get the clean pathname
            let path =
              (item.x || "").split(/[?#]/)[0].replace(/\/$/, "").trim() || "/";
            if (!path.startsWith("/")) path = "/" + path;
            merged[path] = (merged[path] || 0) + (item.y || 0);
          });

          // Converting to sorted array for display
          results["merged_top_pages"] = Object.entries(merged)
            .map(([path, views]) => ({ path, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 500);

          // --- PARAMETER STRESS TEST for the 109 vs 99 discrepancy ---
          const stressSlug = "/blog/caddy-log-comprehensive";
          const stressParams = [
            "url",
            "path",
            "pathname",
            "url=eq.",
            "path=eq.",
            "pathname=eq.",
          ];
          const stressResults = {};

          for (const p of stressParams) {
            try {
              let endpoint;
              if (p.includes("=")) {
                const parts = p.split("=");
                endpoint = `/api/websites/${websiteId}/stats?startAt=0&endAt=${endAtTs}&${parts[0]}=${parts[1]}${encodeURIComponent(stressSlug)}`;
              } else {
                endpoint = `/api/websites/${websiteId}/stats?startAt=0&endAt=${endAtTs}&${p}=${encodeURIComponent(stressSlug)}`;
              }
              const res = await makeUmamiRequest(endpoint);
              if (res && res.ok) {
                const d = await res.json();
                stressResults[p] = {
                  views:
                    typeof d.pageviews === "number"
                      ? d.pageviews
                      : d.pageviews?.value || 0,
                  visitors:
                    typeof d.visitors === "number"
                      ? d.visitors
                      : d.visitors?.value || 0,
                };
              }
            } catch (e) {
              stressResults[p] = "Error: " + e.message;
            }
          }
          results["parameter_stress_test"] = {
            target: stressSlug,
            results: stressResults,
          };
          // -----------------------------------------------------------

          results["target_post_search"] = {
            slug: "caddy-log-comprehensive",
            metrics_sum: data
              .filter((p) => p.x?.includes("caddy-log-comprehensive"))
              .reduce((sum, p) => sum + (p.y || 0), 0),
          };

          results["top_pages_raw"] = data.slice(0, 50);
          break;
        }
      }
    }

    // 4. Try the Pageviews endpoint with units
    const pvUrl = `/api/websites/${websiteId}/pageviews?startAt=${startAtTs}&endAt=${endAtTs}&unit=day&timezone=UTC`;
    const pvResponse = await makeUmamiRequest(pvUrl);
    if (pvResponse && pvResponse.ok) {
      results["pageviews_graph_data"] = await pvResponse.json();
    }

    return new Response(
      JSON.stringify({
        success: true,
        websiteId,
        dateRange: {
          start: new Date(startAtTs).toISOString(),
          end: endDate.toISOString(),
        },
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Handler Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
