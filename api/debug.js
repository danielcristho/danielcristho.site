export default async function handler(req, res) {
  try {
    // Check environment variables
    const umamiUrl = process.env.PUBLIC_UMAMI_URL;
    const websiteId = process.env.PUBLIC_UMAMI_WEBSITE_ID;
    const username = process.env.UMAMI_USERNAME;
    const password = process.env.UMAMI_PASSWORD;
    
    if (!umamiUrl || !websiteId || !username || !password) {
      return res.status(500).json({
        error: 'Missing environment variables',
        config: {
          umamiUrl: !!umamiUrl,
          websiteId: !!websiteId,
          username: !!username,
          password: !!password
        }
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Environment variables configured',
      config: {
        umamiUrl,
        websiteId,
        hasCredentials: !!username && !!password
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      error: 'Debug endpoint failed',
      message: error.message
    });
  }
}