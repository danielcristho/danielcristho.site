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

    const baseUrl = umamiApiUrl.replace(/\/(login)?$/, '');
    
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.token) return null;

    authToken = data.token;
    tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
    
    return authToken;
  } catch (error) {
    return null;
  }
}

async function makeUmamiRequest(endpoint, options = {}) {
  const token = await getUmamiAuthToken();
  if (!token) return null;

  const umamiApiUrl = process.env.PUBLIC_UMAMI_URL;
  const baseUrl = umamiApiUrl.replace(/\/(login)?$/, '');

  try {
    return await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  const { slug } = req.query;
  
  try {
    const websiteId = process.env.PUBLIC_UMAMI_WEBSITE_ID;
    
    if (!websiteId || !slug) {
      return res.status(200).json({ 
        pageviews: 0,
        slug: slug,
        error: 'Missing configuration',
        debug: { websiteId: !!websiteId, slug: !!slug }
      });
    }

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const startAt = startDate.getTime();
    const endAt = endDate.getTime();

    // Get authentication token first
    const token = await getUmamiAuthToken();
    if (!token) {
      return res.status(200).json({ 
        pageviews: 0,
        slug: slug,
        error: 'Authentication failed'
      });
    }

    // Use the correct /metrics endpoint with type=url to get per-page data
    const response = await makeUmamiRequest(
      `/api/websites/${websiteId}/metrics?type=url&startAt=${startAt}&endAt=${endAt}`
    );
    
    if (!response || !response.ok) {
      return res.status(200).json({ 
        pageviews: 0,
        slug: slug,
        error: 'Could not fetch metrics data'
      });
    }

    const data = await response.json();
    
    // Find the specific page in the results
    // data should be an array like: [{"x": "/blog/post-slug", "y": 124}, ...]
    const targetUrls = [`/blog/${slug}`, `/blog/${slug}/`];
    let totalViews = 0;
    let debugInfo = { foundUrls: [], totalItems: Array.isArray(data) ? data.length : 0 };
    
    if (data && Array.isArray(data)) {
      for (const item of data) {
        // Check if this item matches our target URLs
        if (targetUrls.includes(item.x)) {
          totalViews += item.y || 0;
          debugInfo.foundUrls.push({ url: item.x, views: item.y });
        }
      }
    }
    
    return res.status(200).json({ 
      pageviews: totalViews,
      slug: slug,
      period: '30 days',
      debug: debugInfo
    });

  } catch (error) {
    return res.status(200).json({ 
      pageviews: 0,
      slug: slug,
      error: 'Could not fetch page view data',
      errorMessage: error.message
    });
  }
}