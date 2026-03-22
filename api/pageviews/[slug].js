let authToken = null;
let tokenExpiry = 0;

async function getUmamiAuthToken() {
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  const umamiApiUrl = process.env.PUBLIC_UMAMI_URL;
  const username = process.env.UMAMI_USERNAME;
  const password = process.env.UMAMI_PASSWORD;

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

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ pageviews: 0, error: "Missing slug" });
  }

  const websiteId = process.env.PUBLIC_UMAMI_WEBSITE_ID;
  const umamiApiUrl = process.env.PUBLIC_UMAMI_URL;

  if (!websiteId || !umamiApiUrl) {
    return res.status(200).json({ pageviews: 0, error: "Missing config" });
  }

  const token = await getUmamiAuthToken();
  if (!token) {
    return res.status(200).json({ pageviews: 0, error: "Auth failed" });
  }

  const baseUrl = umamiApiUrl.replace(/\/(login)?$/, "");
  const startAt = 0;
  const endAt = Date.now();

  // Try both with and without trailing slash
  const urls = [`/blog/${slug}`, `/blog/${slug}/`];

  for (const url of urls) {
    try {
      const endpoint = `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&url=${encodeURIComponent(url)}`;
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) continue;

      const data = await response.json();
      const pageviews = data?.pageviews?.value ?? 0;

      if (pageviews > 0) {
        return res.status(200).json({ pageviews, slug });
      }
    } catch (_error) {
      continue;
    }
  }

  return res.status(200).json({ pageviews: 0, slug });
}
