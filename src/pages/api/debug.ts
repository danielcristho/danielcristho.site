import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Disable debug endpoint in production
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({
      error: 'Debug endpoint disabled in production'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Check environment variables (for development only)
    const umamiUrl = import.meta.env.PUBLIC_UMAMI_URL;
    const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;
    const username = import.meta.env.UMAMI_USERNAME;
    const password = import.meta.env.UMAMI_PASSWORD;
    
    if (!umamiUrl || !websiteId || !username || !password) {
      return new Response(JSON.stringify({
        error: 'Missing environment variables',
        config: {
          umamiUrl: !!umamiUrl,
          websiteId: !!websiteId,
          username: !!username,
          password: !!password
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Debug endpoint working (development only)',
      environment: 'development'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};