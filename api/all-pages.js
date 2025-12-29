// Get all pages data from Umami
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
  try {
    const websiteId = process.env.PUBLIC_UMAMI_WEBSITE_ID;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const startAt = startDate.getTime();
    const endAt = endDate.getTime();

    // Try different endpoints to find the one that gives us per-page data
    const endpoints = [
      `/api/websites/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}`,
      `/api/websites/${websiteId}/events?startAt=${startAt}&endAt=${endAt}`,
      `/api/reports/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}`,
    ];

    const results = {};

    for (const endpoint of endpoints) {
      const response = await makeUmamiRequest(endpoint);
      if (response && response.ok) {
        const data = await response.json();
        results[endpoint] = {
          success: true,
          dataType: Array.isArray(data) ? 'array' : typeof data,
          length: Array.isArray(data) ? data.length : 'N/A',
          sample: Array.isArray(data) ? data.slice(0, 5) : data
        };
      } else {
        results[endpoint] = {
          success: false,
          status: response?.status || 'no response'
        };
      }
    }

    return res.status(200).json({
      success: true,
      websiteId,
      dateRange: { startAt, endAt },
      results
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}