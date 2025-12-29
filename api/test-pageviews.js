// Test pageviews with debug info
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
    const slug = "2025-in-review";
    
    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const startAt = startDate.getTime();
    const endAt = endDate.getTime();

    // Test exact URL from Umami
    const url = `/blog/${slug}`;
    const response = await makeUmamiRequest(
      `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&url=${url}`
    );

    if (!response || !response.ok) {
      return res.status(200).json({ 
        error: 'API call failed',
        debug: { 
          hasToken: !!authToken,
          url,
          startAt,
          endAt,
          responseStatus: response?.status
        }
      });
    }

    const data = await response.json();
    
    return res.status(200).json({ 
      success: true,
      pageviews: data.pageviews || 0,  // Fix: langsung ambil data.pageviews
      slug,
      debug: { 
        url,
        startAt,
        endAt,
        rawData: data
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}