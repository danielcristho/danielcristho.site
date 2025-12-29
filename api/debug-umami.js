// Debug Umami API endpoints
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

    // Test different endpoints and URL formats
    const testUrls = ['/blog/2025-in-review', '/blog/2025-in-review/'];
    const results = {};

    // Test stats endpoint for specific URLs
    for (const url of testUrls) {
      const endpoint = `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&url=${url}`;
      const response = await makeUmamiRequest(endpoint);
      
      if (response && response.ok) {
        const data = await response.json();
        results[`stats_${url}`] = {
          success: true,
          data: data,
          pageviews: data?.pageviews || 0
        };
      } else {
        results[`stats_${url}`] = {
            success: false,
            status: response?.status || 'no response'
        };
      }
    }

    // Test pages endpoint to see all available pages
    const pagesEndpoint = `/api/websites/${websiteId}/pages?startAt=${startAt}&endAt=${endAt}`;
    const pagesResponse = await makeUmamiRequest(pagesEndpoint);
    
    if (pagesResponse && pagesResponse.ok) {
      const pagesData = await pagesResponse.json();
      results['all_pages'] = {
        success: true,
        dataType: Array.isArray(pagesData) ? 'array' : typeof pagesData,
        length: Array.isArray(pagesData) ? pagesData.length : 'N/A',
        sample: Array.isArray(pagesData) ? pagesData.slice(0, 5) : pagesData
      };
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