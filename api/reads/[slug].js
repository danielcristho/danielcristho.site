// Shared authentication utility
let authToken = null;
let tokenExpiry = 0;

async function getUmamiAuthToken() {
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  try {
    const umamiApiUrl = process.env.PUBLIC_UMAMI_URL;
    const username = process.env.UMAMI_USERNAME;
    const password = process.env.UMAMI_PASSWORD;

    if (!umamiApiUrl || !username || !password) {
      return null;
    }

    const baseUrl = umamiApiUrl.replace(/\/(login)?$/, "");

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
  } catch (error) {
    return null;
  }
}

async function makeUmamiRequest(endpoint, options = {}) {
  const token = await getUmamiAuthToken();
  if (!token) return null;

  const umamiApiUrl = process.env.PUBLIC_UMAMI_URL;
  const baseUrl = umamiApiUrl.replace(/\/(login)?$/, "");

  try {
    return await fetch(`${baseUrl}${endpoint}`, {
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

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method === "GET") {
    try {
      const websiteId = process.env.PUBLIC_UMAMI_WEBSITE_ID;

      if (!websiteId || !slug) {
        return res.status(500).json({ error: "Missing configuration" });
      }

      // Calculate date range for last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const startAt = startDate.getTime();
      const endAt = endDate.getTime();

      // Fetch read completion events from Umami API
      // Try both with and without trailing slash
      const urls = [`/blog/${slug}`, `/blog/${slug}/`];
      let totalReads = 0;

      for (const url of urls) {
        const response = await makeUmamiRequest(
          `/api/websites/${websiteId}/events?startAt=${startAt}&endAt=${endAt}&url=${url}&event=read_completed`,
        );

        if (response && response.ok) {
          const data = await response.json();
          totalReads += data.events?.length || 0;
        }
      }

      return res.status(200).json({
        reads: totalReads,
        slug: slug,
        period: "30 days",
      });
    } catch (error) {
      return res.status(200).json({
        reads: 0,
        slug: slug,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const websiteId = process.env.PUBLIC_UMAMI_WEBSITE_ID;

      if (!websiteId || !slug) {
        return res.status(500).json({ error: "Missing configuration" });
      }

      // Track read completion event
      const response = await makeUmamiRequest(
        `/api/websites/${websiteId}/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: `/blog/${slug}/`,
            event: "read_completed",
            timestamp: Date.now(),
          }),
        },
      );

      if (!response || !response.ok) {
        return res.status(500).json({
          success: false,
          error: "Could not track read completion",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Read completion tracked",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Could not track read completion",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
