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
  try {
    const websiteId = process.env.PUBLIC_UMAMI_WEBSITE_ID;
    
    if (!websiteId) {
      return res.status(500).json({ error: 'Missing website ID' });
    }

    const response = await makeUmamiRequest(`/api/websites/${websiteId}/active`);

    if (!response || !response.ok) {
      return res.status(200).json({ 
        visitors: 0,
        timestamp: new Date().toISOString()
      });
    }

    const data = await response.json();
    
    return res.status(200).json({ 
      visitors: data.x || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(200).json({ 
      visitors: 0,
      timestamp: new Date().toISOString()
    });
  }
}